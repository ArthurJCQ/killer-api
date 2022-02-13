interface ExceptionResponse {
  statusCode?: number;
  message?: string;
  key?: string;
  args?: Record<string, never>;
}
