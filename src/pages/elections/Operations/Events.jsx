import React, { useState, useContext, useEffect } from "react";

import HTML5Backend from "react-dnd-html5-backend";
import { DragDropContext } from "react-dnd";
import * as BigCalendar from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import EventIcon from "@mui/icons-material/Event";

import { StateContext } from "../../../state/State";

import AdapterDateFns from "@mui/lab/AdapterDateFns";

import Grid from "@mui/material/Grid";
import BasicDialog from "../../../components/modal/BasicDialog";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Map from "../../../components/Map";
import { PublicLocationMarker } from "../../../pages/public/LocationPicker";
import { NewEventComponent, Header } from "./Operations";
import Stack from "@mui/material/Stack";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import DetailMap from "./DetailMap";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import axiosInstance from "../../../state/axiosInstance";
import { useFilters } from "./Operations";

export const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

const now = new Date();

BigCalendar.momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(BigCalendar);

function Dnd() {
  const { events } = useContext(StateContext);
  const [state, setState] = useState([]);

  function moveEvent({ event, start, end }) {
    const idx = events?.indexOf(event);
    const updatedEvent = { ...event, start, end };

    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);

    setState(nextEvents);
  }

  function resizeEvent(resizeType, { event, start, end }) {
    const { events } = [...state];

    const nextEvents = events.map((existingEvent) => {
      return existingEvent.id == event.id
        ? { ...existingEvent, start, end }
        : existingEvent;
    });

    setState(nextEvents);
  }

  useEffect(() => {
    if (events?.length) {
      const eve = events?.map((c) => {
        const starts = new Date(c.start);
        const ends = new Date(c.end);
        const start = new Date(
          starts.getFullYear(),
          starts.getMonth(),
          starts.getDate(),
          starts.getMinutes()
        );
        const end = new Date(
          ends.getFullYear(),
          ends.getMonth(),
          ends.getDate(),
          ends.getMinutes()
        );
        return { ...c, start, end };
      });
      setState(eve);
    }
  }, [events]);

  return (
    <Box style={{ height: "88vh", overflow: "auto", p: 3, pt: 1 }}>
      <CustomizedDialogs />
      <DragAndDropCalendar
        selectable
        events={state || []}
        onEventDrop={moveEvent}
        resizable
        onEventResize={resizeEvent}
        defaultView={BigCalendar.Views.MONTH}
        defaultDate={new Date()}
      />
    </Box>
  );
}

const Calendar = DragDropContext(HTML5Backend)(Dnd);

export default Calendar;

function EventsForm() {
  const [open, setOpen] = useState(false);
  const { goBack } = useHistory();

  const closeButton = ({ handleClose }) => (
    <Button onClick={goBack}>Cancel</Button>
  );

  const signupButton = ({ handleClose }) => null;

  const submitButton = ({ handleClose }) => <Button>Submit</Button>;

  return (
    // <BasicDialog open>
    //   <Button onClick={() => setOpen(true)} sx={{ textTransform: "none" }}>
    //     Add new
    //   </Button>
    //   <Map zoom={7} className={"AgentSignup"}>
    //     <BasicDialog
    //       setOpen={setOpen}
    //       open={open}
    //       title="Add"
    //       SubmitAction={submitButton}
    //       SignupAction={signupButton}
    //       CloseAction={closeButton}
    //     >
    // <NewEventComponent />
    {
      /* </BasicDialog>
      </Map>
    </BasicDialog> */
    }
  );
}

function CustomizedDialogs() {
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState(null);

  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

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
    getRest,
  } = useFilters();

  console.log(county, isCounty);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const { publicLocation, useCurrentLocation, dispatch, party } =
    useContext(StateContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    axiosInstance
      .post("/events", {
        ...state,
        county,
        constituency,
        ward,
        station,
        lat: publicLocation?.lat,
        long: publicLocation?.lng,
        party: party?.id,
      })
      .then(({ data }) => {
        setSuccess(true);
        dispatch({
          type: "ADD_SINGLE",
          context: "events",
          payload: { ...data, isNew: true },
        });
        setLoading(false);
      })
      .catch((e) => {
        setSuccess(false);
        setLoading(false);
        setErr(true);
      });
  };

  const handleCheckChange = (e) =>
    setState({ ...state, allDay: e.target.checked });

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleDareChange = (val, howLong) => {
    setState({ ...state, [howLong]: val });
  };

  return (
    <div>
      <Box sx={{ my: 2, textAlign: "right" }}>
        <Button
          startIcon={<EventIcon />}
          size="small"
          variant="outlined"
          onClick={handleClickOpen}
        >
          New Event
        </Button>
      </Box>

      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        fullWidth
        maxWidth="md"
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          New event
        </BootstrapDialogTitle>
        <Header where="New event" />
        <DialogContent dividers>
          <Grid container>
            <Grid
              item
              xs={5}
              sx={{ maxHeight: "63vh", overflow: "auto", px: 1 }}
            >
              {!success && (
                <form onSubmit={handleSubmit}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Stack spacing={2}>
                      <TextField
                        name="title"
                        required
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        label="Title"
                      />
                      <TextField
                        name="desc"
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        label="Desc"
                      />
                      <TextField
                        name="agenda"
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        label="Agenda"
                      />
                      <DateTimePicker
                        renderInput={(props) => (
                          <TextField required variant="standard" {...props} />
                        )}
                        label="Event Starts"
                        required
                        value={state?.start || new Date()}
                        onChange={(newValue) => {
                          handleDareChange(newValue, "start");
                        }}
                      />
                      <DateTimePicker
                        size="small"
                        renderInput={(props) => (
                          <TextField required variant="standard" {...props} />
                        )}
                        required
                        label="Event Ends"
                        value={state?.end || new Date()}
                        onChange={(newValue) => {
                          handleDareChange(newValue, "end");
                        }}
                      />
                      <FormGroup>
                        <FormControlLabel
                          control={
                            <Switch
                              size="small"
                              name="allDayEvent"
                              onChange={handleCheckChange}
                              defaultChecked
                              checked={state?.allDay}
                            />
                          }
                          label="All day event"
                        />
                      </FormGroup>
                      <TextField
                        name="locationName"
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        variant="standard"
                        label="Name this location"
                      />
                      <TextField
                        name="hashTag"
                        // onChange={handleChange}
                        fullWidth
                        size="small"
                        value={`#${state?.title}`}
                        variant="standard"
                        label="Use hashtag"
                      />
                      {loading && (
                        <Button
                          sx={{ textTransform: "none" }}
                          color="warning"
                          type="button"
                          variant="contained"
                        >
                          Saving...
                        </Button>
                      )}
                      {!loading && (
                        <Button
                          type="submit"
                          sx={{ textTransform: "none" }}
                          variant="contained"
                        >
                          Create Event
                        </Button>
                      )}
                    </Stack>
                  </LocalizationProvider>
                </form>
              )}
              {success && (
                <Box
                  sx={{
                    height: "63vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Box>
                    <Alert severity="success">Typography</Alert>
                  </Box>
                </Box>
              )}
            </Grid>
            <Grid item xs={7}>
              <Map className="smallMap">
                <DetailMap checked />
                {Boolean(publicLocation?.lat && publicLocation?.lng) && (
                  <PublicLocationMarker />
                )}
              </Map>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
