import useAllCountyData from "../../../components/hooks/useAllCountyData";
import useSearchParams from "../../../components/hooks/useSearchQueryParams";
import { StateContext } from "../../../state/State";
import React, { useContext, PureComponent, useState, useRef } from "react";
import {
  GeoJSON,
  useMap,
  FeatureGroup,
  LayersControl,
  Marker,
  Popup,
  CircleMarker,
} from "react-leaflet";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import L, { divIcon } from "leaflet";
import Button from "@mui/material/Button";
import { renderToStaticMarkup } from "react-dom/server";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useFilters } from "../../elections/Operations/Operations";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import Avatar from "@mui/material/Avatar";

import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import useSearchQueryParams from "../../../components/hooks/useSearchQueryParams";

export default function PrevCountyMap({ ctx, onClickFeature, Icon }) {
  const { allCountyData } = useContext(StateContext);

  const { push } = useHistory();

  const map = useMap();

  return (
    <div>
      <LayersControl.Overlay checked name="Population heatmap">
        <FeatureGroup pathOptions={{ color: "purple" }}>
          {Boolean(allCountyData?.length) && (
            <React.Fragment>
              {(allCountyData || [])?.map((p, i) => {
                const handleClick = (feature, layer) => {
                  layer.on({
                    click: () => {
                      if (!Boolean(ctx)) {
                        push(`/atlas/counties/${p.county}`);
                      } else {
                        onClickFeature(feature, layer, map);
                      }
                    },
                  });
                };
                return (
                  <div key={i}>
                    <GeoJSON
                      pathOptions={{
                        fillColor: p.color,
                        lineColor: p.color,
                      }}
                      key={p.id}
                      data={p}
                      onEachFeature={handleClick}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          )}
        </FeatureGroup>
      </LayersControl.Overlay>
    </div>
  );
}

export function useIsNotNationWide() {
  const { party, agentsParty } = useContext(StateContext);
  return (
    (party?.isParty && party.operations != "NATIONWIDE" && party?.roi) ||
    (agentsParty?.operations != "NATIONAL" &&
      agentsParty?.roi &&
      agentsParty?.isParty)
  );
}

export function DenseMap({
  checked,
  noneColor,
  Mini,
  MiniBottomRight,
  isSetup,
}) {
  const map = useMap();

  const { allCountyData, dispatch, party, agentsParty } =
    useContext(StateContext);

  const [state, setState] = useState({
    name: "Counties",
    desc: "",
  });

  const token = useSearchQueryParams("token");

  useAllCountyData();

  const geojson = useRef();

  function infoUpdate(properties) {
    setState({
      name: properties.name,
      desc: properties.density,
    });
  }

  const { url } = useRouteMatch();
  const { push } = useHistory();

  function zoomToFeature(e) {
    if (isSetup) {
      push(
        `${url}?token=${token}&filter=true&county=${e.target.feature.properties.name}`
      );
    } else {
      push(`${url}?filter=true&county=${e.target.feature.properties.name}`);
    }
    map.fitBounds(e.target.getBounds());
  }

  function zoomToLoad(e) {
    push(`${url}?filter=true&county=${e.target.feature.properties.name}`);
    map.fitBounds(e.target.getBounds());
  }

  function resetHighlight(e) {
    setState({
      name: "Counties",
      desc: "",
    });
    dispatch({
      type: "ADD_MULTIPLE",
      context: "active",
      payload: false,
    });
    geojson.current.resetStyle(e.target);
  }

  function highlightFeature(e, feature) {
    var layer = e.target;

    dispatch({
      type: "ADD_MULTIPLE",
      context: "active",
      payload: {
        name: `${feature.county} county`,
      },
    });

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    infoUpdate(layer.feature.properties);
  }

  function getColor(d) {
    if (noneColor) return "#FFBF81";
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }

  function style(feature) {
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  const notNational = useIsNotNationWide();

  const data = allCountyData || [];

  if (notNational && geojson?.current) {
    map.fitBounds(geojson?.current?.getBounds());
  }

  return (
    <LayersControl.Overlay checked={checked} name="Counties">
      <FeatureGroup>
        <div>
          {Boolean(allCountyData?.length) && (
            <React.Fragment>
              {(allCountyData || [])?.map((p, i) => {
                const handleClick = (feature, layer) => {
                  layer.on({
                    mouseover: (e) => highlightFeature(e, feature),
                    mouseout: resetHighlight,
                    click: zoomToFeature,
                  });
                };

                return (
                  <div key={i}>
                    <GeoJSON
                      ref={geojson}
                      style={style}
                      key={p.id}
                      data={p}
                      onEachFeature={handleClick}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          )}
          {Mini && (
            <MiniMap state={state} position="bottomleft">
              <Mini state={state} />
            </MiniMap>
          )}
          {Boolean(MiniBottomRight) && (
            <MiniMap state={state} position="bottomright">
              <MiniBottomRight state={state} />
            </MiniMap>
          )}
        </div>
      </FeatureGroup>
    </LayersControl.Overlay>
  );
}

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};
export function MiniMap({ position, state, children, title }) {
  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright;
  return (
    <div className={positionClass}>
      <Paper className="leaflet-control leaflet-bar">
        <div className="info">{children}</div>
      </Paper>
    </div>
  );
}

export function AtlasMap({
  dat,
  title,
  checked,
  color,
  datatype,
  nonFilter,
  noneColor,
  MiniBottomRight,
  isSetup,
  atlas,
  portal,
  votes,
}) {
  const map = useMap();

  const { url } = useRouteMatch();

  const [state, setState] = useState({
    name: "KE County Results",
    desc: "2017 Presidential results",
  });

  const geojson = useRef();

  const { dispatch, party } = useContext(StateContext);

  const [properties, setProperties] = useState(null);

  const winner = properties?.res?.winner;

  function infoUpdate(properties) {
    setProperties(properties);
    setState({
      name: properties.name,
      desc: properties.density,
    });
  }

  const filter = Boolean(useSearchParams("filter"));
  const county = useSearchParams("county");
  const ref = useSearchParams("ref");
  const role = useSearchParams("role");
  const constituency = useSearchParams("constituency");

  const token = useSearchParams("token");

  const ward = useSearchParams("ward");

  const { push } = useHistory();

  const { getFilterUrl, getRest } = useFilters();

  function zoomToFeature(e, feature) {
    const slug = getFilterUrl();
    const rest = getRest(datatype, feature);
    const uri = `${url}${slug}${rest}${
      isSetup ? `&token=${token}` : portal ? `&ref=${ref}&role=${role}` : ""
    }`;
    map.fitBounds(e.target.getBounds());
    push(uri);
  }

  function resetHighlight(e) {
    setProperties(null);
    dispatch({
      type: "ADD_MULTIPLE",
      context: "active",
      payload: null,
    });
    setState({
      name: "KE County Results",
      desc: "2017 Presidential results",
    });
    geojson.current.resetStyle(e.target);
  }

  function highlightFeature(e, feature) {
    var layer = e.target;
    const name =
      datatype === "county"
        ? feature.county
        : datatype === "constituency"
        ? feature.const
        : feature.ward;
    dispatch({
      type: "ADD_MULTIPLE",
      context: "active",
      payload: {
        name: `${name} ${datatype}`,
      },
    });

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    infoUpdate(layer.feature.properties);
  }

  const { context } = useParams();

  function getColor() {
    if (noneColor) return party?.primaryColor || "#FFBF81";
  }

  function style(feature) {
    // const data = (alt?.filter(r=>r.id === feature.id))[0]
    const color = "#fff";
    const getAtlasColor = () => {
      const col = JSON.parse(feature?.res?.winner)?.color;
      const winner = JSON.parse(feature?.res?.winner);
      return col || party.primaryColor;
    };
    return {
      fillColor: atlas
        ? getAtlasColor()
        : noneColor || (votes && feature.candidates.length)
        ? getColor()
        : color || "#FFEDA0",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  const d = dat?.filter((fData) => {
    if (nonFilter) {
      return fData;
    } else {
      if (filter && Boolean(county)) {
        return fData.county === county;
      } else return fData;
    }
  });

  return (
    <LayersControl.Overlay checked={checked} name={title}>
      <FeatureGroup pathOptions={{ color: color || "red" }}>
        <div>
          {Boolean(d?.length) && (
            <React.Fragment>
              {(d || [])?.map((p, i) => {
                const handleClick = (feature, layer) => {
                  layer.on({
                    mouseover: (e) => highlightFeature(e, feature),
                    mouseout: resetHighlight,
                    click: (e) => zoomToFeature(e, feature),
                  });
                };
                const isPaginated = datatype === "county";
                return (
                  <div key={isPaginated ? p[0].id : p.id}>
                    <GeoJSON
                      ref={geojson}
                      style={style}
                      key={isPaginated ? p[0].id : p.id}
                      data={isPaginated ? p[0] : p}
                      onEachFeature={handleClick}
                    />
                  </div>
                );
              })}
            </React.Fragment>
          )}
          {url.includes("atlas") && (
            <MiniMap state={state} position="bottomleft">
              <Typography variant="caption">Hover on map</Typography>
            </MiniMap>
          )}
          {Boolean(MiniBottomRight) && (
            <MiniMap state={state} position="bottomright">
              <MiniBottomRight state={state} />
            </MiniMap>
          )}
          {Boolean(properties) && <Graph res={properties?.res || null} />}
        </div>
      </FeatureGroup>
    </LayersControl.Overlay>
  );
}

function Graph({ res }) {
  function choseBig(myArray) {
    return myArray.sort((a, b) => b.votes - a.votes).slice(0, 3);
  }

  return (
    <>
      <MiniMap position={"bottomright"}></MiniMap>
    </>
  );
}

export function PeopleMap({ title, dat, checked, Icons, Icon }) {
  const map = useMap();

  const { allCountyData } = useContext(StateContext);

  const [state, setState] = useState({
    name: "KE County Results",
    desc: "2017 Presidential results",
  });

  const geojson = useRef();

  const data = allCountyData || [];

  const [properties, setProperties] = useState(null);

  const winner = properties?.res?.winner;

  function infoUpdate(properties) {
    setProperties(properties);
    setState({
      name: properties.name,
      desc: properties.density,
    });
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function resetHighlight(e) {
    setProperties(null);
    setState({
      name: "KE County Results",
      desc: "2017 Presidential results",
    });
    geojson.current.resetStyle(e.target);
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    infoUpdate(layer.feature.properties);
  }

  function getColor(d) {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }

  function style(feature) {
    return {
      fillColor: feature.properties.res?.winner?.color || "#FFEDA0",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  const { context } = useParams();

  const isMembers = context === "Members" && title === "Members";
  const isOfficials = context === "Officials" && title === "Officials";

  const getIcon = (role) => {
    const iconMarkup = renderToStaticMarkup(<>{Icons[role]}</>);
    return divIcon({
      html: iconMarkup,
    });
  };

  const {
    isStation,
    isWard,
    isConst,
    isCounty,
    county,
    constituency,
    ward,
    station,
    filter,
    getFilterUrl,
  } = useFilters();

  const dir = (dat || []).filter((f) => {
    if (!filter || !county) {
      if (context) {
        return f.role === context;
      }
      return f;
    } else {
      if (context) {
        if (isStation) return f.station === station && f.role === context;
        if (isWard) return f.ward === ward && f.role === context;
        if (isConst)
          return f.constituency === constituency && f.role === context;
        if (isCounty) return f.county === county && f.role === context;
      } else {
        if (isStation) return f.station === station;
        if (isWard) return f.ward === ward;
        if (isConst) return f.constituency === constituency;
        if (isCounty) return f.county === county;
      }
    }
    return f;
  });

  const getPosition = (p) => [p.geom.coordinates[1], p.geom.coordinates[0]];

  return (
    <LayersControl.Overlay checked name={title}>
      <FeatureGroup>
        {Boolean(dir?.length) && (
          <React.Fragment>
            {dir?.map((p, i) => {
              const handleClick = (feature, layer) => {
                layer.on({
                  // mouseover: highlightFeature,
                  // mouseout: resetHighlight,
                  // click: zoomToFeature
                });
              };
              return (
                <div key={i}>
                  {p?.geom && (
                    <Marker
                      ref={geojson}
                      key={p}
                      position={getPosition(p)}
                      icon={getIcon(p.role)}
                    >
                      <Popup>
                        <Box>
                          <Avatar src={p?.avatar}></Avatar>
                          <Typography>
                            {p?.firstname} {p?.lastname}
                          </Typography>
                        </Box>
                      </Popup>
                    </Marker>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        )}
      </FeatureGroup>
    </LayersControl.Overlay>
  );
}

export function StationsMap({ title, dat, checked, Icon }) {
  const map = useMap();

  const { allCountyData } = useContext(StateContext);

  const [state, setState] = useState({
    name: "KE County Results",
    desc: "2017 Presidential results",
  });

  const geojson = useRef();

  const data = allCountyData || [];

  const [properties, setProperties] = useState(null);

  const winner = properties?.res?.winner;

  function infoUpdate(properties) {
    setProperties(properties);
    setState({
      name: properties.name,
      desc: properties.density,
    });
  }

  function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
  }

  function resetHighlight(e) {
    setProperties(null);
    setState({
      name: "KE County Results",
      desc: "2017 Presidential results",
    });
    geojson.current.resetStyle(e.target);
  }

  function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
      weight: 5,
      color: "#666",
      dashArray: "",
      fillOpacity: 0.7,
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }

    infoUpdate(layer.feature.properties);
  }

  function getColor(d) {
    return d > 1000
      ? "#800026"
      : d > 500
      ? "#BD0026"
      : d > 200
      ? "#E31A1C"
      : d > 100
      ? "#FC4E2A"
      : d > 50
      ? "#FD8D3C"
      : d > 20
      ? "#FEB24C"
      : d > 10
      ? "#FED976"
      : "#FFEDA0";
  }

  function style(feature) {
    return {
      fillColor: feature.properties.res?.winner?.color || "#FFEDA0",
      weight: 2,
      opacity: 1,
      color: "white",
      dashArray: "3",
      fillOpacity: 0.7,
    };
  }

  const { context } = useParams();

  const isMembers = context === "Members" && title === "Members";
  const isOfficials = context === "Officials" && title === "Officials";

  const iconMarkup = renderToStaticMarkup(<>{Icon}</>);
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  const filter = Boolean(useSearchParams("filter"));
  const county = useSearchParams("county");
  const constituency = useSearchParams("constituency");
  const ward = useSearchParams("ward");

  const d = dat || [];

  const dir = d.filter((fData) => {
    if (filter && Boolean(county) && Boolean(constituency) && Boolean(ward)) {
      return fData.ward === ward.toUpperCase();
    } else if (filter && Boolean(county) && Boolean(constituency)) {
      return fData.constituen === constituency.toUpperCase();
    } else if (filter && Boolean(county)) {
      return fData.county === county.toUpperCase();
    } else return fData;
  });

  const getPosition = (p) => [p.geom.coordinates[1], p.geom.coordinates[0]];

  return (
    <LayersControl.Overlay
      checked={isMembers || isOfficials || checked}
      name={title}
    >
      <FeatureGroup>
        {Boolean(dir?.length) && (
          <React.Fragment>
            {dir?.map((p, i) => {
              const handleClick = (feature, layer) => {
                layer.on({
                  // mouseover: highlightFeature,
                  // mouseout: resetHighlight,
                  // click: zoomToFeature
                });
              };
              return (
                <div>
                  {p?.geom && (
                    <CircleMarker
                      ref={geojson}
                      key={p}
                      radius={9}
                      center={getPosition(p)}
                    >
                      <Popup>
                        <Box>
                          <Typography variant="h6">
                            {p?.name} Polling Center
                          </Typography>
                          <Typography>
                            {p?.county} county {">"} {p?.ward} ward
                          </Typography>
                          <Button>View more</Button>
                          <Button>Adjust location</Button>
                        </Box>
                      </Popup>
                    </CircleMarker>
                  )}
                </div>
              );
            })}
          </React.Fragment>
        )}
      </FeatureGroup>
    </LayersControl.Overlay>
  );
}
