/**
 * geoCurrency.js — Client-side locale/IP currency detection & exchange rates
 * Base price is ₹749 INR.
 */

export const CURRENCY_METADATA = {
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', defaultRate: 1.0, precision: 0 },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', defaultRate: 0.0116, precision: 2 },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', defaultRate: 0.0108, precision: 2 },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', defaultRate: 0.0093, precision: 2 },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', defaultRate: 0.0160, precision: 2 },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', defaultRate: 0.0180, precision: 2 },
  AED: { code: 'AED', symbol: 'AED ', name: 'UAE Dirham', flag: '🇦🇪', defaultRate: 0.0425, precision: 2 },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', defaultRate: 0.0155, precision: 2 },
}

const BASE_INR_PRICE = 749

let cachedDetectedCurrency = null

/**
 * Fast client-side detection using Browser Timezone + Locale
 */
export function detectLocalCurrency() {
  if (cachedDetectedCurrency) return cachedDetectedCurrency

  try {
    const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase()
    const lang = (navigator.language || '').toLowerCase()

    if (tz.includes('calcutta') || tz.includes('kolkata') || tz.includes('india') || lang.includes('en-in')) {
      cachedDetectedCurrency = 'INR'
      return 'INR'
    }

    if (tz.includes('london') || tz.includes('europe/belfast') || lang.includes('en-gb')) {
      cachedDetectedCurrency = 'GBP'
      return 'GBP'
    }

    if (
      tz.includes('paris') || tz.includes('berlin') || tz.includes('rome') || 
      tz.includes('madrid') || tz.includes('amsterdam') || tz.includes('brussels') || 
      tz.includes('vienna') || tz.includes('dublin') || tz.includes('europe')
    ) {
      cachedDetectedCurrency = 'EUR'
      return 'EUR'
    }

    if (tz.includes('toronto') || tz.includes('vancouver') || tz.includes('montreal') || tz.includes('edmonton') || lang.includes('en-ca')) {
      cachedDetectedCurrency = 'CAD'
      return 'CAD'
    }

    if (tz.includes('sydney') || tz.includes('melbourne') || tz.includes('brisbane') || tz.includes('perth') || lang.includes('en-au')) {
      cachedDetectedCurrency = 'AUD'
      return 'AUD'
    }

    if (tz.includes('dubai') || tz.includes('abu_dhabi') || tz.includes('uae')) {
      cachedDetectedCurrency = 'AED'
      return 'AED'
    }

    if (tz.includes('singapore')) {
      cachedDetectedCurrency = 'SGD'
      return 'SGD'
    }

    if (tz.includes('america') || tz.includes('new_york') || tz.includes('chicago') || tz.includes('los_angeles') || lang.includes('en-us')) {
      cachedDetectedCurrency = 'USD'
      return 'USD'
    }
  } catch (e) {
    console.debug('Timezone detection error:', e)
  }

  cachedDetectedCurrency = 'USD'
  return 'USD'
}

/**
 * Async IP-based detection (optional background refinement)
 */
export async function detectCountryByIp() {
  try {
    const res = await fetch('https://ipapi.co/json/', { timeout: 3000 })
    if (res.ok) {
      const data = await res.json()
      const curr = (data.currency || '').toUpperCase()
      if (curr && CURRENCY_METADATA[curr]) {
        cachedDetectedCurrency = curr
        return curr
      }
      if (data.country_code === 'IN') {
        cachedDetectedCurrency = 'INR'
        return 'INR'
      }
    }
  } catch (e) {
    // Non-blocking fallback to timezone detection
  }
  return detectLocalCurrency()
}

/**
 * Calculate formatted price for a given currency code
 */
export function formatCurrencyPrice(currCode = 'INR', liveRates = null) {
  const code = (currCode || 'INR').toUpperCase()
  const meta = CURRENCY_METADATA[code] || CURRENCY_METADATA.INR
  const rate = (liveRates && liveRates[code]?.rate) ? liveRates[code].rate : meta.defaultRate

  if (code === 'INR') {
    return {
      code: 'INR',
      symbol: '₹',
      amount: BASE_INR_PRICE,
      formatted: `₹${BASE_INR_PRICE}`,
      meta,
    }
  }

  const rawAmount = BASE_INR_PRICE * rate
  const amount = Number(rawAmount.toFixed(meta.precision))
  return {
    code,
    symbol: meta.symbol,
    amount,
    formatted: `${meta.symbol}${amount.toFixed(meta.precision)}`,
    meta,
  }
}
