import "./DashboardPage.css";
import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";
import { tokenAtom, useRemoveToken } from "../../../core/atoms/token.ts";
import { IconCheck } from "../../Icons/Icons.tsx";
import { turbineClient } from "../../../core/api-clients.ts";
import type {
    AlertResponse,
    CommandRequest,
    TurbineResponse,
    TurbineTelemetryResponse,
} from "../../../core/ServerAPI.ts";
import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const METRIC_AMOUNT = 50;


function formatKw(value: number) {
    return `${value.toLocaleString("da-DK", { maximumFractionDigits: 0 })} kW`;
}


function TurbineCommandPanel({ turbineId: _turbineId }: { turbineId: string }) {
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

function metricToChartPoint(m: TurbineTelemetryResponse): {
    timestampUtc: string;
    windspeed?: number;
    poweroutput?: number;
    rotorspeed?: number;
} {
    return {
        timestampUtc: m.timestamp ?? "",
        windspeed: m.windSpeed,
        poweroutput: m.powerOutput,
        rotorspeed: m.rotorSpeed,
    };
}

function TurbineMetricChart({ metrics }: { metrics: TurbineTelemetryResponse[] }) {
    const data = useMemo(
        () => [...metrics].sort((a, b) => (a.timestamp ?? "").localeCompare(b.timestamp ?? "")).map(metricToChartPoint),
        [metrics],
    );

    return (
        <article className="detail-card" aria-label="Historik for turbine metrics">
            <h3 className="detail-subtitle">Historik</h3>
            {data.length > 0 ? (
                <div className="metric-chart-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data}
                            margin={{ top: 8, right: 12, left: 0, bottom: 4 }}
                        >
                            <CartesianGrid stroke="#e5ecc8" strokeDasharray="3 3" />
                            <XAxis
                                dataKey="timestampUtc"
                                tickFormatter={(v) =>
                                    new Date(v).toLocaleTimeString("da-DK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                }
                                fontSize={11}
                            />
                            <YAxis
                                yAxisId="left"
                                fontSize={11}
                                tickFormatter={(v: number) => `${v.toFixed(0)}`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                fontSize={11}
                                tickFormatter={(v: number) => `${v.toFixed(1)}`}
                            />
                            <Tooltip
                                labelFormatter={(v) =>
                                    new Date(v).toLocaleString("da-DK", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        second: "2-digit",
                                    })
                                }
                            />
                            <Line
                                yAxisId="left"
                                type="monotone"
                                dataKey="poweroutput"
                                name="Power (kW)"
                                stroke="#4a5e2f"
                                dot={false}
                                strokeWidth={2}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="windspeed"
                                name="Vind (m/s)"
                                stroke="#8db848"
                                dot={false}
                                strokeWidth={1.7}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="rotorspeed"
                                name="Rotor (rpm)"
                                stroke="#c27e3a"
                                dot={false}
                                strokeWidth={1.5}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            ) : (
            <div className="detail-hint">Ingen data i valgt periode.</div>
            )}
        </article>
    );
}

function latestMetric(t: TurbineResponse): TurbineTelemetryResponse | null {
    const m = t.metrics;
    return m && m.length > 0 ? m[0]! : null;
}

function turbineStatus(t: TurbineResponse): string {
    const s = latestMetric(t)?.status;
    if (s === "running" || s === "stopped") return s;
    return s ? s : "Offline";
}

export default function DashboardPage() {
    const [turbines, setTurbines] = useState<TurbineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const [token] = useAtom(tokenAtom);
    const navigate = useNavigate();
    const removeToken = useRemoveToken();


    useEffect(() => {
        /*
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }*/
        let cancelled = false;
        setLoading(true);
        setError(null);
        turbineClient
            .getTurbines(METRIC_AMOUNT)
            .then((list) => {
                if (cancelled) return;
                setTurbines(list ?? []);
                if (selectedId === "" && list && list.length > 0) {
                    setSelectedId(list[0].id ?? "");
                }
            })
            .catch(() => {
                if (!cancelled) setError("Kunne ikke hente turbiner.");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [token, navigate]);

    const selected = useMemo(() => {
        return turbines.find((t) => t.id === selectedId) ?? turbines[0] ?? null;
    }, [turbines, selectedId]);

    const fleetSummary = useMemo(() => {
        const totalTurbines = turbines.length;
        const online = turbines.filter((t) => turbineStatus(t) === "running").length;
        const withAlerts = turbines.filter((t) => (t.alerts?.length ?? 0) > 0).length;
        const offline = turbines.filter((t) => turbineStatus(t) === "stopped").length;
        const totalPower = turbines.reduce((sum, t) => {
            const p = latestMetric(t)?.powerOutput;
            return sum + (p ?? 0);
        }, 0);
        const windSum = turbines.reduce((sum, t) => {
            const w = latestMetric(t)?.windSpeed;
            return sum + (w ?? 0);
        }, 0);
        const avgWind = totalTurbines > 0 ? windSum / totalTurbines : 0;
        return { totalTurbines, online, withAlerts, offline, totalPower, avgWind };
    }, [turbines]);

    const handleLogout = async () => {
        removeToken(null);
        navigate("/login", { replace: true });
    };

    if (!token) {
        return null;
    }
    if (loading && turbines.length === 0) {
        return (
            <main className="dashboard-wrapper">
                <div className="dashboard-shell">
                    <p className="detail-hint">Loader turbiner…</p>
                </div>
            </main>
        );
    }
    if (error && turbines.length === 0) {
        return (
            <main className="dashboard-wrapper">
                <div className="dashboard-shell">
                    <p className="detail-error">{error}</p>
                </div>
            </main>
        );
    }
    if (!selected) {
        return (
            <main className="dashboard-wrapper">
                <div className="dashboard-shell">
                    <p className="detail-hint">Ingen turbiner at vise.</p>
                </div>
            </main>
        );
    }
    return (
        <>
            <div className="dashboard-bg" aria-hidden="true" />
            <main className="dashboard-wrapper">
                <div className="dashboard-shell">
                    <header className="dashboard-header">
                        <div className="brand">
                            <div className="brand-icon" aria-hidden="true">
                                🌿
                            </div>
                            <div className="brand-text">
                                <span className="brand-name">I Observe Turbines </span>
                                <span className="brand-subtitle">
                                    IoT
                                </span>
                            </div>
                        </div>

                        <div className="dashboard-header-right">
                            <div className="header-pill">
                                <span className="dot dot-online" />
                                <span>
                                    {fleetSummary.online} / {fleetSummary.totalTurbines} online
                                </span>
                            </div>
                            <button
                                type="button"
                                className="btn-ghost"
                                onClick={handleLogout}
                            >
                                Log ud
                            </button>
                        </div>
                    </header>

                    <section className="dashboard-main">
                        <section
                            className="dashboard-column dashboard-column-left"
                            aria-label="Overview of all turbines"
                        >
                            <div className="dashboard-section-header">
                                <h2>Overblik</h2>
                                <p>
                                    Se status for alle turbiner og vælg én for detaljeret
                                    visning.
                                </p>
                            </div>

                            <div className="kpi-grid">
                                <article className="kpi-card">
                                    <span className="kpi-label">Aktuel effekt</span>
                                    <strong className="kpi-value">
                                        {formatKw(fleetSummary.totalPower)}
                                    </strong>
                                    <span className="kpi-footnote">
                                        Samlet output for alle turbiner
                                    </span>
                                </article>

                                <article className="kpi-card">
                                    <span className="kpi-label">Turbiner online</span>
                                    <strong className="kpi-value">
                                        {fleetSummary.online} / {fleetSummary.totalTurbines}
                                    </strong>
                                    <span className="kpi-footnote kpi-status">
                                        <span className="dot dot-online" /> Kører
                                        <span className="dot dot-warning" /> Advarsel ({fleetSummary.withAlerts})
                                        <span className="dot dot-offline" /> Stopper
                                    </span>
                                </article>

                                <article className="kpi-card">
                                    <span className="kpi-label">Vindhastighed (gennemsnit)</span>
                                    <strong className="kpi-value">
                                        {fleetSummary.avgWind.toFixed(1)} m/s
                                    </strong>
                                    <span className="kpi-footnote">
                                        Baseret på alle aktive målepunkter
                                    </span>
                                </article>
                            </div>

                            <div className="table-card" role="region" aria-label="Liste over turbiner">
                                <div className="table-head">
                                    <span>Turbine</span>
                                    <span>Status</span>
                                    <span>Output</span>
                                    <span>Vind</span>
                                    <span>Lokation</span>
                                </div>
                                <div className="table-body">
                                {turbines.map((turbine) => {
                                        const id = turbine.id ?? "";
                                        const name = turbine.displayname ?? turbine.id ?? "—";
                                        const status = turbineStatus(turbine);
                                        const power = latestMetric(turbine)?.powerOutput ?? 0;
                                        const wind = latestMetric(turbine)?.windSpeed ?? 0;
                                        return (
                                            <button
                                                key={id}
                                                type="button"
                                                className={
                                                    "table-row" +
                                                    (id === selectedId ? " table-row-active" : "")
                                                }
                                                onClick={() => setSelectedId(id)}
                                            >
                                                <span className="cell-main">
                                                    <span className="cell-title">{name}</span>
                                                    <span className="cell-subtitle">{id || "—"}</span>
                                                </span>
                                                <span>
                                                    <span
                                                        className={
                                                            "status-pill status-" +
                                                            status.toLowerCase()
                                                        }
                                                    >
                                                        {status}
                                                    </span>
                                                </span>
                                                <span>{formatKw(power)}</span>
                                                <span>{wind.toFixed(1)} m/s</span>
                                                <span>{name}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        <section
                            className="dashboard-column dashboard-column-right"
                            aria-label="Detailed turbine data"
                        >
                            <div className="dashboard-section-header">
                                <h2>{selected.displayname ?? selected.id ?? "Turbine"}</h2>
                                <p>
                                    Detaljeret status og performance for{" "}
                                    <strong>{selected.displayname ?? selected.id ?? "—"}</strong>.
                                </p>
                            </div>

                            <article className="detail-card">
                                <header className="detail-header">
                                    <span
                                        className={
                                            "status-pill status-" +
                                            turbineStatus(selected).toLowerCase()
                                         }
                                    >
                                        {turbineStatus(selected)}
                                        </span>
                                    <span className="detail-meta">
                                    Seneste data
                                    </span>
                                </header>

                                <div className="detail-grid">
                                    <div className="detail-metric">
                                        <span className="metric-label">Aktuel effekt</span>
                                        <div className="metric-main">
                                            <span className="metric-value">
                                            {formatKw(
                                                    latestMetric(selected)?.powerOutput ?? 0,
                                                )}                                            </span>
                                            <span className="metric-sub">
                                            fra seneste måling
                                            </span>
                                        </div>
                                        <div className="metric-bar">
                                            <div
                                                className="metric-bar-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        100,
                                                        ((latestMetric(selected)?.powerOutput ?? 0) / 3200) * 100,
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="detail-metric">
                                        <span className="metric-label">
                                            Vind &amp; temperatur
                                        </span>
                                        <div className="metric-main metric-main-split">
                                            <div>
                                                <span className="metric-value">
                                                {(latestMetric(selected)?.windSpeed ?? 0).toFixed(1)} m/s
                                                </span>
                                                <span className="metric-sub">
                                                    Ved navhøjde
                                                </span>
                                            </div>
                                            <div>
                                                <span className="metric-value">
                                                {(latestMetric(selected)?.generatorTemp ?? 0).toFixed(1)} °C
                                                </span>
                                                <span className="metric-sub">
                                                    Generatorhus
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="detail-metric">
                                        <span className="metric-label">Alarmer</span>
                                        <div className="metric-main metric-main-alerts">
                                            {(selected.alerts?.length ?? 0) === 0 ? (
                                                <>
                                                    <IconCheck />
                                                    <span>Ingen aktive alarmer</span>
                                                </>
                                            ) : (
                                                <ul className="alert-list" aria-label="Aktive alarmer">
                                                    {selected.alerts!.map((a: AlertResponse) => (
                                                        <li key={a.id} className="alert-item">
                                                            <span className="alert-severity">Severity {a.severity ?? 0}</span>
                                                            <span className="alert-message">{a.message ?? "—"}</span>
                                                            <span className="alert-time">
                                                                {a.alerted ? new Date(a.alerted).toLocaleString("da-DK", { dateStyle: "short", timeStyle: "short" }) : ""}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </article>

                            <TurbineCommandPanel turbineId={selected.id ?? ""} />
                            <TurbineMetricChart metrics={selected.metrics ?? []} />
                        </section>
                    </section>
                </div>
            </main>
        </>
    );
}

