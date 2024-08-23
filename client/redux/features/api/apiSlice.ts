import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { login } from "../auth/authSlice";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_URL }),
  tagTypes: ["User", "Course", "Layout"],
  endpoints: (builder) => ({
    loadUser: builder.query({
      query: () => ({
        url: "me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            login({
              token: data.access_token,
              user: data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
  }),
});

export const { useLoadUserQuery } = apiSlice;
