import React from 'react';

interface LoginProps {
  password: string;
  setPassword: (password: string) => void;
  handlePasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

// Step 2: Modify the component
const Login: React.FC<LoginProps> = ({ password, setPassword, handlePasswordSubmit }) => {
  return (
    <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center">
      <input
        type="text"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="border p-2 mb-4 rounded"
      />
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Submit
      </button>
    </form>
  );
};

export default Login;