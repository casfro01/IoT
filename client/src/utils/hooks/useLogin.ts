import {authClient} from "../../core/api-clients.ts";
import type {LoginRequest} from "../../core/ServerAPI.ts";

export interface LoginForm {
    email: string;
    password: string;
}

export async function Login(form: LoginForm): Promise<string | undefined> {
    const dto: LoginRequest = {
        email: form.email,
        password: form.password,
    }
    const res = await authClient.login(dto);
    return res.jwt
}