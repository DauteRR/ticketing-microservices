import axios from 'axios';
import { NextPage } from 'next';
import Router from 'next/router';
import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { withAuthServerSideProps } from '../../hocs/withAuthServerSideProps';
import StripeCheckout from 'react-stripe-checkout';
import useRequest from '../../hooks/useRequest';

export interface OrderShowPageProps extends CurrentUserResponse {
  order: Order;
}

export const OrderShowPage: NextPage<OrderShowPageProps> = ({
  currentUser,
  order
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [doRequest, errors] = useRequest<PaymentRequestBody, PaymentResponse>({
    body: {
      orderId: order.id
    },
    method: 'POST',
    onSuccess: () => Router.push('/orders'),
    url: '/api/payments'
  });

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [order]);

  return (
    <>
      <Layout currentUser={currentUser}>
        {timeLeft <= 0 ? (
          <h4>Order expired</h4>
        ) : (
          <>
            <h3>Time left to pay</h3>
            <h4>
              {Math.floor(timeLeft / 60)
                .toString()
                .padStart(2, '0')}
              :
              {Math.floor(timeLeft % 60)
                .toString()
                .padStart(2, '0')}
            </h4>
            <StripeCheckout
              token={token => doRequest({ token: token.id })}
              stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY!}
              amount={order.ticket.price * 100}
              email={currentUser?.email}
            />
            {errors}
          </>
        )}
      </Layout>
    </>
  );
};

export const getServerSideProps = withAuthServerSideProps<{ order: Order }>(
  async context => {
    const { orderId } = context.query;

    const { data } = await axios.get<Order>(
      `http://ingress-nginx-srv/api/orders/${orderId}`,
      {
        headers: context.req.headers
      }
    );

    return { props: { order: data } };
  }
);

export default OrderShowPage;
