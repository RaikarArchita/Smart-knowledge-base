import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#667eea",
      light: "#8a9beb",
      dark: "#5568d3",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#764ba2",
      light: "#8a5fb3",
      dark: "#663a8a",
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1a1a1a",
      secondary: "#666666",
      disabled: "#999999",
    },
    divider: "#e5e7eb",
    error: {
      main: "#d32f2f",
      light: "#e57373",
      dark: "#c62828",
    },
    warning: {
      main: "#f57c00",
      light: "#ffb74d",
      dark: "#e65100",
    },
    success: {
      main: "#388e3c",
      light: "#81c784",
      dark: "#2e7d32",
    },
    info: {
      main: "#1976d2",
      light: "#64b5f6",
      dark: "#1565c0",
    },
  },

  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: "32px",
      fontWeight: 700,
      lineHeight: 1.2,
      color: "#1a1a1a",
    },
    h2: {
      fontSize: "28px",
      fontWeight: 700,
      lineHeight: 1.3,
      color: "#1a1a1a",
    },
    h3: {
      fontSize: "24px",
      fontWeight: 700,
      lineHeight: 1.3,
      color: "#1a1a1a",
    },
    h4: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: 1.4,
      color: "#1a1a1a",
    },
    h5: {
      fontSize: "16px",
      fontWeight: 600,
      lineHeight: 1.4,
      color: "#1a1a1a",
    },
    h6: {
      fontSize: "14px",
      fontWeight: 600,
      lineHeight: 1.5,
      color: "#1a1a1a",
    },
    body1: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#1a1a1a",
    },
    body2: {
      fontSize: "14px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#666666",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#1a1a1a",
    },
    subtitle2: {
      fontSize: "14px",
      fontWeight: 500,
      lineHeight: 1.5,
      color: "#666666",
    },
    button: {
      fontSize: "15px",
      fontWeight: 600,
      textTransform: "none",
      lineHeight: 1.5,
    },
    caption: {
      fontSize: "12px",
      fontWeight: 400,
      lineHeight: 1.5,
      color: "#999999",
    },
  },

  spacing: 8,

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "10px",
          textTransform: "none",
          fontWeight: 600,
          fontSize: "15px",
          padding: "12px 24px",
          transition: "all 0.3s ease",
          "&:disabled": {
            opacity: 0.7,
            cursor: "not-allowed",
          },
        },
        contained: {
          boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
          "&:hover": {
            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
            transform: "translateY(-2px)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        outlined: {
          borderColor: "#e5e7eb",
          color: "#1a1a1a",
          "&:hover": {
            borderColor: "#667eea",
            backgroundColor: "rgba(102, 126, 234, 0.05)",
          },
        },
        text: {
          color: "#667eea",
          "&:hover": {
            backgroundColor: "rgba(102, 126, 234, 0.08)",
          },
        },
      },
      defaultProps: {
        disableElevation: false,
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "10px",
            fontSize: "14px",
            transition: "all 0.3s ease",
            backgroundColor: "#f9f9f9",
            "&:hover": {
              backgroundColor: "#f5f5f5",
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              "& fieldset": {
                borderColor: "#667eea",
                borderWidth: "2px",
              },
            },
            "&.Mui-error fieldset": {
              borderColor: "#d32f2f",
            },
          },
          "& .MuiOutlinedInput-input": {
            padding: "12px 16px",
            color: "#1a1a1a",
            "&::placeholder": {
              color: "#999999",
              opacity: 1,
            },
          },
          "& .MuiFormHelperText-root": {
            fontSize: "12px",
            marginTop: "6px",
            color: "#d32f2f",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 10px 10px rgba(0, 0, 0, 0.3)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backgroundColor: "#ffffff",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.35)",
          },
        },
        outlined: {
          borderColor: "rgba(255, 255, 255, 0.1)",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "20px 16px",
          "&:last-child": {
            paddingBottom: "48px",
          },
        },
      },
    },

    MuiLink: {
      styleOverrides: {
        root: {
          color: "#667eea",
          transition: "color 0.3s ease",
          textDecoration: "none",
          cursor: "pointer",
          "&:hover": {
            color: "#764ba2",
            textDecoration: "underline",
          },
        },
      },
    },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#ccc",
          "&.Mui-checked": {
            color: "#667eea",
          },
          transition: "color 0.3s ease",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#e5e7eb",
          margin: "16px 0",
        },
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          marginLeft: "-8px",
        },
        label: {
          fontSize: "14px",
          color: "#555555",
          userSelect: "none",
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          fontSize: "14px",
        },
      },
    },
  },

  // Custom breakpoints
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;