import "../DashboardPage.css";
import { useMemo } from "react";
import type { TurbineTelemetryResponse} from "../../../../core/ServerAPI.ts";
import {CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {metricToChartPoint} from "../../../../utils/DashboardSpecificUtil.ts";

export function TurbineMetricChart({ metrics }: { metrics: TurbineTelemetryResponse[] }) {
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
