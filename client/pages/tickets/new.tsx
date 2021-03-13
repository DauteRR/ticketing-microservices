import { NextPage } from 'next';
import Router from 'next/router';
import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import useRequest from '../../hooks/useRequest';

interface NewTicketPageProps extends CurrentUserResponse {}

export const NewTicketPage: NextPage<NewTicketPageProps> = ({
  currentUser
}) => {
  const [title, setTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('');

  const [doRequest, errors] = useRequest<
    CreateTicketRequestBody,
    CreateTicketResponse
  >({
    url: '/api/tickets',
    method: 'POST',
    body: {
      title,
      price
    },
    onSuccess: () => Router.push('/')
  });

  const onBlur = () => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  return (
    <Layout currentUser={currentUser}>
      <div>
        <h1>Create a ticket</h1>
        <form
          onSubmit={event => {
            event.preventDefault();
            doRequest();
          }}>
          <div className="form-group">
            <label>Title</label>
            <input
              value={title}
              onChange={event => setTitle(event.target.value)}
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              value={price}
              onBlur={onBlur}
              onChange={event => setPrice(event.target.value)}
              className="form-control"
            />
          </div>
          {errors}
          <button className="btn btn-primary">Create</button>
        </form>
      </div>
    </Layout>
  );
};

export const getServerSideProps = withAuthServerSideProps();

export default NewTicketPage;
