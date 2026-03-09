import {useState} from "react";
import type {CommandRequest} from "../../../../../core/ServerAPI.ts";
import {turbineClient} from "../../../../../core/api-clients.ts";


export const useCommandForm = (_turbineId: string) => {
    const [form, setForm] = useState<CommandRequest>({
        action: "start",
        value: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState<null | { type: "success" | "error"; message: string }>(null);

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (status) setStatus(null);
    };

    return{
        form,
        status,
        submitting,
        handleChange,
        handleSubmit
    }
}