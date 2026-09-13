import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#FBF9F4] flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[#173F35] mb-2">Page Not Found</h1>
        <p className="text-sm text-[#7A8B7E] mb-6">The page you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#173F35] text-white text-sm font-semibold hover:bg-[#102F28] transition-colors"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
