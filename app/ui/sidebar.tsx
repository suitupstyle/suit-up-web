// components/Sidebar.tsx
'use client'

import {
	HomeIcon,
	UserIcon,
	ArrowRightStartOnRectangleIcon,
	PresentationChartBarIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/app/stores/uiStore'
import { useUserStore } from '@/app/stores/userStore'
import { UserService } from '@/app/services/user.service'
import { logger } from '@/app/lib/logger'

export default function Sidebar() {
	const pathname = usePathname()
	const { closeMobileSidebar } = useUIStore()
	const { user, setUser } = useUserStore()
	const router = useRouter()

	const handleLogout = async () => {
		try {
			await UserService.logout()
			setUser(null)
			router.push('/')
		} catch (error) {
			logger.error('User logout error:', error as Error)
		}
	}

	const navItems = [
		{ name: 'Home', href: '/', icon: HomeIcon },
		{
			name: 'Dashboard',
			href: '/admin/dashboard',
			icon: PresentationChartBarIcon,
		},
	]

	return (
		<div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
			<div className="p-4 border-b border-gray-200">
				<h1 className="text-xl font-bold">Admin Panel</h1>
			</div>

			<nav className="flex-1 py-4">
				{navItems.map((item) => (
					<Link
						key={item.name}
						href={item.href}
						onClick={closeMobileSidebar}
						className={`flex items-center px-4 py-2 mx-2 rounded-lg ${
							pathname === item.href
								? 'bg-gray-100 text-black'
								: 'text-gray-600 hover:bg-gray-50'
						}`}>
						<item.icon className="w-5 h-5 mr-3" />
						<span>{item.name}</span>
					</Link>
				))}
			</nav>

			<div className="p-4 border-t border-gray-200">
				<div className="flex items-center mb-4">
					<div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 flex justify-center items-center">
						<UserIcon className="w-5 h-5" />
					</div>
					<div className="ml-3">
						<p className="font-medium">
							{user?.user_metadata?.full_name ?? 'User Name'}
						</p>
						<p className="text-sm text-gray-500">
							{user?.email ?? 'user@example.com'}
						</p>
					</div>
				</div>
				<button
					onClick={handleLogout}
					className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
					<ArrowRightStartOnRectangleIcon className="w-5 h-5 mr-3" />
					<span>Logout</span>
				</button>
			</div>
		</div>
	)
}
