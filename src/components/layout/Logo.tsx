import { useTheme } from "@/hooks/useTheme";
import { Link } from "react-router";

export default function Logo() {
  const { theme } = useTheme();

  return (
    <Link to="/">
      <div className="flex items-center mb-2">
        <img
          src={
            theme === "dark" ? "/dropollo-icon-dark.png" : "/dropollo-icon.png"
          }
          alt="Dropollo Logo"
          className="h-10 w-auto"
        />
        <span className="text-primary ml-2 mt-2 text-2xl font-bold ">
          Dropollo
        </span>
      </div>
    </Link>
  );
}
