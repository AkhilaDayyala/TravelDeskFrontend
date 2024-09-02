// components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: ${(props) => (props.isDarkMode ? '#333' : '#fff')};
  color: ${(props) => (props.isDarkMode ? '#fff' : '#333')};
`;

const NavLink = styled(Link)`
  color: inherit;
  text-decoration: none;
  margin: 0 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const DarkModeToggle = styled.button`
  background: none;
  border: 1px solid ${(props) => (props.isDarkMode ? '#fff' : '#333')};
  color: ${(props) => (props.isDarkMode ? '#fff' : '#333')};
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 5px;
`;

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, logout } = useAuth();

  return (
    <NavbarContainer isDarkMode={isDarkMode}>
      <div>
        <NavLink to="/dashboard/employee">Employee Dashboard</NavLink>
        <NavLink to="/dashboard/manager">Manager Dashboard</NavLink>
        <NavLink to="/dashboard/travel-admin">Travel Admin Dashboard</NavLink>
        <NavLink to="/dashboard/admin">Admin Dashboard</NavLink>
      </div>
      <div>
        <DarkModeToggle isDarkMode={isDarkMode} onClick={toggleDarkMode}>
          {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </DarkModeToggle>
        <button onClick={logout}>Logout</button>
      </div>
    </NavbarContainer>
  );
};

export default Navbar;
