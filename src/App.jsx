import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Main from "./pages/Main.jsx";
import MainCalendar from "./pages/MainCalendar.jsx";
import MainMyPage from "./pages/MainMyPage.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />} />
      <Route path="/main/calendar" element={<MainCalendar />} />
      <Route path="/main/mypage" element={<MainMyPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  );
}

export default App;
