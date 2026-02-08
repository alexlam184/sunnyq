'use client';
import Link from 'next/link';
// @ts-expect-error
import { ReactLenis } from 'lenis/dist/lenis-react';
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from 'framer-motion';
import { FiMapPin } from 'react-icons/fi';
import { useRef } from 'react';

const googleOauthUrl =
  process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL ?? '/api/auth/google';

const handleGoogleLogin = () => {
  const redirectUrl = '/host?pagestate=createRoom';
  try {
    const url = new URL(googleOauthUrl, window.location.origin);
    url.searchParams.set('callbackUrl', redirectUrl);
    window.location.href = url.toString();
  } catch (error) {
    const separator = googleOauthUrl.includes('?') ? '&' : '?';
    window.location.href = `${googleOauthUrl}${separator}callbackUrl=${encodeURIComponent(
      redirectUrl
    )}`;
  }
};

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

const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className='relative w-full'
    >
      <CenterImage />
      <Orientation />
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

const Intro = () => {
  return (
    <section className='mx-auto max-w-5xl px-4 py-24 text-white'>
      <div className='rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur'>
        <h2 className='text-3xl font-black uppercase text-zinc-50'>
          What Is SunnyQ
        </h2>
        <p className='mt-4 text-lg text-zinc-200'>
          SunnyQ is a multiplayer online quiz application that helps teachers
          and students interact in real time. Run live quizzes, see responses
          instantly, and turn class time into a shared, engaging experience.
        </p>
      </div>
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

const Orientation = () => {
  return (
    <div className='absolute inset-0 z-40'>
      <Intro />
      <section className='min-h-screen'>
        <div className='mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 py-20 text-center'>
          <div className='mt-8 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-semibold text-black'>
              If you want to host classroom and you have an question bank in
              Google Drive.
            </h2>
            <div className='mt-4'>
              <div className='mx-auto max-w-md text-center space-y-4'>
                <title>Login</title>

                <p className='mt-2 sm:text-lg/relaxed text-black'>
                  Sign in with Google to continue.
                </p>
                <div className='mt-8 flex flex-wrap justify-center gap-4'>
                  <button
                    type='button'
                    onClick={handleGoogleLogin}
                    className='group relative inline-flex items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-800 shadow-sm transition-transform hover:-translate-y-0.5 hover:shadow-md'
                  >
                    <svg
                      aria-hidden='true'
                      viewBox='0 0 24 24'
                      className='h-5 w-5'
                    >
                      <path
                        d='M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.48a5.54 5.54 0 0 1-2.4 3.63v3h3.88c2.27-2.1 3.53-5.19 3.53-8.72Z'
                        fill='#4285F4'
                      />
                      <path
                        d='M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.88-3c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.92H1.25v3.09A12 12 0 0 0 12 24Z'
                        fill='#34A853'
                      />
                      <path
                        d='M5.28 14.34a7.2 7.2 0 0 1-.37-2.34c0-.81.13-1.6.37-2.34V6.57H1.25A12 12 0 0 0 0 12c0 1.94.47 3.77 1.25 5.43l4.03-3.09Z'
                        fill='#FBBC05'
                      />
                      <path
                        d='M12 4.74c1.76 0 3.34.6 4.59 1.78l3.44-3.44C17.94 1.19 15.23 0 12 0A12 12 0 0 0 1.25 6.57l4.03 3.09C6.23 6.84 8.88 4.74 12 4.74Z'
                        fill='#EA4335'
                      />
                    </svg>
                    Continue with Google
                  </button>
                </div>
                {!process.env.NEXT_PUBLIC_GOOGLE_OAUTH_URL ? (
                  <p className='text-xs text-gray-500'>
                    Set `NEXT_PUBLIC_GOOGLE_OAUTH_URL` to your OAuth endpoint.
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className='mt-6 w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'>
            <h2 className='text-lg font-semibold text-black'>If you are new</h2>
            <p className='mt-1 text-sm text-slate-600'>
              Start as a host or join as a client.
            </p>
            <div className='mt-4 flex flex-wrap justify-center gap-3'>
              <Link
                href='/host'
                className='inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5 hover:bg-green-500'
              >
                Host page
              </Link>
              <Link
                href='/client'
                className='inline-flex items-center justify-center rounded-full border border-green-600 px-6 py-3 text-sm font-semibold text-green-700 shadow-sm transition-transform hover:-translate-y-0.5'
              >
                Client page
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
