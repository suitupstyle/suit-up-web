// components/Sidebar.tsx
'use client'

import {
	HomeIcon,
	UserIcon,
	ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '../stores/uiStore'
import { supabase } from '../lib/supabase/client'

export default function Sidebar() {
	const pathname = usePathname()
	const { closeMobileSidebar } = useUIStore()

	const handleLogout = async () => {
		await supabase.auth.signOut()
		// Redirigir a login o home, dependiendo de tu flujo
	}

	const navItems = [
		{ name: 'Dashboard', href: '/admin', icon: HomeIcon },
		// Puedes añadir más rutas aquí según necesites
	]

	return (
		<div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
			{/* Encabezado del sidebar */}
			<div className="p-4 border-b border-gray-200">
				<h1 className="text-xl font-bold">Admin Panel</h1>
			</div>

			{/* Navegación */}
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

			{/* Pie de sidebar - Información de usuario y logout */}
			<div className="p-4 border-t border-gray-200">
				<div className="flex items-center mb-4">
					<div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12" />
					<div className="ml-3">
						<p className="font-medium">Admin User</p>
						<p className="text-sm text-gray-500">
							admin@example.com
						</p>
					</div>
				</div>
				<button
					onClick={handleLogout}
					className="flex items-center w-full px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
					<ArrowLeftOnRectangleIcon className="w-5 h-5 mr-3" />
					<span>Logout</span>
				</button>
			</div>
		</div>
	)
}
