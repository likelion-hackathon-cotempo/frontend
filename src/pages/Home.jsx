import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-title1">랜딩페이지</h1>
      <button
        type="button"
        className="cursor-pointer border border-gray-950"
        onClick={() => navigate("/login")}
      >
        로그인
      </button>
      <div className="bg-amber-700">
        <div className="text-white">white</div>
        <div className="text-gray-900">gray</div>
        <div className="text-purple-900">purple</div>
      </div>
    </div>
  );
}

export default Home;
