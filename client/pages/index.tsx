import React from 'react';
import Layout from '../components/Layout';
import { Button } from '@chakra-ui/core';

export const Index: React.FC = () => {
  return (
    <Layout title="Home">
      <h1>Hello Next.js 👋</h1>
      <Button variantColor="green">Button</Button>
    </Layout>
  );
};
export default Index;
