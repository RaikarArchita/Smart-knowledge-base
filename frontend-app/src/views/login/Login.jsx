import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useLogin } from "./login.services";
import { useFormik } from "formik";
import noteNest from "./../../assets/NoteNest_logo.png";

const Login = () => {
  const { mutate } = useLogin();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.username) {
        errors.username = "Username is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      return errors;
    },
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <Box
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      component="main"
    >
      <Card variant="outlined" sx={{ margin: "20px", minWidth: 380 }}>
        <CardContent>
          <Box
            component="img"
            src={noteNest}
            alt="NoteNest Logo"
            sx={{
              display: "block",
              width: "100%",
              maxWidth: 100,
              height: "auto",
              marginLeft: "-20px",
            }}
          />
          <Stack spacing={2}>
            <Typography variant="h6">Sign In</Typography>
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="label">Username</Typography>
                  <TextField
                    id="username"
                    placeholder="jon123"
                    variant="outlined"
                    fullWidth
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.username && Boolean(formik.errors.username)
                    }
                    helperText={
                      formik.touched.username && formik.errors.username
                    }
                  />
                </Box>
                <Box>
                  <Typography variant="label">Password</Typography>
                  <TextField
                    id="password"
                    placeholder="••••••••"
                    variant="outlined"
                    fullWidth
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.password && Boolean(formik.errors.password)
                    }
                    helperText={
                      formik.touched.password && formik.errors.password
                    }
                  />
                </Box>
                <Button type="submit" variant="contained" color="primary">
                  Sign In
                </Button>
              </Stack>
            </form>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Not Registered?{" "}
              <Link
                component={RouterLink}
                to="/register"
                underline="none"
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign up
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;
