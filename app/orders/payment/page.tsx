'use client'

import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'
import BackButton from '@/app/ui/back-button'
import { logger } from '@/app/lib/logger'
import { useOrderStore } from '@/app/stores/orderStore'
import { OrdersService } from '@/app/services/orders.service'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

const TAX_RATE = 0.08

export default function Payment() {
	const { orderId, orderPrice } = useOrderStore()
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [intentError, setIntentError] = useState<string | null>(null)
	const [isLoadingIntent, setIsLoadingIntent] = useState(true)
	const router = useRouter()

	const subtotal = Number(orderPrice ?? 0)
	const taxes = subtotal * TAX_RATE
	const total = subtotal + taxes

	useEffect(() => {
		if (!orderId || !orderPrice) {
			router.replace('/orders/details')
			return
		}

		const amountInCents = Math.round(total * 100)
		OrdersService.createPaymentIntent({ amount: amountInCents, orderId })
			.then((res) => {
				setClientSecret(res.data.clientSecret)
				logger.log('Payment intent created')
			})
			.catch((err) => {
				logger.error('Payment intent error', err)
				setIntentError(
					'Failed to initialize payment. Please try again.',
				)
			})
			.finally(() => setIsLoadingIntent(false))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center relative">
			<BackButton href="/orders/details" />
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">
					Complete your payment
				</h1>
			</header>

			{/* Order Summary */}
			<div className="border-t border-gray-300 pt-4 space-y-2 w-full">
				<div className="flex justify-center gap-2">
					<span className="font-bold">Subtotal:</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-center gap-2">
					<span className="font-bold">Taxes (8%):</span>
					<span>${taxes.toFixed(2)}</span>
				</div>
				<div className="flex justify-center gap-2 font-black text-lg border-t border-gray-300 pt-2 mt-2">
					<span>Total:</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>

			{intentError ? (
				<div className="w-full text-center py-8">
					<p className="text-red-600 mb-4">{intentError}</p>
					<button
						onClick={() => router.push('/orders/details')}
						className="px-6 py-3 rounded-lg border-2 border-black bg-black text-white">
						Go Back
					</button>
				</div>
			) : isLoadingIntent || !clientSecret ? (
				<div className="flex justify-center py-12">
					<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-400" />
				</div>
			) : (
				<Elements
					stripe={stripePromise}
					options={{
						clientSecret,
						appearance: {
							theme: 'stripe',
							variables: {
								colorPrimary: '#000000',
								borderRadius: '8px',
							},
						},
					}}>
					<CheckoutForm total={total} />
				</Elements>
			)}
		</div>
	)
}

function CheckoutForm({ total }: { total: number }) {
	const stripe = useStripe()
	const elements = useElements()
	const router = useRouter()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!stripe || !elements) return

		setIsSubmitting(true)
		setError(null)

		const { error: confirmError, paymentIntent } =
			await stripe.confirmPayment({
				elements,
				confirmParams: {
					return_url: `${window.location.origin}/orders/payment-confirmation`,
				},
				redirect: 'if_required',
			})

		if (confirmError) {
			setError(confirmError.message ?? 'Payment failed. Please try again.')
			setIsSubmitting(false)
		} else if (paymentIntent?.status === 'succeeded') {
			router.push('/orders/payment-confirmation')
		} else {
			setError('Unexpected payment status. Please contact support.')
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
			<PaymentElement options={{ layout: 'tabs' }} />

			{error && (
				<p className="text-sm text-red-600 text-center">{error}</p>
			)}

			<div className="w-full flex justify-center">
				<button
					type="submit"
					disabled={!stripe || isSubmitting}
					className={`w-full px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all ${
						isSubmitting || !stripe
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-black text-white hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg'
					}`}>
					{isSubmitting ? (
						<>
							<ArrowPathIcon className="animate-spin h-5 w-5 text-gray-500" />
							Processing...
						</>
					) : (
						`Pay $${total.toFixed(2)}`
					)}
				</button>
			</div>
		</form>
	)
}
