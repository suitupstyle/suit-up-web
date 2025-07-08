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

export default function Instructions() {
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null)
	const [error, setError] = useState<string | null>(null)
	const { frontImage, setFrontImage, sideImage, setSideImage } =
		useOrderStore()

	const handleImageUpload = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: 'front' | 'side'
	) => {
		const file = e.target.files?.[0]
		if (file) {
			// Reset upload status when changing images
			setUploadSuccess(null)
			setError(null)

			// Validate image type and size
			if (!file.type.startsWith('image/')) {
				setError('Please upload a valid image file')
				return
			}

			if (file.size > 5 * 1024 * 1024) {
				// 5MB limit
				setError('Image size should be less than 5MB')
				return
			}

			const reader = new FileReader()
			reader.onload = (event) => {
				const result = event.target?.result as string
				type === 'front' ? setFrontImage(result) : setSideImage(result)
			}
			reader.readAsDataURL(file)
		}
	}

	const handleUpload = async () => {
		if (!frontImage || !sideImage) {
			setError('Please upload both front and side pictures')
			return
		}

		setIsSubmitting(true)
		setError(null)

		try {
			// Simulate API call with timeout
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					// Simulate random success/failure for testing
					const success = Math.random() > 0.3
					success
						? resolve(true)
						: reject(new Error('Upload failed. Please try again.'))
				}, 2000)
			})

			setUploadSuccess(true)
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Upload failed')
			setUploadSuccess(false)
		} finally {
			setIsSubmitting(false)
		}
	}

	const isUploadDisabled = !frontImage || !sideImage
	const isNextDisabled = !uploadSuccess

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
							disabled={isSubmitting}
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
							disabled={isSubmitting}
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
					{isSubmitting && (
						<div className="p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-center gap-2">
							<ArrowPathIcon className="w-5 h-5 animate-spin" />
							<small>Uploading images, please wait...</small>
						</div>
					)}

					{uploadSuccess && (
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
						disabled={isUploadDisabled || isSubmitting}
						className={`w-full h-14 rounded-lg border-black border flex items-center justify-center gap-2 transition-colors ease-linear ${
							isUploadDisabled || isSubmitting
								? 'bg-gray-200 text-gray-500 cursor-not-allowed'
								: 'bg-white text-black hover:bg-black hover:text-white'
						}`}>
						{isSubmitting ? (
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
							isNextDisabled
								? 'bg-gray-300 text-gray-500 border-gray-300 cursor-not-allowed pointer-events-none'
								: 'bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg'
						}`}
						aria-disabled={isNextDisabled}
						tabIndex={isNextDisabled ? -1 : 0}>
						<span>Next</span>
					</Link>
				</div>
			</footer>
		</div>
	)
}
