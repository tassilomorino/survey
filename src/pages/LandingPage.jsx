import Map from "./../components/Map";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { useHistory } from "react-router-dom";
import { DenseMap, AtlasMap } from "./Atlas/Prev/PrevCountyMap";
import Button from "@mui/material/Button";
import { StateContext } from "../state/State";
import { useContext } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import AccountMenu from "../components/Sidebar/AccountMenu";
import useAllCountyData from "../components/hooks/useAllCountyData";
import useAllConstData from "../components/hooks/useAllConstituencyData"
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack"
import Container from "@mui/material/Container"

import Dialog from "@mui/material/Dialog"

export default function LandingPage() {
  const { push } = useHistory();
  useAllCountyData()
  useAllConstData()
  const { loadingCountyChildren, allCountyData } = useContext(StateContext);
  return (
    <Box style={{ backgroundColor: "#30332E" }} >
      <Box sx={{ display: "flex", alignItems: "space-between", justifyContent: "space-between", p: 2, px: 3 }}  >
        <Typography sx={{ color: "lightgray" }} variant="h6">
          Kura.Ke
        </Typography>
        <Box>
          <AccountMenu />
        </Box>
      </Box>
      <Box>
        <Map zoom={7} className="smallMap" >
          <AtlasMap nonFilter checked title="Counties" datatype="county" dat={allCountyData} />
        </Map>
      </Box>
      <Container>
        <Box sx={{ height: "30vh", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center" }} >
          <Box>
            <Typography sx={{ color: "lightgray", mt: 2 }}  >Use the power of GIS and AI, with direct communication tools to your team members at all levels </Typography>
            <Typography sx={{ color: "lightgray" }}>Track activities at all levels, conduct polls and surveys and perfom real-time analytics on voter data</Typography>
            <Button sx={{ mt: 6 }} onClick={() => push("/accounts/new")} variant="contained" >Get started</Button>
          </Box>
        </Box>
      </Container>
      <Container>
        <div
          style={{ backgroundColor: "#297373", paddingBottom: "72px" }}
        >
          <Box  >
            <Box sx={{ textAlign: "center", mt: 2 }} >
              <Typography variant="h4" sx={{ color: "white" }} >Features</Typography>
            </Box>
            <Box>
              <Grid container >
                <Grid item xs={12} md={6} lg={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 6 }} >
                  <Box sx={{ textAlign: "center" }}  >
                    <Stack spacing={2} >
                      <Typography sx={{ color: "white" }} variant="h5">KURA.KE ATLAS</Typography>
                      <Divider />
                      <Typography sx={{ color: "white" }} >
                        View and analyze past election results. Ideal for  real-time media results streaming use and election trend analytics
                      </Typography>
                      <Button onClick={() => push('/atlas')} color="secondary" variant="contained" disableElevation >Explore Atlas</Button>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} lg={6} >
                  {loadingCountyChildren && (
                    <Box>
                      <LinearProgress />
                    </Box>
                  )}
                  <Map className="smallMap" >
                    <AtlasMap dark checked dat={allCountyData} title="Atlas Counties" ></AtlasMap>
                  </Map>
                </Grid>
              </Grid>
            </Box>
            <Box sx={{ mt: 3 }} >
              <Grid container >
                <Grid item xs={12} md={6} lg={6} >
                  {loadingCountyChildren && (
                    <Box>
                      <LinearProgress />
                    </Box>
                  )}
                  <Map className="smallMap" >
                    <DenseMap checked />
                  </Map>
                </Grid>
                <Grid item xs={12} md={6} lg={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 3 }} >
                  <Box sx={{ textAlign: "center" }}  >
                    <Stack spacing={2} >
                      <Typography sx={{ color: "white" }} variant="h5">Voting patterns</Typography>
                      <Divider />
                      <Typography sx={{ color: "white" }} >
                        Make your decisions using state of the art AI tools that take account of accurate area information, including population density, voter and household distribution to help you target your operations
                      </Typography>
                      <Button onClick={() => push("/operations")} color="secondary" variant="contained" disableElevation >Go to operations</Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>

        </div>
      </Container>
    </Box>

  );
}
