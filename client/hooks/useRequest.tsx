import axios from 'axios';
import { useState } from 'react';
import { ApiError } from '..';

interface UseRequestParams<R> {
  url: string;
  method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH';
  body: object;
  onSuccess(data: R): any;
}

export function useRequest<R extends any>({
  body,
  method,
  url,
  onSuccess
}: UseRequestParams<R>) {
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
