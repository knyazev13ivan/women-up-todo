import { baseApi } from "../base.api";
import { db } from "../../firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export interface ITask {
  title: string;
  description: string;
  date: string;
  attachment: string;
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTasks: build.query({
      queryFn: async () => {
        try {
          const tasksRef = collection(db, "tasks");
          const querySnaphot = await getDocs(tasksRef);

          let tasks: any = [];
          querySnaphot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          return { data: tasks };
        } catch (error) {
          return { error };
        }
      },
      providesTags: () => ["tasks"],
    }),
    getTaskById: build.query({
      queryFn: async (id) => {
        try {
          const taskRef = doc(db, "tasks", id);
          const snapshot = await getDoc(taskRef);
          return { data: snapshot.data() };
        } catch (error) {
          return { error };
        }
      },
    }),
    createTask: build.mutation({
      queryFn: async (fields: any) => {
        try {
          const tasksRef = collection(db, "tasks");
          await addDoc(tasksRef, {
            title: fields.title,
            description: fields.description,
            date: fields.date,
            attachment: fields.attachment,
            isCompleted: fields.isCompleted,
          });

          const querySnaphot = await getDocs(tasksRef);

          let tasks: any = [];
          querySnaphot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          return { data: tasks };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["tasks"],
    }),
    updateTask: build.mutation({
      queryFn: async (fields: any) => {
        try {
          const taskDoc = doc(db, "tasks", fields.id);
          const newFields = { ...fields };
          await updateDoc(taskDoc, newFields);

          const tasksRef = collection(db, "tasks");
          const querySnaphot = await getDocs(tasksRef);

          let tasks: any = [];
          querySnaphot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          return { data: tasks };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["tasks"],
    }),
    deleteTask: build.mutation({
      queryFn: async (id) => {
        try {
          const taskDoc = doc(db, "tasks", id);
          await deleteDoc(taskDoc);

          const tasksRef = collection(db, "tasks");
          const querySnaphot = await getDocs(tasksRef);

          let tasks: any = [];
          querySnaphot?.forEach((doc) => {
            tasks.push({ id: doc.id, ...doc.data() });
          });
          return { data: tasks };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ["tasks"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;
