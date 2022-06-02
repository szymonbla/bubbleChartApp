import { createTheme } from "@mui/material/styles";

const customHeaderFontSize = (fontSize: number) => ({
  fontSize,
  lineHeight: 1.1,
});

const customBodyFontSize = (fontSize: number) => ({
  fontSize,
  lineHeight: 1.4,
});

const theme = createTheme({
  palette: {
    common: {
      black: "#1A1A1A",
      white: "#FFFFFF",
    },
    info: {
      main: "#006ED4",
    },
    warning: {
      main: "#F98600",
    },
    success: {
      main: "#008929",
    },
    error: {
      main: "#DA0027",
    },
    grey: {
      800: "#454749",
      600: "#838890",
      400: "#CBCFDA",
      200: "#EFF2F5",
    },
  },
  typography: {
    fontFamily: [
      "Roboto Condensed",
      "Helvetica",
      '"Open Sans"',
      "sans-serif",
    ].join(","),
    h1: customHeaderFontSize(56),
    h2: customHeaderFontSize(48),
    h3: customHeaderFontSize(40),
    h4: customHeaderFontSize(32),
    h5: customHeaderFontSize(24),
    h6: customHeaderFontSize(20),

    subtitle1: customBodyFontSize(20),
    subtitle2: customBodyFontSize(18),

    body1: customBodyFontSize(16),
    body2: customBodyFontSize(14),
  },
  spacing: (factor: number) => `${0.5 * factor}rem`,
});

export default theme;
