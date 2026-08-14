import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPersonal from "../components/modal/AddPersonal.jsx";

function Home() {
  const navigate = useNavigate();
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);

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

      <button
        type="button"
        className="w-fit cursor-pointer rounded-12 bg-purple-900 px-4 py-2 text-subtitle3 text-white"
        onClick={() => setIsPersonalModalOpen(true)}
      >
        개인 일정 추가
      </button>

      <AddPersonal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        onSubmit={() => setIsPersonalModalOpen(false)}
      />
    </div>
  );
}

export default Home;
