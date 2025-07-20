"use client";

// Local Imports
import { usersCol } from "@/utils/constants";
import { auth, firestore } from "@/lib/firebase/config";
import { createOrganisation } from "./admin-create";

// External Imports
import { deleteField, doc, FieldValue, updateDoc } from "firebase/firestore";

export async function updateOnboarding({ firstname, lastname, organisation }: { firstname: string, lastname: string, organisation?: string }) {
    try {
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("No authenticated user found.");
        }


        const userRef = doc(firestore, usersCol, user.uid);

        const updatePayload: { [x: string]: FieldValue | Partial<unknown> | undefined; } = {
            firstname,
            lastname,
            "authentication.onboarding": deleteField(),
        }


        if (organisation) {
            const { org, error } = await createOrganisation({
                name: organisation,
                ownerId: user.uid,
                email: user.email,
            })

            if (error || !org) throw error

            updatePayload.organisation = {
                id: org.id,
                role: "owner",
                joinedAt: org.createdAt,
            }
        }

        await updateDoc(userRef, updatePayload);
    } catch (error) {
        console.error("Failed to update onboarding info:", error);
        throw error;
    }
}