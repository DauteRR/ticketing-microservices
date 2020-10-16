import React from 'react';

export const ErrorsAlert: React.FC = ({ children }) => {
  return (
    <div className="alert alert-danger">
      <h4>Ooops...</h4>
      <ul className="my-0">{children}</ul>
    </div>
  );
};

export default ErrorsAlert;
