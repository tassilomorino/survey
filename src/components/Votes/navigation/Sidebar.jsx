import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";
import { StateContext } from "../../../state/State";
import AccountMenu from "../../Sidebar/AccountMenu";
import Paper from "@mui/material/Paper";
import VotesList from "./VotesList";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { useRouteMatch } from "react-router-dom";

const drawerWidth = 240;

function Sidebar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const { showStations, dispatch } = React.useContext(StateContext);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const { path } = useRouteMatch();

  const drawer = (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Toolbar>
          <Typography>Kura Ke</Typography>
        </Toolbar>
        <Toolbar>
          <IconButton>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </div>
      <Divider />
      <Toolbar>
        <Paper sx={{ width: 200 }}>
          <Button fullWidth sx={{ textTransform: "none" }}>
            New vote
          </Button>
        </Paper>
      </Toolbar>
      <Divider />
      <Toolbar>
        <Paper sx={{ width: 200 }}>
          <VotesList />
        </Paper>
      </Toolbar>
      <Divider />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const { push } = useHistory();
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Paper p={3} sx={{ bgcolor: "background.paper", mr: 2 }}>
          <IconButton onClick={() => push("/detail")}>
            <MenuIcon />
          </IconButton>
        </Paper>
        <Box sx={{ position: "absolute", right: 10 }}>
          <Box>
            <Toolbar>
              <AccountMenu />
            </Toolbar>
          </Box>
        </Box>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{ flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        {/* <Toolbar /> */}
        {props.children}
      </Box>
    </Box>
  );
}

export default Sidebar;
