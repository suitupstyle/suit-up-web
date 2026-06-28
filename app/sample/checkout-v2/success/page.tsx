'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
	CheckCircleIcon,
	XCircleIcon,
	ArrowLeftIcon,
	ClockIcon,
} from '@heroicons/react/24/outline'

type RedirectStatus = 'succeeded' | 'processing' | 'requires_payment_method' | string

function SuccessContent() {
	const searchParams = useSearchParams()
	const paymentIntentId = searchParams.get('payment_intent')
	const redirectStatus = searchParams.get('redirect_status') as RedirectStatus | null

	if (!paymentIntentId) {
		return (
			<div className="text-center space-y-4">
				<XCircleIcon className="h-16 w-16 text-red-400 mx-auto" />
				<h1 className="text-2xl font-bold text-gray-900">
					No payment found
				</h1>
				<p className="text-gray-500 text-sm">
					This page should be reached via Stripe&apos;s redirect after
					payment.
				</p>
				<Link
					href="/sample/checkout-v2"
					className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
					<ArrowLeftIcon className="h-4 w-4" />
					Back to checkout
				</Link>
			</div>
		)
	}

	if (redirectStatus === 'processing') {
		return (
			<div className="text-center space-y-6">
				<ClockIcon className="h-16 w-16 text-yellow-400 mx-auto" />
				<div className="space-y-1">
					<h1 className="text-2xl font-bold text-gray-900">
						Payment processing
					</h1>
					<p className="text-gray-500 text-sm">
						Your payment is being processed. We&apos;ll notify you once it&apos;s confirmed.
					</p>
				</div>
				<PaymentDetails paymentIntentId={paymentIntentId} status="processing" />
			</div>
		)
	}

	if (redirectStatus !== 'succeeded') {
		return (
			<div className="text-center space-y-6">
				<XCircleIcon className="h-16 w-16 text-red-400 mx-auto" />
				<div className="space-y-1">
					<h1 className="text-2xl font-bold text-gray-900">
						Payment failed
					</h1>
					<p className="text-gray-500 text-sm">
						Status:{' '}
						<code className="bg-gray-100 px-1 rounded">
							{redirectStatus ?? 'unknown'}
						</code>
					</p>
				</div>
				<Link
					href="/sample/checkout-v2"
					className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
					<ArrowLeftIcon className="h-4 w-4" />
					Try again
				</Link>
			</div>
		)
	}

	return (
		<div className="text-center space-y-6">
			<CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto" />

			<div className="space-y-1">
				<h1 className="text-2xl font-bold text-gray-900">
					Payment confirmed
				</h1>
				<p className="text-gray-500 text-sm">
					The Stripe Payment Intent integration is working correctly.
				</p>
			</div>

			<PaymentDetails paymentIntentId={paymentIntentId} status="succeeded" />

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Link
					href="/sample/checkout-v2"
					className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border-2 border-black text-black text-sm font-semibold hover:bg-gray-50 transition-colors">
					<ArrowLeftIcon className="h-4 w-4" />
					Test again
				</Link>
				<Link
					href="/"
					className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
					Back to home
				</Link>
			</div>
		</div>
	)
}

function PaymentDetails({
	paymentIntentId,
	status,
}: {
	paymentIntentId: string
	status: string
}) {
	return (
		<div className="bg-gray-50 rounded-xl p-4 text-left space-y-3 text-sm">
			<div className="flex flex-col gap-1">
				<span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
					Payment Intent ID
				</span>
				<span className="break-all font-mono text-xs text-gray-700">
					{paymentIntentId}
				</span>
			</div>
			<div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
				<span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
					Amount
				</span>
				<span className="text-gray-700">$99.00 USD</span>
			</div>
			<div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
				<span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
					Status
				</span>
				<span className="text-gray-700">{status}</span>
			</div>
		</div>
	)
}

export default function SampleCheckoutV2Success() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Suspense
					fallback={
						<div className="text-center text-gray-400">Loading…</div>
					}>
					<SuccessContent />
				</Suspense>
			</div>
		</div>
	)
}
