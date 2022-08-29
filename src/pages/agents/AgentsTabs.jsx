import * as React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ReportForm from "./ReportForm";
import AgentOverview from "./AgentOverview";
import ElectionsTabs from "./ElectionsTabs";
import Events from "./Events";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Naps() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          variant="fullWidth"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab sx={{ textTransform: "none" }} label="Home" {...a11yProps(1)} />

          <Tab
            sx={{ textTransform: "none" }}
            label="Elections"
            {...a11yProps(3)}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label="Reports"
            {...a11yProps(4)}
          />
          <Tab
            sx={{ textTransform: "none" }}
            label="Events"
            {...a11yProps(5)}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AgentOverview />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ElectionsTabs />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReportForm />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Events />
      </TabPanel>
    </Box>
  );
}
