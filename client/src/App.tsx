import React, { useEffect } from 'react';
import NotFoundPage from './pages/NotFoundPage';
import { Switch, Route, useHistory } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import styled from 'styled-components';
import { RootState } from './store/store';
import { useSelector } from 'react-redux';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';

const AppContainer = styled.div`
  /* padding-left: 2rem; */
  /* padding-right: 2rem; */
`;

// @ts-ignore
const App = () => {
  const isLoading = useSelector(
    (state: RootState) => state.auth.applicationLoading,
  );
  const history = useHistory();
  const currentUser = useSelector((state: RootState) => state.auth.userProfile);

  // use loggingIn and storedUser so that loading only happens when logging in or already logged in
  const storedUser = localStorage.getItem('user');
  const loggingIn = localStorage.getItem('loggingIn');

  // redirect to dashboard on initial log in
  useEffect(() => {
    if (loggingIn) {
      history.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <>
      <AppContainer>
        {(loggingIn || storedUser) && isLoading ? (
          <div>Loading</div>
        ) : (
          <>
            <NavBar />
            <Switch>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route exact path="/pricing">
                <Pricing />
              </Route>
              <PrivateRoute path="/dashboard">
                <Dashboard />
              </PrivateRoute>
              <Route path="*">
                <NotFoundPage />
              </Route>
            </Switch>
          </>
        )}
      </AppContainer>
    </>
  );
};

export default App;
