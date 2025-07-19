import { createCustomToken } from "./admin-create";

export async function createSignInToken({ uid }: { uid: string }) {
    try {
        const { token, error } = await createCustomToken({ uid });
        if (error) throw error;

        return token
    } catch (error) {
        console.error('Error creating custom token (jwt):', error);
    }
}