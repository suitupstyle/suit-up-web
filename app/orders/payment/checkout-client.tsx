'use client'

import { useOrderStore } from "@/app/stores/orderStore";
import { OrdersService } from "@/app/services/orders.service";
import BackButton from "@/app/ui/back-button";
import StepAlert from "@/app/ui/step-alert";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { initAirwallex } from '@/app/lib/airwallex'
import { getErrorMessage } from '@/app/lib/api/errorHandler'

const TAX_RATE = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0.08);
const DROP_IN_CONTAINER_ID = 'airwallex-drop-in'

const DROP_IN_APPEARANCE = {
	mode: 'light' as const,
	variables: {
		colorBrand: '#000000',
		colorText: '#111111',
		colorBackground: '#ffffff',
	},
	rules: {
		'.Button': {
			backgroundColor: '#000000',
			color: '#ffffff',
			borderRadius: '8px',
			border: '2px solid #000000',
			fontWeight: 600,
			height: '48px',
		},
		'.Button:hover': {
			backgroundColor: '#1f2937',
			borderColor: '#1f2937',
		},
		'.Input': {
			borderRadius: '8px',
			border: '2px solid #d1d5db',
		},
		'.Input:hover': {
			borderColor: '#111111',
		},
		'.Input:active': {
			borderColor: '#000000',
		},
	},
}

const DROP_IN_STYLE = {
	variant: 'outlined' as const,
	base: {
		background: 'transparent',
		boxShadow: 'none',
		padding: '0',
		border: 'none',
	},
	input: {
		borderRadius: '8px',
		border: '2px solid #d1d5db',
		fontSize: '16px',
	},
}

type CheckoutIntent = {
	intentId: string
	clientSecret: string
	currency: string
}

export default function CheckoutClient() {
	const { orderId, orderPrice, orderItems } = useOrderStore()
	const router = useRouter()
	const [intent, setIntent] = useState<CheckoutIntent | null>(null)
	const [fetchError, setFetchError] = useState<string | null>(null)

	const subtotal = Number(orderPrice ?? 0)
	const taxes = subtotal * TAX_RATE;
	const total = subtotal + taxes
	const taxPercent = Math.round(TAX_RATE * 100)
	const itemName = orderItems?.[0]?.name ?? 'Custom Suit'

	useEffect(() => {
		if (!orderId || !orderPrice) {
			router.replace('/orders/details')
			return
		}

		OrdersService.createPaymentIntent({ orderId })
			.then((res) => setIntent(res.data))
			.catch((err) =>
				setFetchError(
					getErrorMessage(err, 'Unable to initialize payment. Please try again.'),
				),
			)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (fetchError) {
		return (
			<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-center items-center text-center gap-4">
				<StepAlert>{fetchError}</StepAlert>
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
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col items-center relative">
			<BackButton href="/orders/details" />
			<header className="w-full mb-8 text-center">
				<h1 className="font-bold text-2xl">
					Complete your payment
				</h1>
			</header>

			<div className="w-full grid grid-cols-1 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] gap-6 lg:gap-8 items-stretch">
				<aside className="w-full text-left bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden flex flex-col">
					<div className="px-5 pt-5 pb-4">
						<p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500">
							Your order
						</p>
						<h2 className="mt-2 font-bold text-lg leading-snug">
							{itemName}
						</h2>
						{orderId && (
							<p className="mt-1 text-sm text-gray-500">
								Order #{orderId}
							</p>
						)}
					</div>
					<dl className="mt-auto px-5 pb-5 space-y-2 text-sm">
						<div className="flex justify-between gap-3">
							<dt className="text-gray-600">Subtotal</dt>
							<dd>${subtotal.toFixed(2)}</dd>
						</div>
						<div className="flex justify-between gap-3">
							<dt className="text-gray-600">Taxes ({taxPercent}%)</dt>
							<dd>${taxes.toFixed(2)}</dd>
						</div>
						<div className="flex justify-between gap-3 items-baseline border-t border-black pt-3 mt-3 font-black text-base">
							<dt>Total</dt>
							<dd>${total.toFixed(2)}</dd>
						</div>
					</dl>
				</aside>

				<section className="w-full text-left bg-white border border-gray-200 rounded-lg shadow-md px-5 py-5">
					<p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-gray-500">
						Pay with card
					</p>
					<p className="mt-1 mb-4 text-sm text-gray-600">
						Enter your card details to confirm this order.
					</p>
					<DropInCheckout
						orderId={orderId}
						intent={intent}
					/>
				</section>
			</div>
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
					methods: ['card'],
					layout: {
						type: 'accordion',
						alwaysShowMethodLabel: false,
					},
					appearance: DROP_IN_APPEARANCE,
					style: DROP_IN_STYLE,
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
		<div className="relative w-full">
			{!isReady && !error && (
				<div className="absolute inset-0 z-10 flex min-h-[240px] items-center justify-center bg-white/80">
					<ArrowPathIcon className="animate-spin h-8 w-8 text-gray-500" />
				</div>
			)}
			<div
				id={DROP_IN_CONTAINER_ID}
				className="w-full min-h-[240px] text-left"
			/>
			{error && (
				<div className="mt-3">
					<StepAlert>{error}</StepAlert>
				</div>
			)}
		</div>
	)
}
