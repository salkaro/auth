const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomChars = (numChar: number) => {
    let code = '';
    for (let i = 0; i < numChar; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


export const generateRandomOrganisationId = (numChar: number = 40) => {
    return `orgid-${generateRandomChars(numChar)}`;
}