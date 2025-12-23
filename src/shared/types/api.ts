export interface ApiError {
  timestamp?: string;
  status: number;
  error: string;
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
}
