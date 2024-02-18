// utils/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = "http://localhost:8000/api/v1/auth/";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

interface FetcherOptions extends AxiosRequestConfig {}

export const fetcher = async <T>(
  url: string,
  method: string = "GET",
  data?: any,
  options?: FetcherOptions
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await axiosInstance.request({
      url,
      method,
      data,
      ...options,
    });

    return response.data;
  } catch (error) {
    throw new Error("Server response was not ok");
  }
};
