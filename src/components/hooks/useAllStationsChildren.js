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
                context: "loadingStationsChildren",
                payload: true
            })

            axiosInstance.get(`/station-bycounty/${county?.toUpperCase() || agentsParty?.roi || party.roi}`).then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "allStationsData",
                    payload: data
                })
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingStationsChildren",
                    payload: false
                })
            }).catch((e) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingStationsChildren",
                    payload: false
                })
            })
        }
    }

    useEffect(() => {
        updateCountyNames();
    }, [party, county]);
}