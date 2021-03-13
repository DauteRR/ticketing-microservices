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
    const props = { currentUser };

    if (!getServerSidePropsFunc) {
      return { props };
    }

    const result = (await getServerSidePropsFunc(context)) as { props: Q };
    if (result && result.props) {
      return { props: { ...props, ...result.props } };
    }
  };
}
