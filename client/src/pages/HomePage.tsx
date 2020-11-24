import React, { useEffect, useState } from 'react';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // authenticateUser(setUser, setAuthenticated, setAuthError);
  }, []);
  return (
    <div>
      {!authenticated ? (
        <h1>Welcome!</h1>
      ) : (
        <div>
          <h1>You have login succcessfully!</h1>
          <h2>Welcome {user}!</h2>
        </div>
      )}
    </div>
  );
};

export default HomePage;
