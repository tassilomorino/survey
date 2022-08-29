import { useEffect, useContext } from "react";
import axiosInstance from "../../state/axiosInstance";
import { StateContext } from "../../state/State";
import useSearchQueryParams from "./useSearchQueryParams";
export default function useDetail() {
  const { dispatch, party, agent, agentsParty } = useContext(StateContext);

  function update() {
    axiosInstance
      .get(`/vote/${party?.id}`)
      .then(({ data }) => {
        console.log(data);
        dispatch({
          type: "ADD_MULTIPLE",
          context: "votes",
          payload: data,
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }

  useEffect(() => {
    if (party) {
      update();
    }
  }, [party, agent, agentsParty]);
}
