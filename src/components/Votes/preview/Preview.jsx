import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import ContestantList from "./ContestantList";

export default function Preview() {
  return (
    <Grid container>
      {/* <Grid item xs={3}>
        <div
          style={{
            backgroundColor: "lightgray",
            minHeight: "100vh",
            padding: 10,
          }}
        >
          <Button
            endIcon={<ContentCopyIcon />}
            sx={{ mt: 2 }}
            variant="outlined"
            fullWidth
          >
            Copy preview link
          </Button>
        </div>
      </Grid> */}
      <Grid item xs>
        <Container sx={{ mt: 2, textAlign: "center" }}>
          <Button color="warning">Vote is underway</Button>
          <Typography sx={{ color: "text.secondary", my: 3 }}>
            Secret vote
          </Typography>
          <Typography variant="h5">New vote</Typography>
          <Typography sx={{ textTransform: "text.secondary", mt: 2 }}>
            From {Date()}
          </Typography>
          <Typography sx={{ textTransform: "text.secondary", mt: 2 }}>
            Organizer:
          </Typography>
          <div style={{ textAlign: "left" }}>
            <Typography sx={{ mt: 5 }}>Choose one option</Typography>
          </div>
          <Divider sx={{ my: 2 }} />
          <ContestantList />
          <Button
            sx={{ mt: 2 }}
            disableElevation
            size="large"
            fullWidth
            variant="contained"
          >
            Vote
          </Button>
        </Container>
      </Grid>
    </Grid>
  );
}
