import {useNavigate} from "react-router";
import {useRemoveToken} from "../../core/atoms/token.ts";

export const useLogout = () => {
    const navigate = useNavigate();
    const removeToken = useRemoveToken();
    return () => {
        removeToken(null);
        navigate("/login", { replace: true });
    }
}