import "../../DashboardPage.css";
import {useCommandForm} from "./useCommandForm.ts";

export function TurbineCommandPanel({ turbineId: _turbineId }: { turbineId: string }) {
    const {
        form,
        status,
        submitting,
        handleChange,
        handleSubmit
    } = useCommandForm(_turbineId);

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