import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PeoplesIcons } from "../../pages/elections/AtlasAdminSidebar";
import PrevCountyMap, { AtlasMap, DenseMap, StationsMap } from "../../pages/Atlas/Prev/PrevCountyMap";
import DetailMap from "../../pages/elections/Operations/DetailMap";
import { Switch, Route, useHistory, useRouteMatch, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add"
import ArrowBackIos from "@mui/icons-material/ArrowBackIos"
import Box from "@mui/material/Box"
import Alert from "@mui/material/Alert"
import Map from "../../components/Map";
import logo from "../../assets/logo.png"
import { StateContext } from "../../state/State";
import React, { useState, useContext } from "react";
import { Marker, Popup, useMap } from "react-leaflet"
import LocationPicker from "../../pages/public/LocationPicker"
import { PublicLocationMarker } from "../../pages/public/LocationPicker";

import MuiSwitch from "@mui/material/Switch"
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from "@mui/material/Paper"

import * as turf from "@turf/turf"
import Slider from '@mui/material/Slider';
import axiosInstance from "../../state/axiosInstance";
import useSearchQueryParams from "../hooks/useSearchQueryParams";
// import useAllCons

const marks = [
  {
    value: 10,
    label: '10 KM',
  },
  {
    value: 10,
    label: '10 KM',
  },
  {
    value: 30,
    label: '30 KM',
  },
  {
    value: 50,
    label: '50 KM',
  },
];

function valuetext(value) {
  return `${value} KM`;
}






export default function Editor() {
  const { path } = useRouteMatch();
  const { push } = useHistory();

  const {
    dispatch, allWardData,
    party, useCurrentLocation,
    allConstData, publicLocation,
    allCountyData, allStationsData
   } = useContext(StateContext);



  const filter = Boolean(useSearchQueryParams("filter"))

  return (
    <div style={{ backgroundColor: "#297373" }} >
      <Grid container>
        <Grid item pt={3} xs={4} style={{ height: "100vh", overflow: "auto" }} >
          <Switch>
            <Route path={path}>
              <EditorHome />
            </Route>

          </Switch>
        </Grid>
        <Grid item xs >
          <Grid container >

            <Grid item xs >
              <Map className="AgentSignup">
                <Switch>
                  <Route exact path={`${path}`}>
                    {filter && (
                      <DetailMap checked={(filter)} />
                    )}
                    {(party?.operations != "NATIONWIDE") ? (
                      // <RoiMap checked={!filter} />
                      <></>
                    ) : (
                      <DenseMap checked={!filter}  noneColor datatype="county"  ctx />
                    )}
                    <AtlasMap checked={filter} color="#42113C" title="Constituencies" datatype="constituency" dat={allConstData} />
                    <AtlasMap nonFilter title="County" datatype="county" dat={allCountyData} />

                    {(filter) && (
                      <>
                        <AtlasMap color="#D63AF9" title="Wards" dat={allWardData} datatype="ward" />
                        <StationsMap Icon={PeoplesIcons[1]} dat={allStationsData} title="Polling Centers" />
                      </>
                    )}
                  </Route>
                  <Route exact path={`${path}/new`}>
                    {filter && (
                      <DetailMap checked />
                    )}
                    <DenseMap isSetup noneColor Mini={MiniMap} checked={!Boolean(filter)} title="Counties" />
                    {Boolean(filter) && (
                      <AtlasMap isSetup datatype="constituency" noneColor Mini={MiniMap} checked title="Constituencies" dat={allConstData} />
                    )}

                    {Boolean(filter) && (
                      <AtlasMap isSetup datatype="ward" noneColor Mini={MiniMap} title="Wards" dat={allWardData} />
                    )}
                    {useCurrentLocation && (
                      <LocationPicker />
                    )}
                    {(!useCurrentLocation && Boolean(publicLocation?.lat && publicLocation?.lng)) && (
                      <PublicLocationMarker />
                    )}
                    <DetailMap />
                  </Route>
                </Switch>
              </Map>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}


function DetailMidpointMap() {
  const { detail, dispatch } = useContext(StateContext)

  const detailCoord = (detail || []);

  const detailMp =
    detailCoord.map((t) => ({
      ...t,
      coordinates: turf.centroid(t).geometry.coordinates
    })) || [];


  const markerRef = React.useRef(null);

  const map = useMap()


  const [state, setState] = React.useState(null)

  const eventHandlers = React.useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setState(marker.getLatLng());
          dispatch({
            type: "ADD_MULTIPLE",
            payload: marker.getLatLng(),
            context: "publicLocation"
          })
          map.flyTo(marker.getLatLng(), map.getZoom());
        }
      },
    }),
    []
  );


  return (
    <div>
      {detailMp.map((data, i) => {
        const coord = data.coordinates;
        const formatted = [coord[1], coord[0]];
        return (
          <Marker
            draggable
            ref={markerRef}
            eventHandlers={eventHandlers}
            key={data.id}
            position={state || formatted}
          >
            <Popup>
              <Box>
                Drag and drop marker in approximated location
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </div>
  )
}




function ShowAllBtn() {

  const { context } = useParams()

  const { wardChildren, stationChildren, dispatch, focusedWards } = useContext(StateContext)

  const handleClick = () => {
    if (context === "counties") {
      if (focusedWards?.length) {
        dispatch({
          type: "ADD_MULTIPLE",
          context: "focusedWards",
          payload: []
        })
      } else
        dispatch({
          type: "ADD_MULTIPLE",
          context: "focusedWards",
          payload: wardChildren?.map(({ ward }) => ward)
        })
    }
  }

  const handleAllStations = () => {

  }

  return (
    <Paper>
      <Box sx={{ textAlign: "center", my: 2 }} >
        <Typography variant="h6"  >
          {context === "counties" ? wardChildren?.length : stationChildren?.length} {context === "counties" ? "Wards" : "Polling Centers"}
        </Typography>
        {context === "counties" && (
          <Button onClick={handleClick} variant="contained" size="small" sx={{ textTransform: "none" }}  >{Boolean(focusedWards?.length) ? "Hide" : "Show"} All </Button>
        )}
        {context === "wards" && (
          <Button onClick={handleAllStations} variant="contained" size="small" sx={{ textTransform: "none" }}  >{Boolean(focusedWards?.length) ? "Hide" : "Show"} All </Button>
        )}
      </Box>
    </Paper>
  )
}

const MiniMap = () => {
  const { wardChildren, stationChildren, dispatch, focusedWards } = useContext(StateContext)
  const { context } = useParams()
  const { push } = useHistory()

  const { url } = useRouteMatch()

  const isFocucusedWard = (ward) => focusedWards?.includes(ward)


  return (
    <div>
      {Boolean(wardChildren?.length && url.includes("counties")) && (
        <Box sx={{ my: 3, bgcolor: "background.paper", p: 2, }} >
          {/* <ShowAllBtn /> */}
        </Box>
      )}
      {Boolean(wardChildren?.length && url.includes("counties")) && (
        <Stack style={{ height: "63vh", overflow: "auto", p: 2, pr: 4 }} spacing={2} >
          {wardChildren?.map((f, i) => {
            const handleClick = (ward) => {
              push(`/editor/wards/${ward}`)
            }
            const handleFeatureClick = (e) => {
              e.stopPropagation()
              push(`/editor/wards/${f.ward}/new-center`)

            }

            const handleNewClick = (e) => {
              e.stopPropagation()
              push(`/editor/wards/${f.ward}/new-feature`)
            }


            return (
              <Box onClick={() => handleClick(f.ward)} sx={{ bgcolor: "background.paper", cursor: "pointer" }} elevation={0} key={i} >
                <Box sx={{ bgcolor: f.color, p: 1 }}>
                  <Typography sx={{ fontWeight: "bold" }}  >{f.ward}</Typography>
                </Box>
                <Box sx={{ p: 1 }} >
                  <Button size="small" onClick={handleFeatureClick}   >Add Polling Center</Button>
                  <Button size="small" onClick={handleNewClick} >Add Feature</Button>
                  {/* <Button size="small" onClick={handleShow} sx={{ bgcolor: f.color }} variant="contained" > {isFocucusedWard(f.ward) ? "Hide" : "Show"}</Button> */}
                </Box>
              </Box>
            )
          })}
        </Stack>
      )}
      {Boolean(stationChildren && context === "wards") && (
        <Box sx={{ bgcolor: "background.paper", p: 2, mb: 3 }} >
          <ShowAllBtn />
        </Box>
      )}
      {Boolean(stationChildren && context === "wards") && (
        <Stack spacing={2} sx={{ height: "63vh", overflow: "auto" }} >
          {stationChildren?.map((f, i) => {
            const { coordinates } = f.geom
            return (
              <Box sx={{ bgcolor: "background.paper" }} elevation={0} key={i} >
                <Box sx={{ p: 2 }} >
                  <Typography>{f.name}</Typography>
                  <Typography variant="caption">Current:  {coordinates[1]}, {coordinates[0]}</Typography>
                  <CoordinatesForm />
                </Box>
              </Box>
            )
          })}
        </Stack>
      )}
    </div>
  )
}


function CoordinatesForm() {


  return (
    <Box>
      <form>
        <Stack spacing={1} >
          <TextField size="small" />
          <TextField size="small" />
          <Button>Save</Button>
        </Stack>
      </form>
    </Box>
  )
}

const EditorHomeAltert = () => {
  return (
    <Box sx={{ p: 2, mt: 10 }}  >
      <Alert severity="info"  >
        Select  County on the map, then  <span style={{ fontWeight: "bold" }} > show wards </span>
      </Alert>
    </Box>
  )
}

const EditorHome = () => {
  const { push, goBack } = useHistory()

  const { path } = useRouteMatch()
  return (
    <div>
      <Button startIcon={<ArrowBackIos />} onClick={goBack} sx={{ color: "white" }}  > Back</Button>
      <Box sx={{ textAlign: "center", mt: 3 }}  >
        <img style={{ height: 63 }} src={logo} alt="Kura ke logo" />
      </Box>
      <Switch>
        <Route exact path={path} >
          <EditorHomeAltert />
        </Route>
        <Route exact path={`${path}/counties/:name`} >
          <Box sx={{ p: 2, mt: 10 }}  >
            <Alert severity="info"  >
              Select  Ward on the map, then  <span style={{ fontWeight: "bold" }} > show stations </span>
            </Alert>
          </Box>
          <Box sx={{ mt: 3, p: 1 }}  >
            <Button onClick={() => push(`/editor/near-me`)} variant="contained" fullWidth >
              View Polling Centers near me
            </Button>
          </Box>
        </Route>
        <Route exact path={`${path}/wards/:name`} >
          <Btns />
          <Box sx={{ p: 2, mt: 1 }}  >
            <Alert severity="info"  >
              Select Station on the map to edit.
              <br />
              Add Polling Centers and Features. Features can be social halls, Public Schools, Market Places, Stadiums that are ideal for political activities.
            </Alert>
          </Box>
        </Route>
        <Route exact path={`${path}/:context/:name/new-center`} >
          <EditorForm />
        </Route>
        <Route exact path={`${path}/:context/:name/new-feature`} >
          <EditorForm />
        </Route>
        <Route exact path={`${path}/:context/:name/:id`} >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente autem aut praesentium exercitationem, libero aliquam et natus blanditiis cum quaerat in beatae laborum? Necessitatibus reiciendis sunt aliquam ratione quasi incidunt!
        </Route>
      </Switch>
    </div>
  );
};

const Btns = () => {
  const { push } = useHistory()
  const { url } = useRouteMatch()
  return (
    <Box sx={{ mt: 8, px: 2 }} >
      <Button onClick={() => push(`${url}/new-center`)} variant="contained" sx={{ textTransform: "none", mr: 1 }} size="small" color="success"  >Add Polling Center</Button>
      <Button onClick={() => push(`${url}/new-feature`)} variant="contained" sx={{ textTransform: "none", }} size="small" color="secondary" >Add Feature</Button>
    </Box>
  )
}

function StationsNearMeWidget() {
  const { push, goBack } = useHistory()
  return (
    <Box sx={{ p: 2, pt: 1 }}  >
      <Button startIcon={<ArrowBackIos />} onClick={goBack} sx={{ color: "white" }}  >Back</Button>
      <Box sx={{ textAlign: "center", mt: 1, mb: 3 }}  >
        <img style={{ height: 63 }} src={logo} alt="Kura ke logo" />
      </Box>
      <Alert severity="info"  >
        Select radius with the slider below, find missing polling centers, add and edit polling centers
      </Alert>
      <Box>
        <Button onClick={() => push(`/editor/new`)} sx={{ mt: 3 }} fullWidth startIcon={<AddIcon />} color="success" variant="contained"  >
          Create New Polling center
        </Button>
        <Button onClick={() => push(`/editor/new/feature`)} sx={{ mt: 3 }} fullWidth startIcon={<AddIcon />} color="warning" variant="contained"   >
          Add Features, i.e Social halls, Market Places, CBO Offices
        </Button>
      </Box>
      <Box>
        <DiscreteSlider />
        {/* <Lottie options={defaultOptions}
          height={400}
          width={400}
          // isPaused={this.state.isPaused} 
          /> */}

      </Box>
    </Box>
  )
}


function DiscreteSlider() {
  const [value, setValue] = useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div >
      <Box sx={{ mt: 6 }}  >
        <Slider
          defaultValue={1}
          getAriaValueText={valuetext}
          aria-labelledby="discrete-slider-always"
          step={5}
          marks={marks}
          valueLabelDisplay="on"
          value={value} onChange={handleChange}
        />
        <Button fullWidth sx={{ mt: 2 }} variant="contained" >Search Polling Centers</Button>
      </Box>
    </div>
  );
}

const EditorForm = () => {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false)
  const { useCurrentLocation, detail, dispatch, publicLocation } = useContext(StateContext)

  const { push, goBack } = useHistory()


  const { context, name } = useParams()

  const handleToggleCurrentLocation = (e) => {
    if (e.target.checked) {
      dispatch({
        type: "ADD_MULTIPLE",
        context: "useCurrentLocation",
        payload: true
      })
    } else {
      dispatch({
        type: "ADD_MULTIPLE",
        context: "useCurrentLocation",
        payload: false
      })
    }
  }

  const handleChange = (e) => {
    setState({
      ...state,
      [e.tatget.name]: e.target.value
    });
    if (state?.lat && state?.lng) {
      dispatch({
        type: "ADD_MUILTIPLE",
        payload: { ...state },
        context: "publicLocation"
      })
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true)
    const d = detail[0]
    const data = {
      ...state,
      lat: publicLocation?.lat,
      long: publicLocation?.lng,
      county: d.county,
      ward: d.ward,
      name: state.name.toUpperCase(),
      constituen: d.const
    }
    axiosInstance.post("/station", data).then(({ data }) => {
      setLoading(false)
      dispatch({
        type: "ADD_SINGLE",
        context: "stationChildren",
        payload: data
      })
      push(`/editor/${context}/${name}/${data?.id}`)
    }).catch(e => {
      setLoading(false)
    })
  };


  return (
    <Box sx={{ p: 2, bgcolor: "background.paper", mt: 5 }} >
      <form onSubmit={handleSubmit}>
        <Stack spacing={2} sx={{ mt: 6 }} >
          <TextField
            name="name"
            onChange={handleChange}
            fullWidth
            variant="standard"
            size="small"
            label="Polling station name"
          />
          <FormGroup>
            <FormControlLabel control={<MuiSwitch onChange={handleToggleCurrentLocation} checked={useCurrentLocation} />} label="Use my current location" />
          </FormGroup>

          {Boolean(useCurrentLocation) && (
            <Box>
              <Alert severity="info" >
                Pick location on map. Tap on the map to enable location info
              </Alert>
            </Box>
          )}

          {!Boolean(useCurrentLocation) && (
            <Box >
              <Alert severity="info"  >
                Manually add coordinates
              </Alert>
              <Stack spacing={2} >
                <TextField
                  name="lat"
                  onChange={handleChange}
                  fullWidth
                  required
                  variant="standard"
                  size="small"
                  label="Latitude"
                />
                <TextField
                  required
                  name="lng"
                  onChange={handleChange}
                  fullWidth
                  variant="standard"
                  size="small"
                  label="Longitude"
                />
              </Stack>
            </Box>
          )}
          <Button disabled={loading || !Boolean(publicLocation)}  >{loading ? "Saving..." : "Save"}</Button>
        </Stack>
      </form>
    </Box>
  );
};

