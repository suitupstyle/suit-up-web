'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	EnvelopeIcon,
	LockClosedIcon,
	UserIcon,
	ArrowPathIcon,
	EyeIcon,
	EyeSlashIcon,
} from '@heroicons/react/24/outline'
import BackButton from '@/app/ui/back-button'
import { useRouter } from 'next/navigation'
import { useState, useId } from 'react'
import { logger } from '@/app/lib/logger'
import { type UserFormData } from '@/app/lib/definitions'
import { UserSchema } from '@/app/lib/schemas'
import { useMutation } from '@tanstack/react-query'
import { OrdersService } from '@/app/services/orders.service'
import { useOrderStore } from '@/app/stores/orderStore'
import { usePreOrderStore } from '@/app/stores/preOrderStore'

export default function Details() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<UserFormData>({
		resolver: zodResolver(UserSchema),
	})
	const router = useRouter()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false)
	const detailsFormId = useId()
	const { setOrder } = useOrderStore()
	const { id: preorderId } = usePreOrderStore()

	const { mutate: submitDetails, isError } = useMutation({
		mutationFn: (data: UserFormData) =>
			OrdersService.createOrder({
				preorderId: preorderId as string,
				customerName: data.full_name,
				customerEmail: data.email,
				customerPassword: data.password,
				orderType: 'ABC',
				orderQuantity: 1,
				orderLeadTime: 1,
				jacketBook: 'SUIT 2301',
				jacketFabric: 'DBK053A',
			}),
		onSuccess: (response) => {
			logger.log('Order created:', response)
			setOrder(
				response.data.id,
				response.data.pricingData.price,
				response.data.items,
			)
			router.push('/orders/checkout')
		},
		onError: (error) => {
			logger.error('Order creation error:', error)
		},
	})

	const onSubmit = async (data: UserFormData) => {
		if (!preorderId) {
			router.replace('/')
			return
		}
		submitDetails(data)
	}

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center relative">
			<BackButton href="/orders/confirmation" />
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">Submit your details</h1>
			</header>

			<form
				onSubmit={handleSubmit(onSubmit)}
				className="w-full max-w-md space-y-4"
				id={detailsFormId}
				noValidate>
				{/* Full Name */}
				<div className="w-full flex flex-col justify-start gap-1 text-start">
					<label
						htmlFor="fullName"
						className="select-none">
						Full Name:
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<UserIcon className="h-5 w-5 text-gray-400" />
						</div>
						<input
							{...register('full_name')}
							type="text"
							placeholder="Full Name"
							className={`pl-10 w-full rounded-lg border-2 ${
								errors.full_name
									? 'border-red-500'
									: 'border-gray-300'
							} focus:border-black p-3`}
							disabled={isSubmitting}
						/>
					</div>
					<div className="h-5">
						{errors.full_name && (
							<p className="text-sm text-red-600 text-left">
								{errors.full_name.message}
							</p>
						)}
					</div>
				</div>

				{/* Email */}
				<div className="w-full flex flex-col justify-start gap-1 text-start">
					<label
						htmlFor="email"
						className="select-none">
						Email:
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<EnvelopeIcon className="h-5 w-5 text-gray-400" />
						</div>
						<input
							{...register('email')}
							type="email"
							placeholder="Email Address"
							className={`pl-10 w-full rounded-lg border-2 ${
								errors.email
									? 'border-red-500'
									: 'border-gray-300'
							} focus:border-black p-3`}
							disabled={isSubmitting}
						/>
					</div>
					<div className="h-5 mt-1">
						{errors.email && (
							<p className="text-sm text-red-600 text-left">
								{errors.email.message}
							</p>
						)}
					</div>
				</div>

				{/* Password */}
				<div className="w-full flex flex-col justify-start gap-1 text-start">
					<label
						htmlFor="password"
						className="select-none">
						Create Password:
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<LockClosedIcon className="h-5 w-5 text-gray-400" />
						</div>
						<input
							{...register('password')}
							type={isPasswordVisible ? 'text' : 'password'}
							placeholder="Password"
							className={`pl-10 w-full rounded-lg border-2 ${
								errors.password
									? 'border-red-500'
									: 'border-gray-300'
							} focus:border-black p-3`}
							disabled={isSubmitting}
						/>
						<button
							className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
							onPointerDown={(e) => {
								e.stopPropagation()
								e.preventDefault()
								setIsPasswordVisible((prev) => !prev)
							}}>
							{isPasswordVisible ? (
								<EyeIcon className="h-5 w-5 text-gray-400" />
							) : (
								<EyeSlashIcon className="h-5 w-5 text-gray-400" />
							)}
						</button>
					</div>
					<div className="h-5 mt-1">
						{errors.password && (
							<p className="text-sm text-red-600 text-left">
								{errors.password.message}
							</p>
						)}
					</div>
				</div>

				{/* Confirm Password */}
				<div className="w-full flex flex-col justify-start gap-1 text-start">
					<label
						htmlFor="confirmPassword"
						className="select-none">
						Confirm Password:
					</label>
					<div className="relative">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
							<LockClosedIcon className="h-5 w-5 text-gray-400" />
						</div>
						<input
							{...register('confirmPassword')}
							type={
								isConfirmPasswordVisible ? 'text' : 'password'
							}
							placeholder="Confirm Password"
							className={`pl-10 w-full rounded-lg border-2 ${
								errors.confirmPassword
									? 'border-red-500'
									: 'border-gray-300'
							} focus:border-black p-3`}
							disabled={isSubmitting}
						/>
						<button
							className="absolute inset-y-0 right-0 pr-3 flex items-center z-10"
							onPointerDown={(e) => {
								e.stopPropagation()
								e.preventDefault()
								setIsConfirmPasswordVisible((prev) => !prev)
							}}>
							{isConfirmPasswordVisible ? (
								<EyeIcon className="h-5 w-5 text-gray-400" />
							) : (
								<EyeSlashIcon className="h-5 w-5 text-gray-400" />
							)}
						</button>
					</div>
					<div className="h-5 mt-1">
						{errors.confirmPassword && (
							<p className="text-sm text-red-600 text-left">
								{errors.confirmPassword.message}
							</p>
						)}
					</div>
				</div>
			</form>

			<footer className="w-full">
				<div className="w-full flex justify-center">
					<button
						type="submit"
						form={detailsFormId}
						disabled={isSubmitting}
						className={`w-full max-w-md px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all ${
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
							'Submit and Continue'
						)}
					</button>
				</div>
			</footer>
		</div>
	)
}
