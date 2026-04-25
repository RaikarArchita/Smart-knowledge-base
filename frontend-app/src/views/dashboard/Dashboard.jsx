import React from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetDashboardDetails } from "./dashboard.services";


dayjs.extend(relativeTime);
const COLORS = ["#667eea", "#764ba2", "#8a9beb", "#a78bfa", "#93c5fd"];

const StatCard = ({ label, value }) => (
  <Card>
    <CardContent>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h4" mt={1}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { data } = useGetDashboardDetails();

  return (
    <Box p={3}>
      {/* Title */}
      <Typography variant="h4" mb={3}>
        Dashboard
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} mb={3}>
        <Grid size={2}>
          <StatCard label="Total no. of Notes" value={data?.total_notes} />
        </Grid>
        <Grid size={2}>
          <StatCard label="Total no. of Folders" value={data?.no_of_folders} />
        </Grid>
        <Grid size={2}>
          <StatCard label="Active Today" value={data?.active_today} />
        </Grid>
        <Grid size={2}>
          <StatCard label="Avg. length of notes" value={data?.avg_note_len} />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={2}>
        {/* Line Chart */}
        <Grid size={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Notes Created (Last 4 Weeks)
              </Typography>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data?.week_data} responsive>
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#667eea"
                    fill="#8884d8"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid size={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Top Tags
              </Typography>

              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data?.top_tags}
                    dataKey="count"
                    innerRadius={60}
                    outerRadius={90}
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {data?.top_tags.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activity */}
        <Grid size={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Recent activity
              </Typography>

              <List>
                {data?.recent_activites.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={item.title}
                        secondary={
                          item.content.length > 100
                            ? item.content.slice(0, 160) + "..."
                            : item.content
                        }
                      />
                      <Typography variant="caption">
                        {dayjs(item.updated_at).fromNow()}
                      </Typography>
                    </ListItem>
                    {index !== data?.recent_activites.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
