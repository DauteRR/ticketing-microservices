import axios from 'axios';
import { useState } from 'react';
import { ApiError } from '..';
import { ErrorsAlert } from '../components/ErrorsAlert';

interface UseRequestParams<Body, Response> {
  url: string;
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
  body: Partial<Body>;
  onSuccess(data: Response): any;
}

export function useRequest<Body = any, Response = any>({
  body,
  method,
  url,
  onSuccess
}: UseRequestParams<Body, Response>) {
  const [errors, setErrors] = useState<JSX.Element>(<></>);

  const doRequest = async (props: Partial<Body> = {}) => {
    try {
      setErrors(<></>);
      const response = await axios.request({
        url,
        method,
        data: { ...body, ...props }
      });

      if (onSuccess) onSuccess(response.data);

      return response.data as Response;
    } catch (err) {
      const {
        response: {
          data: { errors }
        }
      } = err;

      setErrors(
        errors ? (
          <ErrorsAlert>
            {(err.response.data.errors as ApiError[]).map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ErrorsAlert>
        ) : (
          <ErrorsAlert>
            <li>Something went wrong :(</li>
          </ErrorsAlert>
        )
      );
    }
  };

  return [doRequest, errors] as const;
}

export default useRequest;
