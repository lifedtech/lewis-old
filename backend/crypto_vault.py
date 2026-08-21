import os
import hmac
import base64
import hashlib
import logging
from typing import Optional
from dotenv import load_dotenv
from cryptography.fernet import Fernet

load_dotenv()
logger = logging.getLogger("lewis.crypto")

# Obtain or derive a 32-byte url-safe base64 encoded encryption key
_RAW_KEY = os.getenv("LEWIS_ENCRYPTION_KEY", "").strip()
if not _RAW_KEY:
    # Deterministically derive a 32-byte key using SHA256 of server secret / salt
    _secret_source = os.getenv("LEWIS_ANON_SALT", "lewis-default-internal-crypto-salt-2026")
    _derived_32bytes = hashlib.sha256(_secret_source.encode("utf-8")).digest()
    _RAW_KEY = base64.urlsafe_b64encode(_derived_32bytes).decode("utf-8")
else:
    # Ensure it's valid urlsafe base64 of 32 bytes; if given arbitrary string, derive from sha256
    try:
        decoded = base64.urlsafe_b64decode(_RAW_KEY.encode("utf-8"))
        if len(decoded) != 32:
            _derived_32bytes = hashlib.sha256(_RAW_KEY.encode("utf-8")).digest()
            _RAW_KEY = base64.urlsafe_b64encode(_derived_32bytes).decode("utf-8")
    except Exception:
        _derived_32bytes = hashlib.sha256(_RAW_KEY.encode("utf-8")).digest()
        _RAW_KEY = base64.urlsafe_b64encode(_derived_32bytes).decode("utf-8")

_fernet = Fernet(_RAW_KEY.encode("utf-8"))


def encrypt_pii(plaintext: Optional[str]) -> Optional[str]:
    """Encrypt a sensitive field (like user name or email) using AES-Fernet encryption."""
    if plaintext is None:
        return None
    trimmed = str(plaintext).strip()
    if not trimmed:
        return ""
    try:
        cipher_bytes = _fernet.encrypt(trimmed.encode("utf-8"))
        return cipher_bytes.decode("utf-8")
    except Exception as e:
        logger.error("PII encryption error: %s", e)
        # Fail-closed / fallback to secure tagged representation if crypto fails
        raise RuntimeError("Failed to securely encrypt sensitive field.") from e


def decrypt_pii(ciphertext: Optional[str]) -> Optional[str]:
    """Decrypt an encrypted sensitive field back to plaintext."""
    if ciphertext is None:
        return None
    trimmed = str(ciphertext).strip()
    if not trimmed:
        return ""
    try:
        plain_bytes = _fernet.decrypt(trimmed.encode("utf-8"))
        return plain_bytes.decode("utf-8")
    except Exception as e:
        logger.warning("PII decryption failed or text was unencrypted: %s", e)
        # If payload was somehow stored unencrypted or cannot be decrypted, return trimmed or placeholder
        return trimmed


def blind_index_email(email: Optional[str]) -> Optional[str]:
    """
    Generate a deterministic HMAC-SHA256 blind index hash for email search/deduplication
    without storing or exposing raw plaintext email.
    """
    if not email:
        return None
    clean = str(email).strip().lower()
    if not clean:
        return None
    return hmac.new(_RAW_KEY.encode("utf-8"), clean.encode("utf-8"), hashlib.sha256).hexdigest()
