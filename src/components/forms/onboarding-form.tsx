"use client"

import { useSession } from "next-auth/react";
import PreparingForm from "./preparing-form";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { updateOnboarding } from "@/services/firebase/update";
import { Loader2Icon } from "lucide-react";

const OnboardingForm = () => {
    const { data: session, status } = useSession();
    const toastShownRef = useRef(false);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [stage, setStage] = useState(0);

    // Stage 0: User info
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    // Stage 1: Org info
    const [orgName, setOrgName] = useState("");

    const handleNextStage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (stage === 0 && (!firstName || !lastName)) {
            toast.error("Please enter your first and last name.");
            return;
        }
        if (stage === 1 && !orgName) {
            toast.error("Please enter your organisation name.");
            return;
        }

        if (stage === 1) {
            setLoading(true);
            if (session?.user.authentication?.onboarding) {
                await updateOnboarding({ firstname: firstName, lastname: lastName, organisation: orgName })
            }
            toast.success("Onboarding complete!");
            router.push("https://app.salkaro.com")
        } else {
            setStage(stage + 1);
        }
    };

    useEffect(() => {
        if (toastShownRef.current) return;

        if (status === "loading") {
            toast.info("Checking your session...");
        } else if (status === "unauthenticated") {
            toast.warning("You are not authenticated.");
        } else if (status === "authenticated") {
            toast.success(`Welcome to your onboarding`);
        }
        toastShownRef.current = true;

    }, [status, session,]);

    async function onClick() {
        router.push("/login")
    }

    const handlePreviousStage = () => {
        setStage((prev) => Math.max(prev - 1, 0));
    };

    if (status === "loading") {
        return <PreparingForm />
    }

    if (status === "unauthenticated") {
        return (
            <div className="text-center mb-6 space-y-6">
                <h1 className="text-4xl font-bold mb-6">Not authenticated</h1>
                <p>Please login or create an account</p>
                <Button onClick={onClick}>
                    Go to login
                </Button>
            </div>
        )
    }

    return (
        <div className="max-w-xl mx-auto p-6 text-center">
            {stage === 0 && (
                <form onSubmit={handleNextStage} className="space-y-6">
                    <h1 className="text-2xl font-bold ">Let&apos;s get started</h1>
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="firstname">First Name</Label>
                            <Input id="firstname" value={firstName} type="text" placeholder="John" required onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input id="lastname" value={lastName} type="text" placeholder="Smith" required onChange={(e) => setLastName(e.target.value)} />
                        </div>
                    </div>
                    <Button className="w-full mt-4" type="submit" disabled={!firstName || !lastName}>
                        Continue
                    </Button>
                </form>
            )}

            {stage === 1 && (
                <form className="space-y-6" onSubmit={handleNextStage}>
                    <h1 className="text-2xl font-bold mb-6">Create your organisation</h1>
                    <div className="space-y-4">
                        <div className="grid gap-3">
                            <Label htmlFor="organisation">Organisation Name</Label>
                            <Input id="organisation" value={orgName} type="text" placeholder="Acme Inc." required onChange={(e) => setOrgName(e.target.value)} />
                        </div>
                        <Button variant="link" onClick={handlePreviousStage}>
                            Go Back
                        </Button>
                    </div>
                    <Button className="w-full" type="submit" disabled={loading || !orgName}>
                        {loading && (
                            <Loader2Icon className="animate-spin" />
                        )}
                        Finish Onboarding
                    </Button>
                </form>
            )}
        </div>
    );
}

export default OnboardingForm
