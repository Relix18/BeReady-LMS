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
  }),
});

export const { useRegisterMutation, useActivationMutation } = authApi;
