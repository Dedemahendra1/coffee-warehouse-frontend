import { useFetchWarehouses } from "../hooks/useWarehouses";
import { useFetchOutlets } from "../hooks/useOutlets";
import { useFetchProducts } from "../hooks/useProducts";
import Sidebar from "../components/Sidebar";
import UserProfileCard from "../components/UserProfileCard";
import { Link } from "react-router-dom";

const Overview = () => {
  const { data: warehousesData, isPending: loadingWarehouses } = useFetchWarehouses();
  const { data: outletsData, isPending: loadingOutlets } = useFetchOutlets();
  const { isPending: loadingProducts } = useFetchProducts();

  const warehouseList = Array.isArray(warehousesData) ? warehousesData : [];
  const outletList = Array.isArray(outletsData) ? outletsData : [];

  const totalWarehouses = warehouseList.length;
  const totalOutlets = outletList.length;

  const totalWarehouseStock = warehouseList.reduce(
    (acc, w) => acc + (w.products?.length ?? 0), 0
  );

  const totalOutletStock = outletList.reduce(
    (acc, o) => acc + (o.products?.reduce((sum, p) => sum + (p.pivot?.stock ?? 0), 0) ?? 0),
    0
  );

  const lowStockWarehouseProducts =
    warehouseList.flatMap((w) =>
      (w.products ?? [])
        .filter((p) => (p.pivot?.stock ?? 0) <= 5)
        .map((p) => ({ ...p, warehouseName: w.name, warehouseId: w.id }))
    );

  const lowStockOutletProducts =
    outletList.flatMap((o) =>
      (o.products ?? [])
        .filter((p) => (p.pivot?.stock ?? 0) <= 5)
        .map((p) => ({ ...p, outletName: o.name, outletId: o.id }))
    );

  const totalLowStock = lowStockWarehouseProducts.length + lowStockOutletProducts.length;

  const isLoading = loadingWarehouses || loadingOutlets || loadingProducts;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
        <div
          id="Top-Bar"
          className="flex items-center w-full gap-6 mt-[30px] mb-6"
        >
          <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
            <div className="flex flex-col gap-[6px] w-full">
              <h1 className="font-bold text-2xl">Dashboard Manager</h1>
              <p className="font-medium text-lg text-monday-gray">Senopati Coffee &mdash; Inventory & Distribution System</p>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src="assets/images/icons/search-normal-black.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
              </a>
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img
                    src="assets/images/icons/notification-black.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
              </a>
              <div className="relative w-fit">
                <div className="flex size-14 rounded-full bg-monday-lime-green items-center justify-center overflow-hidden">
                  <img
                    src="assets/images/icons/crown-black-fill.svg"
                    className="size-6"
                    alt="icon"
                  />
                </div>
                <p className="absolute transform -translate-x-1/2 left-1/2 -bottom-2 rounded-[20px] py-1 px-2 bg-monday-black text-white w-fit font-extrabold text-[8px]">
                  PRO
                </p>
              </div>
            </div>
          </div>
          <UserProfileCard />
        </div>

        <main className="flex flex-col gap-6 flex-1">
          {isLoading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <section className="grid grid-cols-3 gap-6">
                <Link
                  to="/warehouses"
                  className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex size-14 rounded-full bg-monday-blue/10 items-center justify-center">
                    <img
                      src="assets/images/icons/buildings-2-blue-fill.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-semibold text-[32px]">{totalWarehouses}</p>
                    <p className="font-medium text-lg text-monday-gray">
                      Total Gudang
                    </p>
                  </div>
                </Link>

                <Link
                  to="/outlets"
                  className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white hover:shadow-md transition-shadow"
                >
                  <div className="flex size-14 rounded-full bg-green-100 items-center justify-center">
                    <img
                      src="assets/images/icons/receive-square-blue-fill.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-semibold text-[32px]">{totalOutlets}</p>
                    <p className="font-medium text-lg text-monday-gray">
                      Total Outlet
                    </p>
                  </div>
                </Link>

                <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
                  <div className="flex size-14 rounded-full bg-purple-100 items-center justify-center">
                    <img
                      src="assets/images/icons/bag-blue-fill.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-semibold text-[32px]">{totalWarehouseStock}</p>
                    <p className="font-medium text-lg text-monday-gray">
                      Total Stok Gudang
                    </p>
                  </div>
                </div>
              </section>

              <section className="grid grid-cols-2 gap-6">
                <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
                  <div className="flex size-14 rounded-full bg-green-100 items-center justify-center">
                    <img
                      src="assets/images/icons/shop-blue-fill.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-semibold text-[32px]">{totalOutletStock}</p>
                    <p className="font-medium text-lg text-monday-gray">
                      Total Stok Outlet
                    </p>
                  </div>
                </div>

                <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
                  <div className="flex size-14 rounded-full bg-orange-100 items-center justify-center">
                    <img
                      src="assets/images/icons/note-2-blue-fill.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                  <div className="flex flex-col gap-[6px]">
                    <p className="font-semibold text-[32px]">{totalLowStock}</p>
                    <p className="font-medium text-lg text-monday-gray">
                      Stok Hampir Habis
                    </p>
                    <p className="font-medium text-sm text-monday-gray">
                      Gudang: {lowStockWarehouseProducts.length} &middot; Outlet: {lowStockOutletProducts.length}
                    </p>
                  </div>
                </div>
              </section>

              {lowStockWarehouseProducts.length > 0 && (
                <section className="flex flex-col gap-5 rounded-3xl p-[18px] bg-white">
                  <h2 className="font-bold text-xl text-orange-600">
                    Stok Gudang Hampir Habis (&#8804;5)
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {lowStockWarehouseProducts.map((p) => (
                      <div
                        key={`${p.warehouseId}-${p.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-orange-200 bg-orange-50"
                      >
                        <div className="flex size-[60px] rounded-xl bg-monday-background items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={p.thumbnail}
                            className="size-full object-contain"
                            alt="icon"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <p className="font-semibold text-lg truncate">{p.name}</p>
                          <p className="font-medium text-sm text-monday-gray">
                            {p.warehouseName} &middot; {p.category?.name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <p className="font-bold text-xl text-orange-600">
                            {p.pivot?.stock ?? 0} {p.unit}
                          </p>
                          <p className="font-medium text-xs text-monday-gray">
                            stok tersisa
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {lowStockOutletProducts.length > 0 && (
                <section className="flex flex-col gap-5 rounded-3xl p-[18px] bg-white">
                  <h2 className="font-bold text-xl text-orange-600">
                    Stok Outlet Hampir Habis (&#8804;5)
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {lowStockOutletProducts.map((p) => (
                      <div
                        key={`${p.outletId}-${p.id}`}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-orange-200 bg-orange-50"
                      >
                        <div className="flex size-[60px] rounded-xl bg-monday-background items-center justify-center overflow-hidden shrink-0">
                          <img
                            src={p.thumbnail}
                            className="size-full object-contain"
                            alt="icon"
                          />
                        </div>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <p className="font-semibold text-lg truncate">{p.name}</p>
                          <p className="font-medium text-sm text-monday-gray">
                            {p.outletName} &middot; {p.category?.name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <p className="font-bold text-xl text-orange-600">
                            {p.pivot?.stock ?? 0} {p.unit}
                          </p>
                          <p className="font-medium text-xs text-monday-gray">
                            stok tersisa
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Overview;
