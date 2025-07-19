import { createCustomToken } from "./admin-create";

export async function createSignInToken({ uid }: { uid: string }) {
    try {
        const { token: firebaseToken, error } = await createCustomToken({ uid });
        if (error) throw error;

        sessionStorage.setItem("signInToken", firebaseToken as string);
    } catch (error) {
        console.error('Error creating custom token (jwt):', error);
    }
}