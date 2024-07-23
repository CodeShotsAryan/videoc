// SignInPage.tsx
"use client";
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SignInPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/dashboard');
    }
  }, [status, router]);

  const handleSignIn = async () => {
    await signIn('google');
  };

  return (
    <div>
      <h1>Sign In</h1>
      <button onClick={handleSignIn}>Sign In with Google</button>
      {status === 'loading' && <p>Loading...</p>}
      {status === 'authenticated' && <p>Redirecting...</p>}
    </div>
  );
};

export default SignInPage;
