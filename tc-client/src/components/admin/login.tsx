import React from 'react';

interface LoginProps {
  password: string;
  setPassword: (password: string) => void;
  handlePasswordSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const Login: React.FC<LoginProps> = ({ password, setPassword, handlePasswordSubmit }) => {
  return (
    <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center space-y-4">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter password"
        className="border-2 border-gray-200 p-4 rounded-xl w-80 focus:border-candy-purple focus:ring-2 focus:ring-candy-purple/20 transition-all duration-200 outline-none text-lg"
      />
      <button 
        type="submit" 
        className="w-80 bg-gradient-to-r from-candy-purple to-candy-blue hover:from-candy-blue hover:to-candy-purple text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        🔓 Unlock Admin Panel
      </button>
    </form>
  );
};

export default Login;