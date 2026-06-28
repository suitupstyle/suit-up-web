'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
	CheckCircleIcon,
	XCircleIcon,
	ArrowLeftIcon,
} from '@heroicons/react/24/outline'

function ReturnContent() {
	const searchParams = useSearchParams()
	const sessionId = searchParams.get('session_id')

	if (!sessionId) {
		return (
			<div className="text-center space-y-4">
				<XCircleIcon className="h-16 w-16 text-red-400 mx-auto" />
				<h1 className="text-2xl font-bold text-gray-900">
					No session found
				</h1>
				<p className="text-gray-500 text-sm">
					This page should be reached via Stripe&apos;s redirect after
					payment.
				</p>
				<Link
					href="/sample/checkout"
					className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
					<ArrowLeftIcon className="h-4 w-4" />
					Back to checkout
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
					The Stripe integration is working correctly.
				</p>
			</div>

			<div className="bg-gray-50 rounded-xl p-4 text-left space-y-2 text-sm">
				<div className="flex flex-col gap-1">
					<span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
						Checkout Session ID
					</span>
					<span className="break-all font-mono text-xs text-gray-700">
						{sessionId}
					</span>
				</div>
				<div className="flex flex-col gap-1 border-t border-gray-200 pt-2">
					<span className="text-gray-400 text-xs uppercase font-semibold tracking-wide">
						Amount
					</span>
					<span className="text-gray-700">$99.00 USD</span>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<Link
					href="/sample/checkout"
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

export default function SampleCheckoutReturn() {
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
				<Suspense
					fallback={
						<div className="text-center text-gray-400">Loading…</div>
					}>
					<ReturnContent />
				</Suspense>
			</div>
		</div>
	)
}
