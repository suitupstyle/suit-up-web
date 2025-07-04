'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
	CreditCardIcon,
	LockClosedIcon,
	EnvelopeIcon,
	UserIcon,
	HomeIcon,
	BuildingOfficeIcon,
	ArrowPathIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import BackButton from '@/app/ui/back-button'
import { logger } from '@/app/lib/logger'

const paymentSchema = z
	.object({
		paymentMethod: z.enum(['stripe', 'paypal', 'alipay', 'applepay']),
		cardHolderName: z
			.string()
			.min(2, 'Name must be at least 2 characters')
			.optional(),
		email: z.string().email('Invalid email address').optional(),
		expirationDate: z
			.string()
			.regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiration date')
			.optional(),
		cvv: z
			.string()
			.min(3, 'CVV must be at least 3 digits')
			.max(4, 'CVV too long')
			.optional(),
		streetAddress: z.string().min(5, 'Address too short').optional(),
		city: z.string().min(2, 'City name too short').optional(),
	})
	.superRefine((data, ctx) => {
		if (data.paymentMethod === 'stripe') {
			if (!data.cardHolderName) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Card holder name is required',
					path: ['cardHolderName'],
				})
			}
			if (!data.email) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Email is required',
					path: ['email'],
				})
			}
			if (!data.expirationDate) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Expiration date is required',
					path: ['expirationDate'],
				})
			}
			if (!data.cvv) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'CVV is required',
					path: ['cvv'],
				})
			}
			if (!data.streetAddress) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Street address is required',
					path: ['streetAddress'],
				})
			}
			if (!data.city) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'City is required',
					path: ['city'],
				})
			}
		}
	})

type PaymentFormData = z.infer<typeof paymentSchema>

export default function Payment() {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<PaymentFormData>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			paymentMethod: 'stripe',
		},
	})

	const selectedMethod = watch('paymentMethod')

	const onSubmit = async (data: PaymentFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 1500))
		logger.log('Payment submitted:', data)
		// Here you would normally call your payment API
	}

	// Mock order data
	const subtotal = 599.99
	const taxes = (subtotal * 0.08).toFixed(2)
	const total = (subtotal + parseFloat(taxes)).toFixed(2)

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center relative">
			<BackButton href="/orders/details" />
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">
					Choose your payment method
				</h1>
			</header>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full space-y-6"
				noValidate>
				{/* Payment Methods */}
				<div className="space-y-3">
					<label className="flex items-center space-x-3 p-4 transition-colors hover:bg-gradient-to-r hover:from-gray-300 hover:to-transparent rounded-lg ease-linear cursor-pointer">
						<input
							type="radio"
							value="stripe"
							className="h-5 w-5 text-black focus:ring-black"
							{...register('paymentMethod')}
						/>
						<span className="block text-lg font-medium">
							Stripe
						</span>
					</label>

					<div className="space-y-4 pl-8 md:pl-20">
						{/* Card Holder Name */}
						<div className="w-full flex flex-col justify-start gap-1 text-start">
							<label
								htmlFor="cardHolderName"
								className="select-none">
								Card Holder Name:
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<UserIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register('cardHolderName')}
									type="text"
									placeholder="Name on card"
									className={`pl-10 w-full rounded-lg border-2 ${
										errors.cardHolderName
											? 'border-red-500'
											: 'border-gray-300'
									} focus:border-black p-3`}
									disabled={isSubmitting}
								/>
							</div>
							<div className="h-5">
								{errors.cardHolderName && (
									<p className="text-sm text-red-600 text-left">
										{errors.cardHolderName.message}
									</p>
								)}
							</div>
						</div>

						{/* Email */}
						<div className="w-full flex flex-col justify-start gap-1 text-start">
							<label
								htmlFor="email"
								className="select-none">
								Email Address:
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<EnvelopeIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register('email')}
									type="email"
									placeholder="Email for receipt"
									className={`pl-10 w-full rounded-lg border-2 ${
										errors.email
											? 'border-red-500'
											: 'border-gray-300'
									} focus:border-black p-3`}
									disabled={isSubmitting}
								/>
							</div>
							<div className="h-5">
								{errors.email && (
									<p className="text-sm text-red-600 text-left">
										{errors.email.message}
									</p>
								)}
							</div>
						</div>

						{/* Expiration Date and CVV */}
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* Expiration Date */}
							<div className="w-full flex flex-col justify-start gap-1 text-start">
								<label
									htmlFor="expirationDate"
									className="select-none">
									Expiration Date:
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<CreditCardIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										{...register('expirationDate')}
										type="text"
										placeholder="MM/YY"
										className={`pl-10 w-full rounded-lg border-2 ${
											errors.expirationDate
												? 'border-red-500'
												: 'border-gray-300'
										} focus:border-black p-3`}
										disabled={isSubmitting}
									/>
								</div>
								<div className="h-5">
									{errors.expirationDate && (
										<p className="text-sm text-red-600 text-left">
											{errors.expirationDate.message}
										</p>
									)}
								</div>
							</div>

							{/* CVV */}
							<div className="w-full flex flex-col justify-start gap-1 text-start">
								<label
									htmlFor="cvv"
									className="select-none">
									CVV:
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<LockClosedIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										{...register('cvv')}
										type="text"
										placeholder="123"
										className={`pl-10 w-full rounded-lg border-2 ${
											errors.cvv
												? 'border-red-500'
												: 'border-gray-300'
										} focus:border-black p-3`}
										disabled={isSubmitting}
									/>
								</div>
								<div className="h-5">
									{errors.cvv && (
										<p className="text-sm text-red-600 text-left">
											{errors.cvv.message}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* Street Address */}
						<div className="w-full flex flex-col justify-start gap-1 text-start">
							<label
								htmlFor="streetAddress"
								className="select-none">
								Street Address:
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<HomeIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register('streetAddress')}
									type="text"
									placeholder="123 Main St"
									className={`pl-10 w-full rounded-lg border-2 ${
										errors.streetAddress
											? 'border-red-500'
											: 'border-gray-300'
									} focus:border-black p-3`}
									disabled={isSubmitting}
								/>
							</div>
							<div className="h-5">
								{errors.streetAddress && (
									<p className="text-sm text-red-600 text-left">
										{errors.streetAddress.message}
									</p>
								)}
							</div>
						</div>

						{/* City */}
						<div className="w-full flex flex-col justify-start gap-1 text-start">
							<label
								htmlFor="city"
								className="select-none">
								City:
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
								</div>
								<input
									{...register('city')}
									type="text"
									placeholder="New York"
									className={`pl-10 w-full rounded-lg border-2 ${
										errors.city
											? 'border-red-500'
											: 'border-gray-300'
									} focus:border-black p-3`}
									disabled={isSubmitting}
								/>
							</div>
							<div className="h-5">
								{errors.city && (
									<p className="text-sm text-red-600 text-left">
										{errors.city.message}
									</p>
								)}
							</div>
						</div>
					</div>

					<label className="flex items-center space-x-3 p-4 transition-colors hover:bg-gradient-to-r hover:from-gray-300 hover:to-transparent rounded-lg ease-linear cursor-pointer">
						<input
							type="radio"
							value="paypal"
							className="h-5 w-5 text-black focus:ring-black"
							{...register('paymentMethod')}
						/>
						<span className="block text-lg font-medium">
							PayPal
						</span>
					</label>

					<label className="flex items-center space-x-3 p-4 transition-colors hover:bg-gradient-to-r hover:from-gray-300 hover:to-transparent rounded-lg ease-linear cursor-pointer">
						<input
							type="radio"
							value="alipay"
							className="h-5 w-5 text-black focus:ring-black"
							{...register('paymentMethod')}
						/>
						<div className="flex items-center gap-4">
							<span className="block text-lg font-medium">
								AliPay
							</span>
							<img
								src="/ali-pay-icon.svg"
								alt="Ali Pay Icon"
							/>
						</div>
					</label>

					<label className="flex items-center space-x-3 p-4 transition-colors hover:bg-gradient-to-r hover:from-gray-300 hover:to-transparent rounded-lg ease-linear cursor-pointer">
						<input
							type="radio"
							value="applepay"
							className="h-5 w-5 text-black focus:ring-black"
							{...register('paymentMethod')}
						/>
						<div className="flex items-center gap-4">
							<span className="block text-lg font-medium">
								Apple Pay
							</span>
							<img
								src="/apple-pay-icon.svg"
								alt="Apple Pay Icon"
							/>
						</div>
					</label>
				</div>

				{/* Order Summary */}
				<div className="border-t border-gray-300 pt-4 space-y-2">
					<div className="flex justify-center gap-2">
						<span className="font-bold">Subtotal:</span>
						<span>${subtotal.toFixed(2)}</span>
					</div>
					<div className="flex justify-center gap-2">
						<span className="font-bold">Taxes:</span>
						<span>${taxes}</span>
					</div>
					<div className="flex justify-center gap-2 font-black text-lg border-t border-gray-300 mt-2">
						<span>Total:</span>
						<span>${total}</span>
					</div>
				</div>

				<footer className="w-full pt-6">
					<div className="w-full flex justify-center">
						<button
							type="submit"
							disabled={isSubmitting}
							className={`w-full max-w-md px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all ${
								isSubmitting
									? 'bg-gray-300 text-gray-500 cursor-not-allowed'
									: 'bg-black text-white hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg'
							}`}>
							{isSubmitting ? (
								<>
									<ArrowPathIcon className="animate-spin h-5 w-5 text-white" />
									Processing...
								</>
							) : (
								'Payment'
							)}
						</button>
					</div>
				</footer>
			</form>
		</div>
	)
}
