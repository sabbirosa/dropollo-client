import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Admin-only endpoints
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/user",
        method: "GET",
        params,
      }),
      providesTags: ["USER"],
    }),

    getUserById: builder.query({
      query: (id) => ({
        url: `/user/${id}`,
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    getUserStats: builder.query({
      query: () => ({
        url: "/user/stats",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/user/${id}/role`,
        method: "PUT",
        body: { role },
      }),
      invalidatesTags: ["USER"],
    }),

    blockUnblockUser: builder.mutation({
      query: ({ id, isBlocked, reason }) => ({
        url: `/user/${id}/block`,
        method: "PUT",
        body: { isBlocked, reason },
      }),
      invalidatesTags: ["USER"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["USER"],
    }),

    // User profile endpoints (for all authenticated users)
    getMyProfile: builder.query({
      query: () => ({
        url: "/user/profile/me",
        method: "GET",
      }),
      providesTags: ["USER"],
    }),

    updateMyProfile: builder.mutation({
      query: (profileData) => ({
        url: "/user/profile/update",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["USER"],
    }),

    // Auth profile endpoints (alternative endpoints from auth module)
    updateAuthProfile: builder.mutation({
      query: (profileData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: profileData,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation({
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
