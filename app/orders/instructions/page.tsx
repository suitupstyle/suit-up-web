'use client'

import { PreOrderFormData, preOrderSchema } from '@/app/lib/definitions'
import { logger } from '@/app/lib/logger'
import { PreOrdersService } from '@/app/services/preOrders.service'
import { usePreOrderStore } from '@/app/stores/preOrderStore'
import BackButton from '@/app/ui/back-button'
import {
	ArrowPathIcon,
	CheckCircleIcon,
	PhotoIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

export default function Instructions() {
	const [error, setError] = useState<string | null>(null)
	const {
		id,
		setGender,
		setHeight,
		setWeight,
		frontImage,
		setFrontImage,
		sideImage,
		setSideImage,
		setMeasurements,
	} = usePreOrderStore()
	logger.log('preorder id', { id })

	const {
		mutate,
		isError,
		error: apiError,
		isSuccess,
		isPending,
		data,
	} = useMutation({
		mutationFn: PreOrdersService.uploadImagesAndData,
	})

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<PreOrderFormData>({
		resolver: zodResolver(preOrderSchema),
		defaultValues: {
			gender: 'male',
			weight: 0,
			height: 0,
		},
	})

	const instructionsFormId = useId()
	const router = useRouter()

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'front' | 'side'
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			const validated = z
				.object({
					type: z.string().regex(/^image\/(jpeg|png|webp)/),
					size: z.number().max(2 * 1024 * 1024),
				})
				.parse({
					type: file.type,
					size: file.size,
				})

			const reader = new FileReader()
			reader.onload = (event) => {
				const result = event.target?.result as string
				if (!z.string().includes('base64').safeParse(result).success) {
					throw new Error('Invalid Base64 encoding')
				}
				type === 'front' ? setFrontImage(result) : setSideImage(result)
			}
			reader.readAsDataURL(file)
		} catch (err) {
			if (err instanceof z.ZodError) {
				setError(err.issues.map((i) => i.message).join(', '))
			} else {
				setError((err as Error).message)
			}
		}
	}

	const handleUpload = async (formData: PreOrderFormData) => {
		if (!frontImage || !sideImage) {
			setError('Please upload both front and side pictures')
			return
		}
		logger.log('preorder id', id)
		mutate(
			{
				id,
				frontImage,
				sideImage,
				gender: formData.gender,
				weight: formData.weight,
				height: formData.height,
			},
			{
				onSuccess: (data) => {
					logger.log('measurements response', data)
					setGender(data.data.gender)
					setWeight(data.data.weight)
					setHeight(data.data.height)
					setMeasurements(data.data.measurementData)
					router.push('/orders/confirmation')
				},
				onError: (err) => {
					logger.error('Instructions POST error:', err)
				},
			}
		)
	}

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center text-center relative">
			<BackButton />
			<header>
				<h1 className="font-bold text-2xl mb-5">Instructions</h1>
				<p className="font-normal text-sm">
					Upload a clear, full-body photo of you standing straight,
					Make sure that your feet/shoes and hands are visible, so our
					AI can determine your perfect fit.
				</p>
			</header>

			<section className="w-full max-w-4xl mx-auto p-4">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{/* Front picture */}
					<div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							onChange={(e) => handleImageUpload(e, 'front')}
							disabled={isPending}
						/>
						{frontImage ? (
							<img
								src={frontImage}
								alt="Front preview"
								className="w-full h-full object-contain"
							/>
						) : (
							<div className="text-center p-4">
								<PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
								<p className="mt-2 text-sm text-gray-600">
									Tap to upload front picture
								</p>
							</div>
						)}
					</div>

					{/* Side picture */}
					<div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden flex flex-col items-center justify-center border-2 border-dashed border-gray-300 cursor-pointer hover:border-blue-500 transition-colors">
						<input
							type="file"
							accept="image/*"
							className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
							onChange={(e) => handleImageUpload(e, 'side')}
							disabled={isPending}
						/>
						{sideImage ? (
							<img
								src={sideImage}
								alt="Side preview"
								className="w-full h-full object-contain"
							/>
						) : (
							<div className="text-center p-4">
								<PhotoIcon className="w-12 h-12 mx-auto text-gray-400" />
								<p className="mt-2 text-sm text-gray-600">
									Tap to upload side picture
								</p>
							</div>
						)}
					</div>
				</div>
				<form
					id={instructionsFormId}
					onSubmit={handleSubmit(handleUpload)}
					className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
					{/* GENDER */}
					<div className="flex items-center justify-between text-gray-700 font-medium lg:pr-6 lg:border-gray-300 border-r">
						<span className="w-full text-start">Gender</span>
						<div className="flex items-center space-x-3">
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									value="male"
									{...register('gender')}
									className="form-radio"
								/>
								<span className="text-sm">Male</span>
							</label>
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									value="female"
									{...register('gender')}
									className="form-radio"
								/>
								<span className="text-sm">Female</span>
							</label>
						</div>
					</div>

					{/* HEIGHT */}
					<div className="flex items-center justify-between text-gray-700 font-medium lg:pr-6 lg:border-gray-300 border-r">
						<span className="w-full text-start">Height (cm)</span>
						<input
							type="number"
							{...register('height')}
							className={clsx(
								'w-full h-11 px-2 py-1 border rounded text-right',
								{
									'border-red-500': errors.height,
								}
							)}
							step="0.1"
							min="0"
						/>
					</div>

					{/* WEIGHT */}
					<div className="flex items-center justify-between text-gray-700 font-medium">
						<span className="w-full text-start">Weight (kg)</span>
						<input
							type="number"
							{...register('weight')}
							className={clsx(
								'w-full h-11 px-2 py-1 border rounded text-right',
								{
									'border-red-500': errors.weight,
								}
							)}
							step="0.1"
							min="0"
						/>
					</div>
				</form>
				<div className="w-full h-5 flex flex-col gap-1 justify-start">
					{errors.gender && (
						<small className="text-sm text-red-600 text-left">
							Gender error: {errors.gender.message}
						</small>
					)}
					{errors.height && (
						<small className="text-sm text-red-600 text-left">
							Height error: {errors.height.message}
						</small>
					)}
					{errors.weight && (
						<small className="text-sm text-red-600 text-left">
							Weight error: {errors.weight.message}
						</small>
					)}
				</div>

				{/* Status indicators */}
				<div className="h-12 mt-4 text-sm md:text-base">
					{isPending && (
						<div className="p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center gap-2">
							<ArrowPathIcon className="w-5 h-5 animate-spin" />
							<small>Uploading images, please wait...</small>
						</div>
					)}

					{isSuccess && (
						<div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-center justify-center gap-2">
							<CheckCircleIcon className="w-5 h-5" />
							<small>Images uploaded successfully!</small>
						</div>
					)}

					{error && (
						<div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-center justify-center gap-2">
							<XCircleIcon className="w-5 h-5" />
							<small>{error}</small>
						</div>
					)}
				</div>
			</section>

			<footer className="w-full">
				<div className="w-full flex justify-between items-center gap-5">
					<button
						type="submit"
						form={instructionsFormId}
						className={clsx(
							'w-full h-14 rounded-lg border-2 flex justify-center items-center transition-all ease-in-out',
							{
								'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed pointer-events-none':
									isPending,
								'bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg':
									!isPending,
							}
						)}
						disabled={isPending}>
						<span>Next</span>
					</button>
				</div>
			</footer>
		</div>
	)
}
