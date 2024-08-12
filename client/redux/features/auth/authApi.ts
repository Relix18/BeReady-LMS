import { apiSlice } from "../api/apiSlice";
import { login, logout, signUp } from "./authSlice";

type RegistrationResponse = {
  message: string;
  token: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            signUp({
              token: data.token,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activationCode }) => ({
        url: "activation",
        method: "POST",
        body: { activationCode },
        credentials: "include",
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: { email, password },
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            login({
              token: data.token,
              user: data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    socialAuth: builder.mutation({
      query: ({ email, name, avatar }) => ({
        url: "social-auth",
        method: "POST",
        body: { email, name, avatar },
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            login({
              token: data.token,
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

export const {
  useLoginMutation,
  useRegisterMutation,
  useActivationMutation,
  useSocialAuthMutation,
} = authApi;
