import "./LoginPage.css";
import {IconAlert, IconCheck, IconEye, IconEyeOff, IconLock, IconMail} from "../../Icons/Icons.tsx";
import {validateEmail} from "../../../utils/ValidateEmail.ts";
import {useLoginForm, useLoginProtector} from "./useLoginForm.ts";

export default function LoginPage() {
    const {
        form,
        showPw,
        loading,
        alert,
        touched,
        setForm,
        setShowPw,
        setAlert,
        setTouched,
        handleSubmit,
    } = useLoginForm();

    useLoginProtector(); // fjerner dig fra denne side, hvis du har et valid jwt nøgle.

    const emailError = touched.email && form.email && !validateEmail(form.email);
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
                                    <div className="shift-eye-to-the-right">
                                        {showPw ? <IconEyeOff /> : <IconEye />}
                                    </div>
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