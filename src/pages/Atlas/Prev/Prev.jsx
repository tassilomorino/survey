import React from "react";
import Button from "@mui/material/Button";
import Papa from "papaparse";
import CheckBox from "@mui/material/Checkbox";
import { StateContext } from "../../../state/State";
import axiosInstance from "../../../state/axiosInstance";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Map from "../../../components/Map";
import useAllCountyData from "../../../components/hooks/useAllCountyData";
import useAllConstData from "../../../components/hooks/useAllConstituencyData";
import useSearchQueryParams from "../../../components/hooks/useSearchQueryParams";
import useAllWardChildren from "../../../components/hooks/useAllWardData";
import useAllStationsChildren from "../../../components/hooks/useAllStationsChildren";
import { StationsMap, AtlasMap, MiniMap } from "./PrevCountyMap";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import DetailsIcon from "@mui/icons-material/Details";
import * as turf from "@turf/turf";
import LinearProgress from "@mui/material/LinearProgress";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";

import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  useParams,
  Redirect,
} from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Ctx from "./Ctx";
import { GeoJSON, Marker, Popup, useMap } from "react-leaflet";
import IconButton from "@mui/material/IconButton";

import UploadFileIcon from "@mui/icons-material/UploadFile";

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";
import usePresidentialResults from "../../../components/hooks/usePresidentialResults";
import { useContext } from "react";
import FileReader from "../../Admin/Upload";
import Stack from "@mui/material/Stack";
import { useState } from "react";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function Prev() {
  const {
    dispatch,
    allCountyData,
    allConstData,
    allWardData,
    allStationsData,
    results,
    isLoggedIn,
  } = React.useContext(StateContext);

  const valRes = results || [];

  const mapper = (val, ctx) => {
    const res = valRes.filter((v) => v[ctx] === val[ctx]);
    return { ...val, res };
  };

  const valCounties = allCountyData?.map((v) => mapper(v, "county")) || [];
  const valConsts = allConstData?.map((v) => mapper(v, "constituen")) || [];
  const valWards = allWardData?.map((v) => mapper(v, "ward")) || [];
  const valStations = allStationsData?.map((v) => mapper(v, "name")) || [];

  const { path, url } = useRouteMatch();
  const { goBack } = useHistory();

  useAllCountyData(true);
  useAllConstData();
  useAllStationsChildren();
  useAllWardChildren();
  usePresidentialResults();

  const filter = Boolean(useSearchQueryParams("filter"));

  if (!isLoggedIn && !Boolean(localStorage.getItem("access_token"))) {
    return <Redirect to={`/accounts?redirect=${window.location.pathname}`} />;
  }

  function onlyUnique(value, index, self) {
    if (value) return self.indexOf(value) === index;
    else return false;
  }

  const isUplaod = window.location.pathname.includes("upload");

  const res = results?.map((r) => r.title)?.filter(onlyUnique) || [];
  return (
    <div className="app">
      <Grid container>
        {(filter || isUplaod) && (
          <Grid item xs={3} sx={{ maxHeight: "100vh", overflow: "auto", p: 2 }}>
            <Switch>
              <Route exact path={path}>
                <AtlasHome />
              </Route>
              <Route exact path={`${path}/upload`}>
                <UploaderRes />
              </Route>
            </Switch>
          </Grid>
        )}

        <Grid xs item>
          <Map dark atlas className="AgentSignup">
            <UploadControl />
            {res?.map((r, i) => {
              const data = results
                ?.filter((re) => re.title === r)
                .map((c) => {
                  const county = allCountyData
                    ?.map((p) => p[0])
                    .filter((f) => f.county === c.county)[0];
                  return [{ ...county, res: c }];
                });
              const valid = data?.filter((d) => Boolean(d[0].id)) || [];
              return (
                <AtlasMap
                  alt={valid}
                  atlas
                  nonFilter
                  datatype="county"
                  dat={valid}
                  checked={i === 0}
                  title={r}
                ></AtlasMap>
              );
            })}
          </Map>
        </Grid>
      </Grid>
    </div>
  );
}

function AtlasHome() {
  const county = useSearchQueryParams("county");
  const res = useSearchQueryParams("res");

  const { results } = useContext(StateContext);
  const item = results?.filter(
    (f) => f.title === res && f.county === county
  )[0];
  const winner = JSON.parse(item?.winner);
  const runnerUp = JSON.parse(item?.runnerUp);

  return (
    <Box>
      <Typography sx={{ my: 2 }} variant="h6">
        {county} County
      </Typography>
      <Ctx />
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Typography variant="caption">winner</Typography>
        <Avatar src={winner?.avatar}>
          {/* <PersonIcon/> */}
          {winner?.name[0]}
        </Avatar>
        <Typography>{winner.name}</Typography>
        <Typography>{winner?.party}</Typography>
      </Box>
    </Box>
  );
}

function UploaderRes() {
  const { results, dispatch, party } = useContext(StateContext);
  const { push } = useHistory();
  const [state, setState] = useState(null);
  const [uploaded, setUploaded] = useState([]);

  const [loading, setLoading] = useState(false);
  const [errs, setErrs] = useState([]);

  const [expected, setExpected] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleChange = (v) => {
    setUploaded([]);
    setCompleted(false);
    Papa.parse(v, {
      complete: handleComplete,
      header: true,
    });
  };

  const handleComplete = (res) => {
    setState(res);
  };

  const [candidates, setCandidates] = useState(null);

  const [candidateMeta, setCandidateMeta] = useState(null);

  const uploadOptions = [
    { name: "Pres" },
    { name: "W. Rep" },
    { name: "Sen" },
    { name: "MP" },
    { name: "MCA" },
  ];

  const [formState, setFormState] = useState(false);

  const filter = (v) => {
    if (formState?.roi === "Counties") return v != ("MCA" || "MP");
    if (formState?.roi === "Constituencies") return v != "MCA";
    return v;
  };

  const types = [...uploadOptions].filter(filter);

  const handleUpload = (e) => {
    e.preventDefault();
    const items = state.data;
    setExpected(items?.length);
    setLoading(true);
    for (let item of items) {
      const name = item[Object.keys(item)[0]];
      const data = {
        name: formState.name,
        roi: formState.roi,
        candidates: candidateMeta,
        csvArr: item,
        party: party?.id,
        regVoters: item["reg_voters"],
        validVotes: item["valid_votes"],
        turnout: item["turnout"],
        type: formState?.type,
        ctx: name,
      };

      axiosInstance
        .post(`/results`, data)
        .then(({ data }) => {
          dispatch({
            type: "ADD_SINGLE",
            context: "results",
            payload: data,
          });
          const allUploaded = [...uploaded];
          allUploaded.push(data);
          setUploaded(allUploaded);
          if (uploaded?.length === expected) {
            setLoading(false);
            setCompleted(true);
          }
        })
        .catch((e) => {
          console.log(e);
          const allErrs = [...errs];
          allErrs.push(data);
          setErrs(allErrs);
        });
    }
  };

  return (
    <form onSubmit={handleUpload}>
      <Stack spacing={2}>
        <Typography variant="h6">Upload csv results</Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Ensure you fill all required fields for a successful upload
        </Alert>
        <TextField
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          required
          label="Save as"
          fullWidth
        />
        <FileReader
          disabled={!Boolean(state)}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleUpload}
        />
        {/* <SelectAgentType required label="Upload to" select one option options={["Counties", "Polling Centers", "Constituencies", "Wards"]} setFieldValue={(v) => setFormState({ ...formState, roi: v })} /> */}
        {/* <SelectAgentType required label="Upload for" select one option options={types} setFieldValue={(v) => setFormState({ ...formState, type: v.name })} /> */}
        <TextField
          fullWidth
          required
          value={formState.year}
          onChange={(e) => setFormState({ ...formState, year: e.target.value })}
          label="Year"
        />
        {Boolean(state?.data.length) && (
          <Box sx={{ mt: 2 }}>
            <SelectCandidates
              fieldNames={Object.keys(state?.data[0])}
              setFieldValue={setCandidates}
            />
          </Box>
        )}

        {Boolean(candidates?.length) && (
          <>
            <Box sx={{ py: 2, px: 4 }}>
              <Alert severity="info">
                One more step, and candidate metadata
              </Alert>
            </Box>
            {candidates?.map((c, i) => {
              return (
                <CandidateFormWidget
                  key={i}
                  index={i}
                  candidateMeta={candidateMeta}
                  setCandidateMeta={setCandidateMeta}
                  name={c}
                />
              );
            })}
          </>
        )}
        {completed && <Alert severity="info">Data upload successful</Alert>}
        {loading && (
          <Button
            startIcon={<UploadFileIcon />}
            type="button"
            color="warning"
            variant="contained"
          >
            {" "}
            Uploading...
          </Button>
        )}
        {!loading && (
          <Button
            startIcon={<UploadFileIcon />}
            disabled={!state}
            variant="contained"
            type="submit"
          >
            {" "}
            Upload now
          </Button>
        )}
      </Stack>
    </form>
  );
}

function CandidateFormWidget({ name, candidateMeta, index, setCandidateMeta }) {
  const [state, setState] = useState({
    name,
  });

  const handleChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const submitMeta = () => {
    if (
      state.name &&
      state.party &&
      state.color &&
      state.image &&
      state.partyLogo
    ) {
      const all = candidateMeta ? [...candidateMeta] : [];
      all.push(state);
      setCandidateMeta(all);
    }
  };

  return (
    <Stack spacing={2}>
      <Typography variant="h6">{name}</Typography>
      <TextField
        size="small"
        required
        onChange={handleChange}
        name="party"
        label="Party"
      />
      <TextField
        size="small"
        required
        onChange={handleChange}
        name="color"
        label="Color"
      />
      <TextField
        size="small"
        required
        onChange={handleChange}
        name="image"
        label="Avatar Url"
      />
      <TextField
        size="small"
        required
        onChange={handleChange}
        name="partyLogo"
        label="Party Logo"
      />
      <Button onClick={submitMeta}>Save</Button>
      <Divider sx={{ my: 2 }} />
    </Stack>
  );
}

function SelectCandidates({ setFieldValue, fieldNames }) {
  return (
    <Box>
      <Autocomplete
        multiple
        size="small"
        id="checkboxes-tags-demo"
        options={fieldNames}
        disableCloseOnSelect
        onChange={(e, v) => {
          setFieldValue(v);
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <CheckBox
              size="small"
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            fullWidth
            size="small"
            {...params}
            placeholder="Select candidate names"
          />
        )}
      />
    </Box>
  );
}

function UploadControl() {
  const { push } = useHistory();
  const { url } = useRouteMatch();
  return (
    <MiniMap position={"bottomright"}>
      <Button
        onClick={() => push(`${url}/upload`)}
        startIcon={<UploadFileIcon />}
      >
        Upload new
      </Button>
    </MiniMap>
  );
}

const Timer = () => {
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");

  React.useEffect(() => {
    const intervalTimer = () =>
      setInterval(() => {
        const day = new Date().getDate();
        const month = new Date().getMonth() + 1;
        const year = new Date().getFullYear();

        const hours = new Date().getHours();
        const mins = new Date().getMinutes();

        const seconds = new Date().getSeconds();

        setDate(`${day} / ${month} / ${year}`);
        setTime(`${hours}:${mins}:${seconds}`);
      }, 1000);

    intervalTimer();

    return () => {
      clearInterval(intervalTimer);
    };
  }, []);
  return (
    <div>
      <Typography>
        {date} - {time}
      </Typography>
    </div>
  );
};

const EditableMarkers = ({ coordinates, p }) => {
  const [draggable, setDraggable] = React.useState(false);

  const [state, setState] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const { stationChildren } = React.useContext(StateContext);
  const markerRef = React.useRef(null);

  const map = useMap();

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setState(marker.getLatLng());
          map.flyTo(marker.getLatLng(), map.getZoom());
        }
      },
    }),
    []
  );
  const toggleDraggable = React.useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  const handleSubmit = (e) => {
    setLoading((p) => !p);
    if (state) {
      axiosInstance
        .patch("/station", { ...state, id: p.id, long: state.lng })
        .then(({ data }) => {
          setLoading((p) => !p);
        })
        .catch((e) => {
          alert("An error occured");
          console.log(e);
          setLoading((p) => !p);
        });
    }
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Marker
        draggable={draggable}
        ref={markerRef}
        eventHandlers={eventHandlers}
        position={state || [coordinates[1], coordinates[0]]}
      >
        <Popup>
          <Box>
            <Box>
              <Typography variant="h6">{p.name} Station</Typography>
            </Box>
            <Box>
              <Alert severity="info">
                To adjust the coordinates of this polling center, enable drag
                then drag to desired location and apply changes.
              </Alert>
            </Box>
            {/* <Accordion size="small" >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography variant="caption" >Edit Coordinates</Typography>
              </AccordionSummary>
              <AccordionDetails>

                <Textfield onChange={handleChange} name="lat" value={state?.lat} size="small" label="Latitude" fullWidth variant="standard" />
                <Textfield onChange={handleChange} name="lng" size="small" value={state?.lng} label="Longitude" fullWidth variant="standard" />
              </AccordionDetails>
            </Accordion> */}
            <Box sx={{ mt: 2 }}>
              <Button type="button" onClick={toggleDraggable}>
                {draggable ? "Disable drag" : "Enable drag"}
              </Button>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Button
                    disabled={state === null}
                    type="button"
                    onClick={() => {
                      toggleDraggable();
                      setState(null);
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
                <Box>
                  <Button
                    color={loading ? "warning" : "primary"}
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading || state === null}
                  >
                    {loading ? "Saving..." : "Apply Changes"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        </Popup>
      </Marker>
    </form>
  );
};

const Loader = () => {
  const { loadingCountyChildren, loadingDetail } =
    React.useContext(StateContext);
  const loading = Boolean(loadingDetail) || Boolean(loadingCountyChildren);
  return <>{loading && <LinearProgress />}</>;
};
