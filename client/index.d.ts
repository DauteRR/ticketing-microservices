export interface ApiError {
  message: string;
  field?: string;
}

export interface ErrorResponse {
  errors: ApiError[];
}
