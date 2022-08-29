import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import QRCode from "react-qr-code";
import People from "@mui/icons-material/People";
export default function VoteView() {
  return (
    <Container
      sx={{
        textAlign: "center",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div>
        <Typography variant="h5">Vote</Typography>
        <Grid container mt={3} spacing={2}>
          <Grid item xs>
            <QRCode value="hello world" />
          </Grid>
          <Grid item xs  align="left">
            <Typography variant="h5">Voting link</Typography>
            <Typography sx={{ my: 2 }} color="primary" variant="h4">
            window.location.host{"/votes"}
            </Typography>
            <Typography variant="h5">People voted</Typography>
            <People /> <span style={{ fontSize: 60 }}>0</span>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}
