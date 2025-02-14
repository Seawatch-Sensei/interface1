import { signOut } from 'next-auth/react';
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa';

function SignOut() {
return (
    <div className="mt-4">
        <button
            onClick={() => signOut()}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-full shadow-lg transition duration-300 ease-in-out flex items-center space-x-2"
        >
            <FaSignOutAlt size={20} />
            <span>Sign out</span>
        </button>
    </div>
)
}

export default SignOut