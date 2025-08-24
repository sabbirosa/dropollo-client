import { baseApi } from "@/redux/baseApi";
import type {
  ICreateParcel,
  IParcel,
  IParcelFilters,
  IParcelStats,
  IResponse,
  IUpdateParcel,
  IUpdateParcelStatus,
} from "@/types";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    trackParcel: builder.query<IParcel, string>({
      query: (trackingId) => `/parcel/track/${trackingId}`,
      providesTags: ["PARCEL"],
    }),

    createParcel: builder.mutation<IParcel, ICreateParcel>({
      query: (body) => ({
        url: "/parcel",
        method: "POST",
        body,
      }),

      invalidatesTags: ["PARCEL"],
    }),

    getMySentParcels: builder.query<IResponse<IParcel[]>, Partial<IParcelFilters>>({
      query: (params) => ({ url: "/parcel/my-sent", params }),
      providesTags: ["PARCEL"],
    }),

    updateParcel: builder.mutation<
      IParcel,
      { id: string; data: IUpdateParcel }
    >({
      query: ({ id, data }) => ({
        url: `/parcel/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PARCEL"],
    }),

    cancelParcel: builder.mutation<IParcel, { id: string; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/parcel/${id}/cancel`,
        method: "DELETE",
        body: { reason },
      }),
      invalidatesTags: ["PARCEL"],
    }),

    // -------- Receiver --------
    getMyReceivedParcels: builder.query<
      IResponse<IParcel[]>,
      Partial<IParcelFilters>
    >({
      query: (params) => ({ url: "/parcel/my-received", params }),
      providesTags: ["PARCEL"],
    }),

    confirmDelivery: builder.mutation<IParcel, { id: string; note?: string }>({
      query: ({ id, note }) => ({
        url: `/parcel/${id}/confirm-delivery`,
        method: "PUT",
        body: { note },
      }),
      invalidatesTags: ["PARCEL"],
    }),

    getDeliveryHistory: builder.query<IResponse<IParcel[]>, Partial<IParcelFilters>>(
      {
        query: (params) => ({ url: "/parcel/delivery-history", params }),
        providesTags: ["PARCEL"],
      }
    ),

    // -------- Admin --------
    getAllParcels: builder.query<IResponse<IParcel[]>, Partial<IParcelFilters>>({
      query: (params) => ({ url: "/parcel", params }),
      providesTags: ["PARCEL"],
    }),

    updateParcelStatus: builder.mutation<
      IParcel,
      { id: string; data: IUpdateParcelStatus }
    >({
      query: ({ id, data }) => ({
        url: `/parcel/${id}/status`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["PARCEL"],
    }),

    blockParcel: builder.mutation<
      IParcel,
      { id: string; isBlocked: boolean; reason?: string }
    >({
      query: ({ id, isBlocked, reason }) => ({
        url: `/parcel/${id}/block`,
        method: "PUT",
        body: { isBlocked, reason },
      }),
      invalidatesTags: ["PARCEL"],
    }),

    assignDeliveryPersonnel: builder.mutation<
      IParcel,
      { id: string; deliveryPersonnel: { id: string; name: string } }
    >({
      query: ({ id, deliveryPersonnel }) => ({
        url: `/parcel/${id}/assign`,
        method: "PUT",
        body: { deliveryPersonnel },
      }),
      invalidatesTags: ["PARCEL"],
    }),

    deleteParcel: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["PARCEL"],
    }),

    getParcelStats: builder.query<IParcelStats, void>({
      query: () => "/parcel/stats",
      providesTags: ["PARCEL"],
    }),

    // -------- Shared --------
    getParcelById: builder.query<IParcel, string>({
      query: (id) => `/parcel/${id}`,
      providesTags: ["PARCEL"],
    }),

    getParcelStatusHistory: builder.query<
      { status: string; updatedAt: string; note?: string }[],
      string
    >({
      query: (id) => `/parcel/${id}/status-history`,
      providesTags: ["PARCEL"],
    }),
  }),
});

export const {
  // Public
  useTrackParcelQuery,

  // Sender
  useCreateParcelMutation,
  useGetMySentParcelsQuery,
  useUpdateParcelMutation,
  useCancelParcelMutation,

  // Receiver
  useGetMyReceivedParcelsQuery,
  useConfirmDeliveryMutation,
  useGetDeliveryHistoryQuery,

  // Admin
  useGetAllParcelsQuery,
  useUpdateParcelStatusMutation,
  useBlockParcelMutation,
  useAssignDeliveryPersonnelMutation,
  useDeleteParcelMutation,
  useGetParcelStatsQuery,

  // Shared
  useGetParcelByIdQuery,
  useGetParcelStatusHistoryQuery,
} = parcelApi;
