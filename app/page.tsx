import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-black text-white flex flex-col p-6">
      <article className='w-856 mx-auto flex flex-col gap-4 text-center'>
        <header>
          <h1 className='font-bold text-2xl'>SuitUp - Dress for <br /> Success</h1>

        </header>
        <section className='flex flex-col items-center gap-2 relative'>
          <Image src="/home-suit.webp"
            alt="Default black suit."
            className="w-full h-auto"
            width={836}
            height={532}
            priority
          />
          <button className='w-full h-14 bg-white text-black rounded-lg transition-all ease-in-out hover:bg-gray-400 hover:tracking-wide'>Pre-Order Now</button>
          <button className='absolute bottom-20 right-0 w-64 h-14 border border-white rounded-lg transition-colors ease-linear hover:bg-white hover:text-black'>Save My Style</button>
        </section>
        <footer>
          <div className='w-64 mx-auto text-sm text-gray-400 font-normal'>
            <p>
              Revolutionizing the fashion experience through innovation.
            </p>
            <p>
              The idea of SuitUp came as to solve to problem as to why a Tailored Suit cannot be bought from the comfort of your device, almost anywhere.
            </p>
          </div>
        </footer>
      </article>
    </main>
  );
}
