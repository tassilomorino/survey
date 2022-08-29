import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import useModalControls from "./useModalControls";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
function SimpleDialog(props) {
  const { toggle, open, handleChange, state } = props;

  const setAlignment = (e, alignment) => {
    const event = {
      target: {
        name: "voters",
        value: alignment,
      },
    };
    handleChange(event);
  };
  return (
    <Dialog onClose={toggle} open={open}>
      <DialogTitle>Who can vote</DialogTitle>
      <DialogContent dividers>
        <ToggleButtonGroup
          color="primary"
          value={state?.voters}
          exclusive
          onChange={setAlignment}
        >
          <ToggleButton value="ANYONE">Allow Anyone in test mode</ToggleButton>
          <ToggleButton value="MEMBERS">Party Members</ToggleButton>
          <ToggleButton value="COORDINATORS">Party Coordinators</ToggleButton>
          <ToggleButton value="OFFICIALS">Party Officials</ToggleButton>
        </ToggleButtonGroup>
      </DialogContent>
      <DialogActions>
        <Button onClick={toggle}> Cancel</Button>
        <Button onClick={toggle}>Continue</Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ModalDialog() {
  const [openBallotType, toggleOpenType] = useModalControls();

  return (
    <div>
      <Button
        fullWidth
        sx={{ mt: 2, textTransform: "none" }}
        variant="outlined"
        onClick={toggleOpenType}
        size="large"
        startIcon={<ShieldRoundedIcon />}
      >
        Choose how voters will vote
      </Button>
      <SimpleDialog open={openBallotType} toggle={toggleOpenType} />
    </div>
  );
}
