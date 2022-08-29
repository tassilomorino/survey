import { useContext } from 'react';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import PeopleAltSharpIcon from '@mui/icons-material/PeopleAltSharp'; import PushPinSharpIcon from '@mui/icons-material/PushPinSharp';
import Box from "@mui/material/Box"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom"
import { SendMessages } from "./Operations"
import { StateContext } from '../../../state/State';
export default function NotifyContainer() {
    const { path } = useRouteMatch()
    return (
        <Switch>
            <Route exact path={path} >
                <FolderList />
            </Route>
            <Route exact path={`${path}/new`} >
                <MessageDetail />
            </Route>
            <Route exact path={`${path}/:id`} >
                <MessageDetail />
            </Route>
        </Switch>
    )
}


function FolderList() {
    const { url } = useRouteMatch()
    const { push } = useHistory()
    const { messages } = useContext(StateContext)
    const unReadNotes = messages?.filter(m => !m.isRead && m.ctx === "message") || []
    return (
        <Box>
            <Box sx={{ textAlign: "center", my: 2 }}>
                <Typography variant="h6" >Notifications</Typography>
            </Box>
            <List sx={{ width: '100%', mt: 3, bgcolor: 'background.paper', minHeights: "72vh" }}>
                {['Officials', 'Coordinators', 'Members', 'Candidates'].map((text, index) => (
                    <ListItemButton key={index} onClick={() => push(`${url}/new?ctx=${text}`)} dense secondaryAction={<IconButton size="small" ><PushPinSharpIcon /></IconButton>} >
                        <ListItemAvatar>
                            <Avatar>
                                <PeopleAltSharpIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={text} />
                    </ListItemButton>
                ))}
            </List>
            <Box sx={{ my: 2, textAlign: "center" }} >
                <Typography variant="h6" ></Typography>
            </Box>
            <Typography>Unread</Typography>
            <List sx={{ width: '100%', mt: 3, bgcolor: 'background.paper', minHeights: "72vh" }}>
                {unReadNotes.map((text, index) => (
                    <ListItemButton key={index} onClick={() => push(`${url}/new?ctx=${text.message.subject}`)} dense >
                        <ListItemAvatar>
                            <Avatar>
                                <PeopleAltSharpIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={text.message.subject} secondary={text.message.body} />
                    </ListItemButton>
                ))}
            </List>
        </Box>

    );
}


function MessageDetail() {
    return (
        <Box>
            <SendMessages fullWidth />
        </Box>
    )
}