import React from "react";

import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import CopyIcon from "@mui/icons-material/ContentCopy";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useHistory } from "react-router-dom";
export default function Voting({ handleTabChange }) {
  const url = window.location.host + "/voting";
  const handleUrlCopy = () => {
    navigator.clipboard.writeText(url);
  };
  const { push } = useHistory();
  return (
    <Grid container>
      <Grid item xs={8}>
        <div>
          <Typography variant="body1">VOTED</Typography>
          <Typography variant="h2">0</Typography>
          <Typography sx={{ mt: 5 }} variant="body1">
            Voting Link
          </Typography>
          <Typography sx={{ color: "text.secondary", mt: 2 }} variant="caption">
            Everyone who can view the link will be able to vote.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <TextField
            value={url}
            placeholder="voting link"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleUrlCopy}>
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>
      </Grid>
      <Grid item xs>
        <div>
          <Button
            onClick={() => push(`/vote-view`)}
            fullWidth
            variant="outlined"
          >
            View on screen
          </Button>
          <Divider sx={{ my: 2 }} />
          <Button
            onClick={() => handleTabChange(2)}
            disableElevation
            variant="contained"
            fullWidth
          >
            Finish voting
          </Button>
        </div>
      </Grid>
    </Grid>
  );
}
