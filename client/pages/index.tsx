import axios, { AxiosResponse } from 'axios';
import { NextPage } from 'next';
import React from 'react';
import { GetServerSideProps } from 'next';

interface CurrentUser {
  email: string;
  id: string;
  iat: number;
}

interface CurrentUserResponse {
  currentUser: CurrentUser | null;
}

interface Props extends CurrentUserResponse {}

export const getServerSideProps: GetServerSideProps<Props> = async ({
  req
}) => {
  const response = await axios.get<CurrentUserResponse>(
    'http://ingress-nginx-srv/api/users/currentuser',
    {
      headers: req.headers
    }
  );
  return { props: response.data };
};

const Index: NextPage<Props> = ({ currentUser }) => {
  return (
    <>
      <h1>Landing page</h1>
      {currentUser && <p>Welcome {currentUser.email}</p>}
    </>
  );
};

export default Index;
