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
      invalidatesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ name }) => ({
        url: "update-profile",
        method: "PUT",
        body: { name },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
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
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ email, role }) => ({
        url: `update-user`,
        method: "PUT",
        body: { role, email },
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useUpdateAvatarMutation,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useDeleteUserMutation,
} = userApi;
