'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import {
	EnvelopeIcon,
	LockClosedIcon,
	ArrowPathIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { LoginFormData, loginSchema } from '../lib/definitions'

export default function LoginPage() {
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	})

	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormData) => {
			const {
				data: { session },
				error,
			} = await supabase.auth.signInWithPassword({
				email: data.email,
				password: data.password,
			})

			if (error) throw error
			return session
		},
		onSuccess: (session) => {
			if (session?.user) {
				router.push(
					session.user.user_metadata?.is_admin
						? '/admin'
						: '/dashboard'
				)
			}
		},
	})

	const onSubmit = handleSubmit((data) => {
		loginMutation.mutate(data)
	})

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center">
			<header className="w-full">
				<h1 className="font-bold text-2xl mb-5">Welcome Back</h1>
				<p className="font-normal text-sm">
					Sign in to access your personalized dashboard
				</p>
			</header>

			<form
				onSubmit={onSubmit}
				className="w-full max-w-md space-y-4">
				{/* Email Input */}
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<EnvelopeIcon className="h-5 w-5 text-gray-400" />
					</div>
					<input
						{...register('email')}
						type="email"
						placeholder="Email Address"
						className={`pl-10 w-full rounded-lg border-2 ${
							errors.email ? 'border-red-500' : 'border-gray-300'
						} focus:border-black p-3`}
						disabled={loginMutation.isPending}
					/>
					{errors.email && (
						<p className="mt-1 text-sm text-red-600 text-left">
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password Input */}
				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<LockClosedIcon className="h-5 w-5 text-gray-400" />
					</div>
					<input
						{...register('password')}
						type="password"
						placeholder="Password"
						className={`pl-10 w-full rounded-lg border-2 ${
							errors.password
								? 'border-red-500'
								: 'border-gray-300'
						} focus:border-black p-3`}
						disabled={loginMutation.isPending}
					/>
					{errors.password && (
						<p className="mt-1 text-sm text-red-600 text-left">
							{errors.password.message}
						</p>
					)}
				</div>

				{loginMutation.isError && (
					<div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
						{loginMutation.error instanceof Error
							? loginMutation.error.message
							: 'Authentication failed'}
					</div>
				)}

				<button
					type="submit"
					disabled={loginMutation.isPending}
					className={`w-full px-6 py-3 rounded-lg border-2 border-black flex items-center justify-center gap-2 transition-all ${
						loginMutation.isPending
							? 'bg-gray-300 text-gray-500 cursor-not-allowed'
							: 'bg-black text-white hover:bg-gray-800'
					}`}>
					{loginMutation.isPending ? (
						<>
							<ArrowPathIcon className="w-5 h-5 animate-spin" />
							Signing in...
						</>
					) : (
						'Sign In'
					)}
				</button>
			</form>

			<footer className="w-full">
				<div className="w-full flex flex-col items-center gap-3">
					<Link
						href="/forgot-password"
						className="text-sm text-gray-600 hover:text-black">
						Forgot password?
					</Link>

					<Link
						href="/"
						className="flex items-center gap-2 text-sm text-gray-600 hover:text-black">
						Back to Home
					</Link>
				</div>
			</footer>
		</div>
	)
}
