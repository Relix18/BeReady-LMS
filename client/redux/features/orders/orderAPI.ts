import { apiSlice } from "../api/apiSlice";

export const orderApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query({
      query: () => ({
        url: "all-orders",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useGetOrdersQuery } = orderApi;
