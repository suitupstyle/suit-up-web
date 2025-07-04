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
			className={`absolute top-0 left-0 bg-white border border-gray-900 rounded-md pr-1 z-10 ${className}`}>
			<ChevronLeftIcon className="w-8 md:w-10 h-8 md:h-10 text-gray-900" />
		</Link>
	)
}
