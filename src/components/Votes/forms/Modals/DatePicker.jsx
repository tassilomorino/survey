import * as React from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DateTimePicker from "@mui/lab/DateTimePicker";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

export default function DatePicker({ state, handleDareChange }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container>
        <Grid item xs>
          <DateTimePicker
            renderInput={(props) => (
              <TextField required variant="standard" {...props} />
            )}
            label="Starts"
            required
            value={state?.start || new Date()}
            onChange={(newValue) => {
              handleDareChange(newValue, "start");
            }}
          />
        </Grid>
        <Grid item xs>
          <DateTimePicker
            renderInput={(props) => (
              <TextField
                helperText="You can manually stop voting"
                required
                variant="standard"
                {...props}
              />
            )}
            label="Ends"
            required
            value={state?.end || new Date()}
            onChange={(newValue) => {
              handleDareChange(newValue, "start");
            }}
          />
          <Box sx={{ textAlign: "center" }}></Box>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
