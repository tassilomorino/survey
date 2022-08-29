import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import CommentIcon from "@mui/icons-material/Delete";
import { StateContext } from "../../../state/State";

export default function VotesList() {
  const [checked, setChecked] = React.useState([0]);

  const { ballots, dispatch } = React.useContext(StateContext);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {ballots?.map(({ title }, i) => {
        const labelId = `checkbox-list-label-${i}`;
        return (
          <ListItem
            key={i}
            secondaryAction={
              <IconButton
                onClick={() =>
                  dispatch({
                    type: "REMOVE_BALLOT",
                    payload: i,
                  })
                }
                edge="end"
                aria-label="comments"
              >
                <CommentIcon />
              </IconButton>
            }
            disablePadding
          >
            <ListItemButton
              role={undefined}
              onClick={handleToggle(title)}
              dense
            >
              {/* <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon> */}
              <ListItemText id={labelId} primary={title} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
