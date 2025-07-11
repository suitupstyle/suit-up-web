// app/admin/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useUIStore } from '../../stores/uiStore'
import { useRouter } from 'next/navigation'

// Interfaz para las órdenes
interface Order {
	id: string
	customer: string
	product: string
	amount: number
	status: 'pending' | 'processing' | 'shipped' | 'delivered'
	date: string
}

export default function DashboardPage() {
	const router = useRouter()
	const [orders, setOrders] = useState<Order[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	// Datos de ejemplo (en producción vendrían de una API)
	const mockOrders: Order[] = [
		{
			id: 'ORD-001',
			customer: 'John Smith',
			product: 'Custom Business Suit',
			amount: 165,
			status: 'processing',
			date: '2023-06-15',
		},
		{
			id: 'ORD-002',
			customer: 'Emma Johnson',
			product: 'Premium Tuxedo',
			amount: 220,
			status: 'shipped',
			date: '2023-06-18',
		},
		{
			id: 'ORD-003',
			customer: 'Michael Brown',
			product: 'Casual Blazer',
			amount: 135,
			status: 'delivered',
			date: '2023-06-10',
		},
		{
			id: 'ORD-004',
			customer: 'Sarah Davis',
			product: 'Executive Suit',
			amount: 195,
			status: 'pending',
			date: '2023-06-20',
		},
		{
			id: 'ORD-005',
			customer: 'Robert Wilson',
			product: 'Wedding Suit',
			amount: 250,
			status: 'processing',
			date: '2023-06-22',
		},
	]

	// Simular carga de datos
	useEffect(() => {
		const fetchOrders = async () => {
			try {
				setLoading(true)
				// Aquí iría la llamada real a la API
				// const response = await fetch('/api/orders');
				// const data = await response.json();
				// setOrders(data);

				// Usamos datos mock por ahora
				await new Promise((resolve) => setTimeout(resolve, 1000))
				setOrders(mockOrders)
				setError(null)
			} catch (err) {
				setError('Failed to load orders. Please try again later.')
			} finally {
				setLoading(false)
			}
		}

		fetchOrders()
	}, [])

	// Función para exportar a CSV
	const exportToCSV = () => {
		const csvContent =
			'ID,Customer,Product,Amount,Status,Date\n' +
			orders
				.map(
					(order) =>
						`"${order.id}","${order.customer}","${order.product}",${order.amount},"${order.status}","${order.date}"`
				)
				.join('\n')

		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.setAttribute('href', url)
		link.setAttribute('download', 'orders_export.csv')
		link.style.visibility = 'hidden'
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	// Función para formatear el estado
	const getStatusBadge = (status: string) => {
		const statusClasses = {
			pending: 'bg-yellow-100 text-yellow-800',
			processing: 'bg-blue-100 text-blue-800',
			shipped: 'bg-indigo-100 text-indigo-800',
			delivered: 'bg-green-100 text-green-800',
		}

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${
					statusClasses[status as keyof typeof statusClasses] ||
					'bg-gray-100 text-gray-800'
				}`}>
				{status.charAt(0).toUpperCase() + status.slice(1)}
			</span>
		)
	}

	return (
		<div className="flex-1 flex flex-col">
			<header className="py-6">
				<h1 className="font-bold text-2xl mb-2">Order Dashboard</h1>
				<p className="font-normal text-sm text-gray-600">
					Manage and track all your orders in one place
				</p>
			</header>

			<div className="flex-1 flex flex-col">
				{/* Controles */}
				<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
					<div className="text-sm text-gray-600">
						Showing {orders.length} orders
					</div>

					<div className="flex flex-wrap gap-3">
						<button
							onClick={() => router.refresh()}
							disabled={loading}
							className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-sm ${
								loading
									? 'opacity-50 cursor-not-allowed'
									: 'hover:bg-gray-50'
							}`}>
							<ArrowPathIcon
								className={`w-4 h-4 ${
									loading ? 'animate-spin' : ''
								}`}
							/>
							Refresh
						</button>

						<button
							onClick={exportToCSV}
							disabled={orders.length === 0}
							className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed">
							<ArrowDownTrayIcon className="w-4 h-4" />
							Export CSV
						</button>
					</div>
				</div>

				{/* Contenido: Tabla (desktop/tablet) o Cards (mobile) */}
				{loading ? (
					<div className="flex items-center justify-center h-full p-8">
						<div className="text-center">
							<ArrowPathIcon className="w-10 h-10 mx-auto text-gray-400 animate-spin" />
							<p className="mt-4 text-gray-600">
								Loading orders...
							</p>
						</div>
					</div>
				) : error ? (
					<div className="flex items-center justify-center h-full p-8">
						<div className="text-center">
							<div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-md">
								<p>{error}</p>
								<button
									onClick={() => router.refresh()}
									className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200">
									Try Again
								</button>
							</div>
						</div>
					</div>
				) : (
					<>
						{/* Vista de escritorio/tablet (tabla) */}
						<div className="hidden md:block bg-white rounded-lg shadow overflow-hidden border border-gray-200 flex-1">
							<div className="overflow-x-auto">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												ID
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Customer
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Product
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Amount
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Status
											</th>
											<th
												scope="col"
												className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Date
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200">
										{orders.map((order) => (
											<tr
												key={order.id}
												className="hover:bg-gray-50 cursor-pointer"
												onClick={() =>
													router.push(
														`/admin/orders/${order.id}`
													)
												}>
												<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
													{order.id}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{order.customer}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{order.product}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													${order.amount.toFixed(2)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm">
													{getStatusBadge(
														order.status
													)}
												</td>
												<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
													{order.date}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>

						{/* Vista móvil (cards) */}
						<div className="md:hidden space-y-4">
							{orders.map((order) => (
								<div
									key={order.id}
									className="bg-white rounded-lg shadow border border-gray-200 p-4"
									onClick={() =>
										router.push(`/admin/orders/${order.id}`)
									}>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="font-medium text-gray-900">
												{order.id}
											</h3>
											<p className="text-gray-500">
												{order.customer}
											</p>
										</div>
										<div>
											{getStatusBadge(order.status)}
										</div>
									</div>

									<div className="mt-3">
										<p className="text-sm font-medium">
											{order.product}
										</p>
										<p className="text-sm text-gray-500">
											${order.amount.toFixed(2)}
										</p>
									</div>

									<div className="mt-2 text-sm text-gray-500">
										{order.date}
									</div>
								</div>
							))}
						</div>
					</>
				)}

				{!loading && orders.length === 0 && (
					<div className="text-center py-12">
						<p className="text-gray-500">No orders found</p>
					</div>
				)}
			</div>

			<footer className="py-6">
				<div className="text-sm text-gray-600">
					Last updated: {new Date().toLocaleDateString()} at{' '}
					{new Date().toLocaleTimeString([], {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</div>
			</footer>
		</div>
	)
}
