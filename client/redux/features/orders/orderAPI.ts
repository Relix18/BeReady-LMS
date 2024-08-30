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
    getStripePublishKey: builder.query({
      query: () => ({
        url: "payment/stripepublishkey",
        method: "GET",
        credentials: "include",
      }),
    }),
    createPayment: builder.mutation({
      query: (amount) => ({
        url: "payment",
        method: "POST",
        body: {
          amount,
        },
        credentials: "include",
      }),
    }),
    createOrder: builder.mutation({
      query: ({ courseId, payment_info }) => ({
        url: "create-order",
        method: "POST",
        body: { courseId, payment_info },
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetStripePublishKeyQuery,
  useCreatePaymentMutation,
  useCreateOrderMutation,
} = orderApi;
