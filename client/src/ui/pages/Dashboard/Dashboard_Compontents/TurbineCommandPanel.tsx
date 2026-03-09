import "../DashboardPage.css";
import {useState} from "react";
import type {CommandRequest} from "../../../../core/ServerAPI.ts";
import {turbineClient} from "../../../../core/api-clients.ts";

export function TurbineCommandPanel({ turbineId: _turbineId }: { turbineId: string }) {
    const [form, setForm] = useState<CommandRequest>({
        action: "start",
        value: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (status) setStatus(null);
    };

    // TODO : flyt denne -> use command submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (form.action !== "start" && !form.value!.trim()) {
            setStatus({ type: "error", message: "Angiv en værdi." });
            return;
        }

        setSubmitting(true);
        try {
            const request: CommandRequest = {
                action: form.action,
                value: form.value
            };
            await turbineClient.executeCommand(_turbineId, request);

            setStatus({ type: "success", message: "Kommando sendt til turbine." });
        } catch {
            setStatus({ type: "error", message: "Kunne ikke sende kommando. Prøv igen." });
        } finally {
            setSubmitting(false);
        }
    };

    const showPitch = form.action === "setPitch";
    const showStop = form.action === "stop";
    const showInterval = form.action === "setInterval"

    return (
        <article className="detail-card" aria-label="Styring af turbine">
            <h3 className="detail-subtitle">Styring</h3>
            <form className="command-form" onSubmit={handleSubmit}>
                <div className="command-row">
                    <div className="command-field">
                        <label htmlFor="command">Kommando</label>
                        <select
                            id="command"
                            name="action"
                            value={form.action}
                            onChange={handleChange}
                        >
                            <option value="start">Start</option>
                            <option value="stop">Stop</option>
                            <option value="setPitch">Sæt pitch</option>
                            <option value="setInterval">Sæt interval</option>
                        </select>
                    </div>

                    {showStop && (
                        <div className="command-field">
                            <label htmlFor="stopValue">Begrundelse</label>
                            <input
                                id="stopValue"
                                name="value"
                                type="text"
                                placeholder="Begrundelse"
                                value={form.value}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {showPitch && (
                        <div className="command-field">
                            <label htmlFor="pitchDeg">Pitch (°)</label>
                            <input
                                id="pitchDeg"
                                name="value"
                                type="number"
                                min="-5"
                                max="90"
                                step="0.1"
                                placeholder="f.eks. 12.5"
                                value={form.value}
                                onChange={handleChange}
                            />
                        </div>
                    )}

                    {showInterval && (
                        <div className="command-field">
                            <label htmlFor="interval">Interval (sekunder)</label>
                            <input
                                id="interval"
                                name="value"
                                type="number"
                                min="1"
                                max="60"
                                step="1"
                                placeholder="1-60 sekunder"
                                value={form.value}
                                onChange={handleChange}
                            />
                        </div>
                    )}
                </div>

                {status && (
                    <div
                        className={
                            "command-status " +
                            (status.type === "success"
                                ? "command-status-success"
                                : "command-status-error")
                        }
                    >
                        {status.message}
                    </div>
                )}

                <div className="command-actions">
                    <button type="submit" className="btn-ghost" disabled={submitting}>
                        {submitting ? "Sender…" : "Send kommando"}
                    </button>
                </div>
            </form>
        </article>
    );
}