'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { useState } from 'react'
import { logger } from '@/app/lib/logger'

const signupSchema = z
	.object({
		fullName: z
			.string()
			.min(2, 'Name must be at least 2 characters')
			.max(50, 'Name too long'),
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(/[A-Z]/, 'Must contain at least one uppercase letter')
			.regex(/[0-9]/, 'Must contain at least one number'),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

type SignupFormData = z.infer<typeof signupSchema>

export default function Details() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
	})
	const router = useRouter()
	const [isPasswordVisible, setIsPasswordVisible] = useState(false)
	const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
		useState(false)

	const onSubmit = async (data: SignupFormData) => {
		await new Promise((resolve) => setTimeout(resolve, 1500))
		logger.log('Form submitted:', data)
		router.push('/orders/payment')
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
							{...register('fullName')}
							type="text"
							placeholder="Full Name"
							className={`pl-10 w-full rounded-lg border-2 ${
								errors.fullName
									? 'border-red-500'
									: 'border-gray-300'
							} focus:border-black p-3`}
							disabled={isSubmitting}
						/>
					</div>
					<div className="h-5">
						{errors.fullName && (
							<p className="text-sm text-red-600 text-left">
								{errors.fullName.message}
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
						onClick={handleSubmit(onSubmit)}
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
							'Submit and Continue'
						)}
					</button>
				</div>
			</footer>
		</div>
	)
}
