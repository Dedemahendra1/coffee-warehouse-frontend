
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import { ApiErrorResponse, DistribusiStokPayload } from "../types/types"; 
import { useNavigate } from "react-router-dom";

export const useDistribusiStok = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    DistribusiStokPayload,
    AxiosError<ApiErrorResponse>,
    DistribusiStokPayload
  >({
    mutationFn: async ({ outlet_id, ...payload }) => {
      const response = await apiClient.post(
        `/merchants/${outlet_id}/products`,
        payload
      );
      return response.data;
    },
    onSuccess: (_, { outlet_id, product_id }) => {
      queryClient.invalidateQueries({ queryKey: ["merchant-product", outlet_id, product_id] });
      queryClient.invalidateQueries({ queryKey: ["merchant", outlet_id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["warehouses"] });
      navigate(`/outlet-products/${outlet_id}`);
    },
  });
};

export const useUpdateOutletProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    void, // No return data needed
    AxiosError<ApiErrorResponse>,
    DistribusiStokPayload
  >({
    mutationFn: async ({ outlet_id, product_id, warehouse_id, stock }) => {
      const formData = new FormData();
      formData.append("stock", stock.toString());
      formData.append("outlet_id", outlet_id.toString());
      formData.append("product_id", product_id.toString());
      formData.append("warehouse_id", warehouse_id.toString()); // ✅ This is the missing line
      formData.append("_method", "PUT");

      await apiClient.post(
        `/merchants/${outlet_id}/products/${product_id}`,
        formData
      );
    },
    onSuccess: (_, { outlet_id, product_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["merchant-product", outlet_id, product_id],
      });
      queryClient.invalidateQueries({ queryKey: ["merchant", outlet_id] });

      navigate(`/outlet-products/${outlet_id}`);

    },
  });
};


 
