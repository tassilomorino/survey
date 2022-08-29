import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";

export default function useOfficials() {
  const {
    party,
    dispatch,
    agentsParty,
    loadingOfficials,
    officials,
    isLoggedIn,
  } = useContext(StateContext);

  useEvents();

  function updateState() {
    if (!Boolean(loadingOfficials && !Boolean(officials)) && isLoggedIn) {
      dispatch({
        type: "ADD_MULTIPLE",
        context: "loadingOfficials",
        payload: true,
      });
      axiosInstance
        .get(`/officials/${party?.id || agentsParty?.id}`)
        .then(({ data }) => {
          dispatch({
            type: "ADD_MULTIPLE",
            context: "officials",
            payload: data,
          });
          dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingOfficials",
            payload: false,
          });
        })
        .catch((e) => {
          dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingOfficials",
            payload: false,
          });
        });
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      updateState();
    }
  }, [isLoggedIn]);
}

export function useEvents() {
  const { party, dispatch, agentsParty, loadingEvents, events, isLoggedIn } =
    useContext(StateContext);

  function updateState() {
    if (!Boolean(loadingEvents && !Boolean(events)) && isLoggedIn) {
      dispatch({
        type: "ADD_MULTIPLE",
        context: "loadingEvents",
        payload: true,
      });
      axiosInstance
        .get(`/events/${party?.id || agentsParty?.id}`)
        .then(({ data }) => {
          dispatch({
            type: "ADD_MULTIPLE",
            context: "events",
            payload: data,
          });
          dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingEvents",
            payload: false,
          });
        })
        .catch((e) => {
          dispatch({
            type: "ADD_MULTIPLE",
            context: "loadingEvents",
            payload: false,
          });
        });
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      updateState();
    }
  }, [isLoggedIn]);
}
