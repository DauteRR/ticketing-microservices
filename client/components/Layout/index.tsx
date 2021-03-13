import React from 'react';
import Header from '../Header';

export interface LayoutProps extends CurrentUserResponse {}

export const Layout: React.FC<LayoutProps> = ({ currentUser, children }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <div className="container">{children}</div>
    </>
  );
};

export default Layout;
