import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import { AuthForm } from '../../components/AuthForm';
import Layout from '../../components/Layout';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import { useRequest } from '../../hooks/useRequest';

interface Props extends CurrentUserResponse {}

export const SignIn: NextPage<Props> = ({ currentUser }) => {
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
    <>
      <Layout currentUser={currentUser}>
        <AuthForm
          onSubmit={onSubmit}
          email={email}
          password={password}
          setEmail={setEmail}
          setPassword={setPassword}
          errors={errors}
          type="Sign In"
        />
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default SignIn;
