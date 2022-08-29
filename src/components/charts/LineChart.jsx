import { LineChart, Line } from "recharts";
const data = [
  { name: "Page A", uv: 100, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 10, pv: 2100, amt: 2400 },
  {name: 'Page C', uv: 190, pv: 2600, amt: 2400},
  {name: 'Page D', uv: 400, pv: 2000, amt: 2400},
  {name: 'Page E', uv: 500, pv: 2100, amt: 2400}
];

const renderLineChart = (
  <LineChart width={200} height={100} data={data}>
    <Line type="monotone" dataKey="uv" stroke="#8884d8" />
  </LineChart>
);
export default function componentName() {
  return <>{renderLineChart}</>;
}
