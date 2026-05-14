import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BookOpen, Layers, FileText, Globe } from "lucide-react";

function Navbar() {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Summaries", path: "/explanations?mode=summary", icon: <BookOpen size={18} /> },
    { name: "Explanations", path: "/explanations?mode=explanation", icon: <BookOpen size={18} /> },
    { name: "Flashcards", path: "/flashcards", icon: <Layers size={18} /> },
    { name: "Exams", path: "/exams", icon: <FileText size={18} /> },
  ];

  return (
    <nav className="bg-[#1e3a8a] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">Learnova </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6">
          {links.map((link) => {
            const isActive = location.pathname === link.path;

            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 text-sm font-medium transition ${
                  isActive
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          
          {/* Language */}
          <div className="flex items-center gap-1 cursor-pointer text-sm text-gray-200 hover:text-white">
            <Globe size={16} />
            EN
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <span className="text-sm">user</span>
            <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-sm font-bold">
              U
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;