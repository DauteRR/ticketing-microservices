import React from 'react';
import Link from 'next/link';

interface Props extends CurrentUserResponse {}

export const Header: React.FC<Props> = ({ currentUser }) => {
  return (
    <nav className="navbar navbar-light bg-light">
      <Link href="/">
        <a className="navbar-brand">GitTix</a>
      </Link>

      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">
          {!currentUser && (
            <li className="nav-item">
              <Link href="/auth/signin">
                <a className="nav-link">Sign In</a>
              </Link>
            </li>
          )}
          {!currentUser && (
            <li className="nav-item">
              <Link href="/auth/signup">
                <a className="nav-link">Sign Up</a>
              </Link>
            </li>
          )}
          {currentUser && (
            <li className="nav-item">
              <Link href="/">
                <a className="nav-link">Sign Out</a>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
