import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export const useGetFoldersTree = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.get(
        `${import.meta.env.VITE_API_BASE_URL}/folders/folder-tree`,
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useCreateFolder = () => {
  return useMutation({
    mutationFn: async ({ name, parent_id }) => {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_API_BASE_URL}/folders/create-folder`,
        {
          name: name,
          parent_id: parent_id,
        },
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useRenameFolder = () => {
  return useMutation({
    mutationFn: async ({ name, folder_id }) => {
      const response = await axiosInstance.patch(
        `${import.meta.env.VITE_API_BASE_URL}/folders/rename-folder`,
        {
          new_folder_name: name,
          folder_id: folder_id,
        },
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useDeleteFolder = () => {
  return useMutation({
    mutationFn: async ({ folder_id }) => {
      const response = await axiosInstance.delete(
        `${import.meta.env.VITE_API_BASE_URL}/folders/delete-folder/${folder_id}`,
      );
      return response.data;
    },
    onError: (err) => {
      return err;
    },
  });
};
