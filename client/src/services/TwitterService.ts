export const authenticateUser = async () => {
  return fetch('http://localhost:4000/auth/login/success', {
    method: 'GET',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
  //   // @ts-ignore
  //   .then((response) => {
  //     if (response.status === 200) return response.json();
  //     // @ts-ignore
  //     throw new Error('failed to authenticate user');
  //   })
  //   // @ts-ignore
  //   .then((responseJson) => {
  //     setAuthenticated(true);
  //     setUser(responseJson.user);
  //   })
  //   // @ts-ignore
  //   .catch((error) => {
  //     setAuthenticated(false);
  //     setAuthError('Failed to authenticate user');
  //   });
};
