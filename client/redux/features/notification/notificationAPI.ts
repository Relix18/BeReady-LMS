import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllNotifications: builder.query({
      query: () => ({
        url: "get-notifications",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Notification"],
    }),
    updateNotification: builder.mutation({
      query: (id) => ({
        url: `update-notification/${id}`,
        method: "PUT",
        credentials: "include",
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const { useGetAllNotificationsQuery, useUpdateNotificationMutation } =
  notificationApi;
