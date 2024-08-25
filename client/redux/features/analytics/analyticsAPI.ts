import { apiSlice } from "../api/apiSlice";

export const analyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCoursesAnalytics: builder.query({
      query: () => ({
        url: "get-course-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
    getUsersAnalytics: builder.query({
      query: () => ({
        url: "get-user-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
    getOrdersAnalytics: builder.query({
      query: () => ({
        url: "get-order-analytics",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetCoursesAnalyticsQuery,
  useGetUsersAnalyticsQuery,
  useGetOrdersAnalyticsQuery,
} = analyticsApi;
