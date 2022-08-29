import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";

export default function useRoi(name, alignment) {
    const { dispatch, party, agentParty } = useContext(StateContext);

    const isSelect = Boolean(name && alignment);

    const p = party || agentParty;

    const isCounty =
        p ? .position === "Governor" ||
        p ? .position === "Senator" ||
        p ? .position === "Women representative";

    const isConst = p ? .position === "MP";
    const isWard = p ? .position === "MCA";

    const slug = isCounty ? "county" : isConst ? "constituency" : "ward";

    const getRoi = () => {
        axiosInstance
            .get(`/${isSelect ? alignment : slug}/${isSelect ? name : p?.roi}`)
            .then(({ data }) => {
                dispatch({
                    type: "ADD_MULTIPLE",
                    payload: data,
                    context: "roi",
                });
            })
            .catch((e) => console.log(e));
    };

    useEffect(() => getRoi(), []);
}