import React from 'react';

interface Props {
  type: 'Sign In' | 'Sign Up';
  email: string;
  setEmail(email: string): void;
  password: string;
  setPassword(password: string): void;
  onSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void>;
  errors: JSX.Element;
}

export const AuthForm: React.FC<Props> = ({
  email,
  password,
  setEmail,
  setPassword,
  type,
  onSubmit,
  errors
}) => {
  return (
    <form onSubmit={onSubmit}>
      <h1>{type}</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          className="form-control"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      {errors}
      <button className="btn btn-primary">{type}</button>
    </form>
  );
};

export default AuthForm;
