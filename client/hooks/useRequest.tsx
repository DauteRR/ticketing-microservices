import axios from 'axios';
import { useState } from 'react';
import { ApiError } from '..';

interface UseRequestParams {
  url: string;
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
  body: object;
}

export function useRequest<R extends any>({
  body,
  method,
  url
}: UseRequestParams) {
  const [errors, setErrors] = useState<JSX.Element>(<></>);

  const doRequest = async () => {
    try {
      setErrors(<></>);
      const response = await axios.request({
        url,
        method,
        data: body
      });
      return response.data as R;
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
