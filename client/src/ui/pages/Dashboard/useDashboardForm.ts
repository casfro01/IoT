import {useEffect, useState} from "react";
import type {TurbineResponse} from "../../../core/ServerAPI.ts";
import {useAtom} from "jotai";
import {tokenAtom} from "../../../core/atoms/token.ts";
import {useNavigate} from "react-router";
import {turbineClient} from "../../../core/api-clients.ts";

const METRIC_AMOUNT = 50;

export const useDashboardForm = () => {
    const [turbines, setTurbines] = useState<TurbineResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string>("");
    const [token] = useAtom(tokenAtom);
    const navigate = useNavigate();

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

    return {
        turbines,
        loading,
        error,
        selectedId,
        setSelectedId,
    }
}