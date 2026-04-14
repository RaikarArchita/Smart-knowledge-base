import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export const useGetNotes = () => {
  return useMutation({
    mutationFn: async (folderId) => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/notes/get-notes/${folderId}`,
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useCreateNote = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL}/notes/create-note`,payload
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useEditNote = () => {
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_API_BASE_URL}/notes/edit-note`,payload
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useDeleteNote = () => {
  return useMutation({
    mutationFn: async (noteId) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_BASE_URL}/notes/delete-note/${noteId}`
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};
