import { OrgRoleType } from "./organisation";

export type EmailVerification = "unverified" | "verifying" | "verified";


interface IUser {
    firstname?: string | null;
    lastname?: string | null;
    authentication?: IAuthentication | null;
    email?: string | null;
    id?: string | null;
    metadata?: IMetaData;
    organisation?: IUserOrganisation;
}


interface IUserOrganisation {
    id?: string | null;
    role?: OrgRoleType | null;
    joinedAt?: number | null;
}

interface IAuthentication {
    emailVerified?: EmailVerification;
    onboarding?: boolean | null;
}


interface IMetaData {
    createdAt?: number | null;
}


export type { IUser, IUserOrganisation }