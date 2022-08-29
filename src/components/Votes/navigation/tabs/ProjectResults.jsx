import Typography from "@mui/material/Typography";
import ResultItem from "./ResultItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";

export default function ProjectResults() {
  return (
    <Container sx={{ mt: 18}}>
      <Typography variant="h5">Voting is finished</Typography>
      <Button sx={{ textTransform: "none", my: 1 }}>Project results</Button>
      <Box sx={{ my: 3 }}>
        {[1, 2].map((p) => (
          <ResultItem key={p} />
        ))}
      </Box>
    </Container>
  );
}
