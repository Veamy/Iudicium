import React from "react";
import { API_URL } from "../../../env";

interface ProfileViewProps {
  id: string;
}

const ProfileView = ({ id }: ProfileViewProps) => {
  const [user, setUser] = React.useState<any>(null); 
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch(API_URL + '/user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching user profile:', err);
        setError(err.message || 'Щось пішло не так');
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Завантаження профілю...</div>;
  if (error) return <div style={{ color: 'red' }}>Помилка: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Profile View</h2>

      <pre
        style={{
          background: '#f4f4f4',
          padding: '16px',
          borderRadius: '8px',
          overflowX: 'auto',
          border: '1px solid #ddd',
        }}
      >
        {JSON.stringify(user, null, 2)}
      </pre>
    </div>
  );
};

export default ProfileView;