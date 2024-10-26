// // pages/_app.js
// import React from "react";
// import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
// import Head from "next/head";

// const theme = createTheme({
//   palette: {
//     mode: "light",
//   },
// });

// export default function MyApp({ Component, pageProps }) {
//   return (
//     <ThemeProvider theme={theme}>
//       <CssBaseline />
//       <Head>
//         <title>Interview Platform</title>
//         <meta name="viewport" content="initial-scale=1, width=device-width" />
//       </Head>
//       <Component {...pageProps} />
//     </ThemeProvider>
//   );
// }

// export default App;

// pages/_app.js
import React from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Head from "next/head";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScorecardPage from "./components/Scorecard";

const theme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Interview Platform</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>

      <Header />
      <Component {...pageProps} />
      <ScorecardPage />
      <Footer />
    </ThemeProvider>
  );
}
