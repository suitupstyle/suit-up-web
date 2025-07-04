import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface BackButtonProps {
	href?: string
	className?: string
}

export default function BackButton({
	href = '/',
	className = '',
}: BackButtonProps) {
	return (
		<Link
			href={href}
			className={`absolute top-0 -left-8 bg-white transition-colors ease-in-out hover:bg-gray-100 hover:shadow-gray-300 hover:shadow-md rounded-full -pl-1 pr-1 z-10 ${className}`}>
			<ChevronLeftIcon className="w-8 md:w-10 h-8 md:h-10 text-gray-900" />
		</Link>
	)
}
