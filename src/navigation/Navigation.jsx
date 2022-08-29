import { Switch, Route, useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button"
import ErrorBoundary from "./ErrorBoundary";



export default function Navigation({ options }) {
  return (
    <ErrorBoundary>
    <Switch>
      {options.map(({ isExact, path, Component }, i) => (
        <Route key={i} exact={Boolean(isExact)} path={path}>
          <Component />
        </Route>
      ))}
      <Route path="**" component={FO4} />
    </Switch>
    </ErrorBoundary>
  );
}


const FO4 = () => {
  const { push } = useHistory()
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Box>
        <Typography variant="h6">Resource not found</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography>Coming soon...</Typography>
        <Button onClick={() => push("/")} variant="contained">Back Home</Button>
      </Box>
    </Box>
  );
};