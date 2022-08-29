import Map from "../../../components/Map";
import Grid from "@mui/material/Grid";
import Papa from "papaparse";
import { useTheme } from "@mui/material/styles";
import TwitterIcon from "@mui/icons-material/Twitter";
import Tweet from "./Tweets";
import SurveyPro from "./Surveys";
import { CSVLink } from "react-csv";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import MuiAlert from "@mui/material/Alert";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import QRCode from "react-qr-code";
import StaticDateRangePicker from "@mui/lab/StaticDateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import MarkAsUnreadIcon from "@mui/icons-material/MarkAsUnread";
import BigEvents from "./Events";
import FileReader from "../../Admin/Upload";
import React, { useState, useContext, forwardRef } from "react";
import { StateContext } from "../../../state/State";
import logo from "../../../assets/logo.png";
import axiosInstance from "../../../state/axiosInstance";
import { Marker, useMap } from "react-leaflet";
import {
  useRouteMatch,
  Switch,
  Route,
  useHistory,
  useParams,
  useLocation,
  Redirect,
} from "react-router-dom";
import Context from "./CTX";
import Fab from "@mui/material/Fab";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import useSocket from "../../../components/hooks/useSocket";
import useSurvey from "../../../components/hooks/useSurvey";
import useOfficials from "../../../components/hooks/useOfficials";
import useDetail from "../../../components/hooks/useDetail";
import useToggleSuccessToast from "../../../components/hooks/useToggleSuccessToast";
import useAllCountyData from "../../../components/hooks/useAllCountyData";
import useAllConstituencyData from "../../../components/hooks/useAllConstituencyData";
import useAllWardChildren from "../../../components/hooks/useAllWardData";
import useAllStationsChildren from "../../../components/hooks/useAllStationsChildren";
import useResources from "../../../components/hooks/useResources";
import useSearchQueryParams from "../../../components/hooks/useSearchQueryParams";
import { PeoplesIcons } from "../AtlasAdminSidebar";
import Typography from "@mui/material/Typography";
import {
  DenseMap,
  AtlasMap,
  PeopleMap,
  StationsMap,
  MiniMap,
} from "../../Atlas/Prev/PrevCountyMap";
import ToolTip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import SendSharpIcon from "@mui/icons-material/SendSharp";
import { styled } from "@mui/material/styles";
import Calendar from "react-calendar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import EventIcon from "@mui/icons-material/Event";
import Link from "@mui/material/Link";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import "react-calendar/dist/Calendar.css";
import LinearProgress from "@mui/material/LinearProgress";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import ImageIcon from "@mui/icons-material/Image";
import Checkbox from "@mui/material/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import LocationPicker, {
  PublicLocationMarker,
  IDMarker,
} from "../../public/LocationPicker";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import MuiSwitch from "@mui/material/Switch";
import DetailMap from "./DetailMap";
import { decode } from "jsonwebtoken";
import Chat from "./Chat";
import BasicStack from "../../agents/Stack";
import PresidentsGraph from "../../Atlas/PresidentsGraph";
import { PreviousElections } from "../../../components/Votes/Votes";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  bgcolor: "rgba(25, 118, 210, 0.08)",
  elevation: 0,
}));

export default function Operations() {
  const {
    events,
    officials,
    useCurrentLocation,
    publicLocation,
    loadingCountyChildren,
    allCountyData,
    allConstData,
    loadingConstituencyChildren,
    allWardData,
    loadingWardChildren,
    allStationsData,
    loadingStationsChildren,
    party,
    agentsParty,
    progress_ward,
  } = useContext(StateContext);
  const { push } = useHistory();

  useOfficials();
  useResources();
  useSurvey();
  useToggleSuccessToast();

  useAllCountyData();
  useAllConstituencyData();
  useAllWardChildren();
  useAllStationsChildren();

  useSocket();
  useDetail();

  const { path } = useRouteMatch();

  function onClickFeature(feature, layer, map) {
    const name = feature.county;
    push(`/operations/counties/${name}`);
  }


  // const toastShow = Boolean(toggleSuccess) || Boolean(toggleError);

  const loading =
    loadingConstituencyChildren ||
    loadingCountyChildren ||
    loadingStationsChildren ||
    loadingWardChildren;

  const filter = Boolean(useSearchQueryParams("filter"));
  const constituency = Boolean(useSearchQueryParams("constituency"));
  const ward = Boolean(useSearchQueryParams("ward"));

  const isNotNational =
    (party?.isParty && party?.operations !== "NATIONWIDE") ||
    (agentsParty?.isParty && agentsParty?.operations !== "NATIONWIDE");

  return (
    <div style={{ borderRadius: "24px" }}>
      {Boolean(loading) && (
        <Box>
          <LinearProgress />
        </Box>
      )}
      {loadingWardChildren && (
        <ToastComponent
          progress_ward={progress_ward}
          loadingWardChildren={loadingWardChildren}
        />
      )}
      <Map className="sidebarMap">
        <MiniMap position={"bottomright"}>
          {/* <MiniBottomRight roi /> */}
        </MiniMap>
        <MiniMap position={"bottomleft"}>
          <MiniBottomLeftMap roi />
        </MiniMap>
        <Switch>
          <Route exact path={path}>
            {filter && <DetailMap checked={filter} />}
            {party?.operations !== "NATIONWIDE" ? (
              // <RoiMap checked={!filter}  />
              <></>
            ) : (
              <DenseMap
                checked={!constituency || !ward}
                noneColor
                datatype="county"
                onClickFeature={onClickFeature}
                ctx
              />
            )}
            <AtlasMap
              color="#42113C"
              title="Constituencies"
              datatype="constituency"
              dat={allConstData}
            />
            <AtlasMap
              nonFilter
              title="2017 Presidential Results per County"
              datatype="county"
              dat={allCountyData}
            />
            <PeopleMap
              checked
              Icons={PeoplesIcons}
              dat={officials}
              title="Officials"
            />
            <PeopleMap
              checked
              Icons={PeoplesIcons}
              dat={events}
              datatype="events"
              title="Events"
            />
            {(filter || isNotNational) && (
              <>
                <AtlasMap
                  color="#D63AF9"
                  title="Wards"
                  dat={allWardData}
                  datatype="ward"
                />
                <StationsMap
                  Icon={PeoplesIcons[1]}
                  dat={allStationsData}
                  title="Polling Centers"
                />
              </>
            )}
          </Route>
          <Route exact path={`${path}/:context`}>
            {filter && <DetailMap checked={filter} />}
            {party?.operations !== "NATIONWIDE" ? (
              <></>
            ) : (
              // <RoiMap checked={!filter} />
              <DenseMap
                checked={!filter}
                noneColor
                datatype="county"
                onClickFeature={onClickFeature}
                ctx
              />
            )}
            <AtlasMap
              color="#42113C"
              title="Constituencies"
              datatype="constituency"
              dat={allConstData}
            />
            <AtlasMap
              nonFilter
              title="2017 Presidential Results per County"
              datatype="county"
              dat={allCountyData}
            />
            <PeopleMap
              checked
              Icons={PeoplesIcons}
              dat={events}
              datatype="events"
              title="Events"
            />
            <PeopleMap
              checked
              Icons={PeoplesIcons}
              dat={officials}
              title="People"
            />
            {(filter || isNotNational) && (
              <>
                <AtlasMap
                  color="#D63AF9"
                  title="Wards"
                  dat={allWardData}
                  datatype="ward"
                />
                <StationsMap
                  Icon={PeoplesIcons[1]}
                  dat={allStationsData}
                  title="Polling Centers"
                />
              </>
            )}
          </Route>
          <Route exact path={`${path}/:context/new`}>
            {filter && <DetailMap checked />}
            <DenseMap
              isSetup
              noneColor
              Mini={MiniMap}
              checked={!Boolean(filter)}
              title="Counties"
            />
            {Boolean(filter) && (
              <AtlasMap
                isSetup
                datatype="constituency"
                noneColor
                Mini={MiniMap}
                checked
                title="Constituencies"
                dat={allConstData}
              />
            )}

            {Boolean(filter) && (
              <AtlasMap
                isSetup
                datatype="ward"
                noneColor
                Mini={MiniMap}
                title="Wards"
                dat={allWardData}
              />
            )}
            {useCurrentLocation && <LocationPicker />}
            {!useCurrentLocation &&
              Boolean(publicLocation?.lat && publicLocation?.lng) && (
                <PublicLocationMarker />
              )}
          </Route>
          <Route exact path={`${path}/:context/:id`}>
            {filter && <DetailMap checked />}
            <DenseMap onClickFeature={onClickFeature} ctx />
            <AtlasMap
              title="2017 Presidential Results per County"
              dat={allCountyData}
            />
            <AtlasMap
              title="2017 Presidential Results per Const"
              dat={allConstData}
            />
            <AtlasMap title="Wards" dat={allWardData} />
            <IDMarker />
          </Route>
        </Switch>
      </Map>
    </div>
  );
}

function MiniBottomLeftMap() {
  const { active } = useContext(StateContext);

  return (
    <Box>
      <Paper elevation={0}>
        <Box>
          {Boolean(active) && <Typography>{active.name}</Typography>}
          <Divider sx={{ my: 1 }} />
          <Typography variant="caption">Hover over region</Typography>
        </Box>
      </Paper>
    </Box>
  );
}


const OperationsHubOverview = () => {
  const { path } = useRouteMatch();
  const isPortal = path.includes("portal");
  return (
    <Box>
      <Item>
        <Box sx={{ height: "100v", overflow: "auto" }}>
          <Box>
            <BasicStack portal={isPortal} />
          </Box>
        </Box>
      </Item>
    </Box>
  );
};

export const OperationsHub = () => {
  const { context } = useParams();
  return (
    <div>
      <Header base="Operations" where="Operations" />
      {(!Boolean(context) || context === "Home") && (
        <Box>
          <OperationsHubOverview />
        </Box>
      )}
      {context !== "Events" &&
        context !== "Surveys" &&
        context !== "Resources" &&
        context !== "Notifications" &&
        context !== "News" &&
        context !== "Home" &&
        context !== "Settings" && <OfficialsContainer />}
      {context === "Events" && <EventsContainer />}
      {context === "Surveys" && <SurveyPro />}
      {context === "Resources" && <ResourcesHome />}
      {context === "Notifications" && <Chat />}
      {context === "News" && <NewsFeed />}
    </div>
  );
};

function NewsFeed() {
  return (
    <Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography>News and Activity</Typography>
        <Box sx={{ textAlign: "center" }}>
          <TwitterIcon />
        </Box>
        <Divider />
        <Tweet />
      </Box>
    </Box>
  );
}


const EventsContainer = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <OverviewCard />
      </Route>
      <Route exact path={`${path}/:day`}>
        <DayComponents />
      </Route>
    </Switch>
  );
};



function MediaControlCard({ data }) {

  const { firstname, lastname, email, phone } = data;

  return (
    <Card sx={{ display: "flex" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography component="div" variant="h5">
            {lastname} {firstname}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {email}
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            component="div"
          >
            {phone}
          </Typography>
        </CardContent>
        <Box sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}>
          <QRCode size={66} value={window.location.pathname} />
        </Box>
      </Box>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="https://st2.depositphotos.com/25407336/43814/v/380/depositphotos_438141772-stock-illustration-person-icon-flat-design-template.jpg?forcejpeg=true"
        alt="Avatar"
      />
    </Card>
  );
}

function OfficialDetail() {
  const {  officials, loadingOfficials } =
    useContext(StateContext);
  const { id, context } = useParams();
  const data = officials?.filter((f) => f.id === id) || [];

  const official = data[0];

  if (loadingOfficials || !Boolean(official))
    return (
      <Box sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
            textAling: "center",
          }}
        >
          <Box sx={{ minWidth: 90 }}>
            <Typography>Loading {context}...</Typography>
            <Box>
              <LinearProgress />
            </Box>
          </Box>
        </Box>
      </Box>
    );

  const { firstname, lastname, email, phone, avatar } = official;

  return (
    <Container sx={{ mt: 2, textAlign: "left" }}>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption">Digital {context} card</Typography>
          <br />
          <Typography variant="caption">{id}</Typography>
        </Box>
        <Stack spacing={1}>
          <MediaControlCard data={official} />
          <Box sx={{ mt: 2 }}>
            <Box>
              <Button
                size="small"
                variant="outlined"
                sx={{ textTransform: "none" }}
              >
                View Activity
              </Button>
              <Button size="small" sx={{ textTransform: "none" }}>
                Send Message
              </Button>
              <Button size="small" sx={{ textTransform: "none" }}>
                Give Resources
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
}


const Units = [
  "Items",
  "Pieces",
  "Liters",
  "Kilos",
  "Sacks",
  "Bales",
  "Packets",
  "Shillings",
  "$",
];

const resourceTypes = [
  "Campaign posters",
  "Vehicles",
  "Tshirts",
  "Computers",
  "Tablets",
  "Ballot Boxes",
  "Ballot Papers",
  "Other",
];

const UnitTypes = ({ handleChange, data, title }) => {
  return (
    <Autocomplete
      size="small"
      disablePortal
      required
      options={data || Units}
      onChange={(e, v) => {
        handleChange(v);
      }}
      renderInput={(params) => (
        <TextField
          required
          fullWidth
          size="small"
          {...params}
          label={title || "Unit(s)"}
        />
      )}
    />
  );
};

const ResourceType = ({ handleChange }) => {
  return (
    <Autocomplete
      size="small"
      disablePortal
      id="combo-box-demo"
      required
      options={resourceTypes}
      onChange={(e, v) => {
        handleChange(v);
      }}
      renderInput={(params) => (
        <TextField
          required
          fullWidth
          size="small"
          {...params}
          label="Resource type"
        />
      )}
    />
  );
};

const ResourcesHome = () => {
  const { resources } = useContext(StateContext);
  const data = resources || [];
  const { url } = useRouteMatch();
  const { push } = useHistory();
  return (
    <Item>
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography>No resources available</Typography>
          <Typography variant="caption">
            Add resources to manage and track
          </Typography>
          <br />
          <Button
            onClick={() => push(`${url}/new`)}
            sx={{ mt: 2 }}
            variant="contained"
          >
            Add resources
          </Button>
        </Box>
      </Box>
    </Item>
  );
};

const AssignOfficialsResourcesForm = () => {
  const { selectedOfficials, resources } = useContext(StateContext);

  const selectedTitle = selectedOfficials?.reduce(
    (p, { fullname }) => fullname + "\n, " + p + "\n ",
    ""
  );

  const { url } = useRouteMatch();

  const { push } = useHistory();

  return (
    <Box sx={{ mt: 2 }}>
      <Item>
        <Box sx={{ height: "60vh", overflow: "auto" }}>
          {!Boolean(selectedOfficials?.length) && (
            <Box sx={{ mt: 6 }}>
              <Typography>
                No officials selected to be assigned resources
              </Typography>
            </Box>
          )}
          {Boolean(selectedOfficials?.length) && (
            <Box sx={{ mt: 2 }}>
              <ToolTip title={selectedTitle}>
                <Link>{selectedOfficials.length} officials selected</Link>
              </ToolTip>
              {!Boolean(resources?.length) && (
                <Box sx={{ mt: 5 }}>
                  <Typography>No resources have been added</Typography>
                  <Button
                    sx={{ mt: 5 }}
                    onClick={() =>
                      push(`/operations/Resources/new?redirect=${url}`)
                    }
                  >
                    Add resources to allocated and track
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Item>
    </Box>
  );
};

export function OfficialsForm({ portal }) {
  const { push } = useHistory();
  const [state, setState] = useState(null);
  const [err, setErr] = useState(false);
  const [loading, setLoading] = useState(false);

  const { context } = useParams();

  const ref = useSearchQueryParams("ref");
  const role = useSearchQueryParams("role") || state?.role || "Members";

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

  const { party, dispatch, useCurrentLocation, publicLocation } =
    useContext(StateContext);

  const handleMapState = (e) => {
    dispatch({
      type: "ADD_MULTIPLE",
      payload: e.target.checked,
      context: "useCurrentLocation",
    });
  };

  const handleLocationState = (e) => {
    dispatch({
      type: "ADD_MULTIPLE",
      payload: { ...publicLocation, [e.target.name]: e.target.value },
      context: "publicLocation",
    });
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const dir = {
      ...state,
      party: ref,
      long: publicLocation?.lng,
      lat: publicLocation?.lat,
      role,
      county: county,
      constituency: constituency,
      ward: ward,
      station: station,
      password: state?.password,
    };
    axiosInstance
      .post("/officials", dir)
      .then(({ data }) => {
        const official = decode(data, { headers: true });
        localStorage.setItem("access_token", data);
        dispatch({
          type: "ADD_MULTIPLE",
          context: "isLoggedIn",
          payload: true,
        });
        dispatch({
          type: "ADD_MULTIPLE",
          context: "agent",
          payload: official,
        });
        setLoading(false);
        push("/portal");
      })
      .catch((e) => {
        setErr(true);
        setLoading(false);
      });
  };

  const handleUnitChange = (v, ctx) => {
    setState({ ...state, [ctx]: v });
  };

  return (
    <div>
      <Item>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <Box>
              <img src={logo} style={{ height: 91, cursor: "pointer" }} />
            </Box>
            <Typography variant="h6">{role} registration </Typography>
            <Divider sx={{ my: 2 }} />
            <MuiAlert severity="info">
              <Typography variant="caption">
                You are about to sign up as party {role} {" - "}
                <span>
                  {context !== "Candidates" && isStation && (
                    <span style={{ fontWeight: "bold" }}>
                      {" "}
                      {station} Polling Center
                    </span>
                  )}
                  {isWard && (
                    <span style={{ fontWeight: "bold" }}>{ward}Ward</span>
                  )}
                  {isConst && (
                    <span style={{ fontWeight: "bold" }}>
                      {constituency} Constituency
                    </span>
                  )}
                  {isCounty && (
                    <span style={{ fontWeight: "bold" }}> {county} County</span>
                  )}
                  {!isCounty && !isConst && isWard && !isStation && (
                    <span style={{ fontWeight: "bold" }}>National</span>
                  )}
                  .To change, please select a new location on the map
                </span>
              </Typography>
            </MuiAlert>

            {!role && (
              <UnitTypes
                handleChange={(v) => handleUnitChange(v, "role")}
                title="What is your role"
                data={["Members", "Officials", "Coordinators", "Candidates"]}
              />
            )}

            {isCounty && role === "Candidates" && (
              <UnitTypes
                handleChange={(v) => handleUnitChange(v, "candidateType")}
                title="Select a position"
                data={["GOVERNOR", "SENATOR", "W_REP"]}
              />
            )}
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="First name"
                  name="firstname"
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  size="small"
                  label="Last name"
                  name="lastname"
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>

            <TextField
              type="number"
              size="small"
              label="ID"
              name="ID"
              onChange={handleChange}
              required
            />
            <TextField
              type="number"
              size="small"
              label="Phone"
              name="phone"
              placeholder="07"
              onChange={handleChange}
              required
            />
            <TextField
              size="small"
              label="Email address"
              name="email"
              onChange={handleChange}
              required
            />
            <TextField
              size="small"
              label="Twitter profile"
              name="twitter"
              onChange={handleChange}
            />
            <TextField
              size="small"
              label="Facebook profile"
              name="facebook"
              onChange={handleChange}
            />

            <FormControlLabel
              control={
                <MuiSwitch
                  checked={useCurrentLocation}
                  onChange={handleMapState}
                />
              }
              label="Pick location from map"
            />

            {!useCurrentLocation && (
              <MuiAlert severity="info">
                Your location will be set to the marker position. Drag the
                marker to adjust, or toggle to use your current location
              </MuiAlert>
            )}

            {Boolean(useCurrentLocation) && (
              <MuiAlert severity="info">
                <Typography variant="caption">
                  Allow location access, click on map and drag marker to desired
                  location{" "}
                </Typography>
              </MuiAlert>
            )}

            {!Boolean(useCurrentLocation) && (
              <Grid container spacing={1}>
                <Grid xs={5} item>
                  <TextField
                    value={publicLocation?.lat}
                    onChange={handleLocationState}
                    required
                    name="lat"
                    label="Latitude"
                    size="small"
                    fullWidth
                  />
                </Grid>
                <Grid xs={5} item>
                  <TextField
                    value={publicLocation?.lng}
                    onChange={handleLocationState}
                    required
                    name="lng"
                    label="Longitude"
                    size="small"
                    fullWidth
                  />
                </Grid>
              </Grid>
            )}
            <TextField
              type="password"
              fullWidth
              label="Password"
              size="small"
              onChange={handleChange}
              name="password"
            />
            {err && (
              <>
                <MuiAlert severity="error">
                  <Typography>An error occured</Typography>
                </MuiAlert>
              </>
            )}
            {loading ? (
              <Button color="warning" type="button" variant="contained">
                Submitting...
              </Button>
            ) : (
              <Button
                onChange={handleChange}
                disabled={Boolean(!publicLocation?.lat || !publicLocation?.lng)}
                type="submit"
                variant="contained"
              >
                Submit
              </Button>
            )}
          </Stack>
        </form>
      </Item>
    </div>
  );
}

function AddOfficialsWidget() {
  const { context } = useParams();
  return (
    <Box sx={{ mt: 3 }}>
      <Item>
        <ShareSignup />
        <Upload />
      </Item>
    </Box>
  );
}

function OfficialsContainer() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <OfficialsComponent />
      </Route>
      <Route exact path={`${path}/new`}>
        <AddOfficialsWidget />
      </Route>
      <Route exact path={`${path}/:id`}>
        <OfficialDetail />
      </Route>
      <Route path={`${path}/task`}>
        <TaskView />
      </Route>
      <Route exact path={`${path}/assign-resources`}>
        <AssignOfficialsResourcesForm />
      </Route>
    </Switch>
  );
}

function OfficialsComponent() {
  const { context } = useParams();
  const { officials } = useContext(StateContext);

  const { url } = useRouteMatch();
  const { push } = useHistory();

  const filter = useSearchQueryParams("filter");
  const county = useSearchQueryParams("county");
  const constituency = useSearchQueryParams("constituency");
  const ward = useSearchQueryParams("ward");
  const station = useSearchQueryParams("station");

  const slug = station ? `?filter=true&county=${county}` : "";

  const filteredBy = (o) => {
    if (!Boolean(filter)) {
      return o;
    } else if (
      filter &&
      Boolean(station) &&
      Boolean(ward) &&
      Boolean(constituency) &&
      Boolean(county)
    ) {
      return (
        o &&
        o.county === county &&
        o.constituency === constituency &&
        o.ward === ward &&
        o.station === station
      );
    } else if (
      filter &&
      Boolean(ward) &&
      Boolean(constituency) &&
      Boolean(county)
    ) {
      return (
        o &&
        o.county === county &&
        o.constituency === constituency &&
        o.ward === ward
      );
    } else if (filter && Boolean(constituency) && Boolean(county)) {
      return o && o.county === county && o.constituency === constituency;
    } else if (filter && Boolean(county)) {
      return o && o.county === county;
    } else {
      return o;
    }
  };

  const data = (officials || []).filter(filteredBy);

  const applyFilter = (item) => {
    const rel = item.role === context;
    return rel;
  };

  const empty = !Boolean(data.filter(applyFilter)?.length);

  return (
    <Box sx={{ mt: 2 }}>
      <Item>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Fab
              sx={{ elevation: 0 }}
              elevation={0}
              size="small"
              variant="extended"
              disableRipple
            >
              <Box sx={{ mr: 1, display: "inline", elevation: 0 }}>
                {PeoplesIcons[context]}
              </Box>
              {data.filter(applyFilter).length || 0} {context}
            </Fab>
          </Box>
          <Box sx={{ display: context === "Votes" ? "none" : "block" }}>
            <Stack direction="row" spacing={2}>
              <ToolTip
                sx={{ display: empty ? "none" : "inline" }}
                title={`Start a video meeting with ${context} on Kura. Ke Message`}
              >
                <IconButton
                  size="small"
                  href="https://kura-backend.herokuapp.com"
                >
                  <VideoCallIcon />
                </IconButton>
              </ToolTip>
              <ToolTip
                sx={{ display: empty ? "none" : "inline" }}
                title={`Send messages to all ${context}`}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    push(
                      `/operations/Notifications/new?${slug}&send_to=${context}`
                    )
                  }
                >
                  <MarkAsUnreadIcon />
                </IconButton>
              </ToolTip>
              <ToolTip
                sx={{ display: empty ? "none" : "inline" }}
                title={`Create an event for ${context}`}
              >
                <IconButton
                  size="small"
                  onClick={() =>
                    push(
                      `/operations/Events?${slug}&redirect=${url}${slug}&action="create_new&ctx=${context}`
                    )
                  }
                >
                  <EventIcon />
                </IconButton>
              </ToolTip>
              <ToolTip
                sx={{ display: empty ? "none" : "inline" }}
                title={`Add new officials ${context}`}
              >
                <IconButton
                  size="small"
                  onClick={() => push(`${url}/new?${slug}`)}
                >
                  <PersonAddIcon />
                </IconButton>
              </ToolTip>
            </Stack>
          </Box>
        </Box>
        <>{context === "Votes" && <PreviousElections />}</>
        <>
          {context !== "Votes" && (
            <>
              {Boolean(data.filter(applyFilter)?.length) && (
                <>
                  <Box sx={{ textAlign: "left" }}>
                    <Typography variant="caption">Summary</Typography>
                  </Box>
                  <Box sx={{ width: "100%", height: "26vh" }}>
                    <PresidentsGraph />
                  </Box>
                  <OfficialsList data={data.filter(applyFilter)} />
                </>
              )}
              {!Boolean(data.filter(applyFilter)?.length) &&
                context !== "Votes" && (
                  <Box sx={{ textAlign: "center", my: 3 }}>
                    <AddOfficialsWidget />
                  </Box>
                )}
            </>
          )}
        </>
      </Item>
    </Box>
  );
}

function SearchAndSelectOfficial({ handleSelected, dat, survey, data }) {
  const { officials } = useContext(StateContext);

  const { context } = useContext(StateContext);

  const { push } = useHistory();

  return (
    <div>
      <Autocomplete
        multiple
        size="small"
        id="checkboxes-tags-demo"
        options={data || []}
        disableCloseOnSelect
        getOptionLabel={(option) =>
          `${option.firstname} ${option.lastname}` || option
        }
        onChange={(e, v) => {
          handleSelected(v);
        }}
        renderOption={(props, option, { selected }) => (
          <Box component="li" {...props}>
            <Checkbox
              size="small"
              icon={icon}
              checkedIcon={checkedIcon}
              sx={{ mr: 2, flexShrink: 0 }}
              checked={selected}
            />
            <span style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {option.firstname} {option.lastname}
              </span>
              <Stack sx={{ ml: 3 }} direction="row" spacing={2}>
                <ToolTip
                  title={`Start a video meeting with ${option.firstname} on Kura. Ke Message`}
                >
                  <IconButton
                    size="small"
                    href="https://kura-backend.herokuapp.com"
                  >
                    <VideoCallIcon />
                  </IconButton>
                </ToolTip>
                <ToolTip title={`Send messages to ${option.firstname}`}>
                  <IconButton
                    size="small"
                    onClick={() => push(`/operations/Notifications/new?`)}
                  >
                    <MarkAsUnreadIcon />
                  </IconButton>
                </ToolTip>
                <ToolTip title={`Send messages to ${option.firstname}`}>
                  <IconButton
                    size="small"
                    onClick={() => push(`/operations/Notifications/new?`)}
                  >
                    <EventIcon />
                  </IconButton>
                </ToolTip>
              </Stack>
            </span>
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            fullWidth
            size="small"
            {...params}
            placeholder="Search and select officials"
          />
        )}
      />
    </div>
  );
}

function SearchAndSelectOfficialHeader({ handleSelected, selected, data }) {
  const { dispatch } = useContext(StateContext);
  const { push } = useHistory();
  const { url } = useRouteMatch();

  const filter = useSearchQueryParams("filter");
  const county = useSearchQueryParams("county");
  const constituency = useSearchQueryParams("constituency");
  const ward = useSearchQueryParams("ward");
  const station = useSearchQueryParams("station");

  const handleChange = (event) => {
    dispatch({
      type: "ADD_MULTIPLE",
      context: "selectedOfficials",
      payload: selected,
    });
    if (filter) {
      if (station) {
        push(
          `${url}/task?action=${event.target.value}&filter=true&county=${county}&constituency=${constituency}&ward=${ward}&station=${station}`
        );
      } else if (ward) {
        push(
          `${url}/task?action=${event.target.value}&filter=true&county=${county}&constituency=${constituency}&ward=${ward}`
        );
      } else if (constituency) {
        push(
          `${url}/task?action=${event.target.value}&filter=true&county=${county}&constituency=${constituency}`
        );
      } else {
        push(
          `${url}/task?action=${event.target.value}&filter=true&county=${county}`
        );
      }
    } else {
      push(`${url}/task?action=${event.target.value}`);
    }
  };

  return (
    <div>
      {Boolean(selected.length) && (
        <Box
          sx={{
            bgcolor: "lightblue",
            textAlign: "left",
            mb: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{selected.length} selected</Typography>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl size="small" fullWidth>
              <InputLabel id="demo-simple-select-label">Action</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Action"
                onChange={handleChange}
              >
                <MenuItem value={"send-message"}>Send message</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
      <SearchAndSelectOfficial data={data} handleSelected={handleSelected} />
    </div>
  );
}

function OfficialsList({ data, survey }) {
  const { context } = useParams();

  const { officials } = useContext(StateContext);
  const filter = useSearchQueryParams("filter");
  const county = useSearchQueryParams("county");
  const ward = useSearchQueryParams("ward");
  const constituency = useSearchQueryParams("constituency");
  const station = useSearchQueryParams("station");

  const dir = data || [];

  const { push } = useHistory();

  const [selected, setSelected] = useState([]);

  const handleSelected = (v) => {
    setSelected(v);
  };

  const isSelected = (id) => {
    return Boolean(selected.filter((f) => f.id === id).length);
  };

  return (
    <Box sx={{ mt: 3, minHeight: "81vh" }}>
      {!survey && (
        <SearchAndSelectOfficialHeader
          data={data}
          selected={selected}
          handleSelected={handleSelected}
        />
      )}
      <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
        {dir?.map((o, i) => {
          const { firstname, title, email, id, avatar } = o;
          return (
            <ListItem
              key={i}
              onClick={() => {
                if (filter) {
                  if (station) {
                    push(
                      `/operations/${context}/${id}?filter=true&county=${county}&constituency=${constituency}&ward=${ward}&station=${station}`
                    );
                  } else if (ward) {
                    push(
                      `/operations/${context}/${id}?filter=true&county=${county}&constituency=${constituency}&ward=${ward}`
                    );
                  } else if (constituency) {
                    push(
                      `/operations/${context}/${id}?filter=true&county=${county}&constituency=${constituency}`
                    );
                  } else if (county) {
                    push(
                      `/operations/${context}/${id}?filter=true&county=${county}`
                    );
                  } else {
                    push(`/operations/${context}/${id}`);
                  }
                } else if (survey) {
                  push(`/operations/${context}/${id}`);
                } else {
                  push(`/operations/${context}/${id}`);
                }
              }}
              selected={isSelected(id)}
            >
              <ListItemAvatar>
                <Avatar src={avatar}>
                  <ImageIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={survey ? title : firstname}
                secondary={survey ? `0 responses` : email}
              />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}

function DayComponents() {
  const { day } = useParams();

  const { events } = useContext(StateContext);

  const data = events || [];

  const { push } = useHistory();

  const { url } = useRouteMatch();

  const addNew = () => {
    push(`${url}/new`);
  };

  return (
    <div style={{ marginTop: "12px" }}>
      <Box>
        <Item>
          <Box>
            <Typography sx={{ color: "text.secondary" }} variant="caption">
              Showing events for
            </Typography>
            <Typography>{day}</Typography>
          </Box>
          <Box>
            <Button
              onClick={addNew}
              sx={{ my: 2 }}
              startIcon={<EventIcon />}
              size="small"
            >
              Create event
            </Button>
          </Box>
          <Box>
            {!Boolean(data.length) && (
              <Box
                style={{
                  height: "270px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box>
                  <Typography>No events to show</Typography>
                </Box>
              </Box>
            )}
          </Box>
        </Item>
      </Box>
    </div>
  );
}

function OverviewCard() {
  const { ctx } = useParams();

  const { path } = useRouteMatch();

  return (
    <Box sx={{ mt: 2 }}>
      <BigEvents />
    </Box>
  );
}

export const Header = ({ where, base }) => {
  const { path } = useRouteMatch();
  const { goBack, push } = useHistory();

  const { newDetail } = useContext(StateContext);

  const filter = Boolean(useSearchQueryParams("filter"));
  const county = useSearchQueryParams("county");
  const constituency = useSearchQueryParams("constituency");
  const ward = useSearchQueryParams("ward");
  const station = useSearchQueryParams("station");

  const { context } = useParams();
  const { url } = useRouteMatch();
  const breadcrumbs = [
    {
      isVisible: true,
      Component: (
        <Link
          variant="caption"
          underline="hover"
          key="1"
          color="inherit"
          onClick={() => push(`/${base}`)}
        >
          {where}
        </Link>
      ),
    },
    {
      isVisible: Boolean(context),
      Component: (
        <Link
          variant="caption"
          underline="hover"
          key="1"
          color="inherit"
          onClick={() => push(`${url}`)}
        >
          {context}
        </Link>
      ),
    },
    {
      isVisible: Boolean(county),
      Component: (
        <Link
          variant="caption"
          underline="hover"
          key="1"
          color="inherit"
          onClick={() => push(`${url}?filter=true&county=${county}`)}
        >
          {county} county
        </Link>
      ),
    },
    {
      isVisible: Boolean(constituency),
      Component: (
        <Link
          variant="caption"
          underline="hover"
          key="2"
          color="text.secondary"
          onClick={() =>
            push(
              `${url}?filter=true&county=${county}&constituency=${constituency}`
            )
          }

          // onClick={handleClick}
        >
          {constituency} const
        </Link>
      ),
    },
    {
      isVisible: Boolean(ward),
      Component: (
        <Link
          onClick={() =>
            push(
              `${url}?filter=true&county=${county}&constituency=${constituency}&ward=${ward}`
            )
          }
          variant="caption"
          key="3"
          color="text.secondary"
        >
          {ward} ward
        </Link>
      ),
    },
    {
      isVisible: Boolean(station),
      Component: (
        <Link
          onClick={() =>
            push(
              `${url}?filter=true&county=${county}&constituency=${constituency}&station=${station}`
            )
          }
          variant="caption"
          key="4"
          color="text.secondary"
        >
          {station} polling center
        </Link>
      ),
    },
  ]
    .filter((f) => f.isVisible)
    .map((p) => p.Component);

  return (
    <Box sx={{ px: 2 }}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs}
      </Breadcrumbs>
    </Box>
  );
};

export function NewEventComponent() {
  const [state, setState] = useState(null);
  const { publicLocation, party, dispatch, events } = useContext(StateContext);
  const [loading, setLoading] = useState(false);
  const { push } = useHistory();
  const { day } = useParams();
  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    const lat = publicLocation.lat;
    const long = publicLocation.lng;
    axiosInstance
      .post(`/events`, {
        ...state,
        party: party?.id,
        roi: "national",
        date: day,
        lat,
        long,
      })
      .then(({ data }) => {
        dispatch({
          type: "ADD_MULTIPLE",
          context: "toggleSuccess",
          payload: true,
        });
        dispatch({
          type: "ADD_SINGLE",
          context: "events",
          payload: data,
        });
        setLoading(false);
        push(`/operations/Events/${day}/${data.id}`);
      })
      .catch((e) => {
        dispatch({
          type: "ADD_MULTIPLE",
          context: "toggleError",
          payload: false,
        });
        setLoading(false);
      });
  };
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return (
    <Box sx={{ height: "63vh", overflow: "auto" }}>
      <Item>
        <Box sx={{ textAlign: "left" }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Typography>new event for: {day}</Typography>
              <TextField
                onChange={handleChange}
                label="Event title / name"
                size="small"
                name="title"
                required
              />
              <TextField
                onChange={handleChange}
                label="Venue name"
                size="small"
                name="locationName"
                required
              />
              {loading && (
                <Button variant="contained" color="warning">
                  Saving...
                </Button>
              )}
              {!loading && (
                <Button
                  disabled={!Boolean(publicLocation)}
                  variant="contained"
                  type="submit"
                >
                  Submit
                </Button>
              )}
            </Stack>
          </form>
          <Box>
            {!Boolean(publicLocation) && (
              <Box
                sx={{
                  bgcolor: "red",
                  mt: 2,
                  color: "white",
                  p: 1,
                  borderRadius: 1,
                }}
              >
                <Typography>
                  To register an event, you'll need to pick a venue on the map
                </Typography>
                <Typography variant="caption">
                  You may need to enable your permission
                </Typography>
                <Link>Learn more</Link>
              </Box>
            )}
          </Box>
        </Box>
      </Item>
    </Box>
  );
}

function TaskView() {
  const action = useSearchQueryParams("action");
  return <Box>{action === "send-message" && <SendMessages />}</Box>;
}

export function SendMessages() {
  const ctx = useSearchQueryParams("ctx");

  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [success, setSuccess] = useState(false);
  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { selected } = useContext(StateContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const dir = {
      message: state,
      recipients: [""].map((s) => ({
        email: "bryodiiidah@gmail.com",
        phone: "phone",
      })),
      to: ctx,
    };
    axiosInstance
      .post(`/message-list`, dir)
      .then(({ data }) => {
        setLoading(false);
        setSuccess(true);
      })
      .catch((e) => {
        setLoading(false);
        setErr(true);
      });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <form onSubmit={handleSubmit}>
        <Item>
          {!loading && !success && (
            <Box>
              <Box sx={{ textAlign: "center", my: 2 }}>
                <Typography variant="h6">{ctx}</Typography>
                <MuiAlert severity="warning">
                  <Typography variant="caption">
                    Messages will be sent as sms, whatsapp, email and Kura.ke
                    inmail{" "}
                  </Typography>
                </MuiAlert>
                <Box
                  sx={{
                    height: "50vh",
                    overflow: "auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography variant="h5">
                      {state?.subject || "subject"}
                    </Typography>
                    <Typography>{state?.body || "subject"}</Typography>
                  </Box>
                </Box>
                <TextField
                  name="subject"
                  variant="standard"
                  required
                  placeholder="subject"
                  fullWidth
                  onChange={handleChange}
                  sx={{ mb: 2 }}
                />
                <TextField
                  name="body"
                  required
                  variant="standard"
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IconButton href={"https://kura-backend.herokuapp.com"}>
                          <VideoCallIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton type="submit">
                          <SendSharpIcon />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  fullWidth
                  placeholder="Start Typing..."
                  multiline
                />
              </Box>
            </Box>
          )}
          {loading && !success && (
            <Box
              sx={{
                height: "66vh",
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>{ctx}</Typography>
                <Typography>Sending message...</Typography>
                <LinearProgress sx={{ mt: 2 }} />
              </Box>
            </Box>
          )}
          {success && (
            <Box
              sx={{
                height: "66vh",
                overflow: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MuiAlert severity="success">
                <Box sx={{ textAlign: "left" }}>
                  <Typography>Message sent to {ctx}</Typography>
                  <Box
                    sx={{
                      height: "50vh",
                      overflow: "auto",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="h5">
                        {state?.subject || "subject"}
                      </Typography>
                      <Typography>{state?.body || "subject"}</Typography>
                    </Box>
                  </Box>
                </Box>
              </MuiAlert>
            </Box>
          )}
        </Item>
      </form>
    </Box>
  );
}

function ShareSignup() {
  let { getFilterUrl } = useFilters();

  let { party } = useContext(StateContext);
  let { context } = useParams();

  let share_url = `${
    window.location.host
  }/accounts/portal/registration${getFilterUrl()}&ref=${
    party?.id
  }&role=${context}`;

  return (
    <Box sx={{ mt: 2 }}>
      <Box>
        <Typography variant="h6">Invite {context}</Typography>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ my: 2 }}>
          <MuiAlert severity="info">
            <Typography variant="caption" color="info">
              {context} can sign up on the {context} portal by scanning the code
              below, or using the equivalent link.{" "}
              <Link onClick={() => navigator.clipboard.writeText(share_url)}>
                Copy Link
              </Link>{" "}
              and share via text, email, whatsapp, or social media
            </Typography>
          </MuiAlert>
        </Box>
        {Boolean(share_url) && <QRCode size={108} value={share_url} />}
        <Box>
          <Link
            onClick={() => navigator.clipboard.writeText(share_url)}
            sx={{ mt: 2 }}
          >
            {share_url}
          </Link>
          <br />
          <Typography variant="caption">Tap on link to copy</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function SampleOfficialCSV() {
  const csvData = [
    ["firstname", "lastname", "email", "ID", "phone", "lat", "lng"],
    [
      "Ahmed",
      "Tomi",
      "ah@smthing.co.com",
      "12345678",
      "07111 *****",
      "1.2",
      "2.2",
    ],
  ];
  return (
    <Box>
      <CSVLink data={csvData}>Download csv template</CSVLink>
      <Divider />
      <Typography variant="caption">
        Required fields are: firstname, lastname, ID, phone, email, lat
        (latitude) and long(Longitude){" "}
      </Typography>
    </Box>
  );
}

export function useFilters() {
  const filter = useSearchQueryParams("filter");
  const county = useSearchQueryParams("county");
  const constituency = useSearchQueryParams("constituency");
  const ward = useSearchQueryParams("ward");
  const station = useSearchQueryParams("station");

  const isStation = Boolean(station);
  const isWard = Boolean(ward) && !isStation;
  const isConst = Boolean(constituency) && !isWard;
  const isCounty = Boolean(county) && !isConst;

  let getFilterUrl = () => {
    if (isStation) {
      return `?county=${county}&constituency=${constituency}&ward=${ward}&station=${station}`;
    }
    if (isWard) {
      return `?county=${county}&constituency=${constituency}&ward=${ward}`;
    }
    if (isConst) {
      return `?county=${county}&constituency=${constituency}`;
    }
    if (isCounty) {
      return `?county=${county}`;
    }
    return "?filter=false";
  };

  let getRest = (datatype, feature) => {
    if (datatype === "county") {
      return "";
    } else if (datatype === "constituency") {
      return `&constituency=${feature.const}`;
    } else if (datatype === "ward") {
      return `&ward=${ward}`;
    }
  };

  return {
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
    getRest,
  };
}

function Upload() {
  const { party, dispatch } = useContext(StateContext);

  const { county, constituency, ward, station, filter } = useFilters();

  const { context } = useParams();

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

  const handleUpload = () => {
    const items = state.data;
    setExpected(items?.length);
    setLoading(true);
    for (let item of items) {
      const data = {
        ...item,
        county,
        constituency,
        ward,
        station,
        password: "false",
        role: context,
        party: party?.id,
      };
      axiosInstance
        .post(`/officials`, data)
        .then(({ data }) => {
          const official = decode(data, { headers: true });
          dispatch({
            type: "ADD_SINGLE",
            context: "officials",
            payload: official,
          });
          const allUploaded = [...uploaded];
          allUploaded.push(official);
          setUploaded(allUploaded);
          if (uploaded?.length === expected) {
            setLoading(false);
            setCompleted(true);
          }
        })
        .catch((e) => {
          const allErrs = [...errs];
          allErrs.push(data);
          setErrs(allErrs);
        });
    }
  };

  const { push, goBack } = useHistory();

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }} />
      <Box>
        <Stack spacing={2}>
          <Typography>Upload {context} csv for existing list </Typography>
          <Divider sx={{ my: 2 }} />
          <MuiAlert severity="info">
            <Box>
              <Typography>{context}</Typography>
              {context === "Candidates" && (
                <Box>
                  <Typography sx={{ color: "text.secondary" }}>
                    Add and engage with your party candidates directly at all
                    levels. Easily Conduct elections and polls for all regions
                    where you field your candidates, and issue party
                    certificates
                  </Typography>
                  <Typography>
                    Currently adding
                    <span sx={{ fontweight: "bold" }}>
                      {!filter && <>Presidential</>} candidates
                    </span>{" "}
                    and all registration links will be unique to this region. To
                    choose another location, select it on the map.
                  </Typography>
                </Box>
              )}
              {context !== "Candidates" && <Box></Box>}
              <Divider sx={{ my: 2 }}></Divider>
              <SampleOfficialCSV />
            </Box>
          </MuiAlert>
          <FileReader
            disabled={!Boolean(state)}
            loading={loading}
            handleChange={handleChange}
            handleSubmit={handleUpload}
          />
          <Button onClick={handleUpload}>Upload now</Button>
          <Divider />
          {loading && (
            <MuiAlert severity="info">
              <Typography>
                Uploaded {((uploaded?.length || 1) / expected) * 100} %{" "}
              </Typography>
            </MuiAlert>
          )}
          {Boolean(errs.length) && (
            <MuiAlert severity="error">
              <Typography>{errs.length} Failing rows</Typography>
              {errs.map((e, i) => {
                const { firstname, lastname, email } = e;
                return (
                  <Typography>
                    {firstname} {lastname} {email}
                  </Typography>
                );
              })}
            </MuiAlert>
          )}
          {completed && (
            <MuiAlert severity="success">
              <Typography>
                Data upload successful. {expected} new {context} added!
              </Typography>
              <Typography>
                All added {context} will recieve signup links to finish their
                registation process on the {context}
              </Typography>
              <Button onClick={() => goBack()}>Go Back</Button>
            </MuiAlert>
          )}
        </Stack>
      </Box>
    </Box>
  );
}

const OfficialsCard = ({ title }) => {
  const state = useContext(StateContext);
  const data = state[title.toLowerCase()] || [];
  return (
    <div>
      <Typography variant="h4">{data?.length}</Typography>
      <Divider sx={{ mt: 2 }} />
    </div>
  );
};

const cards = [
  {
    title: "Officials",
    desc: "Add / Remove party officials",
    Card: OfficialsCard,
  },
  {
    title: "Members",
    desc: "Consolidate your support base",
    Card: OfficialsCard,
  },
  {
    title: "Coordinators",
    desc: "Add grassroot coordinators",
    Card: OfficialsCard,
  },
  {
    title: "Candidates",
    desc: "Add candidates for elective posts / Nominations",
    Card: OfficialsCard,
  },
  { title: "Events", desc: "Create events", Card: OfficialsCard },
  {
    title: "Resources",
    desc: "Manage resources / Logistics",
    Card: OfficialsCard,
  },
  { title: "Nominations", desc: "Voting patterns", Card: OfficialsCard },
  { title: "Surveys", desc: "Create surveys", Card: OfficialsCard },
];

const getUnique = (value, index, self) => self.indexOf(value) === index;

function CalendarComponent() {
  const [value, onChange] = useState(new Date());

  const { push } = useHistory();
  const { url } = useRouteMatch();
  const handleChange = (e) => {
    onChange(e);
    push(`${url}/${e}`);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <Calendar className="calendar" onChange={handleChange} value={value} />
      </div>
    </div>
  );
}
