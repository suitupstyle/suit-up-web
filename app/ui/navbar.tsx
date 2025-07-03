import Link from 'next/link'

export default function Navbar() {
	return (
		<nav className="w-full h-20 bg-black text-white shadow-gray-500 shadow-lg flex items-center px-5 relative z-10">
			<ul>
				<li>
					<Link href={'/'}>Home</Link>
				</li>
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
