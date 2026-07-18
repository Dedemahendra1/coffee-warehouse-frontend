import { useMutation, useQuery, useQueryClient, UseQueryOptions } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import { ApiErrorResponse, CreateOutletPayload, Outlet } from "../types/types";
import { useNavigate } from "react-router-dom";

// Fetch All Outlets
export const useFetchOutlets = () => {
  return useQuery<Outlet[], AxiosError>({
    queryKey: ["merchants"],
    queryFn: async () => {
      const response = await apiClient.get("/merchants");
      return response.data;
    },
  });
}; 

export const useFetchOutlet = (
  id: number,
  options?: Partial<UseQueryOptions<Outlet, AxiosError>>
) => {
  return useQuery<Outlet, AxiosError>({
    queryKey: ["merchant", id],
    queryFn: async () => {
      const response = await apiClient.get(`/merchants/${id}`);
      return response.data;
    },
    enabled: !!id, // ✅ default guard
    ...options,     // ✅ allow override
  });
};

export const useCreateOutlet = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<Outlet, AxiosError<ApiErrorResponse>, CreateOutletPayload>({
    mutationFn: async (payload) => {

      const formData = new FormData();

      formData.append("name", payload.name);
      formData.append("address", payload.address);
      formData.append("keeper_id", payload.keeper_id.toString());
      formData.append("phone", payload.phone);
      formData.append("photo", payload.photo); // ✅ Required now

      const response = await apiClient.post("/merchants", formData, {
        headers: { "Content-Type": "multipart/form-data" },

      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      navigate("/outlets");
    }
  });
};   

export const useUpdateOutlet = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    Outlet, // response type
    AxiosError<ApiErrorResponse>, // error type
    { id: number } & CreateOutletPayload // payload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const formData = new FormData();
      
      formData.append("name", payload.name);
      formData.append("address", payload.address);
      formData.append("phone", payload.phone);
      formData.append("keeper_id", payload.keeper_id.toString());
      formData.append("_method", "PUT");

      if (payload.photo) {
        formData.append("photo", payload.photo);  
      }

      const response = await apiClient.post(`/merchants/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
      queryClient.invalidateQueries({ queryKey: ["merchant", id] });
      navigate("/outlets");
    },
  });
}; 

// Delete Outlet
export const useDeleteOutlet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/merchants/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });
};

export const useMyOutletProfile = (
  options?: Partial<UseQueryOptions<Outlet, AxiosError>>
) => {
  return useQuery<Outlet, AxiosError>({
    queryKey: ["my-merchant"],
    queryFn: async () => {
      const response = await apiClient.get("/my-merchant");
      return response.data;
    },
    retry: false, 
    ...options,
  });
}; 
