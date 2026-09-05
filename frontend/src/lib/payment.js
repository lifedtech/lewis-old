// payment.js — Razorpay standard checkout client & server verification
import { useLewisStore } from '../store/useLewisStore.js'

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false)
    if (window.Razorpay) return resolve(true)

    const existingScript = document.getElementById('razorpay-checkout-js')
    if (existingScript) {
      existingScript.onload = () => resolve(true)
      return
    }

    const script = document.createElement('script')
    script.id = 'razorpay-checkout-js'
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiateCheckout({
  plan = 'personal_report',
  currency = 'INR',
  reportId = null,
  userEmail = '',
  userName = '',
  userPhone = '',
  couponCode = null,
  onSuccess = () => {},
  onError = () => {},
}) {
  const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
  const store = useLewisStore.getState()
  const targetReportId = reportId || store.analysisData?.report_uuid || `REP-${Date.now().toString(36).toUpperCase()}`
  const targetEmail = userEmail || store.email || store.authUser?.email || ''
  const targetName = userName || store.name || store.authUser?.name || ''
  const targetPhone = userPhone || store.phone || ''
  const targetCurrency = (currency || store.currency || 'INR').toUpperCase()

  try {
    // 1. Create order on backend (backend authoritatively determines price)
    const payloadBody = JSON.stringify({
      plan: plan || 'personal_report',
      report_id: targetReportId,
      currency: targetCurrency,
      email: targetEmail,
      name: targetName,
      phone: targetPhone,
      coupon_code: couponCode,
    })

    let orderRes = null
    try {
      orderRes = await fetch(`${API_BASE}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadBody,
      })
    } catch (netErr) {
      orderRes = await fetch(`http://127.0.0.1:8000/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payloadBody,
      })
    }

    if (!orderRes.ok) {
      const errDetail = await orderRes.text()
      throw new Error(`Order creation failed (${orderRes.status}): ${errDetail}`)
    }

    const { order } = await orderRes.json()

    // 2. Handle 100% Free Discount Code (e.g. LWSR100) or 0-Amount Orders
    if (order.amount === 0 || order.payment_mode === 'free_discount' || order.status === 'paid') {
      console.log('[Payment System] 100% Discount Code applied - Order auto-unlocked.')
      useLewisStore.getState().setPaymentSuccess({ 
        reportUuid: targetReportId,
        orderId: order.order_id,
        paymentId: order.payment_id || `pay_free_${order.order_id}`,
        email: targetEmail,
        name: targetName,
        phone: targetPhone,
      })
      onSuccess(order)
      return order
    }

    // 3. Handle Mock Development Simulator
    if (order.payment_mode === 'mock') {
      console.log('[Payment Simulator] Running in PAYMENT_MODE=mock')
      // Immediate simulated verification
      const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: order.order_id,
          payment_id: `pay_mock_${Date.now()}`,
          signature: 'mock_sig_approved',
          report_id: targetReportId,
        }),
      })

      if (!verifyRes.ok) {
        throw new Error('Mock payment verification failed')
      }

      const verifyData = await verifyRes.json()
      useLewisStore.getState().setPaymentSuccess({ 
        reportUuid: targetReportId,
        orderId: order.order_id,
        paymentId: `pay_mock_${Date.now()}`,
        email: targetEmail,
        name: targetName,
        phone: targetPhone,
      })
      onSuccess(verifyData)
      return verifyData
    }

    // 3. Handle Live / Test Razorpay Checkout Modal
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded || !window.Razorpay) {
      throw new Error('Razorpay SDK failed to load. Please check your network.')
    }

    return new Promise((resolve, reject) => {
      const razorpayOrderId = order.razorpay_order_id || order.order_id
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency || 'INR',
        name: 'LEWIS Wellbeing Intelligence',
        description: order.plan_name || 'Personal Insight Report',
        order_id: razorpayOrderId,
        image: '/logo.png',
        prefill: {
          name: targetName,
          email: targetEmail,
          contact: targetPhone,
        },
        theme: {
          color: '#00ae9d',
        },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${API_BASE}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id || razorpayOrderId || order.order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                report_id: targetReportId,
                email: targetEmail,
                name: targetName,
                phone: targetPhone,
              }),
            })

            if (!verifyRes.ok) {
              const errText = await verifyRes.text()
              throw new Error(`Payment verification failed: ${errText}`)
            }

            const verifyData = await verifyRes.json()
            useLewisStore.getState().setPaymentSuccess({ 
              reportUuid: targetReportId,
              orderId: order.order_id || razorpayOrderId,
              paymentId: response.razorpay_payment_id,
              email: targetEmail,
              name: targetName,
              phone: targetPhone,
            })
            onSuccess(verifyData)
            resolve(verifyData)
          } catch (err) {
            console.error('Verification error:', err)
            onError(err)
            reject(err)
          }
        },
        modal: {
          ondismiss: function () {
            console.log('Razorpay modal closed by user')
          },
        },
      }

      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', function (resp) {
        console.error('Payment failed:', resp.error)
        onError(resp.error)
        reject(resp.error)
      })
      rzp.open()
    })
  } catch (err) {
    console.error('Checkout initiation error:', err)
    onError(err)
    throw err
  }
}
