import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../../queries/useLoginUser";
import { useRegisterUser } from "../../queries/useRegisterUser";
import { useUserStore } from "../../zustand/user";
import { useToast } from "../../components/Toast";

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useUserStore();
  const { showToast } = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const loginMutation = useLoginUser();
  const registerMutation = useRegisterUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError("");

    if (!username || !password) {
      setLocalError("Please fill in all fields");
      return;
    }

    if (isRegister && password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (isRegister) {
      registerMutation.mutate(
        { username, password },
        {
          onSuccess: (data) => {
            setToken(data.token);
            showToast("Account created successfully!", "success");
            navigate("/");
          },
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { error?: string } } };
            setLocalError(err.response?.data?.error || "Registration failed");
          },
        }
      );
    } else {
      loginMutation.mutate(
        { username, password },
        {
          onSuccess: (data) => {
            setToken(data.token);
            showToast("Welcome back!", "success");
            navigate("/");
          },
          onError: (error: unknown) => {
            const err = error as { response?: { data?: { error?: string } } };
            setLocalError(err.response?.data?.error || "Login failed");
          },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🏋️</div>
          <h1 className="text-2xl font-bold text-gray-800">Workout App</h1>
          <p className="text-gray-500 mt-1">
            {isRegister ? "Create your account" : "Welcome back!"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {localError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {localError}
            </div>
          )}

          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              placeholder="Enter your password"
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </div>

          {isRegister && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isLoading || registerMutation.isLoading}
            className="w-full py-3 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loginMutation.isLoading || registerMutation.isLoading
              ? "Please wait..."
              : isRegister
              ? "Create Account"
              : "Sign In"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-6 text-gray-600">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setLocalError("");
              setPassword("");
              setConfirmPassword("");
            }}
            className="text-blue-500 font-medium hover:underline"
          >
            {isRegister ? "Sign in" : "Sign up"}
          </button>
        </p>

        {/* Demo user shortcut */}
        {!isRegister && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => {
                setUsername("demo_user");
                setPassword("demo_password");
              }}
              className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Use demo account
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
