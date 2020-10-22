import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { AuthForm } from '../../components/AuthForm';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useRequest } from '../../hooks/useRequest';

export const SignUp: NextPage = () => {
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
    <AuthForm
      onSubmit={onSubmit}
      email={email}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      errors={errors}
      type="Sign Up"
    />
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default SignUp;
