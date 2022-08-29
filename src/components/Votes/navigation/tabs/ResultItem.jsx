import * as React from "react";
import PropTypes from "prop-types";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import PeopleIcon from "@mui/icons-material/People";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate and buffer variants.
   * Value between 0 and 100.
   */
  value: PropTypes.number.isRequired,
};

export default function ResultItem() {
  const [progress, setProgress] = React.useState(0);

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography>1. Candidate name</Typography>
        <Box>
          <IconButton>
            <PeopleIcon />
          </IconButton>
           0
        </Box>
      </Box>
      <LinearProgressWithLabel value={progress} />
    </Box>
  );
}
