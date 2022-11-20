import { baseApi } from "../base.api";
import { ITaskState } from "./tasks.slice";

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getContacts: build.query<ITaskState[], string>({
      query: () => ({
        url: "/660/tasks",
      }),
      providesTags: () => ["tasks"],
    }),
    getContactById: build.query<ITaskState, string>({
      query: (id) => ({
        url: `/660/tasks/${id}`,
      }),
    }),
    createContact: build.mutation<ITaskState, ITaskState>({
      query: (params) => ({
        url: `/660/tasks`,
        method: "POST",
        body: params,
      }),
      invalidatesTags: ["tasks"],
    }),
    updateContact: build.mutation<ITaskState, ITaskState>({
      query: (params) => ({
        url: `/660/tasks/${params.id}`,
        method: "PATCH",
        body: params,
      }),
      invalidatesTags: ["tasks"],
    }),
    deleteContact: build.mutation<ITaskState, string>({
      query: (id) => ({
        url: `/660/tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tasks"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetContactsQuery,
  useGetContactByIdQuery,
  useCreateContactMutation,
  useUpdateContactMutation,
  useDeleteContactMutation,
} = tasksApi;
