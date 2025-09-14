import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider } from "@/contexts/AppContext";
import { AppShell } from "@/app/AppShell";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Challenges from "./pages/Challenges";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Journeys from "./pages/Journeys";
import JourneysCountry from "./pages/JourneysCountry";
import JourneysPath from "./pages/JourneysPath";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppShell>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/app" element={<Layout />}>
              <Route path="feed" element={<Feed />} />
              <Route path="challenges" element={<Challenges />} />
              <Route path="journeys" element={<Journeys />} />
              <Route path="journeys/:countryId" element={<JourneysCountry />} />
              <Route path="journeys/:countryId/:pathId" element={<JourneysPath />} />
              <Route path="profile" element={<Profile />} />
              <Route path="admin" element={<Admin />} />
              <Route path="dashboard" element={<Navigate to="/app/feed" replace />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </AppShell>
  </QueryClientProvider>
);

export default App;
