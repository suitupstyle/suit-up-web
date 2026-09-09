'use client'

import { useOrderStore } from "@/app/stores/orderStore";
import { OrdersService } from "@/app/services/orders.service";
import BackButton from "@/app/ui/back-button";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { initAirwallex } from '@/app/lib/airwallex'

const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0.08);
const DROP_IN_CONTAINER_ID = 'airwallex-drop-in'

type CheckoutIntent = {
	intentId: string
	clientSecret: string
	currency: string
}

export default function CheckoutClient() {
	const { orderId, orderPrice } = useOrderStore()
	const router = useRouter()
	const [intent, setIntent] = useState<CheckoutIntent | null>(null)
	const [fetchError, setFetchError] = useState<string | null>(null)

	const subtotal = Number(orderPrice ?? 0)
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + taxes
	const taxPercent = Math.round(TAX_RATE * 100)

	useEffect(() => {
		if (!orderId || !orderPrice) {
			router.replace('/orders/details')
			return
		}

		OrdersService.createPaymentIntent({ orderId })
			.then((res) => setIntent(res.data))
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

	if (!intent || !orderId) {
		return (
			<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex justify-center items-center">
				<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" />
			</div>
		)
	}

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center relative">
			<BackButton href="/orders/details" />
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">
					Complete your payment
				</h1>
			</header>

			<div className="border-t border-gray-300 pt-4 space-y-2 w-full">
				<div className="flex justify-center gap-2">
					<span className="font-bold">Subtotal:</span>
					<span>${subtotal.toFixed(2)}</span>
				</div>
				<div className="flex justify-center gap-2">
					<span className="font-bold">Taxes ({taxPercent}%):</span>
					<span>${taxes.toFixed(2)}</span>
				</div>
				<div className="flex justify-center gap-2 font-black text-lg border-t border-gray-300 pt-2 mt-2">
					<span>Total:</span>
					<span>${total.toFixed(2)}</span>
				</div>
			</div>

			<DropInCheckout
				orderId={orderId}
				intent={intent}
			/>
		</div>
	)
}

function DropInCheckout({
	orderId,
	intent,
}: {
	orderId: number
	intent: CheckoutIntent
}) {
	const router = useRouter()
	const [isReady, setIsReady] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const elementRef = useRef<{ unmount: () => void; destroy: () => void } | null>(null)

	useEffect(() => {
		let cancelled = false

		const mountDropIn = async () => {
			try {
				await initAirwallex()
				if (cancelled) return

				const { createElement } = await import('@airwallex/components-sdk')
				const element = await createElement('dropIn', {
					intent_id: intent.intentId,
					client_secret: intent.clientSecret,
					currency: intent.currency,
					country_code: 'US',
					appearance: {
						mode: 'light',
						variables: {
							colorBrand: '#000000',
						},
					},
				})

				if (cancelled) {
					element.destroy()
					return
				}

				elementRef.current = element
				element.mount(DROP_IN_CONTAINER_ID)
				element.on('ready', () => setIsReady(true))
				element.on('success', () => {
					router.push(`/orders/payment-confirmation?orderId=${orderId}`)
				})
				element.on('error', (event) => {
					setError(
						event.detail.error.message ?? 'Payment failed. Please try again.',
					)
				})
			} catch {
				if (!cancelled) {
					setError('Unable to load payment form. Please try again.')
				}
			}
		}

		void mountDropIn()

		return () => {
			cancelled = true
			elementRef.current?.unmount()
			elementRef.current?.destroy()
			elementRef.current = null
		}
	}, [intent.clientSecret, intent.currency, intent.intentId, orderId, router])

	return (
		<div className="w-full space-y-4">
			{!isReady && !error && (
				<div className="flex justify-center py-8">
					<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" />
				</div>
			)}
			<div id={DROP_IN_CONTAINER_ID} className="w-full text-left" />
			{error && (
				<p className="text-sm text-red-600 text-center">{error}</p>
			)}
		</div>
	)
}
