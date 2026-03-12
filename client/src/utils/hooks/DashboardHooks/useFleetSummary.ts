import type {TurbineResponse} from "../../../core/ServerAPI.ts";
import {useMemo} from "react";
import {latestMetric, turbineStatus} from "../../DashboardSpecificUtil.ts";
import {useAlerts} from "./useAlerts.ts";

export const useFleetSummary = (turbines: TurbineResponse[]) => {
    const {alerts} = useAlerts();
    const fleetSummary = useMemo(() => {
        const totalTurbines = turbines.length;
        const online = turbines.filter((t) => turbineStatus(t) === "running").length;
        const withAlerts = alerts.length;
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
    }, [turbines, alerts]);


    return fleetSummary;
}