import { baseApi } from "@/redux/baseApi";
import type { IResponse, IUser, IUserStats, IUpdateProfileData, IChangePasswordData } from "@/types";

interface UserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
  sort?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin-only endpoints
    getAllUsers: builder.query<IResponse<IUser[]>, UserQueryParams>({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: ["USER"],
    }),

    getUserById: builder.query<IResponse<IUser>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getUserStats: builder.query<IResponse<IUserStats>, void>({
      query: () => ({
        url: "/user/stats",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserRole: builder.mutation<IResponse<IUser>, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["USER"],
    }),

    blockUnblockUser: builder.mutation<IResponse<IUser>, { id: string; isBlocked: boolean; reason?: string }>({
      query: ({ id, isBlocked, reason }) => ({
        url: `/user/${id}/block`,
        method: "PUT",
        body: { isBlocked, reason },
      }),
      invalidatesTags: ["USER"],
    }),

    deleteUser: builder.mutation<IResponse<{ message: string }>, string>({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),

    // User profile endpoints (for all authenticated users)
    getMyProfile: builder.query<IResponse<IUser>, void>({
      query: () => ({
        url: "/user/profile/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateMyProfile: builder.mutation<IResponse<IUser>, IUpdateProfileData>({
      query: (profileData) => ({
        url: "/user/profile/update",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["USER"],
    }),

    // Auth profile endpoints (alternative endpoints from auth module)
    updateAuthProfile: builder.mutation<IResponse<IUser>, IUpdateProfileData>({
      query: (profileData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation<IResponse<{ message: string }>, IChangePasswordData>({
      query: ({ currentPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "PUT",
        body: { currentPassword, newPassword },
      }),
    }),
  }),
});

export const {
  // Admin hooks
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserStatsQuery,
  useUpdateUserRoleMutation,
  useBlockUnblockUserMutation,
  useDeleteUserMutation,
  
  // Profile hooks
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateAuthProfileMutation,
  useChangePasswordMutation,
} = userApi;
