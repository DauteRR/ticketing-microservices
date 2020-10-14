import React, { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/useRequest';

interface SignUpRequestBody {
  email: string;
  password: string;
}

interface SignUpResponse {
  email: string;
  id: string;
}

export const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [doRequest, errors] = useRequest<SignUpRequestBody, SignUpResponse>({
    body: { email, password },
    method: 'POST',
    url: '/api/users/signup',
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
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
      <button className="btn btn-primary">Sign Up</button>
    </form>
  );
};

export default SignUp;
