"use server";

// Local Imports
import { IUser } from "@/models/user";
import { admin, firestoreAdmin } from "@/lib/firebase/config-admin";
import { organisationsCol, usersCol } from "@/utils/constants";
import { IOrganisation } from "@/models/organisation";
import { createStripeCustomer } from "../stripe/create";

// External Imports


export async function createCustomToken({ uid }: { uid: string }): Promise<{ token?: string, error?: string }> {
    try {
        return { token: await admin.auth().createCustomToken(uid) };
    } catch (error) {
        return { error: `${error}` }
    }
}

export async function createUser({ uid, email }: { uid: string, email: string }): Promise<IUser | void> {
    try {
        // Get the user document reference
        const userRef = firestoreAdmin.collection(usersCol).doc(uid);

        const now = new Date();

        const user: IUser = {
            id: uid,
            email,
            authentication: {
                emailVerified: 'verified',
            },
            metadata: {
                createdAt: now.getTime()
            }
        }


        await userRef.set(user);

        return user;
    } catch (error) {
        console.error('Error creating user in Firestore:', error);
    }
}

export async function createOrganisation({
    name,
    ownerId,
    email
}: {
    name: string;
    ownerId: string;
    email: string;
}): Promise<{ org?: IOrganisation, error?: unknown }> {
    try {
        const orgRef = firestoreAdmin.collection(organisationsCol).doc();
        const now = Date.now();
        const stripeCustomerId = await createStripeCustomer({ email })

        const organisation: IOrganisation = {
            id: orgRef.id,
            name,
            ownerId,
            subscription: "free",
            members: 1,
            stripeCustomerId,
            createdAt: now,
        };

        await orgRef.set(organisation);

        return { org: organisation };
    } catch (error) {
        console.error("Error creating organisation:", error);
        return { error };
    }
}