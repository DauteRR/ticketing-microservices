import axios from 'axios';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

export function withAuthServerSideProps<Q>(
  getServerSidePropsFunc?: GetServerSideProps<Q>
) {
  return async (context: GetServerSidePropsContext<ParsedUrlQuery>) => {
    const response = await axios.get<CurrentUserResponse>(
      'http://ingress-nginx-srv/api/users/currentuser',
      {
        headers: context.req.headers
      }
    );
    const {
      data: { currentUser }
    } = response;
    let result = { currentUser };

    if (!getServerSidePropsFunc) {
      return { props: result };
    }

    const { props } = await getServerSidePropsFunc(context);
    if (props) {
      result = { ...result, ...props };
    }

    return {
      props: result
    };
  };
}
