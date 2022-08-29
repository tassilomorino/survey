import { useParams } from "react-router-dom";
import axiosInstance from "../../state/axiosInstance";
import { useEffect, useContext } from "react";
import { StateContext } from "../../state/State";
export default function useParty() {
  const { id } = useParams();

  const { dispatch } = useContext(StateContext);

  const update = () => {
    dispatch({
      type: "ADD_MULTIPLE",
      context: "loadingAgentParty",
      payload: true,
    });
    axiosInstance
      .get(`/party/${id}`)
      .then(({ data }) => {
        dispatch({
          type: "ADD_MULTIPLE",
          context: "loadingAgentParty",
          payload: false,
        });
        dispatch({
          type: "ADD_MULTIPLE",
          context: "agentParty",
          payload: data,
        });
      })
      .catch((e) => {
        dispatch({
          type: "ADD_MULTIPLE",
          context: "loadingAgentParty",
          payload: false,
        });
        alert("An error occured");
      });
  };

  useEffect(() => update(), [id]);
  useEffect(() => update(), []);
}
