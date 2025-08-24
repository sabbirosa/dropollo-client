import { baseApi } from "@/redux/baseApi";
import type { IResponse, IUser } from "@/types";

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "sender" | "receiver" | "admin";
}

interface LoginData {
  email: string;
  password: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<IResponse<IUser>, RegisterData>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        data: userData,
      }),
    }),

    login: builder.mutation<IResponse<{ user: IUser; accessToken: string }>, LoginData>({
      query: (userData) => ({
        url: "/auth/login",
        method: "POST",
        data: userData,
      }),
    }),

    logout: builder.mutation<IResponse<{ message: string }>, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["USER", "PARCEL"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(baseApi.util.resetApiState());
        } catch {
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),

    userInfo: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useUserInfoQuery,
} = authApi;
