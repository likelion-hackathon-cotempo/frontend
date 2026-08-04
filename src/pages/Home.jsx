import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1>랜딩페이지</h1>
      <button
        type="button"
        className="cursor-pointer border border-gray-950"
        onClick={() => navigate("/login")}
      >
        로그인
      </button>
    </div>
  );
}

export default Home;
