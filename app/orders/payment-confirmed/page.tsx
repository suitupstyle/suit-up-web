'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ArrowLeftIcon, ShareIcon } from '@heroicons/react/24/outline'
import { useOrderStore } from '@/app/stores/orderStore'

const TAX_RATE = 0.08

function PaymentConfirmedContent() {
	const searchParams = useSearchParams()
	const sessionId = searchParams.get('session_id')

	const { orderId, orderPrice, orderItems } = useOrderStore()

	const subtotal = Number(orderPrice ?? 0)
	const amountPaid = subtotal * (1 + TAX_RATE)
	const item = orderItems?.[0]

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center">
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">
					Your order has been confirmed
				</h1>
				<p className="font-normal text-sm mb-8">Thank you</p>
				<p className="font-normal text-sm">
					We&apos;ve received your payment and measurements. Your tailored
					suit is now being produced.
				</p>
			</header>

			<section className="w-full max-w-2xl mx-auto p-4">
				<div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
						<div className="bg-gray-100 aspect-square flex items-center justify-center rounded-md my-auto">
							{item?.imageUrl ? (
								<img
									src={item.imageUrl}
									alt="Suit Preview"
									className="w-full h-full object-contain"
								/>
							) : (
								<span className="text-gray-400 text-sm">
									No preview available
								</span>
							)}
						</div>

						<div className="text-left space-y-3">
							<h3 className="font-bold text-xl antialiased">
								{item?.name ?? 'Custom Suit'}
							</h3>
							<div className="text-sm flex flex-col gap-2">
								{sessionId && (
									<div className="w-full flex flex-col justify-start items-start gap-1">
										<span className="text-gray-600">
											Session ID:
										</span>
										<span className="break-all text-xs text-gray-500">
											{sessionId}
										</span>
									</div>
								)}
								{orderId && (
									<div className="w-full flex flex-col justify-start items-start gap-1">
										<span className="text-gray-600">
											Order ID:
										</span>
										<span>{orderId}</span>
									</div>
								)}
								{orderPrice !== null && (
									<div className="w-full flex flex-col justify-start items-start gap-1">
										<span className="text-gray-600">
											Amount Paid:
										</span>
										<span>${amountPaid.toFixed(2)}</span>
									</div>
								)}
								<div className="w-full flex flex-col justify-start items-start gap-1">
									<span className="text-gray-600">
										Measurement Status:
									</span>
									<span className="capitalize">success</span>
								</div>
								<p>
									<span className="text-green-600 font-semibold text-base">
										Successfully Submitted
									</span>
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			<footer className="w-full">
				<div className="w-full flex flex-col md:flex-row justify-between items-center gap-4">
					<Link
						href="/"
						className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-black bg-white text-black transition-all hover:bg-gray-100">
						<ArrowLeftIcon className="w-5 h-5" />
						<span>Back to Home</span>
					</Link>

					<button
						className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-black text-white transition-all hover:bg-gray-800 hover:tracking-widest"
						onClick={() => alert('Sharing feature coming soon!')}>
						<ShareIcon className="w-5 h-5" />
						<span>Share with a friend</span>
					</button>
				</div>
			</footer>
		</div>
	)
}

export default function PaymentConfirmed() {
	return (
		<Suspense>
			<PaymentConfirmedContent />
		</Suspense>
	)
}
