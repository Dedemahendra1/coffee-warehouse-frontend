import Sidebar from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { useFetchOutletTransactions } from "../hooks/useTransactions";
import { Transaction } from "../types/types";
import { useFetchWarehouses } from "../hooks/useWarehouses";
import { useMyOutletProfile } from "../hooks/useOutlets";
import UserProfileCard from "../components/UserProfileCard";

const OverviewOutlet = () => {
  const { user } = useAuth();
  const outlet = user?.outlet;
  const hasOutlet = !!outlet?.id;

  const { data: warehouses = [] } = useFetchWarehouses();
  const { data: myOutlet } = useMyOutletProfile({ enabled: hasOutlet });
  const { data: transactionsResponse = [] } = useFetchOutletTransactions({
    enabled: hasOutlet,
  });

  const transactions: Transaction[] = transactionsResponse ?? [];
  const warehouseList = Array.isArray(warehouses) ? warehouses : (warehouses as any).data ?? [];

  const totalWarehouses = warehouseList.length;

  const totalWarehouseProducts = warehouseList.reduce(
    (acc: number, w: any) => acc + (w.products?.length ?? 0),
    0
  );

  const lowStockProducts =
    myOutlet?.products?.filter((p: any) => (p.pivot?.stock ?? 0) <= 5) ?? [];

  const today = new Date().toISOString().split("T")[0];
  const todayTransactions = transactions.filter(
    (tx) => tx.created_at?.split("T")[0] === today
  );
  const todayDistribusi = todayTransactions.length;
  const todayTotalValue = todayTransactions.reduce(
    (sum, tx) => sum + tx.grand_total,
    0
  );

  const latestDistribusi = transactions.slice(0, 5);

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
              <div className="flex size-14 rounded-full bg-monday-blue/10 items-center justify-center">
                <img
                  src="assets/images/icons/bag-blue-fill.svg"
                  className="size-6"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold text-[32px]">{totalWarehouseProducts}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Total Produk Gudang
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
              <div className="flex size-14 rounded-full bg-green-100 items-center justify-center">
                <img
                  src="assets/images/icons/receive-square-blue-fill.svg"
                  className="size-6"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold text-[32px]">{todayDistribusi}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Distribusi Hari Ini
                </p>
                <p className="font-medium text-sm text-monday-gray">
                  Rp {todayTotalValue.toLocaleString("id")}
                </p>
              </div>
            </div>

            <div className="flex flex-col rounded-3xl p-[18px] gap-5 bg-white">
              <div className="flex size-14 rounded-full bg-purple-100 items-center justify-center">
                <img
                  src="assets/images/icons/shopping-cart-grey.svg"
                  className="size-6"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <p className="font-semibold text-[32px]">{transactions.length}</p>
                <p className="font-medium text-lg text-monday-gray">
                  Total Riwayat Distribusi
                </p>
                <p className="font-medium text-sm text-monday-gray">
                  Rp {transactions.reduce((s, tx) => s + tx.grand_total, 0).toLocaleString("id")}
                </p>
              </div>
            </div>
          </section>

          {lowStockProducts.length > 0 && (
            <section className="flex flex-col gap-5 rounded-3xl p-[18px] bg-white">
              <h2 className="font-bold text-xl text-orange-600">
                Stok Hampir Habis ({"<="}5)
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

          <section className="flex flex-col gap-5 flex-1 rounded-3xl p-[18px] bg-white">
            <h2 className="font-bold text-xl">Riwayat Distribusi Terbaru</h2>

            {latestDistribusi.length > 0 ? (
              latestDistribusi.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 rounded-2xl border border-monday-border"
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex size-12 rounded-xl bg-monday-background items-center justify-center overflow-hidden shrink-0">
                      <img
                        src="assets/images/icons/user-thin-grey.svg"
                        className="size-6"
                        alt="icon"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1 min-w-0">
                      <p className="font-semibold text-lg truncate">{tx.name}</p>
                      <p className="font-medium text-sm text-monday-gray">
                        {tx.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-end gap-1">
                      <p className="font-semibold text-lg text-monday-blue">
                        Rp {tx.grand_total.toLocaleString("id")}
                      </p>
                      <p className="font-medium text-xs text-monday-gray">
                        {tx.transaction_products.length} produk &middot;{" "}
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6">
                <img
                  src="assets/images/icons/document-text-grey.svg"
                  className="size-[52px]"
                  alt="icon"
                />
                <p className="font-semibold text-monday-gray">
                  Belum ada riwayat distribusi.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default OverviewOutlet;
