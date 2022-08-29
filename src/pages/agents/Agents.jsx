import {
  useRouteMatch,
  useHistory,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { StateContext } from "../../state/State";
import Map from "../../components/Map";
import AtlasAdminSidebar from "../../pages/elections/AtlasAdminSidebar";
import { OperationsHub } from "../../pages/elections/Operations/Operations";
import { useContext } from "react";
import useSocket from "../../components/hooks/useSocket";
import useAllCountyData from "../../components/hooks/useAllCountyData";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

import useOfficials from "../../components/hooks/useOfficials";

import { AtlasMap } from "../Atlas/Prev/PrevCountyMap";

export function Portal() {
  return (
    <Box>
      <OperationsHub portal />
    </Box>
  );
}

export default function Agents() {
  const { path } = useRouteMatch();
  const { push } = useHistory();

  useSocket();
  useAllCountyData();
  useOfficials();

  const { allCountyData } = useContext(StateContext);

  return (
    <>
      <div>
        <AtlasAdminSidebar area={"portal"}>
          <Map className={"sidebarMap"}>
            <AtlasMap
              nonFilter
              checked
              title="Counties"
              datatype="county"
              dat={allCountyData}
            />
          </Map>
        </AtlasAdminSidebar>
      </div>
    </>
  );
}

function AgentRoute({ exact, path, Component }) {
  const { agent, isLoggedIn } = useContext(StateContext);
  if (!Boolean(isLoggedIn)) return <Redirect to="/accounts/portal" />;
  if (!agent?.isVerified)
    return <Redirect to={`/accounts/portal/verify?role="agent`} />;
  return (
    <Route exact={exact} path={path}>
      <Component />
    </Route>
  );
}
