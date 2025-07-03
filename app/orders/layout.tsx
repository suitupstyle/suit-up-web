import Navbar from '../ui/navbar'

export default function OrdersLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<Navbar />
			{/* min height is taking navbar height into account */}
			<main className="w-full h-full bg-white text-black py-10">
				{children}
			</main>
		</>
	)
}
