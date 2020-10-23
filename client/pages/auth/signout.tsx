import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect } from 'react';
import { useRequest } from '../../hooks/useRequest';

interface Props {}

export const SignOut: NextPage<Props> = ({}) => {
  const [doRequest] = useRequest<SignOutRequestBody, SignOutResponse>({
    body: {},
    method: 'POST',
    url: '/api/users/signout',
    onSuccess: () => Router.push('/')
  });

  useEffect(() => {
    doRequest();
  }, []);

  return <div>Signing you out...</div>;
};

export default SignOut;
