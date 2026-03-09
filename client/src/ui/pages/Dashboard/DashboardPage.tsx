import "./DashboardPage.css";
import { useEffect, useMemo, useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router";
import { tokenAtom, useRemoveToken } from "../../../core/atoms/token.ts";
import { IconCheck } from "../../Icons/Icons.tsx";
import { turbineClient } from "../../../core/api-clients.ts";
import type {
    AlertResponse,
    TurbineResponse,
} from "../../../core/ServerAPI.ts";
import {formatKw} from "../../../utils/FormatKw.ts";
import {latestMetric, turbineStatus} from "./DashboardSpecificUtil.ts";
import {TurbineCommandPanel} from "./Dashboard_Compontents/TurbineCommandPanel.tsx";
import {TurbineMetricChart} from "./Dashboard_Compontents/TurbineMeticChart.tsx";

const METRIC_AMOUNT = 50;

export default function DashboardPage() {
    // TODO : use dashboard
    const [turbines, setTurbines] = useState<TurbineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const [token] = useAtom(tokenAtom);
    const navigate = useNavigate();
    const removeToken = useRemoveToken();


    // TODO : sammen med de ovenfor ^^
    useEffect(() => {
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

    // todo - måske lave en helper ting til denne i stedet?
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

