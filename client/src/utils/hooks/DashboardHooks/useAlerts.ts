import {useEffect, useState} from "react";
import {type AlertResponse} from "../../../core/ServerAPI.ts";
import {alertClient} from "../../../core/api-clients.ts";

const ALERT_AMOUNT = 10;


export const useAlerts = () => {
    const [alerts, setAlerts] = useState<AlertResponse[]>([]);

    useEffect(() => {
        getAlerts(ALERT_AMOUNT).then(data => setAlerts(data));
    }, []);

    return {
        alerts,
        setAlerts
    }
}

async function getAlerts(num: number): Promise<AlertResponse[]> {
    return await alertClient.getAlerts(num);
}