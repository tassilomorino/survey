import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";

export default function useToggleSuccessToast() {
    const { dispatch, toggleSuccess, tooggleError } = useContext(StateContext);

    function releaseToasts() {
        if (Boolean(toggleSuccess)) {
            setTimeout(() => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "toggleSuccess",
                    payload: false
                });
            }, 4200);

        } else if (Boolean(tooggleError)) {
            setTimeout(() => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "toggleError",
                    payload: false
                });
            }, 4200);

        }
    }

    useEffect(() => releaseToasts(), []);
}