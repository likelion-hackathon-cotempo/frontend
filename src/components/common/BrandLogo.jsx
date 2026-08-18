import logoSymbol from "../../assets/logo.svg";
import logoTypo from "../../assets/logo-typo.svg";

function BrandLogo({ className = "" }) {
  return (
    <div
      role="img"
      aria-label="CoTempo"
      className={`flex h-5 w-fit items-center gap-2 ${className}`}
    >
      <img src={logoSymbol} alt="" className="h-5 w-[25px]" />
      <img src={logoTypo} alt="" className="h-5 w-[95px]" />
    </div>
  );
}

export default BrandLogo;
