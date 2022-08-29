import { useContext, useEffect } from "react";
import { StateContext } from "../../state/State";
import axiosInstance from "../../state/axiosInstance";



export default function useAllCountyData(getAll) {
    const { dispatch, allCountyData, loadingCountyChildren, party } = useContext(StateContext);

    function updateCountyNames() {
        if (getAll) {
            fetchAllCounties()
        } else if (party) {
            if (party.isParty && party.operations === "COUNTY" && party.roi) {
                fetchDetailCounty()
            } else if (party.operations === "NATIONWIDE") {
                fetchAllCounties()
            }
        }

    }


    function fetchDetailCounty() {
        if ((!Boolean(loadingCountyChildren) && !Boolean(allCountyData))) {
            if ((!Boolean(loadingCountyChildren) && !Boolean(allCountyData))) {
                dispatch({
                    type: "ADD_MULTIPLE",
                    payload: true,
                    context: "loadingCountyChildren",
                });


                dispatch({
                    type: "ADD_MULTIPLE",
                    context: "progress_county",
                    payload: 0
                })

                axiosInstance.get(`/county/${party.roi}`).then(({ data }) => {
                    dispatch({
                        type: "ADD_MULTIPLE",
                        context: "progress_county",
                        payload: 0
                    })
                    dispatch({
                        type: "ADD_MULTIPLE",
                        context: "allCountyData",
                        payload: data
                    });
                    dispatch({
                        type: "ADD_MULTIPLE",
                        payload: false,
                        context: "loadingCountyChildren",
                    });
                }).catch(e => {
                    dispatch({
                        type: "ADD_MULTIPLE",
                        payload: false,
                        context: "loadingCountyChildren",
                    });
                })
            }
        }
    }

    function fetchAllCounties() {

        if ((!Boolean(loadingCountyChildren) && !Boolean(allCountyData))) {

            dispatch({
                type: "ADD_MULTIPLE",
                payload: true,
                context: "loadingCountyChildren",
            });

            dispatch({
                type: "ADD_MULTIPLE",
                context: "progress_county",
                payload: 0
            })

            axiosInstance.get(`/counties/paginated/25/0`)
                .then(({ data }) => {
                    dispatch({
                        type: "ADD_MULTIPLE",
                        context: "allCountyData",
                        payload: [...data[0]]
                    });


                    dispatch({
                        type: "ADD_MULTIPLE",
                        context: "progress_county",
                        payload: 50
                    })

                    axiosInstance.get(`/counties/paginated/25/25`)
                        .then((res) => {
                            dispatch({
                                type: "ADD_MULTIPLE",
                                context: "progress_county",
                                payload: 100
                            })
                            dispatch({
                                type: "ADD_MULTIPLE",
                                context: "allCountyData",
                                payload: data[0].concat(res.data[0])
                            });

                            dispatch({
                                type: "ADD_MULTIPLE",
                                payload: false,
                                context: "loadingCountyChildren",
                            });

                        }).catch(e => {
                            dispatch({
                                type: "ADD_MULTIPLE",
                                payload: false,
                                context: "loadingCountyChildren",
                            });
                        })

                })
                .catch((e) => {
                    dispatch({
                        type: "ADD_MULTIPLE",
                        payload: false,
                        context: "loadingCountyChildren",
                    });
                });
        }

    }

    useEffect(() => {
        updateCountyNames();
    }, []);
}