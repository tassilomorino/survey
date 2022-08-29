import { useContext, useEffect } from "react";
import { StateContext } from "../../state/State";
import axiosInstance from "../../state/axiosInstance";
import useSearchParams from "./useSearchQueryParams"
export default function useAllCountyData() {
    const { dispatch, party, agentsParty, allConstData } = useContext(StateContext);

    const filter = Boolean(useSearchParams("filter"));
    const county = useSearchParams("county");

    function updateCountyNames() {
        if ((filter && Boolean(county) || (party && party.isParty && party.operations === "COUNTY") || (agentsParty && agentsParty.isParty && agentsParty.party.operations === "COUNTY"))) {
            updateAll()
        } else if (((party && party.isParty && party.operations === "CONSTITUENCY") || (agentsParty && agentsParty.isParty && agentsParty.operations === "CONSTITUENCY"))) {
            updateDetail()
        }

    }



    function updateDetail() {
        dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingConstituencyChildren",
            payload: true
        })
        axiosInstance.get(`/constituency/${party?.roi || agentsParty?.roi}`).then(({ data }) => {

            dispatch({
                type: "ADD_MULTIPLE",
                context: "allConstData",
                payload: data
            })
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingConstituencyChildren",
                payload: false
            })
        }).catch((e) => {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingConstituencyChildren",
                payload: false
            })
        })
    }


    function updateAll() {
        dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingConstituencyChildren",
            payload: true
        })
        axiosInstance.get(`/constituency-bycounty/${county || party.roi}`).then(({ data }) => {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "allConstData",
                payload: data
            })
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingConstituencyChildren",
                payload: false
            })
        }).catch((e) => {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingConstituencyChildren",
                payload: false
            })
        })
    }

    useEffect(() => {
        updateCountyNames();
    }, [county, party, agentsParty]);
}