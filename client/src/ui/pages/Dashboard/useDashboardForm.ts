import {type Dispatch, type SetStateAction, useEffect, useState} from "react";
import type {TurbineResponse, TurbineTelemetryResponse} from "../../../core/ServerAPI.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../core/atoms/token.ts";
import {useNavigate} from "react-router";
import {alertClient, SSE_PATH, turbineClient} from "../../../core/api-clients.ts";
import {StateleSSEClient} from "../../../core/SseClient.ts";

const METRIC_AMOUNT = 50;

export const useDashboardForm = () => {
    const [turbines, setTurbines] = useState<TurbineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const [token] = useAtom(tokenAtom);
    const navigate = useNavigate();

    useEffect(() => {
        const sse = new StateleSSEClient(SSE_PATH);
        sseListenerHelper(sse, setTurbines);

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

    return {
        turbines,
        loading,
        error,
        selectedId,
        setSelectedId,
    }
}


function sseListenerHelper(client: StateleSSEClient, setTurbineData: Dispatch<SetStateAction<TurbineResponse[]>>){
    // alerts
    client.listen(
        async(id) => {
            await alertClient.connectToAlerts(id);
            return {}
        },
        () => {

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
            if (turb.metrics){
                turb.metrics = [...turb.metrics, telemetry];
            }
            else{
                turb.metrics = [telemetry];
            }
            return [...prev]
        })
    },
    (err) => console.error("SSE ERROR:", err));
}

function mapTelemetry(raw): TurbineTelemetryResponse {
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