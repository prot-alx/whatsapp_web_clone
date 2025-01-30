import React, { useState } from "react";
import Login from "./components/Login";
import Chat from "./components/Chat";
import { authenticate } from "./api/api";
import { Credentials } from "./api/interfaces";

const App: React.FC = () => {
  const [credentials, setCredentials] = useState<Credentials | null>(() => {
    const savedCredentials = localStorage.getItem("green_api_credentials");
    return savedCredentials ? JSON.parse(savedCredentials) : null;
  });
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: Credentials): Promise<boolean> => {
    const { success, message } = await authenticate(credentials);
    if (success) {
      localStorage.setItem("green_api_credentials", JSON.stringify(credentials));
      setCredentials(credentials);
      return true;
    } else {
      setError(message);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("green_api_credentials");
    setCredentials(null);
  };

  return (
    <div>
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
