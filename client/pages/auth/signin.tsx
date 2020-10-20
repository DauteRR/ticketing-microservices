import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';

export const SignIn: NextPage = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [doRequest, errors] = useRequest<SignInRequestBody, SignInResponse>({
    body: { email, password },
    method: 'POST',
    url: '/api/users/signin',
    onSuccess: () => Router.push('/')
  });

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    doRequest();
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign In</h1>
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
      <button className="btn btn-primary">Sign In</button>
    </form>
  );
};

export default SignIn;
