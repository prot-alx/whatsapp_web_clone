import { useState } from "react";
import { authenticate } from "./api/api";
import { Credentials } from "./api/interfaces";
import { Chat, Login } from "./components";

const STORAGE_KEY = "green_api_credentials";

const getStoredCredentials = (): Credentials | null => {
  try {
    const savedCredentials = localStorage.getItem(STORAGE_KEY);
    return savedCredentials ? JSON.parse(savedCredentials) : null;
  } catch {
    return null;
  }
};

const App = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(
    getStoredCredentials
  );
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (newCredentials: Credentials): Promise<boolean> => {
    const response = await authenticate(newCredentials);
    if (response.success) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
      setCredentials(newCredentials);
      setError(null);
      return true;
    }
    setError(response.message);
    return false;
  };

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setCredentials(null);
  };

  return (
    <div className="main-wrapper">
      {!credentials ? (
        <Login onLogin={handleLogin} error={error} />
      ) : (
        <Chat
          idInstance={credentials.idInstance}
          apiTokenInstance={credentials.apiTokenInstance}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
};

export default App;
