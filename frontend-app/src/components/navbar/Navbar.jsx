import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Button from "@mui/material/Button";
import { Link, useLocation } from "react-router-dom";
import { alpha } from "@mui/material/styles";
import HomeFilled from "@mui/icons-material/HomeFilled";

const Navbar = () => {
  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Workspace", path: "/workspace" },
  ];
  const location = useLocation();

  return (
    <AppBar position="static">
      <Toolbar>
        <Stack direction="row" spacing={4} sx={{ flexGrow: 1 }}>
          <Button component={Link} to="/dashboard" color="inherit">
            <HomeFilled />
          </Button>
          <Box sx={{ display: "flex", gap: 2 }}>
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={(theme) => ({
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : alpha(theme.palette.primary.contrastText, 0.7),
                    fontWeight: isActive ? 600 : 500,
                    "&:hover": {
                      color: theme.palette.primary.contrastText,
                      backgroundColor: alpha(
                        theme.palette.primary.contrastText,
                        0.08,
                      ),
                    },
                  })}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>
        </Stack>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 1 }}
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
