import Typography from "@mui/material/Typography";
import ResultItem from "./ResultItem";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

export default function Results() {
  const { push } = useHistory();
  return (
    <div>
      <Typography variant="h5">Voting is finished</Typography>
      <Button onClick={()=>push("/project")} sx={{ textTransform: "none", my: 1 }}>Project results</Button>
      <Box sx={{ my: 3 }}>
        {[1, 2].map((p) => (
          <ResultItem key={p} />
        ))}
      </Box>
    </div>
  );
}
