import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Portal } from "../agents/Agents";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import NewspaperRoundedIcon from "@mui/icons-material/NewspaperRounded";
import HomeRoundedIcon from "@mui/icons-material/WidgetsRounded";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { Switch, Route, useRouteMatch, useHistory } from "react-router-dom";
import { StateContext } from "../../state/State";
import useSearchQueryParams from "../../components/hooks/useSearchQueryParams";
import logo from "../../assets/logo.png";
import AddLinkIcon from "@mui/icons-material/AddLink";
import SettingsIcon from "@mui/icons-material/Settings";
import ConnectWithoutContactIcon from "@mui/icons-material/ConnectWithoutContact";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PeopleIcon from "@mui/icons-material/People";
import BallotIcon from "@mui/icons-material/Ballot";
import MessageIcon from "@mui/icons-material/Message";
import EventIcon from "@mui/icons-material/Event";
import CategoryIcon from "@mui/icons-material/Category";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import { OperationsHub } from "./Operations/Operations";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";

import HowToVoteIcon from "@mui/icons-material/HowToVote";
import SummarizeIcon from "@mui/icons-material/Summarize";

export const PeoplesIcons = {
  Officials: <AssignmentIndIcon sx={{ color: "#3772FF" }} />,
  Coordinators: <ConnectWithoutContactIcon sx={{ color: "#DE4D86" }} />,
  Members: <PeopleIcon sx={{ color: "#531253" }} />,
  Candidates: <BallotIcon sx={{ color: "#D10000" }} />,
  Events: <EventIcon sx={{ color: "maroon" }} />,
  Votes: <HowToVoteIcon sx={{ color: "#D10000" }} />,
};
const ResIcons = {
  Events: <EventIcon />,
  Resources: <CategoryIcon />,
  Surveys: <EmojiEmotionsIcon style={{ color: "yellow" }} />,
};

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({ children, area }) {
  const { officials, messages } = React.useContext(StateContext);

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const { path, url } = useRouteMatch();
  const { push } = useHistory();

  const filter = useSearchQueryParams("filter");

  const county = useSearchQueryParams("county");
  const constituency = useSearchQueryParams("constituency");
  const ward = useSearchQueryParams("ward");
  const station = useSearchQueryParams("station");

  const getQParams = (route) => {
    if (Boolean(filter)) {
      if (Boolean(ward) && Boolean(constituency) && Boolean(county)) {
        return `${route}?filter=${true}&county=${county}&constituency=${constituency}&ward=${ward}`;
      } else if (Boolean(constituency) && Boolean(county)) {
        return `${route}?filter=${true}&county=${county}&constituency=${constituency}`;
      }
      if (Boolean(county)) {
        return `${route}?filter=${true}&county=${county}`;
      }
    } else {
      return route;
    }
  };

  const isSelected = (text) => window.location.pathname.includes(text);

  const getRole = (context) =>
    context === "Officials"
      ? "OFFICIAL"
      : context === "Members"
      ? "MEMBER"
      : context === "Coordinators"
      ? "COORDINATOR"
      : context === "Candidates"
      ? "CANDIDATE"
      : "VOLUNTEER";

  const data = officials || [];

  const unreadOfficials =
    messages?.filter((m) => !m.isRead && m.ctx === "signup") || [];

  const unReadNotes =
    messages?.filter((m) => !m.isRead && m.ctx === "message") || [];

  const unReadEvents =
    messages?.filter((m) => !m.isRead && m.ctx === "events") || [];

  const filterRoi = (item, index) => {
    if (!filter) {
      return item;
    }
    if (filter) {
      if (county && constituency && ward && station) {
        return item.station === station;
      }
      if (county && constituency && ward) {
        return item.ward === ward;
      }
      if (county && constituency) {
        return item.constituency === constituency;
      }
      if (county) {
        return item.county === county;
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar elevation={0} color="default" position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            // onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <img src={logo} height={36} alt="" />
          <Typography variant="h6" noWrap component="div">
            {area === "operations" && "KURA.ke Operations"}
            {area === "portal" && "KURA.ke Portal"}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={false}>
        {Boolean(open || filter) && (
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
        )}

        {!Boolean(open || filter) && (
          <DrawerHeader>
            <IconButton onClick={handleDrawerOpen}>
              <MenuIcon />
            </IconButton>
          </DrawerHeader>
        )}

        <Divider />
        <List sx={{ display: area === "portal" ? "block" : "none" }}>
          {["Home", "New"].map((text, index) => (
            <ListItem
              onClick={() =>
                push(index === 0 ? "/portal/Home" : "/portal/News")
              }
              button
              key={text}
            >
              <ListItemIcon>
                {index % 2 === 0 ? (
                  <HomeRoundedIcon />
                ) : (
                  <NewspaperRoundedIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ display: area === "operations" ? "block" : "none" }} />
        <List>
          {[
            ...["Officials", "Coordinators", "Members"],
            area === "operations" ? "Candidates" : "Votes",
          ].map((text, index) => (
            <ListItem
              selected={isSelected(text)}
              onClick={() => push(getQParams(`/${area}/${text}`))}
              button
              key={text}
            >
              <ListItemIcon>
                <Tooltip title={text}>
                  <Badge
                    color="secondary"
                    badgeContent={
                      unreadOfficials.filter((d) => d.role === text)?.length
                    }
                  >
                    {PeoplesIcons[text]}
                  </Badge>
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Events", "Resources", "Surveys"].map((text, index) => (
            <ListItem
              onClick={() => push(getQParams(`/${area}/${text}`))}
              button
              key={text}
            >
              <Badge
                color="secondary"
                badgeContent={index === 0 ? unReadEvents?.length : 0}
              >
                <ListItemIcon>{ResIcons[text]}</ListItemIcon>
              </Badge>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List sx={{ display: area === "operations" ? "block" : "none" }}>
          {["Votes", "Analytics"].map((text, index) => (
            <ListItem
              onClick={() => push(index === 0 ? "/votes" : "/analytics")}
              button
              key={text}
            >
              <ListItemIcon>
                {index % 2 === 0 ? <HowToVoteIcon /> : <SummarizeIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ display: area === "operations" ? "block" : "none" }} />
        <List>
          {["Notifications", "Settings"].map((text, index) => (
            <ListItem
              onClick={() => push(getQParams(`/${area}/${text}`))}
              button
              key={text}
            >
              <ListItemIcon>
                {index === 1 && <SettingsIcon />}{" "}
                {index === 0 && (
                  <Badge badgeContent={unReadNotes.length} color="secondary">
                    <CircleNotificationsIcon />
                  </Badge>
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        {/* <NewDrawer /> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Toolbar />
        <Grid container>
          <Switch>
            <Route path={`${path}/:context`}>
              <Grid
                item
                xs={12}
                md={5}
                lg={window.location.pathname.includes("Events") ? 6 : 4}
                sx={{
                  maxHeight: "90vh",
                  overflow: "auto",
                  // bgcolor: "rgba(25, 118, 210, 0.08)",
                }}
              >
                {area === "operations" && <OperationsHub />}
                {area === "portal" && <Portal />}
              </Grid>
            </Route>
          </Switch>
          <Grid item xs>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
