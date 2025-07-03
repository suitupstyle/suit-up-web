'use client'

import { useState } from 'react'
import { PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useImageStore } from '@/app/stores/imageStore'
import BackButton from '@/app/ui/back-button'

type Measurements = {
	chest: number
	stomach: number
	seat: number
	sleeveLengthL: number
	sleeveLengthR: number
	backLength: number
	shoulder: number
	pantsWaist: number
	thigh: number
	uCrotch: number
	pantsLengthL: number
	pantsLengthR: number
	calfBottom: number
	waistcoatBackLength: number
}

export default function Confirmation() {
	const { frontImage, sideImage } = useImageStore()

	const [measurements, setMeasurements] = useState<Measurements>({
		chest: 102.92,
		stomach: 86.78,
		seat: 102.19,
		sleeveLengthL: 69.86,
		sleeveLengthR: 69.86,
		backLength: 51.39,
		shoulder: 46.01,
		pantsWaist: 79.64,
		thigh: 62.43,
		uCrotch: 35.11,
		pantsLengthL: 130.96,
		pantsLengthR: 130.96,
		calfBottom: 40.2,
		waistcoatBackLength: 51.39,
	})

	const [isEditing, setIsEditing] = useState(false)
	const [tempMeasurements, setTempMeasurements] =
		useState<Measurements>(measurements)

	const handleMeasurementChange = (
		field: keyof Measurements,
		value: string
	) => {
		setTempMeasurements({
			...tempMeasurements,
			[field]: parseFloat(value) || 0,
		})
	}

	const saveMeasurements = () => {
		setMeasurements(tempMeasurements)
		setIsEditing(false)
	}

	return (
		<div className="w-64 md:w-458 lg:w-856 mx-auto min-h-[calc(100lvh-160px)] flex flex-col justify-between items-center gap-2 text-center relative">
			<BackButton href="/orders/instructions" />
			<header className="w-full relative">
				<h1 className="font-bold text-2xl mb-5">
					Preview Your Measurements
				</h1>
			</header>

			<section className="w-full">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					<div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
						{frontImage ? (
							<img
								src={frontImage}
								alt="Front view"
								className="w-full h-full object-contain"
							/>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
								<span className="text-gray-500">
									Front view
								</span>
							</div>
						)}
					</div>

					<div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-300">
						{sideImage ? (
							<img
								src={sideImage}
								alt="Side view"
								className="w-full h-full object-contain"
							/>
						) : (
							<div className="absolute inset-0 flex flex-col items-center justify-center">
								<PhotoIcon className="w-12 h-12 text-gray-400 mb-2" />
								<span className="text-gray-500">Side view</span>
							</div>
						)}
					</div>
				</div>

				{/* Measurements */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="text-lg font-semibold">
							Body Measurements (cm)
						</h2>
						{!isEditing ? (
							<button
								onClick={() => {
									setTempMeasurements(measurements)
									setIsEditing(true)
								}}
								className="text-blue-600 hover:text-blue-800">
								Edit
							</button>
						) : (
							<button
								onClick={saveMeasurements}
								className="text-green-600 hover:text-green-800 flex items-center">
								<CheckCircleIcon className="w-5 h-5 mr-1" />
								Save
							</button>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						{/* Group 1 */}
						<div className="space-y-3">
							<MeasurementField
								label="Chest"
								value={
									isEditing
										? tempMeasurements.chest
										: measurements.chest
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('chest', v)
								}
							/>
							<MeasurementField
								label="Stomach"
								value={
									isEditing
										? tempMeasurements.stomach
										: measurements.stomach
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('stomach', v)
								}
							/>
							<MeasurementField
								label="Seat (Hips)"
								value={
									isEditing
										? tempMeasurements.seat
										: measurements.seat
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('seat', v)
								}
							/>
							<MeasurementField
								label="Shoulder"
								value={
									isEditing
										? tempMeasurements.shoulder
										: measurements.shoulder
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('shoulder', v)
								}
							/>
							<MeasurementField
								label="Back Length"
								value={
									isEditing
										? tempMeasurements.backLength
										: measurements.backLength
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('backLength', v)
								}
							/>
						</div>

						<div className="space-y-3">
							<MeasurementField
								label="Sleeve Length (L)"
								value={
									isEditing
										? tempMeasurements.sleeveLengthL
										: measurements.sleeveLengthL
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('sleeveLengthL', v)
								}
							/>
							<MeasurementField
								label="Sleeve Length (R)"
								value={
									isEditing
										? tempMeasurements.sleeveLengthR
										: measurements.sleeveLengthR
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('sleeveLengthR', v)
								}
							/>
							<MeasurementField
								label="Pants Waist"
								value={
									isEditing
										? tempMeasurements.pantsWaist
										: measurements.pantsWaist
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('pantsWaist', v)
								}
							/>
							<MeasurementField
								label="Thigh"
								value={
									isEditing
										? tempMeasurements.thigh
										: measurements.thigh
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange('thigh', v)
								}
							/>
							<MeasurementField
								label="Waistcoat Back Length"
								value={
									isEditing
										? tempMeasurements.waistcoatBackLength
										: measurements.waistcoatBackLength
								}
								editing={isEditing}
								onChange={(v) =>
									handleMeasurementChange(
										'waistcoatBackLength',
										v
									)
								}
							/>
						</div>
					</div>
				</div>
			</section>

			<footer className="w-full mt-8">
				<div className="w-full flex justify-end">
					<Link
						href="/next-step"
						className="w-full h-14 rounded-lg border-2 flex justify-center items-center transition-all ease-in-out bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg">
						Confirm and Continue
					</Link>
				</div>
			</footer>
		</div>
	)
}

function MeasurementField({
	label,
	value,
	editing,
	onChange,
}: {
	label: string
	value: number
	editing: boolean
	onChange: (value: string) => void
}) {
	return (
		<div className="flex justify-between items-center">
			<span className="text-gray-700">{label}</span>
			{editing ? (
				<input
					type="number"
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="w-20 px-2 py-1 border rounded text-right"
					step="0.1"
				/>
			) : (
				<span className="font-medium">{value.toFixed(1)} cm</span>
			)}
		</div>
	)
}
