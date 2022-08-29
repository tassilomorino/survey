import { useContext, useEffect, useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { StateContext } from "../../../state/State";
import useSearchQueryParams from "../../../components/hooks/useSearchQueryParams"
export default function Ctx({alignment, handleChange}) {
  const { officials } = useContext(StateContext);


  const data = (officials || []).filter(f => f.role === "CANDIDATE")

  const presidentialCandidates = data.filter(d => d.candidateType === "presidential")


  const filter = Boolean(useSearchQueryParams("filter"))
  const ward = useSearchQueryParams("ward")
  const constituency = useSearchQueryParams("constituency")
  const county = useSearchQueryParams("county")

  const isPresidential = !filter
  const isWard = Boolean(ward)
  const isConstituency = Boolean(constituency) && !Boolean(ward)
  const isCounty = Boolean(county) & !Boolean(constituency) && !Boolean(ward)


  return (
    <>

      {/* {filter && presidentialCandidates.length && (
        <ToggleButton sx={{ textTransform: "none" }} value="presidential">
          Pres
        </ToggleButton>
      )} */}
      {!isPresidential && (
        <ToggleButtonGroup
          color="primary"
          size="small"
          value={alignment}
          exclusive
          onChange={handleChange}

          sx={{ mb: 2 }}
        >
          <ToggleButton sx={{ textTransform: "none" }} value="governor">
            Gov
          </ToggleButton>
          <ToggleButton sx={{ textTransform: "none" }} value="senator">
            Sen
          </ToggleButton>
          <ToggleButton sx={{ textTransform: "none" }} value="w_rep">
            W Rep
          </ToggleButton>
          <ToggleButton sx={{ display: (!isConstituency) ? "none" : "inline", textTransform: "none" }} value="mp">
            MP
          </ToggleButton>
          <ToggleButton sx={{ display: (!isWard) ? "none" : "inline", textTransform: "none" }}  value="mca">
            MCA
          </ToggleButton>
        </ToggleButtonGroup>

      )}

    </>

  );
}
