import React, { useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Mail = () => {
  const clientId = "336287137867-4ipucc09vb5f69vu84lrorc7ug7gcj4g.apps.googleusercontent.com";

  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [composing, setComposing] = useState(false);
  const [newEmail, setNewEmail] = useState({ to: '', subject: '', body: '' });

  const sendEmail = async () => {
    if (!accessToken) {
      alert('Access Token missing!');
      console.log('Access Token:', accessToken);
      return;
    }

    const emailContent = [
      'Content-Type: text/plain; charset="UTF-8"\n',
      'MIME-Version: 1.0\n',
      `To: ${newEmail.to}\n`,
      `Subject: ${newEmail.subject}\n\n`,
      newEmail.body,
    ].join('');

    const base64EncodedEmail = btoa(unescape(encodeURIComponent(emailContent)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    try {
      const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: base64EncodedEmail }),
      });

      if (!response.ok) throw new Error('Failed to send email');

      alert('Email sent successfully!');
      setComposing(false);
      setNewEmail({ to: '', subject: '', body: '' });
    } catch (err) {
      console.error('Send error:', err);
      alert('Failed to send email!');
    }
  };

  const handleLoginSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      setUser(decoded);
      console.log("User decoded:", decoded);

      // ✅ Request proper Access Token (with Gmail scope)
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/gmail.send',
        callback: (tokenResponse) => {
          console.log('Access Token:', tokenResponse.access_token);
          setAccessToken(tokenResponse.access_token);
        },
      });

      tokenClient.requestAccessToken();
    } catch (err) {
      console.error('Login decoding failed:', err);
    }
  };

  return (
    <div className="p-6 text-white bg-[#1a1b1e] h-screen">
      {!user ? (
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => console.log('Login Failed')}
        />
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src={user.picture} alt="avatar" className="w-8 h-8 rounded-full" />
              <span>{user.name}</span>
            </div>
            <button
              onClick={() => {
                googleLogout();
                setUser(null);
                setAccessToken('');
              }}
              className="bg-red-500 px-3 py-1 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
          </div>

          {!composing ? (
            <button
              onClick={() => setComposing(true)}
              className="bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Compose Email
            </button>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                value={newEmail.to}
                onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                className="w-full p-2 rounded-md bg-[#2a2b2e]"
              />
              <input
                type="text"
                placeholder="Subject"
                value={newEmail.subject}
                onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                className="w-full p-2 rounded-md bg-[#2a2b2e]"
              />
              <textarea
                placeholder="Your message..."
                value={newEmail.body}
                onChange={(e) => setNewEmail({ ...newEmail, body: e.target.value })}
                className="w-full h-40 p-2 rounded-md bg-[#2a2b2e]"
              />
              <div className="flex gap-2">
                <button
                  onClick={sendEmail}
                  className="bg-green-500 px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Send
                </button>
                <button
                  onClick={() => setComposing(false)}
                  className="bg-gray-600 px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Mail;
