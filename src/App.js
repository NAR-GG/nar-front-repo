import { MantineProvider, createTheme } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@mantine/core/styles.css";

import Layout from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CombinationResultPage from "./pages/CombinationResultPage";
import SchedulePage from "./pages/SchedulePage";
import GameRecordPage from "./pages/GameRecordPage";
import MatchupPage from "./pages/MatchupPage";
import MatchListPage from "./pages/MatchListPage";
import YoutubeStories from "./pages/YoutubeStoriesPage";

const theme = createTheme({
  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
  colors: {
    primary: [
      "#f0f4ff",
      "#dbe4ff",
      "#bac8ff",
      "#91a7ff",
      "#748ffc",
      "#5c7cfa",
      "#4c6ef5",
      "#4263eb",
      "#3b5bdb",
      "#364fc7",
    ],
  },
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme}>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/combinations" element={<CombinationResultPage />} />
              <Route path="/schedule" element={<SchedulePage />} />
              <Route path="/matchup" element={<MatchupPage />} />
              <Route path="/record/:gameId" element={<GameRecordPage />} />
              <Route path="/games" element={<MatchListPage />} />
              <Route path="/stories" element={<YoutubeStories />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;
