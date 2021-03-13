import axios from 'axios';
import { NextPage } from 'next';
import Router from 'next/router';
import React from 'react';
import { Layout } from '../../components/Layout';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import useRequest from '../../hooks/useRequest';

export interface TicketShowPageProps extends CurrentUserResponse {
  ticket: Ticket;
}

export const TicketShowPage: NextPage<TicketShowPageProps> = ({
  currentUser,
  ticket
}) => {
  const [doRequest, errors] = useRequest<
    CreateOrderRequestBody,
    CreateOrderResponse
  >({
    url: '/api/orders',
    method: 'POST',
    body: {
      ticketId: ticket.id
    },
    onSuccess: order => Router.push('/orders/[orderId]', `/orders/${order.id}`)
  });

  return (
    <>
      <Layout currentUser={currentUser}>
        <h1>{ticket.title}</h1>
        <h4>{ticket.price}</h4>
        {errors}
        <button className="btn btn-primary" onClick={() => doRequest()}>
          Purchase
        </button>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps<{ ticket: Ticket }>(
  async context => {
    const { ticketId } = context.query;

    const { data } = await axios.get<Ticket>(
      `http://ingress-nginx-srv/api/tickets/${ticketId}`,
      {
        headers: context.req.headers
      }
    );

    return { props: { ticket: data } };
  }
);

export default TicketShowPage;
