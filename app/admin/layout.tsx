'use client'

import { useUIStore } from '@/stores/uiStore'
import Sidebar from '@/ui/sidebar'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/stores/userStore'
import { useEffect } from 'react'

export default function AdminLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { mobileSidebarOpen, closeMobileSidebar } = useUIStore()
	const router = useRouter()
	const { user } = useUserStore()

	useEffect(() => {
		if (!user) {
			router.push('/auth')
			return
		}

		const isAdmin = user.user_metadata?.is_admin === true
		if (!isAdmin) {
			router.push('/')
		}
	}, [user, router])

	return (
		<div className="flex h-screen">
			<div className="hidden lg:flex">
				<Sidebar />
			</div>

			{mobileSidebarOpen && (
				<div
					className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden backdrop-blur-[2px] backdrop-saturate-50"
					onClick={closeMobileSidebar}
				/>
			)}

			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 transform ${
					mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} transition-transform duration-300 ease-in-out lg:hidden`}>
				<Sidebar />
			</div>

			<div className="flex-1 flex flex-col overflow-hidden">
				<header className="lg:hidden p-4 border-b border-gray-200">
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
