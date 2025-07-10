'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
	PhotoIcon,
	ArrowPathIcon,
	CheckCircleIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import BackButton from '@/app/ui/back-button'
import { useOrderStore } from '@/app/stores/orderStore'
import { useUploadImages } from '@/app/hooks/useUploadImages'
import z from 'zod'

export default function Instructions() {
	const [error, setError] = useState<string | null>(null)
	const { id, frontImage, setFrontImage, sideImage, setSideImage } =
		useOrderStore()
	const {
		mutate,
		isError,
		error: apiError,
		isSuccess,
		isPending,
	} = useUploadImages()

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'front' | 'side'
	) => {
		const file = e.target.files?.[0]
		if (!file) return

		try {
			// Validación inicial con Zod
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
				// Validación Base64
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
							!isSuccess
								? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed pointer-events-none'
								: 'bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg'
						}`}
						aria-disabled={!isSuccess}
						tabIndex={!isSuccess ? -1 : 0}>
						<span>Next</span>
					</Link>
				</div>
			</footer>
		</div>
	)
}
