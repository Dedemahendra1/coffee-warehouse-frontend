import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/axiosConfig";
import { AxiosError } from "axios";
import {
  Product,
  CreateProductPayload,
  ApiErrorResponse,
} from "../types/types";
import { useNavigate } from "react-router-dom";

// ===============================
// Fetch All Products
// ===============================
export const useFetchProducts = () => {
  return useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await apiClient.get("/products");
      return response.data;
    },
  });
};

// ===============================
// Fetch Single Product
// ===============================
export const useFetchProduct = (id: number) => {
  return useQuery<Product, AxiosError>({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await apiClient.get(`/products/${id}`);
      return response.data;
    },
    enabled: !!id,
  });
};

// ===============================
// Create Product
// ===============================
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    Product,
    AxiosError<ApiErrorResponse>,
    CreateProductPayload
  >({
    mutationFn: async (payload) => {
      const formData = new FormData();

      formData.append("name", payload.name);
      formData.append("thumbnail", payload.thumbnail);
      formData.append("about", payload.about);
      formData.append("unit", payload.unit);
      formData.append("price", payload.price.toString());
      formData.append("category_id", payload.category_id.toString());
      formData.append("is_popular", payload.is_popular ? "1" : "0");

      const response = await apiClient.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      navigate("/products");
    },
  });
};

// ===============================
// Update Product
// ===============================
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation<
    Product,
    AxiosError<ApiErrorResponse>,
    { id: number } & CreateProductPayload
  >({
    mutationFn: async ({ id, ...payload }) => {
      const formData = new FormData();

      formData.append("name", payload.name);
      formData.append("about", payload.about);
      formData.append("unit", payload.unit);
      formData.append("price", payload.price.toString());
      formData.append("category_id", payload.category_id.toString());
      formData.append("is_popular", payload.is_popular ? "1" : "0");
      formData.append("_method", "PUT");

      if (payload.thumbnail) {
        formData.append("thumbnail", payload.thumbnail);
      }

      const response = await apiClient.post(
        `/products/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    },

    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });

      queryClient.invalidateQueries({
        queryKey: ["product", id],
      });

      navigate("/products");
    },
  });
};

// ===============================
// Delete Product
// ===============================
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/products/${id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
};