import type {TurbineResponse, TurbineTelemetryResponse} from "../core/ServerAPI.ts";

export function metricToChartPoint(m: TurbineTelemetryResponse): {
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

export function latestMetric(t: TurbineResponse): TurbineTelemetryResponse | null {
    const m = t.metrics;
    return m && m.length > 0 ? m[0]! : null;
}

export function turbineStatus(t: TurbineResponse): string {
    const s = latestMetric(t)?.status;
    if (s === "running" || s === "stopped") return s;
    return s ? s : "Offline";
}