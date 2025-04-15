import { signOut } from 'next-auth/react';
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa';
import { Button } from "@/components/ui/button";

function SignOut() {
return (
    <div>
        <Button
            onClick={() => signOut()} className="bg-red-500 hover:bg-red-600">
            <FaSignOutAlt size={20} />
            <span>Sign out</span>
        </Button>
    </div>
)
}

export default SignOut