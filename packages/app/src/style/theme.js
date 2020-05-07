import { createMuiTheme } from "@material-ui/core/styles";
import { purple, green } from "@material-ui/core/colors";

export const appBarTheme =  createMuiTheme({
    palette: {
      primary: purple,
      secondary: green,
    },
    status: {
      danger: 'orange',
    },
    overrides: {
      MuiAppBar: {
        root: {
          padding: "0.5rem",
          fontWeight: "bold",
          marginBottom: "10px",
        },
        colorDefault: purple
      }
    }
  });