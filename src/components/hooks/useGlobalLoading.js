import { StateContext } from "../../state/State";
import { useContext } from "react";

export default function useGlobalLoading() {
  const {
    loadingConstituencyNames,
    loadingCountyNames,
    loadingWardName,
    loadingStations,
    loadingSationWardNames,
  } = useContext(StateContext);
  const loading =
    loadingConstituencyNames ||
    loadingCountyNames ||
    loadingWardName ||
    loadingStations ||
    loadingSationWardNames;
  return loading;
}
