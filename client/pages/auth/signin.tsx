import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { AuthForm } from '../../components/AuthForm';
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
    <AuthForm
      onSubmit={onSubmit}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      errors={errors}
      type="Sign In"
    />
  );
};

export default SignIn;
