import { useEffect } from "react";
import { decode } from "jsonwebtoken";

export default function useAuth(dispatch, state) {
    function updateLogin() {
        dispatch({
            type: "ADD_MULTIPLE",
            context: "checkingLoginStatus",
            payload: true
        });
        const access_token = localStorage.getItem("access_token");
        if (Boolean(access_token)) {
            const decoded = decode(access_token, { headers: true });
            if (decoded.isParty) {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "party",
                    payload: decoded
                });

                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "checkingLoginStatus",
                    payload: false
                });

            } else if (decoded.isOfficial) {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "agent",
                    payload: decoded
                });

                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "checkingLoginStatus",
                    payload: false
                });

                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "agentsParty",
                    payload: decoded.party
                });
            }
            dispatch({
                type: "ADD_MULTIPLE",
                context: "isLoggedIn",
                payload: true
            });

        } else {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "isLoggedIn",
                payload: false
            });
            dispatch({
                type: "ADD_MULTIPLE",
                context: "checkingLoginStatus",
                payload: false
            });
        }
    }

    useEffect(() => {
        updateLogin();
    }, []);
}