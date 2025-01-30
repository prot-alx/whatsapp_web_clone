import React, { useState } from "react";
import { Credentials } from "../api/interfaces";

interface LoginProps {
  onLogin: (credentials: Credentials) => Promise<boolean>;
  error: string | null;
}

const Login: React.FC<LoginProps> = ({ onLogin, error }) => {
  console.log(error);
  const [credentials, setCredentials] = useState<Credentials>({
    idInstance: "",
    apiTokenInstance: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const success = await onLogin(credentials);
      if (!success) {
        throw new Error("Ошибка аутентификации. Проверьте данные.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div>
          <h2 className="login-title">WhatsApp API</h2>
          <p className="login-subtitle">
            Введите данные Green API для подключения
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="input-container">
            <div>
              <label htmlFor="idInstance" className="input-label">
                ID Instance
              </label>
              <input
                type="text"
                name="idInstance"
                placeholder="Введите ID Instance"
                value={credentials.idInstance}
                onChange={handleChange}
                required
                className="input-field"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="apiTokenInstance" className="input-label">
                API Token Instance
              </label>
              <input
                type="password"
                name="apiTokenInstance"
                placeholder="Введите API Token Instance"
                value={credentials.apiTokenInstance}
                onChange={handleChange}
                required
                className="input-field"
                disabled={loading}
              />
            </div>
          </div>

          <p
            className={`${
              error ? "visible" : "invisible min-h-[20px]"
            } text-red-600 text-sm mt-2.5`}
          >
            {error}
          </p>

          <div>
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Загрузка..." : "Войти"}
            </button>
          </div>
        </form>

        <div className="login-link">
          <a
            href="https://green-api.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Получить доступ к Green API
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
