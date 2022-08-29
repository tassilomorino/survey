import InputAdornment from "@mui/material/InputAdornment";
import KeyIcon from "@mui/icons-material/Key";
import PersonIcon from "@mui/icons-material/Person";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory, Switch, Route, useRouteMatch } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import useSearchQueryParams from "../hooks/useSearchQueryParams";
import BasicDialog from "../modal/BasicDialog";
import FullScreenDialog from "../modal/FullscreenDialog";
import Divider from "@mui/material/Divider";
import logo from "../../assets/logo.png";
import Map from "../Map";

import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";

import { AtlasMap } from "../../pages/Atlas/Prev/PrevCountyMap";

import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import DetailMap from "../../pages/elections/Operations/DetailMap";
import LocationPicker from "../../pages/public/LocationPicker";
import { PublicLocationMarker } from "../../pages/public/LocationPicker";

import DialogContentText from "@mui/material/DialogContentText";
import { useState, useContext, useEffect } from "react";
import useAllCountyData from "../hooks/useAllCountyData";
import useAllStations from "../hooks/useAllStationsChildren";
import useAllConstituencyData from "../hooks/useAllConstituencyData";
import { StateContext } from "../../state/State";
import axiosInstance from "../../state/axiosInstance";
import { decode } from "jsonwebtoken";
import {
  OfficialsForm,
  useFilters,
} from "../../pages/elections/Operations/Operations";
import Toolbar from "@mui/material/Toolbar";

export default function Accounts() {
  // const signup = useSearchQueryParams("signup")
  // const redirect = useSearchQueryParams("redirect")
  // const role = useSearchQueryParams("role")
  const portal = useSearchQueryParams("portal");

  const { path } = useRouteMatch();

  return (
    <Box>
      <Switch>
        <Route exact path={`${path}/portal`}>
          <Login portal />
        </Route>
        <Route exact path={`${path}/portal/registration`}>
          <PortalSignup portal />
        </Route>
        <Route exact path={`${path}/signup`}>
          <Signup />
        </Route>
        <Route exact path={`${path}/verify`}>
          <Login verify />
        </Route>
        <Route path="**">
          <Login />
        </Route>
      </Switch>
    </Box>
  );
}

function Login({ portal, verify }) {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [party, setParty] = useState(null);

  const token = useSearchQueryParams("token");

  const { push } = useHistory();

  const { allCountyData, dispatch } = useContext(StateContext);

  useAllCountyData(true);

  const redirect = useSearchQueryParams("redirect");

  useEffect(() => {
    if (token) {
      setParty(decode(token, { headers: true }));
    }
  }, [token]);

  function handleSubmit(handleClose) {
    if ((state?.email && state?.password) || state?.token) {
      setLoading(true);
      axiosInstance
        .post(!verify ? `/login` : `/party/${party?.id}/verify`, state)
        .then(({ data }) => {
          localStorage.setItem("access_token", data);
          const user = decode(data, { headers: true });
          if (!portal) {
            dispatch({
              type: "ADD_MULTIPLE",
              context: "party",
              payload: user,
            });
            dispatch({
              type: "ADD_MULTIPLE",
              context: "isLoggedIn",
              payload: true,
            });
            setLoading(false);
            if (redirect) {
              push(redirect);
            } else push("/operations");
          }
        })
        .catch((e) => {
          setError(true);
          setLoading(false);
        });
    }
  }

  function handleChange(e) {
    setError(false);
    setState({ ...state, [e.target.name]: e.target.value });
  }

  const submitButton = ({ handleClose }) => {
    if (loading) {
      return (
        <Button type="button" color="warning">
          Verifying...
        </Button>
      );
    } else {
      return (
        <Button onClick={() => handleSubmit(handleClose)}>
          {verify ? "Verify" : "Login"}
        </Button>
      );
    }
  };

  const closeButton = ({ handleClose }) => (
    <Button onClick={handleClose}>Cancel</Button>
  );

  const signupButton = ({ handleClose }) => null;

  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [resend, setResendSuccess] = useState(false);

  const handleResend = () => {
    // axiosInstance.post(`/`)
  };

  return (
    <div>
      <Map zoom={7} className={"AgentSignup"}>
        <AtlasMap
          nonFilter
          checked
          title="Counties"
          datatype="county"
          dat={allCountyData}
        />
        <BasicDialog
          open
          SubmitAction={submitButton}
          SignupAction={signupButton}
          CloseAction={closeButton}
        >
          <Stack spacing={2}>
            <Box sx={{ textAlign: "center" }}>
              <img src={logo} style={{ height: 91, cursor: "pointer" }} />
              <DialogContentText sx={{ mt: 2 }} variant="h6">
                Welcome back!
              </DialogContentText>
            </Box>
            <Box>
              {Boolean(redirect) && (
                <Alert severity="error">
                  <Box>
                    <Typography variant="caption">
                      This page is restricted. Login required.
                    </Typography>
                  </Box>
                </Alert>
              )}
            </Box>

            {verify && (
              <Box>
                <TextField
                  onChange={handleChange}
                  name="token"
                  required
                  label="Verification code"
                  placeholder="Enter 6 digit verification code"
                  fullWidth
                  variant="standard"
                  error={error}
                />
              </Box>
            )}

            {!verify && (
              <>
                <Box>
                  {error && (
                    <Alert severity="error">
                      <Box>
                        <Typography variant="caption">
                          Login Failed. Please Check your username and password.
                        </Typography>
                      </Box>
                    </Alert>
                  )}
                </Box>

                <Box>
                  <TextField
                    onChange={handleChange}
                    name="email"
                    required
                    label="Email address"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter your email address"
                    fullWidth
                    variant="standard"
                    error={error}
                  />
                </Box>
                <Box>
                  <TextField
                    onChange={handleChange}
                    required
                    error={error}
                    name="password"
                    label="Password"
                    type="password"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <KeyIcon />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Enter your password"
                    sx={{ mt: 3 }}
                    fullWidth
                    variant="standard"
                  />
                </Box>
              </>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Link>Enter Kura.ke as a guest</Link>
              {resending && (
                <Typography sx={{ color: "text.secondary" }}>
                  Resending...
                </Typography>
              )}
              {!resending && <Link>Resend verification code</Link>}
            </Box>
          </Stack>
        </BasicDialog>
      </Map>
    </div>
  );
}

function PortalSignup({ portal }) {
  const openButton = ({ onClick }) => <Link onClick={onClick} />;
  const {
    allCountyData,
    allConstData,
    allWardData,
    useCurrentLocation,
    publicLocation,
  } = useContext(StateContext);
  const role = useSearchQueryParams("role");
  const filter = Boolean(useSearchQueryParams("county"));
  useAllCountyData(true);
  useAllConstituencyData();
  useAllStations();

  return (
    <>
      <FullScreenDialog title="Kura ke Portal" RenderButton={openButton}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            lg={5}
            sx={{ height: "91vh", overflow: "auto", py: 3 }}
          >
            <Container>
              <OfficialsForm />
            </Container>
          </Grid>
          <Grid item xs>
            <Box>
              <Toolbar />
              <Map className="smallMap">
                <DetailMap />

                <AtlasMap
                  portal
                  nonFilter
                  checked
                  title="Counties"
                  datatype="county"
                  dat={allCountyData}
                />
                <AtlasMap
                  portal
                  checked={filter}
                  color="#42113C"
                  title="Constituencies"
                  datatype="constituency"
                  dat={allConstData}
                />
                <AtlasMap
                  portal
                  color="#D63AF9"
                  title="Wards"
                  dat={allWardData}
                  datatype="ward"
                />
                {useCurrentLocation && <LocationPicker />}
                {!useCurrentLocation &&
                  Boolean(publicLocation?.lat && publicLocation?.lng) && (
                    <PublicLocationMarker />
                  )}
              </Map>
            </Box>
          </Grid>
        </Grid>
      </FullScreenDialog>
    </>
  );
}

function Signup({ portal }) {
  const openButton = ({ onClick }) => <Link onClick={onClick} />;
  const { allCountyData } = useContext(StateContext);
  return (
    <>
      <FullScreenDialog title="Kura ke signup" RenderButton={openButton}>
        <Grid container>
          <Grid item xs sx={{ backgroundImage: "" }}>
            <Container>
              <Typography variant="h6">Welcome to kura.ke</Typography>
              <Divider sx={{ my: 2 }} />
            </Container>
          </Grid>
          <Grid item xs>
            <Toolbar />
            <Map className="smallMap">
              <AtlasMap
                nonFilter
                checked
                title="Counties"
                datatype="county"
                dat={allCountyData}
              />
            </Map>
          </Grid>
        </Grid>
      </FullScreenDialog>
    </>
  );
}

function ResetPass({ Link }) {
  const handleLinkClick = () => {};
  return (
    <>
      <Link handleClick={handleLinkClick} />
    </>
  );
}
