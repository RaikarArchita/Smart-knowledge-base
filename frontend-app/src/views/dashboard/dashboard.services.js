import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

export const useGetDashboardDetails = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const res = await axiosInstance.get(`/dashboard`);
      return res.data;
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
};
