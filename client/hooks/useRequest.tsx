import axios from 'axios';
import { useState } from 'react';
import { ApiError } from '..';

interface UseRequestParams<Body, Response> {
  url: string;
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
  body: Body;
  onSuccess(data: Response): any;
}

export function useRequest<Body = any, Response = any>({
  body,
  method,
  url,
  onSuccess
}: UseRequestParams<Body, Response>) {
  const [errors, setErrors] = useState<JSX.Element>(<></>);

  const doRequest = async () => {
    try {
      setErrors(<></>);
      const response = await axios.request({
        url,
        method,
        data: body
      });

      if (onSuccess) onSuccess(response.data);

      return response.data as Response;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {(err.response.data.errors as ApiError[]).map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return [doRequest, errors] as const;
}

export default useRequest;
