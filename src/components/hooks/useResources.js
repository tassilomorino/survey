import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";

export default function useResources() {
    const { party, dispatch, isLoggedIn } = useContext(StateContext);

    function updateState() {
        axiosInstance
            .get(`/resources/${party?.id}`)
            .then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "resources",
                    payload: data
                });
            })
            .catch((e) => {
            });
    }

    useEffect(() => {
        if (isLoggedIn)
            updateState();
    }, [isLoggedIn]);
}