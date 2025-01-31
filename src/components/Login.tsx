import React, { useState, useCallback } from "react";
import { Credentials } from "../api/interfaces";

interface LoginProps {
  onLogin: (credentials: Credentials) => Promise<boolean>;
  error: string | null;
}

const Login = ({ onLogin, error }: LoginProps) => {
  const [credentials, setCredentials] = useState<Credentials>(() => ({
    idInstance: "",
    apiTokenInstance: "",
  }));
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await onLogin(credentials);
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">WhatsApp API</h2>
        <p className="login-subtitle">
          Введите данные Green API для подключения
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="input-container">
            <label htmlFor="id-instance" className="input-label">
              ID Instance
            </label>
            <input
              id="id-instance"
              type="text"
              name="idInstance"
              placeholder="Введите ID Instance"
              value={credentials.idInstance}
              onChange={handleChange}
              required
              className="input-field"
              disabled={loading}
              autoComplete="off"
            />

            <label htmlFor="api-token-instance" className="input-label">
              API Token Instance
            </label>
            <input
              id="api-token-instance"
              type="password"
              name="apiTokenInstance"
              placeholder="Введите API Token Instance"
              value={credentials.apiTokenInstance}
              onChange={handleChange}
              required
              className="input-field"
              disabled={loading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mt-2.5" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>

        <a
          href="https://green-api.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-green-700 transition-colors login-link"
        >
          Получить доступ к Green API
        </a>
      </div>
    </div>
  );
};

export default Login;
