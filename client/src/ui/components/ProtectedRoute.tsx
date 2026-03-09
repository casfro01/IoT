import {Navigate} from "react-router";
import React from "react";
import {getRoleFromJwt} from "../../utils/JwtChecker.ts";
import {tokenAtom} from "../../core/atoms/token.ts";
import {useAtom} from "jotai";

interface ProtectedRouteProps {
    requiredRole: string;
    children: React.ReactNode;
}

export default function ProtectedRoute({requiredRole, children}: ProtectedRouteProps) {
    const [jwt,] = useAtom(tokenAtom);
    const userRole = getRoleFromJwt(jwt);

    if (userRole == null) {
        return <Navigate to="/login" replace />
    }

    if (requiredRole && userRole !== requiredRole){
        return <Navigate to="/" replace />;}

    return children;

}