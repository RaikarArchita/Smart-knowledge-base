import { Outlet } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import Box from "@mui/material/Box";

const MainLayout = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <Box
        sx={{
          flex: 1,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
