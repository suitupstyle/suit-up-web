// app/admin/layout.tsx
'use client'

import { useUIStore } from '../stores/uiStore'
import Sidebar from '../ui/sidebar'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { mobileSidebarOpen, closeMobileSidebar } = useUIStore()

	return (
		<div className="flex h-screen">
			{/* Sidebar para desktop y tablet (siempre visible) */}
			<div className="hidden md:flex">
				<Sidebar />
			</div>

			{/* Overlay para móvil cuando el sidebar está abierto */}
			{mobileSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
					onClick={closeMobileSidebar}
				/>
			)}

			{/* Sidebar móvil (se desliza) */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
					mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out md:hidden`}>
				<Sidebar />
			</div>

			{/* Contenido principal */}
			<div className="flex-1 flex flex-col overflow-hidden">
				{/* Navbar superior para móviles (con botón de hamburguesa) */}
				<header className="md:hidden p-4 border-b border-gray-200">
					<button
						onClick={() =>
							useUIStore.getState().toggleMobileSidebar()
						}
						className="p-2 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none">
						<svg
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M4 6h16M4 12h16M4 18h16"
							/>
						</svg>
					</button>
				</header>

				<main className="flex-1 overflow-y-auto p-4 md:p-6">
					{children}
				</main>
			</div>
		</div>
	)
}
