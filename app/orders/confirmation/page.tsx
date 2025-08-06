'use client'

import { useState } from 'react'
import { PhotoIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePreOrderStore } from '@/stores/preOrderStore'
import BackButton from '@/ui/back-button'
import {
	type MeasurementsTags,
	type MeasurementData,
} from '@/lib/definitions'
import { PreOrdersService } from '@/services/preOrders.service'
import { useMutation } from '@tanstack/react-query'
import _ from 'lodash'
import { measurementsTagMap } from '@/lib/utils'
import { logger } from '@/lib/logger'

const measurementsForm: Array<MeasurementsTags> = Object.keys(
	measurementsTagMap
) as Array<MeasurementsTags>

export default function Confirmation() {
	const {
		id,
		gender,
		height,
		weight,
		frontImage,
		sideImage,
		measurementData,
		setMeasurements,
	} = usePreOrderStore()

	const {
		mutate: mutateMeasurements,
		isError,
		isPending,
		isSuccess,
	} = useMutation({
		mutationFn: PreOrdersService.updateMeasurements,
		onSuccess: () => {},
		onError: () => {},
	})

	const [isEditing, setIsEditing] = useState(false)
	const [tempMeasurements, setTempMeasurements] = useState<MeasurementData>(
		measurementData as MeasurementData
	)

	const handleMeasurementChange = (path: string, value: string) => {
		logger.log('change data', { path, value })
		setTempMeasurements((prev) => {
			const cloned = _.cloneDeep(prev)
			const parsedValue = parseFloat(value) || 0
			return _.set(cloned, path, parsedValue)
		})
		logger.log('change result', tempMeasurements)
	}

	const saveMeasurements = () => {
		setMeasurements(tempMeasurements)
		mutateMeasurements({
			id,
			gender,
			height,
			weight,
			frontImage,
			sideImage,
			createdAt: null,
			measurementData: tempMeasurements,
		})
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

			<section className="w-full text-start text-sm lg:text-base">
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

				<div className="bg-white rounded-lg shadow-md p-4 m-6">
					<h2 className="md:text-lg font-semibold">Your Details</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
						<div>
							<span className="font-medium">Gender:</span>{' '}
							{gender ?? '-'}
						</div>
						<div>
							<span className="font-medium">Height:</span>{' '}
							{height != null ? `${height} cm` : '-'}
						</div>
						<div>
							<span className="font-medium">Weight:</span>{' '}
							{weight != null ? `${weight.toFixed(1)} kg` : '-'}
						</div>
					</div>
				</div>

				{/* Measurements */}
				<div className="bg-white rounded-lg shadow-md p-6">
					<div className="flex justify-between items-center mb-4">
						<h2 className="md:text-lg font-semibold">
							Body Measurements (cm)
						</h2>
						{!isEditing ? (
							<button
								onClick={() => {
									setTempMeasurements(
										measurementData as MeasurementData
									)
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
							{measurementsForm
								.slice(
									0,
									Math.floor(measurementsForm.length / 2) + 1
								)
								.map((m, i) => (
									<MeasurementField
										key={i}
										label={m}
										editing={isEditing}
										value={
											isEditing
												? _.get(
														tempMeasurements,
														measurementsTagMap[m],
														0
												  )
												: _.get(
														measurementData,
														measurementsTagMap[m],
														0
												  )
										}
										onChange={(v) =>
											handleMeasurementChange(
												measurementsTagMap[m],
												v
											)
										}
									/>
								))}
						</div>
						{/* Group 2 */}
						<div className="space-y-3">
							{measurementsForm
								.slice(
									Math.floor(measurementsForm.length / 2) + 1
								)
								.map((m, i) => (
									<MeasurementField
										key={i}
										label={m}
										editing={isEditing}
										value={
											isEditing
												? _.get(
														tempMeasurements,
														measurementsTagMap[m],
														0
												  )
												: _.get(
														measurementData,
														measurementsTagMap[m],
														0
												  )
										}
										onChange={(v) =>
											handleMeasurementChange(
												measurementsTagMap[m],
												v
											)
										}
									/>
								))}
						</div>
					</div>
				</div>
			</section>

			<footer className="w-full mt-8">
				<div className="w-full flex justify-end">
					<Link
						href="/orders/details"
						className="w-full h-14 rounded-lg border-2 flex justify-center items-center transition-all ease-in-out bg-black text-white border-black hover:bg-radial-circle hover:from-gray-700 hover:to-gray-900 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg"
						aria-disabled={
							isEditing || isPending || (!isPending && !isSuccess)
						}>
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
			<span className="text-gray-700 capitalize">{label}</span>
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
