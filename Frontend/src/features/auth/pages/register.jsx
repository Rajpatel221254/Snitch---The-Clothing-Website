import { useState } from "react";
import AuthLayout from "./AuthLayout";
import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";
import { useAuth } from "../hook/useAuth";
import { useNavigate } from "react-router";
import GoogleButton from "../components/GoogleButton";

export default function Register() {
  const { handleRegister } = useAuth();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    contact: "",
    password: "",
  });
  const [isSeller, setIsSeller] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    const { fullname, email, contact, password } = form;
    if (!fullname || !email || !contact || !password) {
      alert("Please fill all fields.");
      return;
    }
    const user = await handleRegister({ ...form, isSeller });
    console.log(user);
    if (user.role == "buyer") {
      navigate("/dashboard");
    } else if (user.role == "seller") {
      navigate("/seller/dashboard");
    }
  };

  return (
    <AuthLayout subtitle="Create Account">
      <GoogleButton />

      {/* Full Name */}
      <AuthInput
        label="Full Name"
        type="text"
        name="fullname"
        placeholder="John Doe"
        value={form.fullname}
        onChange={handleChange}
        required
      />

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

      {/* Contact Number */}
      <AuthInput
        label="Contact Number"
        type="tel"
        name="contact"
        placeholder="+91 00000 00000"
        value={form.contact}
        onChange={handleChange}
        required
      />

      {/* Password */}
      <AuthInput
        label="Password"
        type="password"
        name="password"
        placeholder="Create a strong password"
        value={form.password}
        onChange={handleChange}
        required
      />

      {/* Seller checkbox */}
      <div
        onClick={() => setIsSeller((p) => !p)}
        className="flex items-center gap-3 mb-7 cursor-pointer select-none"
      >
        <div
          className="w-5 h-5 rounded-md shrink-0 flex items-center justify-center transition-all duration-200"
          style={{
            border: `1.5px solid ${isSeller ? "#FFD700" : "#3a3a3a"}`,
            background: isSeller ? "#FFD700" : "#161616",
          }}
        >
          {isSeller && (
            <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
              <path
                d="M1 4L4 7L10 1"
                stroke="#0f0f0f"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
        <span className="text-[13px] text-white/55">
          Register as{" "}
          <span className="text-[#FFD700] font-semibold">Seller</span>
        </span>
      </div>

      {/* Submit */}
      <AuthButton onClick={handleSubmit}>Create Account</AuthButton>

      {/* Switch to Login — routes to /login */}
      <p className="text-center text-[13px] text-white/35">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-[#FFD700] font-semibold hover:opacity-75 transition-opacity duration-200 no-underline"
        >
          Login
        </a>
      </p>
    </AuthLayout>
  );
}
