'use client';
import Link from 'next/link';
import { ReactLenis } from 'lenis/dist/lenis-react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { SiSpacex } from 'react-icons/si';
import { FiArrowRight, FiMapPin } from 'react-icons/fi';
import { useRef } from 'react';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <div className='bg-zinc-950'>
        <ReactLenis
          root
          options={{
            // Learn more -> https://github.com/darkroomengineering/lenis?tab=readme-ov-file#instance-settings
            lerp: 0.05,
            //   infinite: true,
            //   syncTouch: true,
          }}
        >
          <Nav />
          <Hero />
          <Schedule />
        </ReactLenis>
      </div>

      <div className='mb-32 grid text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-left'>
        <Link
          href='/host'
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className='mb-3 text-2xl font-semibold'>
            Host{' '}
            <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
              -&gt;
            </span>
          </h2>
          <p className='m-0 max-w-[30ch] text-sm opacity-50'>For teacher</p>
        </Link>
        <Link
          href='/client'
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className='mb-3 text-2xl font-semibold'>
            Client{' '}
            <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
              -&gt;
            </span>
          </h2>
          <p className='m-0 max-w-[30ch] text-sm opacity-50'>For student</p>
        </Link>
        <Link
          href='/test'
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className='mb-3 text-2xl font-semibold'>
            Test{' '}
            <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
              -&gt;
            </span>
          </h2>
          <p className='m-0 max-w-[30ch] text-sm opacity-50'>Testing</p>
        </Link>
        <Link
          href='/socketio-test'
          className='group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30'
          target='_blank'
          rel='noopener noreferrer'
        >
          <h2 className='mb-3 text-2xl font-semibold'>
            socket.io Test{' '}
            <span className='inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none'>
              -&gt;
            </span>
          </h2>
          <p className='m-0 max-w-[30ch] text-sm opacity-50'>socket.io Test</p>
        </Link>
      </div>
    </main>
  );
}

const Nav = () => {
  return (
    <nav className='fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-3 text-white'>
      <div className='flex flex-row items-center'>
        <SiSpacex className='text-3xl mix-blend-difference' />
        <span>SunnyQ</span>
      </div>
      <Link
        href='/host'
        className='flex items-center gap-1 text-xs text-zinc-400'
        target='_blank'
      >
        HOST
      </Link>
      <Link
        href='/client'
        className='flex items-center gap-1 text-xs text-zinc-400'
        target='_blank'
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
};

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className='relative w-full'
    >
      <CenterImage />

      <ParallaxImages />

      <div className='absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950' />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ['170%', '100%']
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className='sticky top-0 h-screen w-full'
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          'url(https://images.unsplash.com/photo-1460186136353-977e9d6085a1?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    />
  );
};

const ParallaxImages = () => {
  return (
    <div className='mx-auto max-w-5xl px-4 pt-[200px]'>
      <ParallaxImg
        src='https://images.unsplash.com/photo-1484600899469-230e8d1d59c0?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='And example of a space launch'
        start={-200}
        end={200}
        className='w-1/3'
      />
      <ParallaxImg
        src='https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='An example of a space launch'
        start={200}
        end={-250}
        className='mx-auto w-2/3'
      />
      <ParallaxImg
        src='https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='Orbiting satellite'
        start={-200}
        end={200}
        className='ml-auto w-1/3'
      />
      <ParallaxImg
        src='https://images.unsplash.com/photo-1494022299300-899b96e49893?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        alt='Orbiting satellite'
        start={0}
        end={-500}
        className='ml-24 w-5/12'
      />
    </div>
  );
};

const ParallaxImg = ({
  className,
  alt,
  src,
  start,
  end,
}: {
  className: string;
  alt: string;
  src: string;
  start: number;
  end: number;
}) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const Schedule = () => {
  return (
    <section
      id='launch-schedule'
      className='mx-auto max-w-5xl px-4 py-48 text-white'
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.75 }}
        className='mb-20 text-4xl font-black uppercase text-zinc-50'
      >
        Credit
      </motion.h1>
      <ScheduleItem
        developerName='Alex Lam'
        date='Dec 9th'
        location='Hong Kong'
      />
      <ScheduleItem
        developerName='Winter Lau'
        date='Dec 20th'
        location='Hong Kong'
      />
    </section>
  );
};

const ScheduleItem = ({
  developerName,
  date,
  location,
}: {
  developerName: string;
  date: string;
  location: string;
}) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: 'easeInOut', duration: 0.75 }}
      className='mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9'
    >
      <div>
        <p className='mb-1.5 text-xl text-zinc-50'>{developerName}</p>
        <p className='text-sm uppercase text-zinc-500'>{date}</p>
      </div>
      <div className='flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500'>
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};
