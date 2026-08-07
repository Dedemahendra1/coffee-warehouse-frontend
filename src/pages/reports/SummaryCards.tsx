interface SummaryCardsProps {
  totalWarehouseStock: number;
  totalOutletStock: number;
  totalDistributed: number;
  lowStockProductCount: number;
  warehouseCount: number;
  outletCount: number;
}

export default function SummaryCards({
  totalWarehouseStock,
  totalOutletStock,
  totalDistributed,
  lowStockProductCount,
  warehouseCount,
  outletCount,
}: SummaryCardsProps) {
  return (
    <section className="grid grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="flex flex-col rounded-3xl p-5 gap-4 bg-white">
        <div className="flex size-12 rounded-full bg-monday-blue/10 items-center justify-center shrink-0">
          <img src="/assets/images/icons/buildings-2-blue-fill.svg" className="size-5" alt="icon" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl xl:text-[32px]">{totalWarehouseStock}</p>
          <p className="font-medium text-monday-gray">Total Stok Gudang</p>
          <p className="font-medium text-xs text-monday-gray">{warehouseCount} gudang aktif</p>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl p-5 gap-4 bg-white">
        <div className="flex size-12 rounded-full bg-green-100 items-center justify-center shrink-0">
          <img src="/assets/images/icons/shop-blue-fill.svg" className="size-5" alt="icon" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl xl:text-[32px]">{totalOutletStock}</p>
          <p className="font-medium text-monday-gray">Total Stok Outlet</p>
          <p className="font-medium text-xs text-monday-gray">{outletCount} outlet aktif</p>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl p-5 gap-4 bg-white">
        <div className="flex size-12 rounded-full bg-purple-100 items-center justify-center shrink-0">
          <img src="/assets/images/icons/document-text-blue-fill.svg" className="size-5" alt="icon" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl xl:text-[32px]">{totalDistributed}</p>
          <p className="font-medium text-monday-gray">Total Terdistribusi</p>
          <p className="font-medium text-xs text-monday-gray">Gudang + Outlet</p>
        </div>
      </div>

      <div className="flex flex-col rounded-3xl p-5 gap-4 bg-white">
        <div className="flex size-12 rounded-full bg-orange-100 items-center justify-center shrink-0">
          <img src="/assets/images/icons/note-2-blue-fill.svg" className="size-5" alt="icon" />
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-2xl xl:text-[32px]">{lowStockProductCount}</p>
          <p className="font-medium text-monday-gray">Produk Hampir Habis</p>
          <p className="font-medium text-xs text-monday-gray">Stok &#8804; 5</p>
        </div>
      </div>
    </section>
  );
}
