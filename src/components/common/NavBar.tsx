'use client';

import Link from 'next/link';
import { SiSpacex } from 'react-icons/si';
import { FiArrowRight } from 'react-icons/fi';

export default function NavBar() {
  return (
    <nav className='fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white bg-black'>
      <Link href='/' className='flex flex-row items-center'>
        <SiSpacex className='text-3xl mix-blend-difference' />
        <span>SunnyQ</span>
      </Link>
      <Link
        href='/host'
        className='flex items-center gap-1 text-xs text-zinc-400'
      >
        HOST
      </Link>
      <Link
        href='/client'
        className='flex items-center gap-1 text-xs text-zinc-400'
      >
        CLIENT
      </Link>
      <Link
        href='/test'
        className='flex items-center gap-1 text-xs text-zinc-400'
        target='_blank'
      >
        TEST
      </Link>
      <button
        onClick={() => {
          document.getElementById('launch-schedule')?.scrollIntoView({
            behavior: 'smooth',
          });
        }}
        className='flex items-center gap-1 text-xs text-zinc-400'
      >
        CREDIT <FiArrowRight />
      </button>
    </nav>
  );
}
