import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import TablePagination from "@mui/material/TablePagination";
import { colors } from "@mui/material";
import { StateContext } from "../../../../state/State";
import { useParams } from "react-router-dom";
const getColors = () => {
  return Object.keys(colors)[
    Math.floor(Math.random() * Object.keys(colors).length)
  ];
};

export default function RequestTable({
  alignment,
  onClickRow,
  toggleAssignment,
}) {
  const {
    loadingStationNames,
    selectedAgents,
    dispatch,
    agents,
    resources,
  } = React.useContext(StateContext);

  const { name } = useParams();

  const data =
    alignment === "agents"
      ? agents?.filter((f) => f.roi === name)
      : alignment === "resources"
      ? resources?.filter((f) => f.roi === name)
      : [];


  const setSelected = (v) => {
    dispatch({
      type: "ADD_MULTIPLE",
      context: "selectedAgents",
      payload: v,
    });
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(4);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

  const handleSelectAllClick = (event) => {
    event.stopPropagation();
    if (event.target.checked) {
      const newSelected = data.map((ns) => ({ name: ns, color: getColors() }));
      setSelected(newSelected);
      return;
    }
    dispatch({
      type: "CLEAR_ENTITY",
      context: "selectedAgents",
    });
  };

  const slug =
    alignment === "counties"
      ? "county"
      : alignment === "constituencies"
      ? "constituency"
      : alignment === "wards"
      ? "ward"
      : alignment === "stations"
      ? "stations"
      : "";


  const handleClick = (event, name) => {
    event.stopPropagation();
    const withColor = { name, color: getColors() };
    const selectedIndex = selectedAgents
      ? selectedAgents?.map((s) => s?.name).indexOf(name)
      : -1;

    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedAgents, withColor);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedAgents?.slice(1));
    } else if (selectedIndex === selectedAgents?.length - 1) {
      newSelected = newSelected.concat(selectedAgents?.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedAgents?.slice(0, selectedIndex),
        selectedAgents?.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) =>
    selectedAgents
      ? selectedAgents.map((s) => s?.name)?.indexOf(name) !== -1
      : false;


  // if (loading)
  //   return (
  //     <Paper>
  //       <Box
  //         sx={{
  //           width: "100%",
  //           height: 72,
  //           display: "flex",
  //           alignItems: "center",
  //           justifyContent: "center",
  //         }}
  //       >
  //         <CircularProgress />
  //       </Box>
  //     </Paper>
  //   );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <Box sx={{ my: 2 }}>
        NaN selected <button onClick={toggleAssignment}>Assign</button>
      </Box>

      {loadingStationNames && (
        <Box sx={{ width: "100%" }}>
          <LinearProgress />
        </Box>
      )}

      <TableContainer component={Paper}>
        {alignment === "agents" && selectedAgents?.length && (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p>{selectedAgents?.length} Selected</p>
            <div style={{ marginTop: 12 }}>
              <button>Assign duties</button>
            </div>
          </div>
        )}

        <Table sx={{ minWidth: 100 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedAgents?.length > 0 &&
                    selectedAgents?.length < data?.length
                  }
                  checked={
                    data?.length > 0 && selectedAgents?.length === data?.length
                  }
                  onChange={handleSelectAllClick}
                  inputProps={{
                    "aria-label": "select all desserts",
                  }}
                />
              </TableCell>
              <TableCell padding="none" />
              <TableCell padding="none" />
              <TableCell padding="none" />
              <TableCell padding="none" />

              {/* {columns?.map((c, i) => (
                <TableCell sx={{ fontWeight: "bold", fontSize: 11 }} key={i}>
                  <Chip
                    size="small"
                    sx={{ bgcolor: c.color }}
                    label={c.headerName}
                  ></Chip>
                </TableCell>
              ))} */}
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((row, i) => (
                <TableRow
                  onClick={() => onClickRow(row, alignment)}
                  key={i}
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    height: 33,
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected(row)}
                      onClick={(event) => handleClick(event, row)}
                      color="primary"
                      inputProps={{
                        "aria-label": "select all desserts",
                      }}
                    />
                  </TableCell>
                  <TableCell padding="none" align="left">
                    {/* <ColorPicker color={getColor(row)} /> */}
                    {/* <Chip sx={{ bgcolor: getColor(row) }} size="small" /> */}
                  </TableCell>
                  <TableCell align="left">{row.name}</TableCell>
                  <TableCell align="left">Assign</TableCell>

                  {alignment === "agents" && (
                    <>
                      <TableCell align="left">{row.phone}</TableCell>
                      <TableCell align="left">{row.email}</TableCell>
                    </>
                  )}
                  {alignment === "resources" && (
                    <>
                      <TableCell align="left">{row.quantity}</TableCell>
                    </>
                  )}

                  {/* {row?.data && (
                    <React.Fragment>
                      {row?.data?.map((p) => (
                        <TableCell
                          align="center"
                          padding="none"
                          component="th"
                          scope="row"
                        >
                          {p.value}
                        </TableCell>
                      ))}
                    </React.Fragment>
                  )} */}
                  <TableCell padding="none" align="right">
                    {/* <EditForm data={row} /> */}
                  </TableCell>
                </TableRow>
              ))}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: 33 * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[4, 10, 25]}
        component="div"
        count={data?.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
}
