export async function handleLogin(): Promise<{ success?: boolean, error?: unknown }> {
    try {
        return { success: true }
    } catch (error) {
        console.error("An error occured whilst processing login", error);
        return { success: true, error };
    }
}