import { useMemo } from "react";
import { useFetchWarehouses } from "../../hooks/useWarehouses";
import { useFetchOutlets } from "../../hooks/useOutlets";
import { useFetchAllTransactions } from "../../hooks/useTransactions";
import { Warehouse } from "../../types/warehouse";

export type Tab = "stok-habis" | "gudang" | "outlet" | "distribusi";

export interface LowStockProduct {
  id: number;
  name: string;
  thumbnail: string;
  category?: { name: string };
  stock: number;
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
  staff: string;
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
  const { data: transactionsData, isPending: loadingTransactions } = useFetchAllTransactions();

  const warehouseList: Warehouse[] = Array.isArray(warehousesData) ? warehousesData : [];
  const outletList = Array.isArray(outletsData) ? outletsData : [];
  const transactionList = Array.isArray(transactionsData) ? transactionsData : [];

  const isLoading = loadingWarehouses || loadingOutlets || loadingTransactions;

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
          sourceName: outlet.name,
          sourceId: outlet.id,
          sourceType: "Outlet" as const,
        }))
    );

    return [...warehouseProducts, ...outletProducts];
  }, [warehouseList, outletList]);

  const productWarehouseMap = useMemo(() => {
    const map: Record<number, string> = {};
    for (const outlet of outletList) {
      for (const outletProduct of outlet.products ?? []) {
        if (outletProduct.pivot?.warehouse_id) {
          const matchedWarehouse = warehouseList.find(
            (warehouse) => warehouse.id === outletProduct.pivot!.warehouse_id
          );
          if (matchedWarehouse) {
            map[outletProduct.id] = matchedWarehouse.name;
          }
        }
      }
    }
    return map;
  }, [warehouseList, outletList]);

  const distributionRows = useMemo<DistributionRow[]>(() => {
    const rows: DistributionRow[] = [];
    for (const transaction of transactionList) {
      for (const transactionProduct of transaction.transaction_products ?? []) {
        rows.push({
          id: `${transaction.id}-${transactionProduct.id}`,
          date: transaction.created_at ?? "",
          warehouse: productWarehouseMap[transactionProduct.product_id] ?? "-",
          outlet: transaction.merchant?.name ?? "-",
          product: transactionProduct.product?.name ?? "-",
          quantity: transactionProduct.quantity,
          staff: transaction.merchant?.keeper?.name ?? "-",
        });
      }
    }
    return rows;
  }, [transactionList, productWarehouseMap]);

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

  const paginatedLowStock = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredLowStock.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredLowStock, currentPage, rowsPerPage]);

  const paginatedDistribution = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredDistribution.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredDistribution, currentPage, rowsPerPage]);

  const uniqueWarehouseNames = useMemo(
    () => [...new Set(distributionRows.map((row) => row.warehouse).filter(Boolean))],
    [distributionRows]
  );

  const uniqueOutletNames = useMemo(
    () => [...new Set(distributionRows.map((row) => row.outlet).filter(Boolean))],
    [distributionRows]
  );

  return {
    warehouseList,
    outletList,
    transactionList,
    isLoading,
    totalWarehouseStock,
    totalOutletStock,
    totalDistributed,
    allLowStockProducts,
    filteredLowStock,
    filteredDistribution,
    paginatedLowStock,
    paginatedDistribution,
    uniqueWarehouseNames,
    uniqueOutletNames,
  };
}
