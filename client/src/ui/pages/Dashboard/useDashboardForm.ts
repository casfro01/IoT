import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {AlertResponse, TurbineResponse, TurbineTelemetryResponse} from "../../../core/ServerAPI.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../core/atoms/token.ts";
import {useNavigate} from "react-router";
import {alertClient, SSE_PATH, turbineClient} from "../../../core/api-clients.ts";
import {StateleSSEClient} from "../../../core/SseClient.ts";
import toast from "react-hot-toast";
import {useAlerts} from "../../../utils/hooks/DashboardHooks/useAlerts.ts";

const METRIC_AMOUNT = 50;

export const useDashboardForm = () => {
    const [turbines, setTurbines] = useState<TurbineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const {alerts, setAlerts} = useAlerts();
    const [token] = useAtom(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const sse = new StateleSSEClient(SSE_PATH);
        sseListenerHelper(sse, setTurbines, setAlerts);

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
            sse.disconnect();
        };
    }, [token, navigate]);

    return {
        turbines,
        loading,
        error,
        alerts,
        selectedId,
        setSelectedId,
    }
}


function sseListenerHelper(client: StateleSSEClient, setTurbineData: Dispatch<SetStateAction<TurbineResponse[]>>, setAlertData: Dispatch<SetStateAction<AlertResponse[]>>){
    // alerts
    client.listen<AlertResponse>(
        async(id) => {
            await alertClient.connectToAlerts(id);
            return { group: "alerts", data: null}
        },
        (data) => {
            setAlertData(prev => {
                const alert: AlertResponse =
                    typeof data === "string" ? mapAlert(JSON.parse(data)) : data;
                toast(alert.message ?? "Warming", {
                    icon: '⚠️',
                });
                if (!alert) return prev;
                if (prev.some(a => a.id === alert.id)) return prev; // for at undgå duplikater ig, jeg er sej - Alex, hvis du læser dette giv mig lige 12 ik' jeg er så sød
                return [alert, ...prev];
            })
        }
    );
    client.listen<TurbineTelemetryResponse>(async (id) => {
        await turbineClient.connectToAllTurbines(id);
        return { group: "all", data: null };
    },
    (data) => {
        setTurbineData(prev => {
            // Parse at runtime HOST HOST, altså ffs
            const telemetry: TurbineTelemetryResponse =
                typeof data === "string" ? mapTelemetry(JSON.parse(data)) : data;
            const turb = prev.find((t) => t.displayname == telemetry.turbineName);
            if (!turb) return prev;
            // måske er det bedre ikke at køre spread for hver turbine men bare kun på den som får opdateringer
            // som vi gør nu
            return prev.map(t => t.id === turb.id ?
                {
                ...t,
                    metrics: t.metrics ? [...t.metrics, telemetry] : [telemetry],
            } : t);
        })
    },
    (err) => console.error("SSE ERROR:", err));
}

function mapTelemetry(raw: any): TurbineTelemetryResponse {
    return {
        turbineName: raw.TurbineName,
        timestamp: raw.Timestamp,
        windSpeed: raw.WindSpeed,
        windDirection: raw.WindDirection,
        ambientTemperature: raw.AmbientTemperature,
        rotorSpeed: raw.RotorSpeed,
        powerOutput: raw.PowerOutput,
        nacelleDirection: raw.NacelleDirection,
        bladePitch: raw.BladePitch,
        generatorTemp: raw.GeneratorTemp,
        gearboxTemp: raw.GearboxTemp,
        vibration: raw.Vibration,
        status: raw.Status,
    };
}

function mapAlert(parse: any): AlertResponse {
    return {
        id: parse.Id,
        turbineId: parse.TurbineId,
        alerted: parse.Alerted,
        message: parse.Message,
        severity: parse.Severity
    }
}