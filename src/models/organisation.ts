export type OrgRoleType = "viewer" | "developer" | "admin" | "owner"

interface IOrganisation {
    id?: string | null;
    name?: string | null;
    stripeCustomerId?: string | null;
    subscription?: string | null;
    members?: number | null;
    api_key?: string | null;
    ownerId?: string | null;
    createdAt?: number | null;
}


export type { IOrganisation }