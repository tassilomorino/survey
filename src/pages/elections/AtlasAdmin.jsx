import AtlasAdminSidebar from "./AtlasAdminSidebar";
import { Switch, Route, Redirect, useRouteMatch } from "react-router-dom";
import Operations from "./Operations/Operations";
import { StateContext } from "../../state/State";
import { useContext, useEffect } from "react";
import { decode } from "jsonwebtoken";

export default function AtlasAdmin() {
  const { path } = useRouteMatch();
  return (
    <AtlasAdminSidebar area="operations">
      <div style={{ backgroundColor: "#297373" }}>
        <Switch>
          <PartyRoute path={path}>
            <Operations />
          </PartyRoute>
          <Route path="**">Resource not found</Route>
        </Switch>
      </div>
    </AtlasAdminSidebar>
  );
}

const PartyRoute = ({ children, path }) => {
  const access_token = localStorage.getItem("access_token");

  const { isLoggedIn, party, checkingLoginStatus, dispatch } =
    useContext(StateContext);

  useEffect(() => {
    if (access_token && !isLoggedIn) {
      const user = decode(access_token, { headers: true });
      if (user.isParty) {
        dispatch({
          type: "ADD_MULTIPLE",
          payload: user,
          context: "party",
        });

        dispatch({
          type: "ADD_MULTIPLE",
          payload: true,
          context: "isLoggedIn",
        });
      }
    }
  }, []);

  if (!Boolean(isLoggedIn) && !checkingLoginStatus && !access_token)
    return <Redirect to={`/accounts?redirect=${window.location.pathname}`} />;
  if (isLoggedIn && !Boolean(party?.isVerified)) {
    return (
      <Redirect to={`/accounts/verify?token=${access_token}&party=${true}`} />
    );
  } else if (isLoggedIn && !Boolean(party?.hasPlan)) {
    return <Redirect to={`/accounts/setup?token=${access_token}`} />;
  }
  return <Route path={path}>{children}</Route>;
};
