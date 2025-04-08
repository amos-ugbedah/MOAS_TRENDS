import { useState } from 'react';
import { register, login, logout } from '../utils/authService';

function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleRegister(e) {
    e.preventDefault();
    const user = await register(email, password);
    if (user) alert('Registration successful!');
  }

  async function handleLogin(e) {
    e.preventDefault();
    const user = await login(email, password);
    if (user) alert('Login successful!');
  }

  async function handleLogout() {
    await logout();
    alert('Logged out successfully!');
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>

      <button onClick={handleRegister}>Register</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default AuthForm;
