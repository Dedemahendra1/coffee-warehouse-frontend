import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useFetchWarehouses } from "../hooks/useWarehouses";
import { useMyOutletProfile } from "../hooks/useOutlets";
import { useFetchStockOuts } from "../hooks/useStockOuts";
import UserProfileCard from "../components/UserProfileCard";

const OverviewOutlet = () => {
  const { user } = useAuth();
  const outlet = user?.outlet;
  const hasOutlet = !!outlet?.id;

  const { data: warehouses = [] } = useFetchWarehouses();
  const { data: myOutlet } = useMyOutletProfile({ enabled: hasOutlet });
  const { data: stockOuts = [] } = useFetchStockOuts();

  const warehouseList = Array.isArray(warehouses) ? warehouses : (warehouses as any).data ?? [];

  const totalWarehouses = warehouseList.length;

  const lowStockProducts =
    myOutlet?.products?.filter((p: any) => (p.pivot?.stock ?? 0) <= 5) ?? [];

  const totalOutletProducts = myOutlet?.products?.length ?? 0;
  const totalOutletStock = (myOutlet?.products ?? []).reduce(
    (sum: number, p: any) => sum + (p.pivot?.stock ?? 0),
    0
  );

  const today = new Date().toISOString().split("T")[0];
  const todayStockOuts = stockOuts.filter(
    (so) => so.created_at?.split("T")[0] === today
  );

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
              <h1 className="font-bold text-2xl">Dashboard Staff Gudang</h1>
              <p className="font-medium text-lg text-monday-gray">Senopati Coffee &mdash; Inventory & Distribution System</p>
              <p className="font-medium text-sm text-monday-gray">
                {user?.name} &mdash; {outlet?.name ?? "No Outlet Assigned"}
              </p>
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
            </div>
          </div>
          <UserProfileCard />
        </div>

        <main className="flex flex-col gap-6 flex-1">
          <section className="grid grid-cols-3 gap-6">
            <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
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
            </div>

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
                <p className="font-semibold text-[32px]">{lowStockProducts.length}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Stok Hampir Habis
                </p>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 gap-6">
            <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
              <div className="flex size-14 rounded-full bg-purple-100 items-center justify-center">
                <img
                  src="assets/images/icons/bag-blue-fill.svg"
                  className="size-6"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold text-[32px]">{totalOutletProducts}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Total Produk Outlet
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
              <div className="flex size-14 rounded-full bg-red-100 items-center justify-center">
                <img
                  src="assets/images/icons/box-black.svg"
                  className="size-6"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold text-[32px]">{todayStockOuts.length}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Stock Out Hari Ini
                </p>
              </div>
            </div>
          </section>

          {lowStockProducts.length > 0 && (
            <section className="flex flex-col gap-5 rounded-3xl p-[18px] bg-white">
              <h2 className="font-bold text-xl text-orange-600">
                Stok Hampir Habis (&#8804;5)
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {lowStockProducts.map((p: any) => (
                  <div
                    key={p.id}
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
                        {p.category?.name}
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
        </main>
      </div>
    </div>
  );
};

export default OverviewOutlet;
