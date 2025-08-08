import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../core/hooks/useAuth';

export const Header = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-black">
      <div className="container-fluid">
        <Link className="navbar-brand text-light" style={{ textDecoration: 'none', outline: 'none' }} to="/">BudgetApp</Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated && (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={logout}>Logout</button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};