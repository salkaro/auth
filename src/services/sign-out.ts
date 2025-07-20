"use client"

// External Imports
import { signOut as nextSignOut } from "next-auth/react";
import { signOut as firebaseSignout } from "firebase/auth";

// Local Imports
import { removeAllCookies } from "@/utils/cookie-handlers";
import { auth } from "@/lib/firebase/config";

export async function signOut({ redirectToSignOut }: { redirectToSignOut: boolean }) {
    await firebaseSignout(auth);
    await nextSignOut({ redirect: false });
    removeAllCookies();

    if (redirectToSignOut) {
        window.location.href = `${process.env.NEXT_PUBLIC_DASH_ROOT}/api/auth/signout?callbackUrl=${process.env.NEXT_PUBLIC_DASH_ROOT}/`
    }
}