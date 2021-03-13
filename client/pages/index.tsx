import axios from 'axios';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import Layout from '../components/Layout';
import { withAuthServerSideProps } from '../hocs/withAuthServerSideProps';

interface Props extends CurrentUserResponse {
  tickets: GetTicketsResponse;
}

const Index: NextPage<Props> = ({ currentUser, tickets }) => {
  const ticketList = tickets.map(ticket => (
    <tr key={ticket.id}>
      <td>{ticket.title}</td>
      <td>{ticket.price}</td>
      <td>
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          <a>View</a>
        </Link>
      </td>
    </tr>
  ));

  return (
    <>
      <Layout currentUser={currentUser}>
        <div>
          <h1>Tickets</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody>{ticketList}</tbody>
          </table>
        </div>
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps<{
  tickets: GetTicketsResponse;
}>(async context => {
  const { data } = await axios.get<GetTicketsResponse>(
    'http://ingress-nginx-srv/api/tickets',
    {
      headers: context.req.headers
    }
  );

  return { props: { tickets: data } };
});

export default Index;
