'use client'

import { useEffect, useMemo, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	CheckoutElementsProvider,
	PaymentElement,
	useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'
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
	const router = useRouter()

	useEffect(() => {
		if (!orderId || !orderPrice) {
			router.replace('/orders/details')
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const subtotal = Number(orderPrice ?? 0)
	const taxes = subtotal * TAX_RATE
	const total = subtotal + taxes

	// Create the Checkout Session once on mount, passing the Promise directly to
	// CheckoutElementsProvider. Loading and error states are handled by the
	// provider via useCheckoutElements().
	const clientSecretPromise = useMemo<Promise<string> | null>(() => {
		if (!orderId || !orderPrice) return null

		const amountInCents = Math.round(total * 100)
		return OrdersService.createCheckoutSession({ amount: amountInCents, orderId })
			.then((res) => {
				logger.log('Checkout Session created')
				return res.data.clientSecret
			})
			.catch((err) => {
				logger.error('Checkout Session error', err)
				throw err
			})
	// Intentionally empty deps — create session once on mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!clientSecretPromise) return null

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

			<CheckoutElementsProvider
				stripe={stripePromise}
				options={{
					clientSecret: clientSecretPromise,
					elementsOptions: {
						appearance: {
							theme: 'stripe',
							variables: {
								colorPrimary: '#000000',
								borderRadius: '8px',
							},
						},
					},
				}}>
				<CheckoutForm total={total} />
			</CheckoutElementsProvider>
		</div>
	)
}

function CheckoutForm({ total }: { total: number }) {
	const checkoutState = useCheckoutElements()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	if (checkoutState.type === 'loading') {
		return (
			<div className="flex justify-center py-12">
				<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-400" />
			</div>
		)
	}

	if (checkoutState.type === 'error') {
		return (
			<div className="w-full text-center py-8">
				<p className="text-red-600 mb-4">
					Failed to initialize payment. Please try again.
				</p>
			</div>
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const result = await checkoutState.checkout.confirm()

		// This point is only reached on an immediate error.
		// On success, Stripe redirects to the return_url configured on the backend.
		if (result.type === 'error') {
			setError(result.error.message ?? 'Payment failed. Please try again.')
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
					disabled={isSubmitting}
					className={`w-full px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all ${
						isSubmitting
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
