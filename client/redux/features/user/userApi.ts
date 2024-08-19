import { apiSlice } from "../api/apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateAvatar: builder.mutation({
      query: (avatar) => ({
        url: "update-avatar",
        method: "PUT",
        body: { avatar },
        credentials: "include",
      }),
    }),
    updateUser: builder.mutation({
      query: ({ name }) => ({
        url: "update-profile",
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ oldPassword, newPassword }) => ({
        url: "update-password",
        method: "PUT",
        body: { oldPassword, newPassword },
        credentials: "include",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "all-users",
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
} = userApi;
