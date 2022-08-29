import React, { PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Week 1",
    membership: 4000,
    activity: 2400,
    events: 1000,
  },
  {
    name: "Week 2",
    membership: 3000,
    activity: 1398,
    events: 1000,
  },
  {
    name: "Week 3",
    membership: 2000,
    activity: 5000,
    events: 8590,
  },
  {
    name: "Week 4",
    membership: 2780,
    activity: 3908,
    events: 2000,
  },
];

export default class PresidentsGraph extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          width={500}
          height={300}
          data={data}
          margin={{
            top: 5,
            right: 5,
            left: 5,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <Legend />
          <Line
            type="monotone"
            dataKey="activity"
            stroke="#FFBA49"
            activeDot={{ r: 8 }}
          />
          <Line type="monotone" dataKey="membership" stroke="#EF5B5B" />
          <Line type="monotone" dataKey="events" stroke="#23001E" />
        </LineChart>
      </ResponsiveContainer>
    );
  }
}
