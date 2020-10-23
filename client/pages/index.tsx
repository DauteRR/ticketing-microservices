import { NextPage } from 'next';
import React from 'react';
import Header from '../components/Header';
import { withAuthServerSideProps } from '../hocs/withAuthServerSideProps';

interface Props extends CurrentUserResponse {}

const Index: NextPage<Props> = ({ currentUser }) => {
  return (
    <>
      <Header currentUser={currentUser} />
      <h1>Landing page</h1>
      {currentUser && <p>Welcome {currentUser.email}</p>}
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default Index;
