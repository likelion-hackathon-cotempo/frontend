import { useNavigate } from "react-router-dom";
import landingHero from "../../assets/landing-hero.png";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-10">
      <div className="flex w-full max-w-[1120px] items-center justify-between gap-12">
        <div className="flex flex-col gap-[26px]">
          <div className="flex flex-col gap-3">
            <h1 className="text-[40px] font-bold leading-[1.3] tracking-[-0.02em] text-gray-900">
              Collaborate across borders, effortlessly
            </h1>
            <p className="text-title1 text-gray-700">
              Manage different schedules and time zones in one place,
              <br />
              and find the perfect time for your team to work together.
            </p>
          </div>

          <div className="flex gap-[10px]">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="rounded-12 bg-purple-900 px-6 py-3 text-subtitle3 text-white"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="rounded-12 border border-purple-600 bg-white px-6 py-3 text-subtitle3 text-purple-900"
            >
              Sign up
            </button>
          </div>
        </div>

        <img src={landingHero} alt="" className="w-[528px] max-w-full" />
      </div>
    </div>
  );
}

export default Landing;