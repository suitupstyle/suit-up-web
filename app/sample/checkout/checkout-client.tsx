'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	CheckoutElementsProvider,
	PaymentElement,
	useCheckoutElements,
} from '@stripe/react-stripe-js/checkout'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

const PRICE = 99.0

export default function CheckoutClient({
	clientSecret,
}: {
	clientSecret: string
}) {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
				<div className="text-center space-y-1">
					<span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
						Sample Integration Test
					</span>
					<h1 className="text-2xl font-bold text-gray-900">
						Complete your payment
					</h1>
				</div>

				<div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
					<div className="flex justify-between text-gray-600">
						<span>Custom Tailored Suit</span>
						<span>${PRICE.toFixed(2)}</span>
					</div>
					<div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">
						<span>Total</span>
						<span>${PRICE.toFixed(2)} USD</span>
					</div>
				</div>

				<CheckoutElementsProvider
					stripe={stripePromise}
					options={{
						clientSecret,
						elementsOptions: {
							appearance: {
								theme: 'stripe',
								variables: {
									colorPrimary: '#000000',
									borderRadius: '8px',
									fontFamily: 'inherit',
								},
							},
						},
					}}>
					<CheckoutForm />
				</CheckoutElementsProvider>

				<p className="text-center text-xs text-gray-400">
					Test card:{' '}
					<code className="bg-gray-100 px-1 py-0.5 rounded">
						4242 4242 4242 4242
					</code>{' '}
					· any future date · any CVC
				</p>
			</div>
		</div>
	)
}

function CheckoutForm() {
	const checkoutState = useCheckoutElements()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	if (checkoutState.type === 'loading') {
		return (
			<div className="flex justify-center py-10">
				<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-400" />
			</div>
		)
	}

	if (checkoutState.type === 'error') {
		return (
			<div className="text-center py-6 space-y-2">
				<p className="text-red-600 font-medium">
					Failed to initialize payment.
				</p>
				<p className="text-xs text-gray-500">
					Verify{' '}
					<code className="bg-gray-100 px-1 rounded">
						STRIPE_SECRET_KEY
					</code>{' '}
					and{' '}
					<code className="bg-gray-100 px-1 rounded">
						NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
					</code>{' '}
					in your{' '}
					<code className="bg-gray-100 px-1 rounded">.env</code> file.
				</p>
			</div>
		)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setIsSubmitting(true)
		setError(null)

		const result = await checkoutState.checkout.confirm()

		if (result.type === 'error') {
			setError(result.error.message ?? 'Payment failed. Please try again.')
			setIsSubmitting(false)
		}
		// On success, Stripe redirects to return_url automatically
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<PaymentElement options={{ layout: 'tabs' }} />

			{error && (
				<p className="text-sm text-red-600 text-center">{error}</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting}
				className={`w-full px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all font-semibold ${
					isSubmitting
						? 'bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300'
						: 'bg-black text-white hover:bg-gray-800'
				}`}>
				{isSubmitting ? (
					<>
						<ArrowPathIcon className="animate-spin h-5 w-5" />
						Processing…
					</>
				) : (
					<>
						<CheckCircleIcon className="h-5 w-5" />
						Pay $99.00
					</>
				)}
			</button>
		</form>
	)
}
