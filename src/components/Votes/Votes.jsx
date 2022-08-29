import {
  Switch,
  Route,
  useRouteMatch,
  Redirect,
  useHistory,
} from "react-router-dom";
import Preview from "./preview/Preview";
import Link from "@mui/material/Link";
import logo from "../../assets/logo.png";
import useAllCountyData from "../hooks/useAllCountyData";
import useOfficials from "../hooks/useOfficials";
import { AtlasMap } from "../../pages/Atlas/Prev/PrevCountyMap";
import DetailMap from "../../pages/elections/Operations/DetailMap";
import QRCode from "react-qr-code";
import { StateContext } from "../../state/State";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Grid";
import Map from "../Map";
import Alert from "@mui/material/Alert";
import { useContext, useState, useEffect } from "react";
import BasicDialog from "../modal/BasicDialog";
import axiosInstance from "../../state/axiosInstance";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import HowToVoteRoundedIcon from "@mui/icons-material/HowToVoteRounded";
import DatePicker from "./forms/Modals/DatePicker";
import ModalDialog from "./forms/Modals/ModalDialog";
import { PeopleMap } from "../../pages/Atlas/Prev/PrevCountyMap";
import { PeoplesIcons } from "../../pages/elections/AtlasAdminSidebar";
export default function Votes() {
  useAllCountyData(true);
  useOfficials();
  const { path } = useRouteMatch();
  const { goBack, push } = useHistory();

  const { allCountyData, isLoggedIn, party, dispatch } =
    useContext(StateContext);
  const [loading, setLoading] = useState(false);

  const submitButton = ({ handleClose }) => {
    if (loading) {
      return (
        <Button type="button" color="warning">
          Creating vote...
        </Button>
      );
    } else {
      return (
        <>
          <Switch>
            <Route path={path}>
              <Button onClick={() => handleSubmit(handleClose)}>
                Create Vote
              </Button>
            </Route>
            <Route path={path}>
              <Button onClick={() => handleSubmit(handleClose)}>Vote</Button>
            </Route>
          </Switch>
        </>
      );
    }
  };

  const closeButton = ({ handleClose }) => (
    <Button onClick={goBack}>Cancel</Button>
  );

  const signupButton = ({ handleClose }) => null;

  const [state, setState] = useState({
    voters: "MEMBERS",
  });
  const [success, setSuccess] = useState(false);
  const [err, setErr] = useState(false);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const getRand = () => Math.random().toString(16).substr(2, 8);

  function handleSubmit() {
    setLoading(true);
    if (!Boolean(state)) {
      setLoading(false);
      setSuccess(false);
      setErr(true);
    } else {
      axiosInstance
        .post("/vote", {
          ...state,
          party: party?.id,
        })
        .then(({ data }) => {
          setSuccess(true);
          dispatch({
            type: "ADD_SINGLE",
            payload: { ...data, isNew: true },
            context: "votes",
          });
          setLoading(false);
          push(`/votes/${data.rand}`);
        })
        .catch((e) => {
          setErr(true);
          setState(getRand());
          setLoading(false);
        });
    }
  }

  useEffect(() => {
    setState({
      ...state,
      rand: getRand(),
    });
  }, []);

  if (!isLoggedIn && !Boolean(localStorage.getItem("access_token")))
    return <Redirect to={`/accounts?redirect=${"votes"}`} />;

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
          medium
          open
          title="Vote"
          SubmitAction={submitButton}
          SignupAction={signupButton}
          CloseAction={closeButton}
        >
          <Switch>
            <Route exact path={path}>
              <VotesForm
                success={success}
                err={err}
                state={state}
                setState={setState}
                handleChange={handleChange}
              />
            </Route>
            <Route exact path={`${path}/previous`}>
              <PreviousElections />
            </Route>
            <Route exact path={`${path}/:id`}>
              <CandidateList />
            </Route>
            <Route exact path={`${path}/:id/preview`}>
              <Preview />
            </Route>
          </Switch>
        </BasicDialog>
      </Map>
    </div>
  );
}

function CandidateList() {
  const { allCountyData, officials } = useContext(StateContext);
  const candidates = officials?.filter((o) => o.role === "Candidates") || [];

  const withCandidates = allCountyData?.map((c) => {
    const can = candidates?.filter((a) => a.county === c[0].county);
    return [...[{ ...c[0], candidates: can }]];
  });


  return (
    <Grid container spacing={1}>
      <Grid sx={{ maxHeight: "63vh", overflow: "auto" }} item xs={4}>
        <Alert severity="warning">
          <Typography variant="caption">
            Confirm candidate details for this election.
          </Typography>
        </Alert>
      </Grid>
      <Grid item xs>
        <Map className="smallMap">
          <DetailMap />
          <PeopleMap
            checked
            Icons={PeoplesIcons}
            dat={candidates}
            title="Candidates"
          />
          <AtlasMap
            nonFilter
            checked
            votes
            title="Counties"
            datatype="county"
            dat={withCandidates}
          />
        </Map>
      </Grid>
    </Grid>
  );
}

function CandidateCard({ data, isVote }) {
  const [votes, setVotes] = useState(false);

  return (
    <Grid item xs={6}>
      <Paper>
        <Box>
          <Avatar src={data.avatar}>
            {data.firstname[0]}
            {data.lastname[0]}
          </Avatar>
          <Typography>
            {data.firstname}
            {data.lastname}
          </Typography>
          {isVote && <Button>VOTE</Button>}
        </Box>
      </Paper>
    </Grid>
  );
}

export function PreviousElections() {
  const { votes, officials, allCountyData, events } = useContext(StateContext);
  const data = votes || [];
  const { push } = useHistory();
  return (
    <Grid container>
      <Grid sx={{ maxHeight: "63vh", overflow: "auto" }} item xs={4}>
        <Box sx={{ p: 2 }}>
          <Box>
            <Typography>Previous elections</Typography>
          </Box>
          <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            {data.map((f, i) => {
              const { rand, id } = f;
              return (
                <ListItem onClick={() => push(`/votes/${rand}`)} key={id}>
                  <ListItemAvatar>
                    <Avatar>
                      <HowToVoteRoundedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={rand} secondary="Active" />
                </ListItem>
              );
            })}
          </List>
        </Box>
      </Grid>
      <Grid item xs>
        <Map className="smallMap">
          <DetailMap />
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
  );
}

function VotesForm({ handleChange, state, err, success, setState }) {
  const { path } = useRouteMatch();
  const { push } = useHistory();

  const handleDareChange = (v, key) => {
    setState({ ...state, [key]: v });
  };

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid
          item
          xs={3}
          sx={{
            bgcolor: "lightgray",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <QRCode size={108} value={`${window.location.hostname}/rand`} />
          </Box>
        </Grid>
        <Grid item xs>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "right" }}>
              <img height={72} src={logo} alt="kura ke logo" />
            </Box>
            <Typography variant="h6">Create a new vote</Typography>
            <Typography sx={{ mb: 2 }}>
              Streamline your decision making process
            </Typography>
            {success && (
              <Alert severity="success">
                <Typography>Vote created successfully</Typography>
              </Alert>
            )}
            {err && (
              <Alert severity="error">
                <Typography>An error occured</Typography>
              </Alert>
            )}
            <TextField
              required
              name="rand"
              onChange={handleChange}
              value={state?.rand}
              fullWidth
              label="Vote ID"
              variant="standard"
            />
            <TextField
              required
              onChange={handleChange}
              value={state?.title}
              name="title"
              fullWidth
              label="Title"
              variant="standard"
            />
            {/* <Description /> */}
            <ModalDialog handleChange={handleChange} state={state} />
            <Box sx={{ my: 2 }}>
              <DatePicker handleDareChange={handleDareChange} />
            </Box>
            <Link onClick={() => push(`/votes/previous`)} sx={{ mt: 1 }}>
              View Previous votes
            </Link>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
