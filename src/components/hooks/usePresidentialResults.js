import { useContext, useEffect } from "react";
import { StateContext } from "../../state/State";
import axiosInstance from "../../state/axiosInstance";
import useSearchQueryParams from "../hooks/useSearchQueryParams"
export default function usePresidentialResults() {

    const {
        results,
        party,
        dispatch,
        loadingRes,
        allCountyData,
        isLoggedIn
    } = useContext(StateContext)

    const filter = Boolean(useSearchQueryParams("filter"))

    const county = useSearchQueryParams("county")
    const ward = useSearchQueryParams("ward")
    const constituency = useSearchQueryParams("constituency")
    const station = useSearchQueryParams("station")

    const year = useSearchQueryParams("year")
    const title = useSearchQueryParams("title")

    const update = () => {
        if (!loadingRes && !results) {
            dispatch({
                type: "ADD_MULTIPLE",
                context: "loadingRes",
                payload: true
            })


            axiosInstance.get(`/results/${party?.id}`).then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "results",
                    payload: data
                })
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingRes",
                    payload: false
                })

            }).catch(e => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "loadingRes",
                    payload: false
                })

            })
        }
    }

    useEffect(() => {
        if(isLoggedIn){
            update()
        }
    }, [isLoggedIn])

}