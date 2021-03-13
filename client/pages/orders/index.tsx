import axios from 'axios';
import { NextPage } from 'next';
import React from 'react';
import Layout from '../../components/Layout';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';

export interface OrderListPageProps extends CurrentUserResponse {
  orders: Order[];
}

export const OrderListPage: NextPage<OrderListPageProps> = ({
  currentUser,
  orders
}) => {
  return (
    <Layout currentUser={currentUser}>
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.ticket.title} - {order.status}
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps<{
  orders: GetOrdersResponse;
}>(async context => {
  const { data } = await axios.get<GetOrdersResponse>(
    'http://ingress-nginx-srv/api/orders',
    {
      headers: context.req.headers
    }
  );

  return { props: { orders: data } };
});

export default OrderListPage;
