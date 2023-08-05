export interface ApiResponse {
  data?: any;
  errors?: Error;
  message?: string;
  meta?: { [key: string]: any };
}
