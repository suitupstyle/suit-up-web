'use client'

import { useOrderStore } from "@/app/stores/orderStore";
import { OrdersService } from "@/app/services/orders.service";
import BackButton from "@/app/ui/back-button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
	Elements,
	PaymentElement,
	useStripe,
	useElements,
} from '@stripe/react-stripe-js'
import { ArrowPathIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
)

const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0.08);

export default function CheckoutClient() {
	const { orderId, orderPrice } = useOrderStore()
	const router = useRouter()
	const [clientSecret, setClientSecret] = useState<string | null>(null)
	const [fetchError, setFetchError] = useState<string | null>(null)

	const subtotal = Number(orderPrice ?? 0)
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + taxes

	useEffect(() => {
		if (!orderId || !orderPrice) {
			router.replace('/orders/details')
			return
		}

		OrdersService.createPaymentIntent({ amount: Math.round(total * 100), orderId })
			.then((res) => setClientSecret(res.data.clientSecret))
			.catch(() => setFetchError('Unable to initialize payment. Please try again.'))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchError) {
		return (
			<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-center items-center text-center">
				<p className="text-red-600 font-semibold">{fetchError}</p>
				<button
					onClick={() => router.replace('/orders/details')}
					className="mt-4 px-6 py-2 rounded-lg border-2 border-black bg-black text-white hover:bg-gray-800 font-semibold transition-all">
					Go back
				</button>
			</div>
		)
	}

	if (!clientSecret) {
		return (
			<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex justify-center items-center">
				<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" />
			</div>
		)
	}

	return (
		<>
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

			<Elements
				stripe={stripePromise}
				options={{
					clientSecret,
					appearance: {
						theme: 'stripe',
						variables: {
							colorPrimary: '#000000',
							borderRadius: '8px',
							fontFamily: 'inherit',
						},
					},
				}}>
				<CheckoutForm />
			</Elements>
		</div>






		{/*<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">*/}
		{/*	<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">*/}
		{/*		<div className="text-center space-y-1">*/}
		{/*			<span className="text-xs font-semibold uppercase tracking-widest text-gray-400">*/}
		{/*				Sample Integration Test – v2 (Payment Intent)*/}
		{/*			</span>*/}
		{/*			<h1 className="text-2xl font-bold text-gray-900">*/}
		{/*				Complete your payment*/}
		{/*			</h1>*/}
		{/*		</div>*/}

		{/*		<div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">*/}
		{/*			<div className="flex justify-between text-gray-600">*/}
		{/*				<span>Custom Tailored Suit</span>*/}
		{/*				<span>${PRICE.toFixed(2)}</span>*/}
		{/*			</div>*/}
		{/*			<div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-900">*/}
		{/*				<span>Total</span>*/}
		{/*				<span>${PRICE.toFixed(2)} USD</span>*/}
		{/*			</div>*/}
		{/*		</div>*/}

		{/*		<Elements*/}
		{/*			stripe={stripePromise}*/}
		{/*			options={{*/}
		{/*				clientSecret,*/}
		{/*				appearance: {*/}
		{/*					theme: 'stripe',*/}
		{/*					variables: {*/}
		{/*						colorPrimary: '#000000',*/}
		{/*						borderRadius: '8px',*/}
		{/*						fontFamily: 'inherit',*/}
		{/*					},*/}
		{/*				},*/}
		{/*			}}>*/}
		{/*			<CheckoutForm />*/}
		{/*		</Elements>*/}

		{/*		<p className="text-center text-xs text-gray-400">*/}
		{/*			Test card:{' '}*/}
		{/*			<code className="bg-gray-100 px-1 py-0.5 rounded">*/}
		{/*				4242 4242 4242 4242*/}
		{/*			</code>{' '}*/}
		{/*			· any future date · any CVC*/}
		{/*		</p>*/}
		{/*	</div>*/}
		{/*</div>*/}
		</>
	)
}

function CheckoutForm() {
	const stripe = useStripe()
	const elements = useElements()
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!stripe || !elements) return

		setIsSubmitting(true)
		setError(null)

		const { error: stripeError } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${window.location.origin}/orders/payment-confirmation`,
			},
		})

		// confirmPayment only returns an error if it fails before redirecting.
		// On success, Stripe redirects to return_url automatically.
		if (stripeError) {
			setError(
				stripeError.message ?? 'Payment failed. Please try again.',
			)
			setIsSubmitting(false)
		}
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-5">
			<PaymentElement options={{ layout: 'tabs' }} />

			{error && (
				<p className="text-sm text-red-600 text-center">{error}</p>
			)}

			<button
				type="submit"
				disabled={isSubmitting || !stripe || !elements}
				className={`w-full px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all font-semibold ${
					isSubmitting || !stripe || !elements
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
