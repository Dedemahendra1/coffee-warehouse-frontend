import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import UserProfileCard from "../../components/UserProfileCard";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useMyOutletProfile } from "../../hooks/useOutlets";
import { useFetchStockOuts, useCreateStockOut } from "../../hooks/useStockOuts";

const StockOutList = () => {
  const { user } = useAuth();
  const isKeeper = user?.roles?.includes("keeper");

  const { data: outlet } = useMyOutletProfile({ enabled: !!isKeeper });
  const { data: stockOuts = [] } = useFetchStockOuts();

  const createStockOut = useCreateStockOut();

  const [showModal, setShowModal] = useState(false);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outlet || !productId || !quantity) return;

    createStockOut.mutate(
      {
        merchant_id: outlet.id,
        product_id: Number(productId),
        quantity: Number(quantity),
        reason: reason || undefined,
      },
      {
        onSuccess: () => {
          setShowModal(false);
          setProductId("");
          setQuantity("");
          setReason("");
        },
      }
    );
  };

  return (
    <>
      <div id="main-container" className="flex flex-1">
        <Sidebar />
        <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
          <div
            id="Top-Bar"
            className="flex items-center w-full gap-6 mt-[30px] mb-6"
          >
            <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
              <div className="flex flex-col gap-[6px] w-full">
                <h1 className="font-bold text-2xl">Stock Out</h1>
                <Link
                  to={isKeeper ? "/overview-outlet" : "/overview"}
                  className="flex items-center gap-[6px] text-monday-gray font-semibold"
                >
                  <img
                    src="/assets/images/icons/arrow-left-grey.svg"
                    className="size-4 flex shrink-0"
                    alt="icon"
                  />
                  Dashboard
                </Link>
              </div>
              <div className="flex items-center flex-nowrap gap-3">
                <a href="#">
                  <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                    <img
                      src="/assets/images/icons/search-normal-black.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                </a>
                <a href="#">
                  <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                    <img
                      src="/assets/images/icons/notification-black.svg"
                      className="size-6"
                      alt="icon"
                    />
                  </div>
                </a>
                <div className="relative w-fit">
                  <div className="flex size-14 rounded-full bg-monday-lime-green items-center justify-center overflow-hidden">
                    <img
                      src="/assets/images/icons/crown-black-fill.svg"
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
            <section
              id="Warehouse-Info"
              className="flex items-center justify-between rounded-3xl p-[18px] gap-3 bg-white"
            >
              <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                <img
                  src={isKeeper ? outlet?.photo : "/assets/images/icons/box-grey.svg"}
                  className="size-full object-contain"
                  alt="icon"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <p className="font-semibold text-xl">
                  {isKeeper ? outlet?.name : "Senopati Coffee"}
                </p>
                <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                  <img
                    src="/assets/images/icons/box-grey.svg"
                    className="size-6 flex shrink-0"
                    alt="icon"
                  />
                  <span>
                    {isKeeper
                      ? "Barang keluar / hilang dari stok outlet Anda"
                      : "Monitoring barang keluar seluruh outlet"}
                  </span>
                </p>
              </div>
              {isKeeper && (
                <button
                  onClick={() => setShowModal(true)}
                  className="btn btn-primary font-semibold"
                >
                  Tambah Stock Out
                  <img
                    src="/assets/images/icons/add-square-white.svg"
                    className="flex sixe-6 shrink-0"
                    alt="icon"
                  />
                </button>
              )}
            </section>
            <section
              id="Products"
              className="flex flex-col gap-6 flex-1 rounded-3xl p-[18px] px-0 bg-white"
            >
              <div
                id="Header"
                className="flex items-center justify-between px-[18px]"
              >
                <div className="flex flex-col gap-[6px]">
                  <p className="flex items-center gap-[6px]">
                    <img
                      src="/assets/images/icons/box-black.svg"
                      className="size-6 flex shrink-0"
                      alt="icon"
                    />
                    <span className="font-semibold text-2xl">
                      {stockOuts.length} Total Stock Out
                    </span>
                  </p>
                  <p className="font-semibold text-lg text-monday-gray">
                    View and manage your stock out list here.
                  </p>
                </div>
              </div>
              <hr className="border-monday-border" />
              <div
                id="Product-List"
                className="flex flex-col px-4 gap-5 flex-1"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-xl">All Stock Out</p>
                </div>
                {stockOuts.length > 0 ? (
                  <div className="flex flex-col gap-5">
                    {stockOuts.map((so) => (
                      <React.Fragment key={so.id}>
                        <div className="card flex items-center justify-between gap-6">
                          <div className="flex items-center gap-3 w-[280px] shrink-0">
                            <div className="flex size-[86px] rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                              <img
                                src={so.product?.thumbnail}
                                className="size-full object-contain"
                                alt="icon"
                              />
                            </div>
                            <div className="flex flex-col gap-2 flex-1">
                              <p className="font-semibold text-xl w-[162px] truncate">
                                {so.product?.name}
                              </p>
                              <p className="font-semibold text-lg text-monday-gray">
                                {so.product?.unit}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-[6px] w-[120px] shrink-0">
                            <img
                              src="/assets/images/icons/box-black.svg"
                              className="size-6 flex shrink-0"
                              alt="icon"
                            />
                            <p className="font-semibold text-lg text-nowrap">
                              {so.quantity} {so.product?.unit}
                            </p>
                          </div>
                          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
                            <p className="font-semibold text-lg">
                              {so.reason || "-"}
                            </p>
                            <p className="font-medium text-base text-monday-gray">
                              {new Date(so.created_at).toLocaleDateString("id-ID")}
                            </p>
                          </div>
                          {!isKeeper && (
                            <div className="flex items-center gap-[6px] w-[220px] shrink-0">
                              <img
                                src="/assets/images/icons/shop-black.svg"
                                className="size-6 flex shrink-0"
                                alt="icon"
                              />
                              <p className="font-semibold text-lg text-nowrap w-[180px] truncate">
                                {so.merchant?.name}
                              </p>
                            </div>
                          )}
                        </div>
                        <hr className="border-monday-border last:hidden" />
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div
                    id="Empty-State"
                    className="flex flex-col flex-1 items-center justify-center rounded-[20px] border-dashed border-2 border-monday-gray gap-6"
                  >
                    <img
                      src="/assets/images/icons/document-text-grey.svg"
                      className="size-[52px]"
                      alt="icon"
                    />
                    <p className="font-semibold text-monday-gray">
                      Oops, it looks like there's no data yet.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>

      {isKeeper && showModal && outlet && (
        <div className="modal flex flex-1 items-center justify-center h-full fixed top-0 w-full">
          <div
            onClick={() => setShowModal(false)}
            className="absolute w-full h-full bg-[#292D32B2] cursor-pointer"
          />
          <div className="relative flex flex-col w-[406px] shrink-0 rounded-3xl p-[18px] gap-5 bg-white">
            <div className="modal-header flex items-center justify-between">
              <p className="font-semibold text-xl">Tambah Stock Out</p>
              <button
                onClick={() => setShowModal(false)}
                className="flex size-14 rounded-full items-center justify-center bg-monday-gray-background"
              >
                <img
                  src="/assets/images/icons/close-circle-black.svg"
                  className="size-6"
                  alt="icon"
                />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-monday-gray">
                  Produk
                </label>
                <select
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  className="h-[52px] rounded-2xl border border-monday-border px-4"
                  required
                >
                  <option value="">Pilih Produk</option>
                  {outlet.products?.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stok: {p.pivot?.stock ?? 0} {p.unit})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-monday-gray">
                  Kuantitas
                </label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Masukkan jumlah barang keluar"
                  className="h-[52px] rounded-2xl border border-monday-border px-4"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-sm text-monday-gray">
                  Alasan (opsional)
                </label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="cth: Barang rusak, stok kadaluarsa"
                  className="h-[52px] rounded-2xl border border-monday-border px-4"
                />
              </div>
              <button
                type="submit"
                disabled={createStockOut.isPending}
                className="btn btn-primary font-semibold justify-center"
              >
                {createStockOut.isPending ? "Menyimpan..." : "Simpan Stock Out"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default StockOutList;
