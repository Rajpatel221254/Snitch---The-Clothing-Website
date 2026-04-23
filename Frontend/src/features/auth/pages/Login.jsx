import { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import GoogleButton from "../components/GoogleButton";

export default function Login() {
  const { handleLogin } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      alert("Please fill all fields.");
      return;
    }
    const user = await handleLogin(form);

    console.log(user);
    if (user.role == "buyer") {
      navigate("/");
    } else if (user.role == "seller") {
      navigate("/seller/dashboard");
    }
  };

  return (
    <AuthLayout subtitle="Welcome Back">
      <GoogleButton />

      {/* Email */}
      <AuthInput
        label="Email Address"
        type="email"
        name="email"
        placeholder="your@email.com"
        value={form.email}
        onChange={handleChange}
        required
      />

      {/* Password */}
      <AuthInput
        label="Password"
        type="password"
        name="password"
        placeholder="Enter your password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {/* Forgot password */}
      <div className="text-right mb-7 -mt-2">
        <span className="text-xs text-[#FFD700] opacity-60 cursor-pointer hover:opacity-100 transition-opacity duration-200">
          Forgot Password?
        </span>
      </div>

      {/* Submit */}
      <AuthButton onClick={handleSubmit}>Login</AuthButton>

      {/* Switch to Register */}
      <p className="text-center text-[13px] text-white/35">
        Don't have an account?{" "}
        <a
          href="/register"
          className="text-[#FFD700] font-semibold hover:opacity-75 transition-opacity duration-200 no-underline"
        >
          Register
        </a>
      </p>
    </AuthLayout>
  );
}
