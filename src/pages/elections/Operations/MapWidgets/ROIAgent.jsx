import { useContext } from "react";
import { StateContext } from "../../../../state/State";
import { Marker, Popup } from "react-leaflet";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";

import PersonIcon from "@mui/icons-material/AccountCircle";
import IconButton from "@mui/material/IconButton"

import { renderToStaticMarkup } from "react-dom/server";
import { divIcon } from "leaflet";

export default function ROIAgent() {
  const { myAgents } = useContext(StateContext);
  const unverified =
    myAgents?.filter((f) => f.located && f.long && f.lat) || [];

  const iconMarkup = renderToStaticMarkup(
    <IconButton size="large">
      <PersonIcon sx={{ fontSize: 36, color: "green" }} />
    </IconButton>
  );
  const customMarkerIcon = divIcon({
    html: iconMarkup,
  });

  return (
    <div>
      {unverified?.map(
        ({ id, lat, long, fullName, isVerified, phone, coordinator }) => (
          <>
            <Marker icon={customMarkerIcon} position={[lat, long]}>
              <Popup>
                <Avatar size="small"></Avatar>
                <Box>
                  <Typography variant="body2">
                    <strong>{fullName}</strong>
                  </Typography>
                  <Typography variant="body2">{phone}</Typography>
                  <Typography variant="body2">
                    {isVerified ? "verified" : "unverified"}
                  </Typography>
                  <Typography>Events: 0</Typography>
                </Box>
                <button style={{ marginRight: 3 }}>
                  {isVerified ? "Revoke" : "Verify Agent"}
                </button>
                <button style={{ marginRight: 3 }}>
                  {isVerified ? "Assign items" : "Ignore"}
                </button>
                <button>New assignment</button>
                <Box sx={{ mt: 2 }}>
                  {coordinator} Profile
                  <Link>View full profile</Link>
                  <hr />
                  <Link>Powered by metricon</Link>
                </Box>
              </Popup>
            </Marker>
          </>
        )
      )}
    </div>
  );
}
