"use client";

// Local Imports
import { usersCol } from "@/utils/constants";
import { createOrganisation } from "./admin-create";

// External Imports
import { deleteField, doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase/config";

export async function updateOnboarding({ firstname, lastname, organisation }: { firstname: string, lastname: string, organisation: string }) {
    try {
        const user = auth.currentUser;

        if (!user || !user.email) {
            throw new Error("No authenticated user found.");
        }

        const { org, error } = await createOrganisation({ name: organisation, ownerId: user.uid, email: user.email })
        if (error || !org) throw error;

        const userRef = doc(firestore, usersCol, user.uid);

        await updateDoc(userRef, {
            firstname,
            lastname,
            organisation: {
                id: org.id,
                role: "owner",
                joinedAt: org.createdAt,
            },
            "authentication.onboarding": deleteField(),
          });

    } catch (error) {
        console.error("Failed to update onboarding info:", error);
        throw error;
    }
}