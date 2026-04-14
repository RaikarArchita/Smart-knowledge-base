import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4F46E5",
      dark: "#3730A3",
    },
    background: {
      default: "#F3F4F6",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#111827",
      secondary: "#6B7280",
    },
    tagsBtnColor: {
      main: "#7b75f0",
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    label: {
      fontSize: "0.75rem",
      fontWeight: "400",
    },
    note_content: {
      fontSize: "0.75rem",
      fontWeight: "400",
      color: "#3f4148",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
    h5: {
      fontSize: "0.9rem",
    },
    h6: {
      fontSize: "1rem",
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#f9fafb",

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0f1010",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#0f1010",
            borderWidth: 2,
          },
        },

        input: {
          padding: "12px 14px",
          fontSize: "0.9rem",
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
        },
        contained: {
          boxShadow: "none",
        },
      },
      variants: [
        {
          props: { variant: "tagsBtn" },
          style: {
            borderRadius: "4px",
            padding: "6px 10px",
            textTransform: "none",
            backgroundColor:"#7b75f0",
            color:"#FFFFFF",
            fontWeight:"400"
          },
        },
      ],
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#3730A3",
        },
      },
    },
  },
});

export default theme;
