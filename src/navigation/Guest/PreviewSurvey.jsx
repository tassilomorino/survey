import { SurveyItem } from "../../pages/elections/Operations/Surveys";
import logo from "../../assets/logo.png";
import Box from "@mui/material/Box";
import { useParams, useHistory, useRouteMatch } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import AccountMenu from "../../components/Sidebar/AccountMenu";
import { useContext, useEffect } from "react";
import useSearchQueryParams from "../../components/hooks/useSearchQueryParams";
import { StateContext } from "../../state/State";

export default function PreviewSurvey() {
  const { id } = useParams();
  const mode = useSearchQueryParams("mode");
  const { push } = useHistory();
  const { url } = useRouteMatch();
  const { isLoggedIn } = useContext(StateContext);

  useEffect(() => {
    if (!isLoggedIn) {
      push(`accounts?redirect=${url}`);
    }
  }, []);

  return (
    <div>
      <Container>
        <Box sx={{ my: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <img src={logo} height={72} alt="Kura Ke survey form" />
              <Typography variant="h6">kura KE survey</Typography>
              <Typography variant="caption">Survey ID: {id}</Typography>
            </Box>
            <Box>
              <AccountMenu />
            </Box>
          </Box>
          <Divider sx={{ my: 2 }} />
        </Box>
        <SurveyItem />
      </Container>
      {mode === "preview" && (
        <Box
          sx={{
            bgColor: "lightgray",
            position: "fixed",
            bottom: "0",
            width: "100%",
            py: 2,
            textAlign: "center",
          }}
        >
          <Typography sx={{ color: "white" }}>Survey preview</Typography>
          <Button variant="contained">Publish survey</Button>
        </Box>
      )}
    </div>
  );
}
