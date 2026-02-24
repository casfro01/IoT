import React, { useState } from "react";
import "./LoginPage.css";
import {IconAlert, IconCheck, IconEye, IconEyeOff, IconLock, IconMail} from "../../../core/Icons/Icons.tsx";

/* ── Types ── */
interface LoginForm {
    email: string;
    password: string;
}

interface AlertState {
    type: "error" | "success" | null;
    message: string;
}

/* ── Validation ── */
const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

/* ── API helper ── */
interface LoginResponse {
    token?: string;
    user?: { id: string; name: string; email: string };
    message?: string;
}

const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });

    const data: LoginResponse = await response.json();

    if (!response.ok) {
        throw new Error(data.message ?? `HTTP ${response.status}`);
    }

    return data;
};

/* ── Component ── */
export default function LoginPage() {
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<AlertState>({ type: null, message: "" });
    const [touched, setTouched] = useState({ email: false, password: false });

    const emailError  = touched.email    && form.email    && !validateEmail(form.email);
    const passwordError = touched.password && form.password.length > 0 && form.password.length < 6;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        // Ryd alert når brugeren begynder at skrive igen
        if (alert.type === "error") setAlert({ type: null, message: "" });
    };

    const handleBlur = (field: keyof typeof touched) => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

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
            const result = await loginRequest(form.email, form.password);
            // Gem token (tilpas efter behov)
            if (result.token) {
                localStorage.setItem("auth_token", result.token);
            }
            setAlert({ type: "success", message: "Login lykkedes! Du omdirigeres nu…" });
            // TODO: router.push("/dashboard") eller tilsvarende navigation
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : "Forkert e-mail eller adgangskode.";
            setAlert({ type: "error", message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Baggrundsblobbe */}
            <div className="login-bg" aria-hidden="true" />

            <main className="login-wrapper">
                <div className="login-card">

                    {/* Brand */}
                    <div className="brand">
                        <div className="brand-icon" aria-hidden="true">🌿</div>
                        <span className="brand-name">Turbine Lars</span>
                    </div>

                    <h1>Velkommen</h1>
                    <p className="subtitle">Log ind på din konto for at fortsætte.</p>

                    {/* Alert */}
                    {alert.type && (
                        <div className={`alert ${alert.type}`} role="alert">
                            {alert.type === "error" ? <IconAlert /> : <IconCheck />}
                            <span>{alert.message}</span>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} noValidate>
                        {/* E-mail */}
                        <div className="form-group">
                            <label htmlFor="email">E-mail</label>
                            <div className="input-wrap">
                                <IconMail />
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    placeholder="dig@eksempel.dk"
                                    value={form.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    className={emailError ? "input-error" : ""}
                                    aria-invalid={!!emailError}
                                    aria-describedby={emailError ? "email-hint" : undefined}
                                />
                            </div>
                            {emailError && (
                                <small id="email-hint" style={{ color: "var(--error)", fontSize: "0.78rem", marginTop: "4px", display: "block" }}>
                                    Ugyldig e-mailadresse
                                </small>
                            )}
                        </div>

                        {/* Adgangskode */}
                        <div className="form-group">
                            <label htmlFor="password">Adgangskode</label>
                            <div className="input-wrap">
                                <IconLock />
                                <input
                                    id="password"
                                    type={showPw ? "text" : "password"}
                                    name="password"
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("password")}
                                    className={passwordError ? "input-error" : ""}
                                    aria-invalid={!!passwordError}
                                />
                                <button
                                    type="button"
                                    className="toggle-pw"
                                    onClick={() => {setShowPw((v) => !v); console.log("jens")}}
                                    aria-label={showPw ? "Skjul adgangskode" : "Vis adgangskode"}
                                >
                                    {showPw ? <IconEyeOff /> : <IconEye />}
                                </button>
                            </div>
                            {passwordError && (
                                <small style={{ color: "var(--error)", fontSize: "0.78rem", marginTop: "4px", display: "block" }}>
                                    Adgangskoden er for kort
                                </small>
                            )}
                        </div>

                        {/* Login-knap */}
                        <button type="submit" className="btn-login" disabled={loading}>
                            {loading && <span className="spinner" aria-hidden="true" />}
                            {loading ? "Logger ind…" : "Log ind"}
                        </button>
                    </form>
                </div>
            </main>
        </>
    );
}