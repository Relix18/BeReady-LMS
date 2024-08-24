import { apiSlice } from "../api/apiSlice";

export const layoutApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLayout: builder.query({
      query: (type) => ({
        url: `/get-layout/${type}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Layout"],
    }),
    editLayout: builder.mutation({
      query: ({ type, image, title, subtitle, faq, categories }) => ({
        url: "/edit-layout",
        method: "PUT",
        body: {
          type,
          image,
          title,
          subtitle,
          faq,
          categories,
        },
        credentials: "include",
      }),
      invalidatesTags: ["Layout"],
    }),
  }),
});

export const { useGetLayoutQuery, useEditLayoutMutation } = layoutApi;
