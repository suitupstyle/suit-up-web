import Link from 'next/link'
import Image from 'next/image'

export default function Page() {
	return (
		<main className="w-full min-h-screen bg-black text-white">
			<article className="w-64 md:w-458 lg:w-856 min-h-screen mx-auto flex flex-col justify-around items-center text-center">
				<header className="">
					<h1 className="font-bold text-2xl">
						SuitUp - Dress for <br /> Success
					</h1>
				</header>
				<section className="flex flex-col items-center gap-10 md:gap-2 relative">
					<Image
						src="/home-suit.webp"
						alt="Default black suit."
						className="object-cover h-[312px] md:h-[530px] lg:h-[592px]"
						width={836}
						height={592}
						priority
					/>
					<button className="w-full h-14 bg-white text-black rounded-lg transition-all ease-in-out hover:bg-gray-400 hover:tracking-wide">
						Pre-Order Now
					</button>
					<button className="hidden lg:block absolute bottom-20 right-0 w-64 h-14 border border-white rounded-lg transition-colors ease-linear hover:bg-white hover:text-black">
						Save My Style
					</button>
				</section>
				<footer>
					<div className="w-64 mx-auto text-sm text-gray-400 font-normal">
						<p>
							Revolutionizing the fashion experience through
							innovation.
						</p>
						<p>
							The idea of SuitUp came as to solve to problem as to
							why a Tailored Suit cannot be bought from the
							comfort of your device, almost anywhere.
						</p>
					</div>
				</footer>
			</article>
		</main>
	)
}
