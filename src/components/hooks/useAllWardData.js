import { useContext, useEffect } from "react";
import { StateContext } from "../../state/State";
import axiosInstance from "../../state/axiosInstance";
import useSearchParams from "./useSearchQueryParams"
export default function useAllCountyData() {
    const { dispatch, party, agentsParty } = useContext(StateContext);


    const filter = Boolean(useSearchParams("filter"));
    const county = useSearchParams("county");



    function updateCountyNames() {
        if ((filter && Boolean(county) || party || agentsParty)) {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingWardChildren",
                payload: true
            })
            dispatch({
                type: "ADD_MULTIPLE",
                context: "progress_ward",
                payload: 0
            })
            axiosInstance.get(`/ward-bycounty/${county || agentsParty?.roi || party.roi}`).then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "allWardData",
                    payload: data
                })
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingWardChildren",
                    payload: false
                })
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "progress_ward",
                    payload: 100
                })
            }).catch((e) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingWardChildren",
                    payload: false
                })
            })
        }
    }

    useEffect(() => {
        updateCountyNames();
    }, [county, party, agentsParty]);
}