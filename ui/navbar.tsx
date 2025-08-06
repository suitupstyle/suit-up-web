'use client'

import Link from 'next/link'
import { useUserStore } from '@/stores/userStore'

export default function Navbar() {
	const { user } = useUserStore()

	return (
		<nav className="w-full h-32 bg-black text-white shadow-gray-500 shadow-lg flex items-center px-5 relative z-10">
			<ul className="flex justify-start items-center gap-2">
				<li className="flex items-center font-bold w-auto h-11 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-900 active:bg-gray-700">
					<Link href={'/public'}>Home</Link>
				</li>
				{user == null && (
					<li className="flex items-center w-auto h-11 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-900 active:bg-gray-700">
						<Link href={'/auth'}>Login</Link>
					</li>
				)}
				{user?.user_metadata?.is_admin && (
					<li className="flex items-center w-auto h-11 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-900 active:bg-gray-700">
						<Link href={'/admin/dashboard'}>Dashboard</Link>
					</li>
				)}
			</ul>
			<img
				src="/SuitUp-Header-White.svg"
				alt="Brand Icon"
				width={96}
				height={96}
				className="transition-all duration-500 ease-linear hover:contrast-150 hover:cursor-crosshair absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950/80 rounded-lg"
			/>
		</nav>
	)
}
