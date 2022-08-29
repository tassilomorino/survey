import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import useModalControls from "./useModalControls";
import DatePicker from "./DatePicker";
function SimpleDialog(props) {
  const { toggle, open } = props;

  return (
    <Dialog onClose={toggle} open={open}>
      <DialogTitle>Date</DialogTitle>
      <DatePicker />
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

export default function DateModal({ title }) {
  const [openBallotType, toggleOpenType] = useModalControls();

  return (
    <div>
      <Button
        fullWidth
        sx={{ mt: 2, textTransform: "none" }}
        variant="outlined"
        onClick={toggleOpenType}
      >
        {title}
      </Button>
      <SimpleDialog open={openBallotType} toggle={toggleOpenType} />
    </div>
  );
}
