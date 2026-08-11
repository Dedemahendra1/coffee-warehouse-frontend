import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useFetchWarehouse } from "../../hooks/useWarehouses";
import { useFetchProduct } from "../../hooks/useProducts";
import { useUpdateWarehouseProduct } from "../../hooks/useWarehouseProducts";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editDistribusiStokWarehouse, EditDistribusiStokWarehouseFormData } from "../../schemas/editDistribusiStokWarehouse";
import Sidebar from "../../components/Sidebar";
import UserProfileCard from "../../components/UserProfileCard";
import { useAuth } from "../../hooks/useAuth";
import { useMyOutletProfile } from "../../hooks/useOutlets";
import { useUpdateOutletProduct, useDistribusiStok } from "../../hooks/useOutletProducts";

const EditWarehouseProduct = () => {
  const { warehouseId, productId } = useParams<{ warehouseId: string; productId: string }>();
  const { user } = useAuth();
  const isKeeper = user?.roles?.includes("keeper");

  const { data: warehouse, isLoading: loadingWarehouse } = useFetchWarehouse(Number(warehouseId));
  const { data: product, isLoading: loadingProduct } = useFetchProduct(Number(productId));
  const { mutate: updateWarehouseStock } = useUpdateWarehouseProduct();
  const { mutate: updateOutletStock } = useUpdateOutletProduct();
  const { mutate: createOutletStock } = useDistribusiStok();

  const { data: myOutlet } = useMyOutletProfile({ enabled: !!isKeeper });

  const warehouseProduct = warehouse?.products?.find((p) => p.id === Number(productId));

  const outletProduct = isKeeper && myOutlet
    ? myOutlet.products?.find((p) => p.id === Number(productId))
    : undefined;

  const productExistsInOutlet = !!outletProduct;

  const initialStock = isKeeper
    ? (outletProduct?.pivot?.stock ?? 0)
    : (warehouseProduct?.pivot?.stock ?? product?.warehouse_stock ?? 0);

  const warehouseStock = warehouseProduct?.pivot?.stock ?? 0;

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<EditDistribusiStokWarehouseFormData>({
    resolver: zodResolver(editDistribusiStokWarehouse),
    defaultValues: { stock: initialStock },
  });

  useEffect(() => {
    setValue("stock", initialStock);
  }, [initialStock, setValue]);

  const onSubmit = (data: EditDistribusiStokWarehouseFormData) => {
    if (!warehouseId || !productId) return;

    if (isKeeper && myOutlet) {
      if (productExistsInOutlet) {
        updateOutletStock(
          {
            outlet_id: myOutlet.id,
            warehouse_id: Number(warehouseId),
            product_id: Number(productId),
            stock: data.stock,
          },
          {
            onError: (error: any) => {
              if (error?.response) {
                const { message, errors: fieldErrors } = error.response.data;
                if (message) setError("root", { type: "server", message });
                if (fieldErrors) {
                  Object.entries(fieldErrors).forEach(([key, messages]: [string, any]) => {
                    setError(key as keyof EditDistribusiStokWarehouseFormData, {
                      type: "server", message: messages[0],
                    });
                  });
                }
              }
            },
          }
        );
      } else {
        createOutletStock(
          {
            outlet_id: myOutlet.id,
            warehouse_id: Number(warehouseId),
            product_id: Number(productId),
            stock: data.stock,
          },
          {
            onError: (error: any) => {
              if (error?.response) {
                const { message, errors: fieldErrors } = error.response.data;
                if (message) setError("root", { type: "server", message });
                if (fieldErrors) {
                  Object.entries(fieldErrors).forEach(([key, messages]: [string, any]) => {
                    setError(key as keyof EditDistribusiStokWarehouseFormData, {
                      type: "server", message: messages[0],
                    });
                  });
                }
              }
            },
          }
        );
      }
    } else {
      updateWarehouseStock(
        { warehouse_id: Number(warehouseId), product_id: Number(productId), stock: data.stock },
      );
    }
  };

  if (!warehouse) return <p>Not found warehouse details...</p>;
  if (!product) return <p>Not found product details...</p>;
  if (loadingWarehouse || loadingProduct) return <p>Loading details...</p>;
  if (isKeeper && !myOutlet) return <p>Loading outlet details...</p>;

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1 p-6 pt-0">
        <div id="Top-Bar" className="flex items-center w-full gap-6 mt-[30px] mb-6">
          <div className="flex items-center gap-6 h-[92px] bg-white w-full rounded-3xl p-[18px]">
            <div className="flex flex-col gap-[6px] w-full">
              <h1 className="font-bold text-2xl">
                {isKeeper ? "Transfer Stok ke Outlet" : "Update Stock Product"}
              </h1>
              <Link
                to={`/warehouse-products/${warehouse.id}`}
                className="flex items-center gap-[6px] text-monday-gray font-semibold"
              >
                <img
                  src="/assets/images/icons/arrow-left-grey.svg"
                  className="size-4 flex shrink-0"
                  alt="icon"
                />
                Warehouse Details
              </Link>
            </div>
            <div className="flex items-center flex-nowrap gap-3">
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img src="/assets/images/icons/search-normal-black.svg" className="size-6" alt="icon" />
                </div>
              </a>
              <a href="#">
                <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center overflow-hidden">
                  <img src="/assets/images/icons/notification-black.svg" className="size-6" alt="icon" />
                </div>
              </a>
              <div className="relative w-fit">
                <div className="flex size-14 rounded-full bg-monday-lime-green items-center justify-center overflow-hidden">
                  <img src="/assets/images/icons/crown-black-fill.svg" className="size-6" alt="icon" />
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
          <div className="flex gap-6">
            <div className="flex flex-col gap-6 w-full">
              <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full rounded-3xl p-[18px] gap-5 bg-white">
                <h2 className="font-semibold text-xl">Warehouse Details</h2>
                <div className="flex flex-col gap-5 p-[18px] rounded-3xl border-[1.5px] border-monday-border">
                  <div className="flex items-center gap-3">
                    <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                      <img src={warehouse.photo} className="size-full object-cover" alt="icon" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-lg">{warehouse.name}</p>
                      <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                        <img src="/assets/images/icons/call-grey.svg" className="size-6 flex shrink-0" alt="icon" />
                        <span>{warehouse.phone}</span>
                      </p>
                    </div>
                  </div>
                  <hr className="border-monday-border" />
                  <div className="flex items-center gap-3">
                    <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                      <img src={product.thumbnail} className="size-full object-contain" alt="icon" />
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <p className="font-semibold text-xl">{product.name}</p>
                      <p className="font-semibold text-xl text-monday-blue">
                        Rp {product?.price.toLocaleString("id")}
                        <span className="text-base text-monday-gray font-medium">
                          {" "} / {product?.unit}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-[6px] shrink-0">
                      <img src="/assets/images/icons/box-black.svg" className="size-6 flex shrink-0" alt="icon" />
                      <p className="font-semibold text-lg text-nowrap">{warehouseStock} {product?.unit} Stok Gudang</p>
                    </div>
                  </div>
                </div>

                {isKeeper && myOutlet && (
                  <>
                    <h2 className="font-semibold text-xl">Outlet Details</h2>
                    <div className="flex flex-col gap-5 p-[18px] rounded-3xl border-[1.5px] border-monday-border">
                      <div className="flex items-center gap-3">
                        <div className="flex size-16 rounded-2xl bg-monday-background items-center justify-center overflow-hidden">
                          <img src={myOutlet.photo} className="size-full object-cover" alt="icon" />
                        </div>
                        <div className="flex flex-col gap-2 flex-1">
                          <p className="font-semibold text-lg">{myOutlet.name}</p>
                          <p className="flex items-center gap-1 font-medium text-lg text-monday-gray">
                            <img src="/assets/images/icons/user-thin-grey.svg" className="size-6 flex shrink-0" alt="icon" />
                            <span>{myOutlet.keeper?.name}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-[6px] shrink-0">
                          <img src="/assets/images/icons/box-black.svg" className="size-6 flex shrink-0" alt="icon" />
                          <p className="font-semibold text-lg text-nowrap">{outletProduct?.pivot?.stock ?? 0} {product?.unit} Stok Outlet</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <h2 className="font-semibold text-xl">
                  {isKeeper ? "Jumlah Stok yang Dikirim" : "Update Stock"}
                </h2>
                <label className="group relative">
                  <div className="flex items-center pr-4 absolute transform -translate-y-1/2 top-1/2 left-6 border-r-[1.5px] border-monday-border ">
                    <img src="/assets/images/icons/box-grey.svg" className="flex size-6 shrink-0" alt="icon" />
                  </div>
                  <p className="placeholder font-medium text-monday-gray text-sm absolute -translate-y-1/2 left-[81px] top-[25px] group-has-[:placeholder-shown]:top-[36px] group-focus-within:top-[25px] transition-300">
                    Type a Stock
                  </p>
                  <input
                    type="number"
                    {...register("stock", { valueAsNumber: true })}
                    className="appearance-none w-full h-[72px] font-semibold text-lg rounded-3xl border-[1.5px] border-monday-border pl-20 pr-6 pb-[14.5px] pt-[34.5px] placeholder-shown:pt-[14.5px] focus:border-monday-black transition-300"
                    placeholder=""
                  />
                </label>
                {errors.stock && <p className="text-red-500">{errors.stock.message}</p>}
                {errors.root && (
                  <p className="text-red-500 bg-red-100 border border-red-400 p-2 rounded">
                    {errors.root.message}
                  </p>
                )}

                <div className="flex items-center justify-end gap-4">
                  <Link to={`/warehouse-products/${warehouse.id}`} className="btn btn-red font-semibold">
                    Cancel
                  </Link>
                  <button type="submit" className="btn btn-primary font-semibold">
                    {isKeeper ? "Transfer Stok" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
            <div className="flex flex-col w-[392px] shrink-0 h-fit rounded-3xl p-[18px] gap-3 bg-white">
              <p className="font-semibold">
                {isKeeper ? "Quick Guide to Transfer Stok" : "Quick Guide to Distribusi Stok"}
              </p>
              <ul className="flex flex-col gap-4">
                <li className="flex gap-[6px]">
                  <img src="/assets/images/icons/Checklist-green-circle.svg" className="flex size-6 shrink-0" alt="icon" />
                  <p className="font-medium leading-[140%]">
                    {isKeeper
                      ? "Pastikan stok gudang mencukupi untuk dikirim ke outlet"
                      : "Ensure the warehouse has enough capacity"}
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img src="/assets/images/icons/Checklist-green-circle.svg" className="flex size-6 shrink-0" alt="icon" />
                  <p className="font-medium leading-[140%]">
                    {isKeeper
                      ? "Masukkan jumlah stok yang ingin ditransfer ke outlet"
                      : "Double-check product details to avoid mismatches"}
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img src="/assets/images/icons/Checklist-green-circle.svg" className="flex size-6 shrink-0" alt="icon" />
                  <p className="font-medium leading-[140%]">
                    {isKeeper
                      ? "Stok akan dikurangi dari gudang dan ditambahkan ke outlet"
                      : "Keep stock levels updated to prevent overselling"}
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img src="/assets/images/icons/Checklist-green-circle.svg" className="flex size-6 shrink-0" alt="icon" />
                  <p className="font-medium leading-[140%]">
                    {isKeeper
                      ? "Verifikasi stok outlet setelah transfer berhasil"
                      : "Regularly review assigned products for accuracy"}
                  </p>
                </li>
                <li className="flex gap-[6px]">
                  <img src="/assets/images/icons/Checklist-green-circle.svg" className="flex size-6 shrink-0" alt="icon" />
                  <p className="font-medium leading-[140%]">
                    {isKeeper
                      ? "Hubungi manager jika stok gudang tidak mencukupi"
                      : "Communicate with the warehouse team for smooth operations"}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EditWarehouseProduct;
