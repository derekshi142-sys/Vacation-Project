import React, { useEffect, useState } from 'react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, updateProfile, onAuthStateChanged, signOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();

const Login = () => {
  const [tab, setTab] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const showMessage = (msg, type = 'info') => {
    setMessage({ msg, type });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleGoogle = async () => {
    try {
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      showMessage('Login successful', 'success');
    } catch (e) {
      showMessage(e.message || 'Google sign-in failed', 'error');
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showMessage('Login successful', 'success');
    } catch (e) {
      showMessage(e.message || 'Email sign-in failed', 'error');
    }
  };

  const handleEmailSignup = async () => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      if (name) await updateProfile(cred.user, { displayName: name });
      showMessage('Account created', 'success');
    } catch (e) {
      showMessage(e.message || 'Signup failed', 'error');
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      showMessage('Password reset email sent', 'success');
    } catch (e) {
      showMessage(e.message || 'Failed to send reset email', 'error');
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    showMessage('Signed out', 'success');
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-3 mb-4">
            <img className="w-10 h-10 rounded-full" alt="avatar" src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=2563eb&color=fff`} />
            <div>
              <div className="font-semibold text-gray-900">{user.displayName || 'User'}</div>
              <div className="text-sm text-gray-600">{user.email}</div>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full btn-secondary">Sign Out</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        {message && (
          <div className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
            {message.msg}
          </div>
        )}
        <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setTab('login')} className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${tab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sign In</button>
          <button onClick={() => setTab('signup')} className={`flex-1 py-2 px-4 text-sm font-medium rounded-md ${tab === 'signup' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Sign Up</button>
        </div>

        {tab === 'login' ? (
          <div className="space-y-4">
            <input className="input-field w-full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input-field w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleEmailLogin}>Sign In</button>
            <button className="w-full bg-white border border-gray-300 rounded-lg py-2 hover:bg-gray-50" onClick={handleGoogle}>Continue with Google</button>
            <button className="w-full text-sm text-blue-600" onClick={handleReset}>Forgot password?</button>
          </div>
        ) : (
          <div className="space-y-4">
            <input className="input-field w-full" type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="input-field w-full" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className="input-field w-full" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <button className="btn-primary w-full" onClick={handleEmailSignup}>Create Account</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;


