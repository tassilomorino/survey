import { useContext } from "react";
import { GeoJSON, useMap } from "react-leaflet";
import { useRouteMatch, Switch, Route } from "react-router-dom";
import { StateContext } from "../../../../state/State";

import useMapBounds, {
} from "../../../../components/hooks/useMapBounds";

import useDetail from "../../../../components/hooks/useDetail";

const purpleOptions = {
  fillColor: "purple",
  lineColor: "purple",
};

export default function LogisticsMap() {
  const { detail } = useContext(StateContext);
  const data = (detail || []);
  const { path } = useRouteMatch();

  return (
    <div>
      <Switch>
        <Route exact path={path}></Route>
        <Route exact path={`${path}/:context/:name`}>
          <MapDetail />
          {detail?.length && (
            <div>
              {data?.map((d, i) => {
                return <GeoJSON key={d} pathOptions={purpleOptions} data={d} />;
              })}
            </div>
          )}
        </Route>
      </Switch>
    </div>
  );
}

const MapDetail = () => {
  useDetail();
  const { detail } = useContext(StateContext);
  const map = useMap();
  const [c, z] = useMapBounds(detail || []);
  map.setView(c, z);
  return <></>;
};
