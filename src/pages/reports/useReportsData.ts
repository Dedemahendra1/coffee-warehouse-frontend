import { useMemo } from "react";
import { useFetchWarehouses } from "../../hooks/useWarehouses";
import { useFetchOutlets } from "../../hooks/useOutlets";
import { useFetchStockOuts } from "../../hooks/useStockOuts";
import { Warehouse } from "../../types/warehouse";

export type Tab = "stok-habis" | "gudang" | "outlet" | "distribusi" | "stock-out";

export interface LowStockProduct {
  id: number;
  name: string;
  thumbnail: string;
  category?: { name: string };
  stock: number;
  unit?: string;
  sourceName: string;
  sourceId: number;
  sourceType: "Gudang" | "Outlet";
}

export interface DistributionRow {
  id: string;
  date: string;
  warehouse: string;
  outlet: string;
  product: string;
  quantity: number;
  unit?: string;
  staff: string;
}

export interface StockOutRow {
  id: number;
  date: string;
  outlet: string;
  product: string;
  quantity: number;
  unit?: string;
  reason: string;
}

interface UseReportsDataParams {
  searchQuery: string;
  filterDateFrom: string;
  filterDateTo: string;
  filterWarehouse: string;
  filterOutlet: string;
  currentPage: number;
  rowsPerPage?: number;
}

export function useReportsData({
  searchQuery,
  filterDateFrom,
  filterDateTo,
  filterWarehouse,
  filterOutlet,
  currentPage,
  rowsPerPage = 10,
}: UseReportsDataParams) {
  const { data: warehousesData, isPending: loadingWarehouses } = useFetchWarehouses();
  const { data: outletsData, isPending: loadingOutlets } = useFetchOutlets();
  const { data: stockOutsData, isPending: loadingStockOuts } = useFetchStockOuts();

  const warehouseList: Warehouse[] = Array.isArray(warehousesData) ? warehousesData : [];
  const outletList = Array.isArray(outletsData) ? outletsData : [];

  const isLoading = loadingWarehouses || loadingOutlets || loadingStockOuts;

  const totalWarehouseStock = warehouseList.reduce(
    (accumulator, warehouse) =>
      accumulator +
      (warehouse.products?.reduce(
        (sum, warehouseProduct) => sum + (warehouseProduct.pivot?.stock ?? 0),
        0
      ) ?? 0),
    0
  );

  const totalOutletStock = outletList.reduce(
    (accumulator, outlet) =>
      accumulator +
      (outlet.products?.reduce(
        (sum, outletProduct) => sum + (outletProduct.pivot?.stock ?? 0),
        0
      ) ?? 0),
    0
  );

  const totalDistributed = totalWarehouseStock + totalOutletStock;

  const allLowStockProducts = useMemo<LowStockProduct[]>(() => {
    const warehouseProducts = warehouseList.flatMap((warehouse) =>
      (warehouse.products ?? [])
        .filter((product) => (product.pivot?.stock ?? 0) <= 5)
        .map((product) => ({
          ...product,
          stock: product.pivot?.stock ?? 0,
          unit: product.unit ?? "",
          sourceName: warehouse.name,
          sourceId: warehouse.id,
          sourceType: "Gudang" as const,
        }))
    );

    const outletProducts = outletList.flatMap((outlet) =>
      (outlet.products ?? [])
        .filter((product) => (product.pivot?.stock ?? 0) <= 5)
        .map((product) => ({
          ...product,
          stock: product.pivot?.stock ?? 0,
          unit: product.unit ?? "",
          sourceName: outlet.name,
          sourceId: outlet.id,
          sourceType: "Outlet" as const,
        }))
    );

    return [...warehouseProducts, ...outletProducts];
  }, [warehouseList, outletList]);

  const distributionRows = useMemo(() => {
    return [] as DistributionRow[];
  }, []);

  const stockOutRows = useMemo<StockOutRow[]>(() => {
    return (stockOutsData ?? []).map((so) => ({
      id: so.id,
      date: so.created_at ?? "",
      outlet: so.merchant?.name ?? "-",
      product: so.product?.name ?? "-",
      quantity: so.quantity,
      unit: so.product?.unit ?? "",
      reason: so.reason ?? "-",
    }));
  }, [stockOutsData]);

  const filteredLowStock = useMemo(() => {
    let result = allLowStockProducts;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (lowStockItem) =>
          lowStockItem.name.toLowerCase().includes(query) ||
          lowStockItem.sourceName.toLowerCase().includes(query)
      );
    }
    return result;
  }, [allLowStockProducts, searchQuery]);

  const filteredDistribution = useMemo(() => {
    let result = distributionRows;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (distributionRow) =>
          distributionRow.product.toLowerCase().includes(query) ||
          distributionRow.outlet.toLowerCase().includes(query) ||
          distributionRow.warehouse.toLowerCase().includes(query) ||
          distributionRow.staff.toLowerCase().includes(query)
      );
    }
    if (filterDateFrom) {
      result = result.filter((distributionRow) => distributionRow.date >= filterDateFrom);
    }
    if (filterDateTo) {
      result = result.filter(
        (distributionRow) => distributionRow.date <= filterDateTo + "T23:59:59"
      );
    }
    if (filterWarehouse) {
      result = result.filter(
        (distributionRow) => distributionRow.warehouse === filterWarehouse
      );
    }
    if (filterOutlet) {
      result = result.filter(
        (distributionRow) => distributionRow.outlet === filterOutlet
      );
    }
    return result;
  }, [distributionRows, searchQuery, filterDateFrom, filterDateTo, filterWarehouse, filterOutlet]);

  const filteredStockOut = useMemo(() => {
    let result = stockOutRows;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (row) =>
          row.product.toLowerCase().includes(query) ||
          row.outlet.toLowerCase().includes(query)
      );
    }
    if (filterDateFrom) {
      result = result.filter((row) => row.date >= filterDateFrom);
    }
    if (filterDateTo) {
      result = result.filter((row) => row.date <= filterDateTo + "T23:59:59");
    }
    if (filterOutlet) {
      result = result.filter((row) => row.outlet === filterOutlet);
    }
    return result;
  }, [stockOutRows, searchQuery, filterDateFrom, filterDateTo, filterOutlet]);

  const paginatedLowStock = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLowStock.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLowStock, currentPage, rowsPerPage]);

  const paginatedDistribution = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDistribution.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDistribution, currentPage, rowsPerPage]);

  const paginatedStockOut = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredStockOut.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredStockOut, currentPage, rowsPerPage]);

  const uniqueWarehouseNames = useMemo(
    () => [...new Set(distributionRows.map((row) => row.warehouse).filter(Boolean))],
    [distributionRows]
  );

  const uniqueOutletNames = useMemo(
    () => [...new Set(stockOutRows.map((row) => row.outlet).filter(Boolean))],
    [stockOutRows]
  );

  return {
    warehouseList,
    outletList,
    isLoading,
    totalWarehouseStock,
    totalOutletStock,
    totalDistributed,
    allLowStockProducts,
    filteredLowStock,
    filteredDistribution,
    filteredStockOut,
    paginatedLowStock,
    paginatedDistribution,
    paginatedStockOut,
    uniqueWarehouseNames,
    uniqueOutletNames,
  };
}
