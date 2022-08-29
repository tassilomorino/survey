import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/Close";
import TextField from "@mui/material//TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
export default function AssignForm({ toggleAssignment }) {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <p>Assign request</p>
        </div>
        <div>
          <IconButton size="small" onClick={toggleAssignment}>
            <ArrowBackIcon />
          </IconButton>
        </div>
      </div>
      <Stack spacing={2}>
        <TextField
          label="Assigned to"
          placeholder="Select asignee"
          size="small"
          fullWidth
        />
        <Grid container spacing={1}>
          <Grid item xs={4}>
            <TextField label="Priority" size="small" fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Due date" size="small" fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField label="Time" size="small" fullWidth />
          </Grid>
        </Grid>
        <TextField
          label="ID"
          placeholder="Enter assignee ID"
          size="small"
          fullWidth
        />

        <TextField
          label="Description"
          placeholder="Describe the assignment"
          multiline
          size="small"
          fullWidth
        />
        <TextField
          label="file"
          disabled
          multiline
          size="small"
          fullWidth
          type="file"
        />
        <Button disableElevation fullWidth variant="contained">
          Save
        </Button>
      </Stack>
    </>
  );
}
