'use client';
// Root page - redirects to home
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  // Redirect to home page
  // redirect() from /next/navigation severs-side only dosn't work with static exports (output: export)
  // redirect('/home'); => craches in static builds 

  // Fix last issue
  const router = useRouter();

  useEffect(() => {
    router.replace('/home');
  }, [router]);

  return (
    <div className='flex items-center justify-center min-h-screen'>
      <p> Redirecting ...</p>
    </div>
  );
}

