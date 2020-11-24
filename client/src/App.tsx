import React, { useEffect } from 'react';
import NotFoundPage from './pages/NotFoundPage';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import styled from 'styled-components';

const AppContainer = styled.div`
  padding-left: 2rem;
  padding-right: 2rem;
`;

function App() {
  useEffect(() => {
    console.log('app started');
  }, []);

  return (
    <>
      <AppContainer>
        <NavBar />
        <Router>
          <Switch>
            <Route exact path="/">
              <HomePage />
            </Route>
            <Route path="*">
              <NotFoundPage />
            </Route>
          </Switch>
        </Router>
      </AppContainer>
    </>
  );
}

export default App;
