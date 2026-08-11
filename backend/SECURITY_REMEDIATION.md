# SECURITY REMEDIATION REPORT

Remediation pass against the LEWIS security audit (SEC-001 through SEC-015). Covers what was fixed, what changed, what was tested, and what still needs live verification outside this environment.

## 1. Fixed vulnerabilities

| ID | Severity | Status | Files Changed | Fix |
|----|----------|--------|---------------|-----|
| SEC-001 | CRITICAL | **FIXED** | `backend/db/supabase_schema.sql` | Dropped the `USING(true)` policies (they applied to PUBLIC, not service_role). Enabled RLS with **zero** anon/authenticated policies (default-deny) and explicit `REVOKE ALL ... FROM PUBLIC, anon, authenticated` on all 4 tables + the analytics view, plus explicit `GRANT` to `service_role` so the backend is never blocked. Not live-applied — see §7. |
| SEC-002 | HIGH | **FIXED** | `backend/db/supabase_schema.sql` | Added `ALTER TABLE lewis_sessions ENABLE ROW LEVEL SECURITY` + same revoke/grant treatment (previously had no RLS at all). |
| SEC-003 | HIGH | **FIXED** | `backend/main.py`, `frontend/src/store/useLewisStore.js` | Added `POST /auth/logout` (Bearer-authenticated, calls existing `revoke_session()`, idempotent). Frontend `logout()` now clears local state first (always, even offline) then best-effort calls the endpoint. Live-tested: reused token after logout → 401. |
| SEC-004 | HIGH | **FIXED** (config-dependent) | `backend/Procfile`, `backend/railway.json`, `backend/security.py`, `backend/.env.example` | Added `--proxy-headers --forwarded-allow-ips="${LEWIS_TRUSTED_PROXY_IPS:-127.0.0.1}"` to the start command. Deliberately **not** `'*'` — defaults to not trusting any proxy (current safe behavior preserved) until the operator sets `LEWIS_TRUSTED_PROXY_IPS` to their platform's real edge IP range. Fully fixing this requires that one piece of platform-specific information I don't have — see §7. |
| SEC-005 | MEDIUM | **FIXED** | `backend/auth.py`, `backend/main.py`, `backend/.env.example` | Replaced the Railway-specific check with `ENVIRONMENT=production`. Both `LEWIS_ANON_SALT` missing AND no DB backend configured (a related gap found while fixing this) now hard-fail app startup in production. Live-tested both. |
| SEC-006 | MEDIUM | **FIXED** | `backend/security.py` | Removed the unused `sanitize_input()` (and now-unused `html`/`Any` imports) rather than wiring it in — confirmed no `dangerouslySetInnerHTML` exists anywhere in the frontend, so input-side HTML-escaping was the wrong control for this architecture, not a missing one. |
| SEC-007 | MEDIUM | **FIXED** (partial by nature) | `backend/auth.py` | Registration's "already exists" message replaced with a generic one at all 3 call sites. Login already didn't enumerate — verified, no change needed. Residual signal remains: success still returns a token, failure doesn't — full elimination needs an email-verification flow this app doesn't have. Documented, not overclaimed. |
| SEC-008 | MEDIUM | **PARTIALLY FIXED** | `backend/README.md` | Immediate fix (server-side revocation) shipped as SEC-003. Full HttpOnly-cookie migration explicitly scoped out as architectural hardening (documented in README) rather than bundled in — see §7. |
| SEC-009 | LOW/MEDIUM | **FIXED** | `backend/main.py` | `docs_url`/`redoc_url`/`openapi_url` all `None` when `ENVIRONMENT=production`. Live-tested: all three return 404 in production, 200 in development. |
| SEC-010 | MEDIUM | **FIXED** | `backend/main.py`, `backend/.env.example` | Gated behind `X-Internal-Key` header checked with `hmac.compare_digest` against `LEWIS_ANALYTICS_API_KEY`. Endpoint returns 404 (not just 401) if the key isn't configured, so it's closed by default. Live-tested: no header → 401, wrong key → 401, correct key → 200, unconfigured → 404. |
| SEC-011 | MEDIUM/HIGH | **FIXED** (best-effort by nature) | `backend/auth.py` | Extended `deidentify_data()` with URL and phone-number pattern scrubbing (email scrubbing already existed). Docstring now explicitly distinguishes "known PII patterns removed" from "guaranteed anonymous" — free-text name/employer/address content still isn't (and can't be, without NER) caught. Live-tested against 6 realistic strings — correct hits, no false positives on scores/ages. |
| SEC-012 | LOW | **FIXED** | `backend/main.py` | Header comment corrected to describe the actual authenticated-vs-anonymous persistence split. Repo-wide search found no other code/UI copy making the false claim; one doc file (`lewis doc.md`) already correctly qualified it; one standalone prototype HTML at repo root has a matching phrase but isn't part of the live app — flagged, not edited (minified, unclear if served anywhere). |
| SEC-013 | MEDIUM | **FIXED** | `backend/db/lewis_users.db` (untracked), `backend/.gitignore` | `git rm --cached`, added `db/*.db`/`*.sqlite`/`*.sqlite3` to `.gitignore`. **Checked full git history, not just the current file**: both historical commits that touched this file also had 0 rows in every table — this file has never contained real user data. No credential/data rotation needed. |
| SEC-014 | MEDIUM | **FIXED** | `backend/requirements.txt` | Every dependency (7 direct + full transitive closure, ~35 packages) pinned to exact installed/tested versions. Verified with a real `pip install --dry-run` against the pinned file. Frontend already had `package-lock.json` tracked — no change needed. |
| SEC-015 | LOW | **FIXED** | `backend/auth.py`, `backend/requirements.txt` | Added `argon2-cffi`. New registrations hash with Argon2id directly. Existing PBKDF2 users verify against the old hash, then transparently rehash to Argon2id and persist it on that same successful login (all 3 DB backends). Live-tested end-to-end on SQLite: new user gets Argon2 hash; legacy user logs in, gets silently upgraded, second login goes through the Argon2 path; wrong passwords still rejected throughout. Also upgraded the legacy comparison from `==` to `hmac.compare_digest` while touching this code. |

## 2. Files changed

- `backend/db/supabase_schema.sql` — RLS/grant rewrite (SEC-001/002)
- `backend/db/lewis_users.db` — **removed from git tracking** (SEC-013), file itself untouched on disk
- `backend/.gitignore` — added `db/*.db` etc. (SEC-013); added `!.env.example` negation to un-ignore the template file that `.env.*` was accidentally also blocking (found while verifying SEC-005's documentation actually made it into git — see §7)
- `backend/auth.py` — `ENVIRONMENT`/fail-fast (SEC-005), generic registration error (SEC-007), extended `deidentify_data()` (SEC-011), Argon2id migration (SEC-015), new `/auth/logout` support via existing `revoke_session()` (SEC-003)
- `backend/main.py` — `/auth/logout` route (SEC-003), `docs_url` gating (SEC-009), `/analytics/onboarding` key gate (SEC-010), corrected header comment (SEC-012)
- `backend/security.py` — removed dead `sanitize_input()` (SEC-006), documented the proxy-IP trust boundary and Redis-swap seam (SEC-004)
- `backend/Procfile`, `backend/railway.json` — `--proxy-headers --forwarded-allow-ips` (SEC-004)
- `backend/requirements.txt` — full pin (SEC-014) + `argon2-cffi` (SEC-015)
- `backend/.env.example` — rewritten: documents `ENVIRONMENT`, `LEWIS_TRUSTED_PROXY_IPS`, `LEWIS_ANALYTICS_API_KEY`, corrects a stale `OPENAI_API_KEY` reference to the actually-used `NVIDIA_API_KEY`
- `backend/README.md` — endpoint table updated, security notes section added (SEC-008 documentation)
- `frontend/src/store/useLewisStore.js` — `logout()` now async, calls `/auth/logout`, clears local state first regardless of network outcome (SEC-003)

Not modified: `App.jsx` (its `onClick={logout}` works unchanged with the new async `logout`), scoring/content/narrative engine, frontend build tooling, CORS config (already correct).

## 3. Database changes

`backend/db/supabase_schema.sql` now contains an idempotent migration block (safe to re-run) that:
1. Enables RLS on all 4 tables (was 3).
2. Drops the old misnamed policies.
3. Creates **no** replacement policy for anon/authenticated (default-deny — explained in-file: this app doesn't use Supabase Auth, so there's no valid `auth.uid()`-based per-row predicate to write).
4. `REVOKE ALL ... FROM PUBLIC, anon, authenticated` on all 4 tables + the analytics view.
5. Explicit `GRANT ALL` to `service_role` (defensive — Supabase projects normally already grant this).
6. A `DO $$ ... $$` block granting/revoking the identity-column sequences (needed for inserts to keep working under the tightened grants).

**This was not and could not be run against the live Supabase project** — no database credentials or MCP access to it exists in this environment. It's written, self-reviewed for Postgres syntax correctness, and idempotent, but it needs to be run through the Supabase SQL Editor (or a migration tool) and its actual effect verified live — see §7, TEST 3/4.

## 4. Authentication changes

- `POST /auth/logout` (Bearer-required): revokes the session server-side via the already-existing `revoke_session()` — reused rather than reimplemented, per the instruction to check for and reuse existing functions.
- Frontend `logout()`: clears `localStorage`/Zustand state **first**, then best-effort calls the server. A network failure during logout no longer leaves the user "logged in" in the UI — confirmed by design and by the offline-safety requirement, though a literal offline-browser test wasn't run.
- Password hashing: transparent PBKDF2→Argon2id migration on login, live-verified end-to-end (§6).
- Registration: generic failure message; no other auth-endpoint behavior changed.

## 5. Deployment changes

Required in production (`ENVIRONMENT=production`) — app now **refuses to start** without these:
- `LEWIS_ANON_SALT`
- `DATABASE_URL`, or `SUPABASE_URL` + `SUPABASE_SERVICE_KEY`

New optional/recommended production vars:
- `LEWIS_TRUSTED_PROXY_IPS` — **must be determined and set** for SEC-004 to actually take effect (see §7)
- `LEWIS_ANALYTICS_API_KEY` — required for `/analytics/onboarding` to work at all (it's 404 without it)

`Procfile` and `railway.json` both now start uvicorn with `--proxy-headers --forwarded-allow-ips=...`. Full list documented in `backend/.env.example`.

## 6. Tests performed

All run live against this repo, this session:

- `pytest` — **95/95 pre-existing tests pass**, no regressions in scoring/content/narrative/safety.
- `pip install -r requirements.txt --dry-run` — pinned file resolves cleanly.
- Argon2 migration: 8/8 assertions pass (new-user hash format, correct/wrong login, legacy-user login, transparent rehash-on-login, post-upgrade login still works).
- Full `TestClient` regression + explicit test-case run (dev mode, SQLite backend): registration, login, `/auth/me`, `/auth/assessments`, anonymous + authenticated `/assessment/full`, `/pulse/calculate` — all pass.
- **TEST 1** (unauthenticated → protected data): PASS, 401.
- **TEST 2** (User A vs User B data): PASS — B's vault is empty, sees none of A's data, distinct user IDs.
- **TEST 5** (logout → reuse token): PASS — 401 after logout; second logout call still returns 200 (idempotent).
- **TEST 6** (registration enumeration): PASS — duplicate-email response no longer contains "already exists"; distinguishable in principle from a status-code+token diff, documented as a known residual limit.
- **TEST 7** (`/docs` in production): PASS — `/docs`, `/redoc`, `/openapi.json` all 404 in production, 200 in dev.
- **TEST 8** (`/analytics/onboarding` auth): PASS — no header 401, wrong key 401, correct key 200, key unconfigured → 404.
- **TEST 9** (missing `LEWIS_ANON_SALT` in production): PASS — `RuntimeError` at import time, app never starts. Also tested the related DB-backend fail-fast the same way.
- **TEST 10** (spoofed `X-Forwarded-For`): PASS at the app layer — `security.py` never reads that header itself, so a spoofed value has zero effect on the current code regardless of proxy config. **Could not test the uvicorn/proxy-layer trust behavior itself** — `TestClient` talks to the ASGI app directly, bypassing the real uvicorn server where `--forwarded-allow-ips` actually operates.
- **TEST 11** (frontend build secret scan): PASS — ran a real production `vite build`, grepped the output bundle for service-role/API-key/DB-password/connection-string patterns: zero matches. Only `VITE_API_URL`'s inlined value (the backend base URL, meant to be public) appears.
- **TEST 12** (oversized JSON): PASS — 413, rejected by the existing 256KB body cap before it reaches any handler logic.
- **TEST 3/4** (direct Supabase anon access to tables/`lewis_sessions`): **not run** — no live Supabase project access from this environment. The schema fix is written and self-reviewed; needs to be applied and then verified live (curl the PostgREST endpoint with an anon key, confirm 401/403 or empty result).
- Self-review of the changes against the full category list (auth, authz, RLS, sessions, API, CORS, CSRF, XSS, SQLi, SSRF, command injection, path traversal, rate limiting, secrets, PII, business logic, dependencies, error handling, logging, headers): every new SQL statement is parameterized, every new secret comparison is constant-time, no new logging of sensitive values, no new render/injection sinks. One thing the changes themselves exposed: `.env.*` in `.gitignore` was also silently blocking `.env.example` from ever being committed, undermining the SEC-005 documentation requirement — fixed with a `!.env.example` negation.

## 7. Remaining risks — require action outside this environment

- **Run the SQL migration against the live Supabase project.** Nothing in this pass touched the actual database. Until `supabase_schema.sql`'s security section is run in the SQL Editor, SEC-001/002 are fixed in the repo but not in production.
- **Verify the role `DATABASE_URL` connects as**, if direct Postgres access is used at all. The `REVOKE ... FROM anon, authenticated` is safe regardless, but if `DATABASE_URL` ever authenticates as `anon` or `authenticated` (rather than `postgres`/`service_role`-equivalent) instead of what was assumed, this migration would break the backend's own native-Postgres path. Worth a one-line confirmation.
- **Determine and set `LEWIS_TRUSTED_PROXY_IPS`** for the actual Railway/Render deployment. This was deliberately not defaulted to `'*'` (spoofable) — it currently defaults to not-trusted (safe, but doesn't fix the shared-bucket problem). Determine the real value by temporarily logging `request.client.host` in production, or checking the platform's documented edge IP range.
- **TEST 3 and TEST 4 need to be run live** against Supabase directly (curl with an anon key) once the migration is applied.
- **Live pentest of TEST 10's actual proxy-header trust behavior** once `LEWIS_TRUSTED_PROXY_IPS` is set — confirm a request through the real Railway/Render deployment resolves to the true client IP, and that a spoofed header from outside cannot inject a fake one.
- **HttpOnly-cookie migration (SEC-008 architectural hardening)** — not attempted this pass, deliberately, given its size. Scoped and documented in `backend/README.md`.
- **Argon2id PG/Supabase-REST paths are structurally identical to the live-tested SQLite path but were not independently live-tested** — no Postgres/Supabase credentials available in this environment.
- **Frontend `logout()`'s offline-safety wasn't tested against an actual severed network connection** — reviewed by code inspection (try/catch around the fetch, local state cleared unconditionally first) rather than a live network-kill test.
- One thing genuinely outside this engagement's scope, flagged rather than fixed: `LEWIS_Pulse_Prototype 2.html` at the repo root (a standalone, minified prototype, not part of `frontend/`) contains a phrase matching the "nothing persisted" claim — not edited since minified content can't be safely reviewed and it's unclear if it's served anywhere. If it's ever deployed/linked, it should get the same correction as SEC-012.

## 8. Final security score

**BEFORE: 58/100**
**AFTER: 76/100**

Not higher, because: the two most severe findings (SEC-001/002, the RLS defect) are fixed in code but **not yet applied to the live database** — that's the actual attack surface, and it's still open until someone runs the migration. SEC-004's real-world effectiveness depends on a platform-specific value that isn't available here. SEC-007/008/011 are explicitly partial by their nature (residual enumeration signal, cookie migration deferred, PII scrubbing is pattern-based not guaranteed-complete) — not scored as if they were fully closed. What moved the needle: session revocation now actually exists and is tested end-to-end, password hashing is modernized with a working migration path, the DB-access-control code is now *correct* even though not yet *deployed*, production no longer silently degrades on missing secrets, and the docs/analytics/dependency/git-hygiene items are genuinely closed with no caveats.
