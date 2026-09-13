import { XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

type StepAlertProps = {
	children: React.ReactNode
	tone?: 'light' | 'dark'
	className?: string
}

export default function StepAlert({
	children,
	tone = 'light',
	className = '',
}: StepAlertProps) {
	return (
		<div
			role="alert"
			className={clsx(
				'w-full p-3 rounded-lg text-sm flex items-start gap-2 text-left',
				tone === 'dark'
					? 'bg-red-950/80 text-red-200 border border-red-700'
					: 'bg-red-50 text-red-700',
				className
			)}>
			<XCircleIcon className="w-5 h-5 shrink-0 mt-0.5" />
			<div className="whitespace-pre-line">{children}</div>
		</div>
	)
}
