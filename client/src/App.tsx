import React, { useEffect } from 'react';
import NotFoundPage from './pages/NotFoundPage';
import { Switch, Route, useHistory } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './shared/components/NavBar';
import styled from 'styled-components';
import { RootState } from './store/store';
import { useDispatch, useSelector } from 'react-redux';
import PrivateRoute from './shared/components/PrivateRoute';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import { getTokenAndSecret } from './store/thunks/authThunks';
import SideBar from './shared/components/SideBar';
import AccountPage from './pages/AccountPage';

const AppContainer = styled.div`
  display: flex;
  flex-direction: ${(props: { currentUser: boolean }) =>
    props.currentUser ? 'row' : 'column'};
`;

// @ts-ignore
const App = () => {
  const isLoading = useSelector(
    (state: RootState) => state.auth.applicationLoading,
  );
  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: RootState) => state.auth.userProfile);

  // use loggingIn and storedUser so that loading only happens when logging in or already logged in
  const storedUser = localStorage.getItem('user');
  const loggingIn = localStorage.getItem('loggingIn');

  useEffect(() => {
    dispatch(getTokenAndSecret());
  }, [dispatch]);

  // redirect to dashboard on initial log in
  useEffect(() => {
    if (loggingIn) {
      history.push('/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  return (
    <>
      {(loggingIn || storedUser) && isLoading ? (
        <div>Loading</div>
      ) : (
        <AppContainer currentUser={currentUser !== null}>
          {currentUser ? <SideBar /> : <NavBar />}
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
            <PrivateRoute path="/account">
              <AccountPage />
            </PrivateRoute>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </AppContainer>
      )}
    </>
  );
};

export default App;
