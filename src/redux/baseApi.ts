import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: config.apiBaseUrl,
  //   credentials: "include",
  // }),
  baseQuery: axiosBaseQuery(),
  tagTypes: ["USER", "PARCEL"],
  endpoints: () => ({}),
});
