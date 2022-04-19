import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/login";
import MainPage from "./pages/main";
import { useIsloggedIn } from "./context/isLoggedIn";
import SettingsPage from "./pages/settings";
import AddPage from "./pages/addBookmark";
import { Navigate, Outlet } from "react-router";
import { useEffect } from "react";
import Logout from "./pages/logout";
import { getJSON } from "./helpers/fetch";

function PrivateWrapper({ profile }) {
  return profile ? <Outlet /> : <Navigate to="/login" />;
}

function App() {
  let { profile, setIsProfileLoading, isProfileLoading, setProfile } =
    useIsloggedIn();

  useEffect(() => {
    async function fetchProfile() {
      setIsProfileLoading(true);
      var res;
      try {
        res = await getJSON("http://localhost:3333/api/users/me");
      } catch (error) {
        setProfile(undefined);
        setIsProfileLoading(false);
      }

      if (res.ok) {
        setProfile(await res.json());
        setIsProfileLoading(false);
      } else {
        setProfile(undefined);
        setIsProfileLoading(false);
      }
    }
    fetchProfile();
  }, []);

  if (isProfileLoading) return <div>Loading</div>;

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-cyan-600 to-fuchsia-600 overflow-auto">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/logout" element={<Logout />} />

          <Route element={<PrivateWrapper profile={profile} />}>
            <Route path="/" element={<MainPage />} />
          </Route>

          <Route element={<PrivateWrapper profile={profile} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          <Route element={<PrivateWrapper profile={profile} />}>
            <Route path="/add" element={<AddPage />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
