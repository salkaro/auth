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
import { joinOrganisationAdmin } from "@/services/firebase/admin-update";
import { createSignInToken } from "@/services/firebase/create";
import { auth } from "@/lib/firebase/config";

const OnboardingForm = () => {
    const root = process.env.NEXT_PUBLIC_DASH_ROOT as string;

    const { data: session, status } = useSession();
    const toastShownRef = useRef(false);

    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const [stage, setStage] = useState(0);

    // Stage 0: User info
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");

    // Stage 1: Org action choice
    const [orgAction, setOrgAction] = useState<"create" | "join">("create")
    // Create
    const [orgName, setOrgName] = useState("");
    // Join
    const [joinCode, setJoinCode] = useState("")

    const handleNextStage = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (stage === 0 && (!firstname || !lastname)) {
            toast.error("Please enter your first and last name.");
            return;
        }

        if (stage === 1) {
            if (orgAction === "create" && !orgName.trim()) {
                return
            }
            if (orgAction === "join" && !joinCode.trim()) {
                return
            }
        }

        // Final submission
        if (stage === 1) {
            setLoading(true)
            try {
                if (orgAction === "create") {
                    await updateOnboarding({
                        firstname,
                        lastname,
                        organisation: orgName,
                    })
                    toast.success("Organisation created and onboarding complete!")
                } else {
                    const { error } = await joinOrganisationAdmin({ code: joinCode.trim(), uid: session?.user.id as string, firstname, lastname })
                    if (error) throw error;
                    toast.success("Joined organisation successfully!")
                }

                const token = await createSignInToken({ uid: auth.currentUser?.uid as string })
                const isProd = process.env.NODE_ENV === 'production';
                document.cookie = `signInToken=${token}; path=/;${isProd ? ' domain=.salkaro.com;' : ''} max-age=300;${isProd ? ' secure;' : ''} samesite=Lax`;
                router.push(`${root}/preparing`);
            } catch (err) {
                console.log(err)
                toast.error("Something went wrong, please try again.", { description: "Organisation may not exists or invite code is invalid" })
            } finally {
                setLoading(false)
            }
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
                            <Input id="firstname" value={firstname} type="text" placeholder="John" required onChange={(e) => setFirstname(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="lastname">Last Name</Label>
                            <Input id="lastname" value={lastname} type="text" placeholder="Smith" required onChange={(e) => setLastname(e.target.value)} />
                        </div>
                    </div>
                    <Button className="w-full mt-4" type="submit" disabled={!firstname || !lastname}>
                        Continue
                    </Button>
                </form>
            )}

            {stage === 1 && (
                <form onSubmit={handleNextStage} className="space-y-6">
                    <h1 className="text-2xl font-bold mb-4">Organisation</h1>

                    {/* Action toggle */}
                    <div className="flex space-x-4 justify-center">
                        <Button
                            variant={orgAction === "create" ? "default" : "ghost"}
                            onClick={() => setOrgAction("create")}
                        >
                            Create New
                        </Button>
                        <Button
                            variant={orgAction === "join" ? "default" : "ghost"}
                            onClick={() => setOrgAction("join")}
                        >
                            Join Existing
                        </Button>
                    </div>

                    {orgAction === "create" ? (
                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <Label htmlFor="organisation">Organisation Name</Label>
                                <Input
                                    id="organisation"
                                    value={orgName}
                                    onChange={(e) => setOrgName(e.target.value)}
                                    placeholder="Salkaro Inc."
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="grid gap-3">
                                <Label htmlFor="joinCode">Join Code</Label>
                                <Input
                                    id="joinCode"
                                    value={joinCode}
                                    onChange={(e) => setJoinCode(e.target.value)}
                                    placeholder="e.g. AbCd1234"
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button variant="link" onClick={handlePreviousStage}>
                            Go Back
                        </Button>
                        <Button className="w-32" type="submit" disabled={loading}>
                            {loading ? <Loader2Icon className="animate-spin" /> : orgAction === "create" ? "Create" : "Join"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
}

export default OnboardingForm
