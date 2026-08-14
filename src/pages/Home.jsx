import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPersonalModal from "../components/modal/AddPersonalModal.jsx";
import JoinTeamModal from "../components/modal/JoinTeamModal.jsx";
import JoinTeamRoleModal from "../components/modal/JoinTeamRoleModal.jsx";

function Home() {
  const navigate = useNavigate();
  const [isPersonalModalOpen, setIsPersonalModalOpen] = useState(false);
  const [isJoinTeamModalOpen, setIsJoinTeamModalOpen] = useState(false);
  const [isJoinTeamRoleModalOpen, setIsJoinTeamRoleModalOpen] = useState(false);
  const [isShareTeamModalOpen, setIsShareTeamModalOpen] = useState(false);

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

      <button
        type="button"
        className="w-fit cursor-pointer rounded-12 bg-purple-900 px-4 py-2 text-subtitle3 text-white"
        onClick={() => setIsJoinTeamModalOpen(true)}
      >
        팀 참여
      </button>

      <button
        type="button"
        className="w-fit cursor-pointer rounded-12 bg-purple-900 px-4 py-2 text-subtitle3 text-white"
        onClick={() => setIsShareTeamModalOpen(true)}
      >
        팀 코드 공유
      </button>

      <AddPersonalModal
        isOpen={isPersonalModalOpen}
        onClose={() => setIsPersonalModalOpen(false)}
        onSubmit={() => setIsPersonalModalOpen(false)}
      />

      <JoinTeamModal
        isOpen={isJoinTeamModalOpen}
        variant="input"
        onClose={() => setIsJoinTeamModalOpen(false)}
        onSubmit={() => {
          setIsJoinTeamModalOpen(false);
          setIsJoinTeamRoleModalOpen(true);
        }}
      />

      <JoinTeamRoleModal
        isOpen={isJoinTeamRoleModalOpen}
        onClose={() => setIsJoinTeamRoleModalOpen(false)}
        onSubmit={() => setIsJoinTeamRoleModalOpen(false)}
      />

      <JoinTeamModal
        isOpen={isShareTeamModalOpen}
        variant="share"
        onClose={() => setIsShareTeamModalOpen(false)}
      />
    </div>
  );
}

export default Home;
