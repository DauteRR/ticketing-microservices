import { NextPage } from 'next';
import React from 'react';
import { withAuthServerSideProps } from '../hocs/withAuthServerSideProps';

interface Props extends CurrentUserResponse {}

const Index: NextPage<Props> = ({ currentUser }) => {
  return (
    <>
      <h1>Landing page</h1>
      {currentUser && <p>Welcome {currentUser.email}</p>}
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default Index;
