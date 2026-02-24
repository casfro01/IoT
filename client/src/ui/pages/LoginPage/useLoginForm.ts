import { useState } from "react";
import type {LoginForm} from "../../../utils/hooks/useLogin.ts";
import {validateEmail} from "../../../utils/ValidateEmail.ts";
import {Login } from "../../../utils/hooks/useLogin.ts";
import {tokenAtom} from "../../../core/atoms/token.ts";
import {useAtom} from "jotai";
import {useNavigate} from "react-router";

export interface AlertState {
    type: "error" | "success" | null;
    message: string;
}


export const useLoginForm = () => {
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });
    const [touched, setTouched] = useState({ email: false, password: false });
    const [, setJwt] = useAtom(tokenAtom);
    const navigator = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setTouched({ email: true, password: true });

        if (!form.email || !validateEmail(form.email)) {
            setAlert({ type: "error", message: "Indtast venligst en gyldig e-mailadresse." });
            return;
        }
        if (!form.password || form.password.length < 6) {
            setAlert({ type: "error", message: "Adgangskoden skal være mindst 6 tegn." });
            return;
        }

        setLoading(true);
        setAlert({ type: null, message: "" });

        try {
            const result = await Login(form);
            if (result) {
                setJwt(result);
                setAlert({ type: "success", message: "Login lykkedes! Du omdirigeres nu…" });
                // todo : evt sæt til /dashboard eller noget
                navigator("/");
            }
            else{
                setAlert({ type: "error", message: "Login fejlede. Prøv igen senere." });
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Forkert e-mail eller adgangskode.";
            setAlert({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };
    
    return {
        form,
        showPw,
        loading,
        alert,
        touched,
        setForm,
        setShowPw,
        setLoading,
        setAlert,
        setTouched,
        handleSubmit,
    }
}