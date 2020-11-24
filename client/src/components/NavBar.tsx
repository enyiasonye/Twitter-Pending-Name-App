import React from 'react';
import styled from 'styled-components';

const StyledHeader = styled.div`
  display: flex;
`;

const NavBar = () => {
  return (
    <StyledHeader>
      <h1>Twitter App</h1>
      <h1>Pricing</h1>
      <h1>Sign in with twitter</h1>
    </StyledHeader>
  );
};

export default NavBar;
