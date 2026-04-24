import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

const fetchNotes = async ({ folderId, page, limit, title, tags ,sortBy, sortOrder }) => {
  const params = new URLSearchParams();

  params.append("page", page);
  params.append("limit", limit);
  params.append("sortBy", sortBy);
  params.append("sortOrder", sortOrder);

  if (title?.trim()) {
    params.append("title", title);
  }

  if (tags?.length) {
    tags.forEach((tag) => params.append("tags", tag)); 
  }

  const res = await axiosInstance.get(`/notes/get-notes/${folderId}`, {
    params,
  });

  return res.data;
};

export const useGetNotes = ({ folderId, page, limit = 10, title, tags ,sortOrder, sortBy}) => {
  return useQuery({
    queryKey: ["notes", folderId, page, title, tags, sortBy, sortOrder],
    queryFn: () =>
      fetchNotes({
        folderId,
        page,
        limit,
        title,
        tags,
        sortBy,
        sortOrder
      }),
    enabled: !!folderId,
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
};

export const useCreateNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.post(`/notes/create-note`, payload);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["notes", variables.folder_id],
      });
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useEditNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const response = await axiosInstance.patch(`/notes/edit-note`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
    onError: (err) => {
      return err;
    },
  });
};

export const useDeleteNote = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (noteId) => {
      const response = await axiosInstance.delete(
        `/notes/delete-note/${noteId}`,
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notes"],
      });
    },
    onError: (err) => {
      return err;
    },
  });
};
