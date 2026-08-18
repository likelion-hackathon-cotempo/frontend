import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import MainCalendar from "./pages/MainCalendar.jsx";
import MainMyPage from "./pages/MainMyPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HomeLayout from "./components/home/HomeLayout.jsx";
import AuthRoute from "./auth/AuthRoute.jsx";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthRoute guestOnly>
            <Home />
          </AuthRoute>
        }
      />
      <Route
        path="/login"
        element={
          <AuthRoute guestOnly>
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute guestOnly>
            <Signup />
          </AuthRoute>
        }
      />
      <Route
        path="/main"
        element={
          <AuthRoute>
            <HomeLayout />
          </AuthRoute>
        }
      >
        <Route index element={<Main />} />
        <Route path="calendar" element={<MainCalendar />} />
        <Route path="mypage" element={<MainMyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
