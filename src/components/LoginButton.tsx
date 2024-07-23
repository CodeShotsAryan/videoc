"use client"
import React from 'react';
import { signOut, useSession  , signIn} from 'next-auth/react';

const SignInButton = () => {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        await signOut();
    };

    if (session && session.user) {
        return (
            <div className='flex gap-4 ml-auto'>
                <p className='text-sky-600'>
                    <button className='text-red-600' onClick={handleSignOut}>
                        <h1>{session.user.name}</h1>
                        Sign Out
                    </button>
                </p>
            </div>
        );
    }

    return (
        <div>
            <button onClick={() => signIn()} className='text-green-500 ml-auto'>
                Sign In with Google
            </button>
        </div>
    );
};

export default SignInButton;