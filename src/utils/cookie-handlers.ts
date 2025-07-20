export function removeAllCookies(): void {
    const cookies = document.cookie.split(";");

    cookies.forEach(cookie => {
        const trimmed = cookie.trim();
        if (trimmed.startsWith("salkaro.")) {
            const cookieName = trimmed.split("=")[0];
            document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
        }
    });
}