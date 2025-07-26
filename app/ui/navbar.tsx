'use client'

import Link from 'next/link'
import { useUserStore } from '@/app/stores/userStore'

export default function Navbar() {
	const { user } = useUserStore()

	return (
		<nav className="w-full h-20 bg-black text-white shadow-gray-500 shadow-lg flex items-center px-5 relative z-10">
			<ul className="flex justify-start items-center gap-2">
				<li className="flex items-center font-bold w-auto h-11 px-4 rounded-md transition-colors duration-300 ease-in-out hover:bg-gray-900 active:bg-gray-700">
					<Link href={'/'}>Home</Link>
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
				src="/navbar-icon.webp"
				alt="Brand Icon"
				width={46}
				height={57}
				className="mx-auto transition-all hover:contrast-150 hover:cursor-crosshair"
			/>
		</nav>
	)
}
