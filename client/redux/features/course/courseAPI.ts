import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: (data) => ({
        url: "create-course",
        method: "POST",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    getAllCourses: builder.query({
      query: () => ({
        url: "get-all-courses",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `delete-course/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    editCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-course/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    getUserAllCourses: builder.query({
      query: () => ({
        url: "get-courses",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),
    getCourseDetails: builder.query({
      query: (id) => ({
        url: `get-course/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),
    getCourseContent: builder.query({
      query: (id) => ({
        url: `get-course-content/${id}`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Course"],
    }),
    addQuestion: builder.mutation({
      query: ({ question, courseId, contentId }) => ({
        url: "add-question",
        method: "PUT",
        body: { question, courseId, contentId },
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    addAnswer: builder.mutation({
      query: ({ questionId, courseId, contentId, answer }) => ({
        url: "add-answer",
        method: "PUT",
        body: { questionId, courseId, contentId, answer },
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    addReviewCourse: builder.mutation({
      query: ({ id, review, rating }) => ({
        url: `add-review/${id}`,
        method: "PUT",
        body: { review, rating },
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
    addReviewReply: builder.mutation({
      query: ({ reviewId, courseId, reply }) => ({
        url: `add-reply`,
        method: "PUT",
        body: { reviewId, courseId, reply },
        credentials: "include",
      }),
      invalidatesTags: ["Course"],
    }),
  }),
});

export const {
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useEditCourseMutation,
  useGetUserAllCoursesQuery,
  useGetCourseDetailsQuery,
  useGetCourseContentQuery,
  useAddQuestionMutation,
  useAddAnswerMutation,
  useAddReviewCourseMutation,
  useAddReviewReplyMutation,
} = courseApi;
