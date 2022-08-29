import { useContext, useEffect } from "react";
import axiosInstance from "../../state/axiosInstance";
import { StateContext } from "../../state/State";

export default function useStationWards() {
  const { dispatch, publicRoiWards } =
    useContext(StateContext);

  function update() {
    for (var i = 0; i < publicRoiWards?.length; i++) {
      axiosInstance
        .get(`/station-byward/${publicRoiWards[i]?.ward?.toUpperCase()}`)
        .then(({ data }) => {
          dispatch({
            type: "ADD_SINGLE",
            payload: data,
            context: "publicStationsData",
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }

  useEffect(() => {
    update();
  }, [publicRoiWards]);
}
