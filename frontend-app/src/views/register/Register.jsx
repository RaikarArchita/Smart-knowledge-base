import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useRegister } from "./register.services";
import { useFormik } from "formik";
import noteNest from "./../../assets/NoteNest_logo.png";
import { useState } from "react";
import { Divider, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Register = () => {
  const { mutate, isLoading } = useRegister();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      username: "",
      password: "",
    },
    validate: (values) => {
      const errors = {};

      if (!values.full_name) {
        errors.full_name = "Full name is required";
      }

      if (!values.password) {
        errors.password = "Password is required";
      }

      if (!values.username) {
        errors.username = "Username is required";
      }

      return errors;
    },
    onSubmit: (values) => {
      mutate(values);
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: 2,
        "@keyframes slideUp": {
          from: {
            opacity: 0,
            transform: "translateY(30px)",
          },
          to: {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "@keyframes fadeInScale": {
          from: {
            opacity: 0,
            transform: "scale(0.8)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      }}
      component="main"
    >
      <Card
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 420,
          animation: "slideUp 0.6s ease-out",
        }}
      >
        <CardContent>
          <Stack spacing={3}>
            <Box sx={{ textAlign: "center" }}>
              <Box
                component="img"
                src={noteNest}
                alt="NoteNest Logo"
                sx={{
                  width: 100,
                  height: 100,
                  animation: "fadeInScale 0.8s ease-out",
                }}
              />
              <Typography variant="h4">NoteNest</Typography>
              <Typography variant="body2">Hi! Register to continue</Typography>
            </Box>
            <Divider />
            <form onSubmit={formik.handleSubmit}>
              <Stack spacing={2}>
                <Box>
                  <Typography
                    component="label"
                    htmlFor="username"
                    variant="h6"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Full Name
                  </Typography>
                  <TextField
                    id="full_name"
                    placeholder="Enter your full name"
                    variant="outlined"
                    fullWidth
                    name="full_name"
                    value={formik.values.full_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.full_name &&
                      Boolean(formik.errors.full_name)
                    }
                    helperText={
                      formik.touched.full_name && formik.errors.full_name
                    }
                  />
                </Box>
                {/* Username Field */}
                <Box>
                  <Typography
                    component="label"
                    htmlFor="username"
                    variant="h6"
                    sx={{ display: "block", mb: 1 }}
                  >
                    Username
                  </Typography>
                  <TextField
                    id="username"
                    placeholder="Enter your username"
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
                  <Typography component="label" htmlFor="password" variant="h6">
                    Password
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <TextField
                      id="password"
                      placeholder="••••••••"
                      variant="outlined"
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.password &&
                        Boolean(formik.errors.password)
                      }
                      helperText={
                        formik.touched.password && formik.errors.password
                      }
                    />
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{
                        position: "absolute",
                        right: 1,
                        top: "50%",
                        transform: "translate(-20%,-50%)",
                      }}
                    >
                      {showPassword ? (
                        <VisibilityOffIcon sx={{ fontSize: 20 }} />
                      ) : (
                        <VisibilityIcon sx={{ fontSize: 20 }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
                {/* Sign In Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  sx={{
                    background:
                      "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={20} sx={{ color: "#fff" }} />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </Stack>
            </form>

            {/* Sign Up Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2">
                Already have an account?{" "}
                <Link
                  component={RouterLink}
                  to="/sign-in"
                  sx={{ fontWeight: 700 }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
