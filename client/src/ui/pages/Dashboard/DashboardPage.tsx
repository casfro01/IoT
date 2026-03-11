import "./DashboardPage.css";
import { useMemo } from "react";
import { IconCheck } from "../../Icons/Icons.tsx";
import type { AlertResponse } from "../../../core/ServerAPI.ts";
import {formatKw} from "../../../utils/FormatKw.ts";
import {TurbineCommandPanel} from "./Dashboard_Compontents/TurbineCommandPanel/TurbineCommandPanel.tsx";
import {TurbineMetricChart} from "./Dashboard_Compontents/TurbineMeticChart.tsx";
import {useLogout} from "../../../utils/hooks/useLogout.ts";
import {useDashboardForm} from "./useDashboardForm.ts";
import {useIsValidLogin} from "../../../utils/JwtChecker.ts";
import {useFleetSummary} from "../../../utils/hooks/DashboardHooks/useFleetSummary.ts";
import {latestMetric, turbineStatus} from "../../../utils/DashboardSpecificUtil.ts";

export default function DashboardPage() {
    const {
        turbines,
        loading,
        error,
        alerts,
        selectedId,
        setSelectedId
    } = useDashboardForm();
    const logout = useLogout();
    const validLogin = useIsValidLogin();
    const fleetSummary = useFleetSummary(turbines);
    
    const selected = useMemo(() => {
        return turbines.find((t) => t.id === selectedId) ?? turbines[0] ?? null;
    }, [turbines, selectedId]);


    const handleLogout = async () => {
        logout();
    };

    if (!validLogin) {
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
                                            {(alerts.filter(a => a?.turbineId === selectedId).length ?? 0) === 0 ? (
                                                <>
                                                    <IconCheck />
                                                    <span>Ingen aktive alarmer</span>
                                                </>
                                            ) : (
                                                <ul className="alert-list" aria-label="Aktive alarmer">
                                                    {alerts.filter(alrt => alrt?.turbineId === selectedId).map((a: AlertResponse) => (
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

