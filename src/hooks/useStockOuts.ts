import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import {
  ApiErrorResponse,
  CreateStockOutPayload,
  StockOut,
} from "../types/types";
import { useNavigate } from "react-router-dom";

export const useFetchStockOuts = () => {
  return useQuery<StockOut[], AxiosError>({
    queryKey: ["stock-outs"],
    queryFn: async () => {
      const response = await apiClient.get("/stock-outs");
      return response.data.data ?? response.data;
    },
  });
};

export const useCreateStockOut = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    StockOut,
    AxiosError<ApiErrorResponse>,
    CreateStockOutPayload
  >({
    mutationFn: async (payload) => {
      const response = await apiClient.post("/stock-outs", payload);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-outs"] });
      queryClient.invalidateQueries({ queryKey: ["my-merchant"] });
      queryClient.invalidateQueries({ queryKey: ["merchant"] });
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      navigate("/stock-outs");
    },
    onError: (error) => {
      const data = error.response?.data;
      const fieldMessage = data?.errors
        ? Object.values(data.errors)[0]?.[0]
        : undefined;
      const message =
        fieldMessage || data?.message || "Error saving stock out!";
      alert(message);
    },
  });
};
