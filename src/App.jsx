import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import MainCalendar from "./pages/MainCalendar.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import HomeLayout from "./components/home/HomeLayout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<HomeLayout />}>
        <Route index element={<Main />} />
        <Route path="calendar" element={<MainCalendar />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
