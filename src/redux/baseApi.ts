import config from "@/config";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: config.apiBaseUrl,
    credentials: "include",
  }),
  // baseQuery: axiosBaseQuery(),
  tagTypes: ["USER"],
  endpoints: () => ({}),
});
