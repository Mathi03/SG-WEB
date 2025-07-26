import {
  AuthorizationHeader,
  timeoutDuration,
  baseURL,
} from "@application/common/Globals";
import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";

function handleRequest(req: InternalAxiosRequestConfig) {
  req.headers = req.headers || {};
  if (req.url?.startsWith("/sign-in") || req.url?.startsWith("/signup")) {
    return req;
  }

  req.headers.Authorization = AuthorizationHeader;
  req.headers.timestamp = new Date().getTime();

  return req;
}

const axiosInstance = axios.create({
  baseURL,
  timeout: timeoutDuration,
  headers: {
    "Access-Control-Max-Age": 1728000,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Origin": "*",
    "ngrok-skip-browser-warning": "1",
    Accept: "application/json",
    "Cache-Control": "no-cache",
    "Content-Type": "application/json; charset=utf-8",
    Pragma: "no-cache",
    enable_api_call_log: false,
    api_call_log_save_private_request: false,
    api_call_log_save_private_response: false,
    api_call_log_save_public_request: false,
    api_call_log_save_public_response: false,
  },
});

axiosInstance.interceptors.request.use(handleRequest, Promise.reject);

type ApiHandlerConfig = Omit<AxiosRequestConfig, "method" | "url">;

export default {
  async get<T = unknown>(
    url: string,
    config?: Omit<ApiHandlerConfig, "data">
  ): Promise<T> {
    return axiosInstance(url, {
      ...config,
      method: "get",
    }).then((res) => res.data);
  },

  async post<T = unknown>(url: string, config?: ApiHandlerConfig): Promise<T> {
    return axiosInstance(url, {
      ...config,
      method: "post",
    }).then((res) => res.data);
  },

  async put<T = unknown>(url: string, config?: ApiHandlerConfig): Promise<T> {
    return axiosInstance(url, {
      ...config,
      method: "put",
    }).then((res) => res.data);
  },

  async delete<T = unknown>(
    url: string,
    config?: ApiHandlerConfig
  ): Promise<T> {
    return axiosInstance(url, { ...config, method: "delete" }).then(
      (res) => res.data
    );
  },
};
