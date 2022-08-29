import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import EditIcon from "@mui/icons-material/Edit"
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import Paper from "@mui/material/Paper";
import { useHistory } from "react-router-dom";
import { StateContext } from "../../state/State";
import Signup from "../modal/FullscreenDialog";
export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { push } = useHistory();
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isLoggedIn, dispatch } = React.useContext(StateContext);

  function handleAuth() {
    if (Boolean(isLoggedIn)) {
      localStorage.clear();
      dispatch({
        type: "RESET_STATE"
      });
      push("/accounts");
    } else {
      dispatch({
        type: "RESET_STATE"
      });
      push("/accounts");
    }
  }

  return (
    <Paper>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          textAlign: "center"
        }}
      >
        <Tooltip title="Account settings">
          <IconButton onClick={handleClick} size="small">
            <Avatar sx={{ width: 32, height: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0
            }
          }
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {Boolean(isLoggedIn) && (
          <span>
            <Divider />
            <MenuItem>
              <Avatar /> Profile
            </MenuItem>
            <MenuItem>
              <Avatar /> My account
            </MenuItem>
          </span>
        )}
        {!Boolean(isLoggedIn) && (
          <span>
            <Divider />
            <Signup RenderButton={({handleClick})=>
               <MenuItem onClick={handleClick} >
               <ListItemIcon>
                 <PersonAdd />
               </ListItemIcon> Register
             </MenuItem>
            } >
              
            </Signup>
          </span>
        )}
        <MenuItem onClick={handleAuth}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          {Boolean(isLoggedIn) ? "Logout" : "Login"}
        </MenuItem>
        <MenuItem onClick={() => push("/editor")}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          Edit tool
        </MenuItem>
      </Menu>
    </Paper>
  );
}
