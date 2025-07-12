import { firestore } from "@/lib/firebase/config";
import { IUser } from "@/models/user";
import { usersCol } from "@/utils/constants";
import { doc, getDoc } from "firebase/firestore";
import { createUser } from "./admin-create";

export async function retrieveUserAndCreate({ uid, email }: { uid: string, email?: string | null }): Promise<IUser | void> {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);
        const userDoc = await getDoc(docRef);

        // Step 2: Check if the user document exists
        if (userDoc.exists()) {
            // Step 3: Extract & return the user data as an IUser object
            return userDoc.data() as IUser;
        } else {
            if (!email) throw new Error('Email is required to create a new user');

            // Step 4: Create a new user
            return await createUser({ uid, email })
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}


export async function retrieveUser({ uid }: { uid: string }): Promise<IUser | void> {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);
        const userDoc = await getDoc(docRef);

        // Step 2: Check if the user document exists
        if (userDoc.exists()) {
            // Step 3: Extract & return the user data as an IUser object
            return userDoc.data() as IUser;
        }
    } catch (error) {
        console.error('Error retrieving user from Firestore:', error);
    }
}