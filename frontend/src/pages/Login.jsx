import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await login(credentialResponse.credential);
      toast.success("Successfully logged in!");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Login Failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-gray-900 to-gray-800 text-white px-4 py-12">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/10 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-400 mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your GameDay account</p>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="filled_black"
            size="large"
            shape="pill"
            width="300"
          />
        </div>
      </div>
    </div>
  );
}
