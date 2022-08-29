import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";

export default function useSurvey() {
    const { party, dispatch, isLoggedIn } = useContext(StateContext);

    function updateState() {
        axiosInstance
            .get(`/surveys/${party?.id}`)
            .then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "surveys",
                    payload: data
                });
            })
            .catch((e) => {
                console.log(e);
            });
    }

    useEffect(() => {
        if (isLoggedIn) {
            updateState();
        }
    }, [isLoggedIn]);
}