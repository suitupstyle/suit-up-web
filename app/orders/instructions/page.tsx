'use client'

import { OrdersService } from '@/app/services/orders.service'
import { useOrderStore } from '@/app/stores/orderStore'
import BackButton from '@/app/ui/back-button'
import { ArrowPathIcon, CheckCircleIcon, PhotoIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { useState } from 'react'
import z from 'zod'

export default function Instructions() {
	const [error, setError] = useState<string | null>(null)
	const {
		id,
		gender,
		setGender,
		height,
		setHeight,
		weight,
		setWeight,
		frontImage,
		setFrontImage,
		sideImage,
		setSideImage,
	} = useOrderStore()

	const {
		mutate,
		isError,
		error: apiError,
		isSuccess,
		isPending,
	} = useMutation({
		mutationFn: OrdersService.uploadImages,
	})

	const isNextEnabled =
		isSuccess &&
		gender !== null &&
		height !== null &&
		weight !== null

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

	const handleUpload = async () => {
		if (!frontImage || !sideImage) {
			setError('Please upload both front and side pictures')
			return
		}

		mutate(
			{ orderId: id ?? '', frontImage, sideImage },
			{
				onSuccess: () => {
					// Manejo de éxito
				},
				onError: (err) => {
					// Error ya manejado por Zod o API
				},
			}
		)
	}

	const isUploadDisabled = !frontImage || !sideImage

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
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
					{/* GENDER */}
					<div className="flex items-center justify-between text-gray-700 font-medium">
						<span>Gender</span>
						<div className="flex items-center space-x-3">
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									name="gender"
									value="male"
									checked={gender === 'male'}
									onChange={() => setGender('male')}
									className="form-radio"
								/>
								<span className="text-sm">Male</span>
							</label>
							<label className="flex items-center space-x-1">
								<input
									type="radio"
									name="gender"
									value="female"
									checked={gender === 'female'}
									onChange={() => setGender('female')}
									className="form-radio"
								/>
								<span className="text-sm">Female</span>
							</label>
						</div>
					</div>

					{/* HEIGHT */}
					<div className="flex items-center justify-between text-gray-700 font-medium">
						<span>Height (cm)</span>
						<input
							type="number"
							value={height ?? ''}
							onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
							className="w-20 px-2 py-1 border rounded text-right"
							step="0.1"
							min="0"
						/>
					</div>

					{/* WEIGHT */}
					<div className="flex items-center justify-between text-gray-700 font-medium">
						<span>Weight (kg)</span>
						<input
							type="number"
							value={weight ?? ''}
							onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
							className="w-20 px-2 py-1 border rounded text-right"
							step="0.1"
							min="0"
						/>
					</div>
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
						onClick={handleUpload}
						disabled={isUploadDisabled || isPending}
						className={`w-full h-14 rounded-lg border-black border flex items-center justify-center gap-2 transition-colors ease-linear ${
							isUploadDisabled || isPending
								? 'bg-gray-200 text-gray-500 cursor-not-allowed'
								: 'bg-white text-black hover:bg-black hover:text-white'
						}`}>
						{isPending ? (
							<>
								<ArrowPathIcon className="w-5 h-5 animate-spin" />
								<span>Uploading...</span>
							</>
						) : (
							<span>Upload</span>
						)}
					</button>

					<Link
						href={'/orders/confirmation'}
						className={`w-full h-14 rounded-lg border-2 flex justify-center items-center transition-all ease-in-out ${
							!isNextEnabled
								? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed pointer-events-none'
								: 'bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg'
						}`}
						aria-disabled={!isNextEnabled}
						tabIndex={!isNextEnabled ? -1 : 0}
					>
						<span>Next</span>
					</Link>
				</div>
			</footer>
		</div>
	)
}
