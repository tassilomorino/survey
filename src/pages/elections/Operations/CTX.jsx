import { useContext } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { StateContext } from "../../../state/State";
import Badge from "@mui/material/Badge";
import HomeIcon from "@mui/icons-material/Home";
export default function CTX({ alignment, handleChange }) {
  const { party, myAgents } = useContext(StateContext);
  return (
    <ToggleButtonGroup
      color="primary"
      size="small"
      value={alignment}
      exclusive
      onChange={handleChange}
    >
      <ToggleButton sx={{ textTransform: "none" }} value="home">
        <Badge color="secondary" variant="dot">
          <HomeIcon />
        </Badge>
      </ToggleButton>
      {party?.roi === "National" && (
        <ToggleButton sx={{ textTransform: "none" }} value="counties">
          Counties
        </ToggleButton>
      )}

      {(party?.roi === "National" ||
        party?.position === "Governor" ||
        party?.position === "Senator" ||
        party?.position === "Women representative") && (
        <ToggleButton sx={{ textTransform: "none" }} value="constituencies">
          Constituencies
        </ToggleButton>
      )}
      {party?.position !== "MCA" && (
        <ToggleButton sx={{ textTransform: "none" }} value="wards">
          Wards
        </ToggleButton>
      )}

      <ToggleButton sx={{ textTransform: "none" }} value="stations">
        Stations
      </ToggleButton>
    </ToggleButtonGroup>
  );
}
