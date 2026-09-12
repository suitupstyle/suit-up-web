'use client'

import { useMutation } from '@tanstack/react-query'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useItems } from '@/app/hooks/useItems'
import { API_UNREACHABLE_MESSAGE } from '@/app/lib/api/client'
import { getErrorMessage } from '@/app/lib/api/errorHandler'
import { type Item, type PreOrderResponse } from '@/app/lib/definitions'
import { logger } from '@/app/lib/logger'
import { PreOrdersService } from '@/app/services/preOrders.service'
import { usePreOrderStore } from '@/app/stores/preOrderStore'
import StepAlert from '@/app/ui/step-alert'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

export default function Page() {
	const router = useRouter()

	const {
		items,
		isLoading: itemsLoading,
		isError: itemsError,
		error: itemsQueryError,
		refetch,
	} = useItems()

	const { setId } = usePreOrderStore()

	const {
		mutate: createPreorder,
		isPending,
		isError: preorderError,
		error: preorderQueryError,
	} = useMutation<PreOrderResponse, Error, Item[]>({
		mutationFn: (catalogItems) =>
			PreOrdersService.createPreorder({
				itemIds: catalogItems.map((item) => item.id),
			}),
		onSuccess: (response) => {
			logger.log('Create data', response)
			setId(response.data.id)
			router.push(`/orders/instructions`)
		},
		onError: (error) => {
			logger.error('Error:', error)
		},
	})

	const errorMessage = itemsError
		? getErrorMessage(itemsQueryError, API_UNREACHABLE_MESSAGE)
		: preorderError
			? getErrorMessage(
					preorderQueryError,
					'Unable to start your pre-order. Please try again.',
				)
			: null

	const isBusy = itemsLoading || isPending
	const canStart = Boolean(items?.length) && !itemsError
	const buttonDisabled = isBusy || (!errorMessage && !canStart)

	const onSubmit = () => {
		if (itemsError) {
			void refetch()
			return
		}
		if (!items?.length) return
		createPreorder(items)
	}

	return (
		<main className="w-full min-h-screen bg-black text-white">
			<div className="w-64 md:w-458 lg:w-856 min-h-screen mx-auto flex flex-col justify-around items-center text-center">
				<header>
					<h1 className="font-bold text-2xl">
						SuitUp - Dress for <br /> Success
					</h1>
				</header>
				<section className="flex w-full flex-col items-center gap-10 md:gap-2">
					<div className="relative w-full">
						<Image
							src="/home-suit.webp"
							alt="Default black suit."
							className="object-cover h-[312px] md:h-[530px] lg:h-[592px]"
							width={836}
							height={592}
							priority
						/>
						<button className="hidden lg:block absolute bottom-20 right-0 z-10 w-64 h-14 border border-white rounded-lg transition-colors ease-linear hover:bg-white hover:text-black">
							Save My Style
						</button>
					</div>
					{errorMessage && (
						<StepAlert
							tone="dark"
							className="w-full">
							{errorMessage}
						</StepAlert>
					)}
					<button
						onPointerDown={onSubmit}
						disabled={buttonDisabled}
						className="w-full h-14 flex justify-center items-center bg-white text-black rounded-lg transition-all ease-in-out hover:bg-radial-circle hover:from-gray-100 hover:to-gray-400 hover:tracking-widest hover:shadow-gray-700 hover:shadow-lg disabled:bg-gray-300 disabled:text-gray-500 disabled:hover:tracking-normal disabled:hover:shadow-none">
						{isBusy ? (
							<span className="flex items-center gap-1">
								<ArrowPathIcon className="w-5 h-5 animate-spin " />
								Loading...
							</span>
						) : errorMessage ? (
							<span>Try again</span>
						) : (
							<span>Pre-Order Now</span>
						)}
					</button>
				</section>
				<footer>
					<div className="w-64 mx-auto text-sm text-gray-400 font-normal">
						<p>
							Revolutionizing the fashion experience through
							innovation.
						</p>
						<p>
							The idea of SuitUp came as to solve to problem as to
							why a Tailored Suit cannot be bought from the
							comfort of your device, almost anywhere.
						</p>
					</div>
				</footer>
			</div>
		</main>
	)
}
