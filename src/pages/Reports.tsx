import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import UserProfileCard from "../components/UserProfileCard";
import { useReportsData, Tab } from "./reports/useReportsData";
import { exportLowStockToExcel, exportDistributionToExcel } from "./reports/exportExcel";
import LowStockTab from "./reports/LowStockTab";
import DistributionTab from "./reports/DistributionTab";

const ROWS_PER_PAGE = 10;

const TABS: { key: Tab; label: string }[] = [
  { key: "stok-habis", label: "Stok Hampir Habis" },
  { key: "gudang", label: "Stok Gudang" },
  { key: "outlet", label: "Stok Outlet" },
  { key: "distribusi", label: "Riwayat Distribusi" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState<Tab>("stok-habis");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [filterWarehouse, setFilterWarehouse] = useState("");
  const [filterOutlet, setFilterOutlet] = useState("");

  const {
    warehouseList,
    outletList,
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
  } = useReportsData({
    searchQuery,
    filterDateFrom,
    filterDateTo,
    filterWarehouse,
    filterOutlet,
    currentPage,
    rowsPerPage: ROWS_PER_PAGE,
  });

  const totalItems =
    activeTab === "distribusi" ? filteredDistribution.length : filteredLowStock.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ROWS_PER_PAGE));

  const resetFilters = () => {
    setSearchQuery("");
    setFilterDateFrom("");
    setFilterDateTo("");
    setFilterWarehouse("");
    setFilterOutlet("");
    setCurrentPage(1);
  };

  const handlePrint = () => window.print();

  const handleDownloadExcel = async () => {
    if (activeTab === "distribusi") {
      await exportDistributionToExcel(filteredDistribution);
    } else {
      await exportLowStockToExcel(
        filteredLowStock,
        totalWarehouseStock,
        totalOutletStock,
        totalDistributed
      );
    }
  };

  const showTableToolbar = activeTab === "distribusi" || activeTab === "stok-habis";
  const hasActiveFilters = !!(
    searchQuery || filterDateFrom || filterDateTo || filterWarehouse || filterOutlet
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        pages.push(pageNumber);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let pageNumber = Math.max(2, currentPage - 1);
        pageNumber <= Math.min(totalPages - 1, currentPage + 1);
        pageNumber++
      ) {
        pages.push(pageNumber);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    const startItem = Math.min((currentPage - 1) * ROWS_PER_PAGE + 1, totalItems);
    const endItem = Math.min(currentPage * ROWS_PER_PAGE, totalItems);

    return (
      <div className="reports-pagination">
        <p className="reports-pagination-info">
          Menampilkan {startItem}–{endItem} dari {totalItems} data
        </p>
        <div className="reports-pagination-btns">
          <button
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="reports-page-btn"
          >
            ‹
          </button>
          {pages.map((pageNumber, index) =>
            pageNumber === "..." ? (
              <span key={`ellipsis-${index}`} style={{ padding: '0 4px', color: '#9ca3af', fontSize: 14 }}>
                ...
              </span>
            ) : (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`reports-page-btn ${currentPage === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </button>
            )
          )}
          <button
            onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="reports-page-btn"
          >
            ›
          </button>
        </div>
      </div>
    );
  };

  const renderEmptyState = (message: string, showReset = false) => (
    <div className="reports-empty">
      <img src="/assets/images/icons/document-text-grey.svg" alt="icon" />
      <p>{message}</p>
      {showReset && (
        <button onClick={resetFilters} className="btn btn-primary-opacity font-semibold" style={{ fontSize: 14 }}>
          Reset Filter
        </button>
      )}
    </div>
  );

  return (
    <div id="main-container" className="flex flex-1">
      <Sidebar />
      <div id="Content" className="flex flex-col flex-1" style={{ padding: 24, paddingTop: 0 }}>
        <div id="Top-Bar" className="flex items-center w-full gap-6" style={{ marginTop: 30, marginBottom: 24 }}>
          <div className="flex items-center bg-white w-full rounded-3xl" style={{ height: 92, padding: 18, gap: 24 }}>
            <div className="flex flex-col w-full" style={{ gap: 6 }}>
              <h1 className="font-bold text-2xl">Laporan Stok & Distribusi</h1>
              <Link to="/overview" className="flex items-center text-monday-gray font-semibold" style={{ gap: 6 }}>
                <img src="/assets/images/icons/arrow-left-grey.svg" className="size-4 flex shrink-0" alt="icon" />
                Overview
              </Link>
            </div>
            <div className="flex items-center" style={{ gap: 12, flexWrap: 'nowrap' }}>
              <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center">
                <img src="/assets/images/icons/search-normal-black.svg" className="size-6" alt="icon" />
              </div>
              <div className="flex size-14 rounded-full bg-monday-gray-background items-center justify-center">
                <img src="/assets/images/icons/notification-black.svg" className="size-6" alt="icon" />
              </div>
              <div className="relative w-fit">
                <div className="flex size-14 rounded-full bg-monday-lime-green items-center justify-center">
                  <img src="/assets/images/icons/crown-black-fill.svg" className="size-6" alt="icon" />
                </div>
                <p className="absolute transform -translate-x-1/2 left-1/2 rounded-3xl bg-monday-black text-white w-fit font-extrabold" style={{ bottom: -8, padding: '4px 8px', fontSize: 8 }}>PRO</p>
              </div>
            </div>
          </div>
          <UserProfileCard />
        </div>

        <style>{`
          @keyframes rspin { to { transform: rotate(360deg); } }
          .reports-summary-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
          @media (min-width: 768px) { .reports-summary-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (min-width: 1280px) { .reports-summary-grid { grid-template-columns: repeat(4, 1fr); } }
          .reports-card { display: flex; flex-direction: column; border-radius: 1.5rem; padding: 20px; gap: 12px; background: #fff; }
          .reports-card-icon { display: flex; width: 48px; height: 48px; border-radius: 9999px; align-items: center; justify-content: center; flex-shrink: 0; }
          .reports-card-icon img { width: 20px; height: 20px; }
          .reports-card-number { font-weight: 700; font-size: 1.5rem; line-height: 1; }
          .reports-card-title { font-weight: 500; color: #9ca3af; font-size: 14px; }
          .reports-card-sub { font-weight: 500; color: #9ca3af; font-size: 12px; }
          .reports-section { display: flex; flex-direction: column; border-radius: 1.5rem; padding: 18px; gap: 20px; background: #fff; flex: 1; min-height: 0; }
          .reports-tab-bar { display: flex; gap: 8px; flex-wrap: wrap; }
          .reports-tab-btn { padding: 8px 16px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; }
          .reports-tab-active { background: #3b82f6; color: #fff; }
          .reports-tab-inactive { background: #f3f4f6; color: #9ca3af; }
          .reports-actions { display: flex; gap: 8px; flex-wrap: wrap; }
          .reports-action-btn { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 12px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; }
          .reports-action-excel { background: #f3f4f6; color: #9ca3af; }
          .reports-action-print { background: #3b82f6; color: #fff; }
          .reports-hr { border: none; border-top: 1px solid #e5e5e5; }
          .reports-toolbar { display: flex; flex-direction: column; gap: 12px; }
          @media (min-width: 1024px) { .reports-toolbar { flex-direction: row; align-items: center; } }
          .reports-search { position: relative; flex: 1; width: 100%; }
          .reports-search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; opacity: 0.4; }
          .reports-search input { width: 100%; height: 40px; padding-left: 40px; padding-right: 16px; border-radius: 12px; border: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; outline: none; box-sizing: border-box; }
          .reports-search input:focus { border-color: #1f2937; }
          .reports-filter-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
          .reports-filter-input { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; outline: none; }
          .reports-filter-input:focus { border-color: #1f2937; }
          .reports-filter-select { height: 40px; padding: 0 12px; border-radius: 12px; border: 1px solid #e5e5e5; font-size: 14px; font-weight: 500; outline: none; background: #fff; }
          .reports-filter-select:focus { border-color: #1f2937; }
          .reports-reset-btn { height: 40px; padding: 0 12px; border-radius: 12px; font-weight: 600; font-size: 14px; color: #ef4444; border: 1px solid #fecaca; background: #fff; cursor: pointer; white-space: nowrap; }
          .reports-pagination { display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid #e5e5e5; }
          .reports-page-info { font-weight: 500; font-size: 14px; color: #9ca3af; }
          .reports-page-btns { display: flex; align-items: center; gap: 6px; }
          .reports-page-btn { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 12px; font-size: 14px; font-weight: 500; border: 1px solid #e5e5e5; background: #fff; cursor: pointer; padding: 0; }
          .reports-page-btn:hover { background: #f3f4f6; }
          .reports-page-btn-active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
          .reports-page-btn:disabled { opacity: 0.4; cursor: default; }
          .reports-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 16px; border: 2px dashed #e5e5e5; gap: 16px; padding: 64px 0; }
          .reports-empty img { width: 48px; height: 48px; }
          .reports-empty p { font-weight: 600; color: #9ca3af; }
          .reports-wh-card { display: flex; flex-direction: column; border-radius: 16px; border: 1px solid #e5e5e5; overflow: hidden; }
          .reports-wh-head { display: flex; align-items: center; justify-content: space-between; padding: 16px; background: rgba(243,244,246,0.5); }
          .reports-wh-left { display: flex; align-items: center; gap: 12px; }
          .reports-wh-right { display: flex; align-items: center; gap: 12px; }
          .reports-wh-icon { display: flex; width: 40px; height: 40px; border-radius: 12px; background: #fff; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; border: 1px solid #e5e5e5; }
          .reports-wh-icon img { width: 100%; height: 100%; object-fit: contain; }
          .reports-wh-name { font-weight: 600; font-size: 1rem; }
          .reports-wh-phone { font-weight: 500; font-size: 12px; color: #9ca3af; }
          .reports-badge { display: flex; align-items: center; gap: 6px; padding: 6px 12px; border-radius: 8px; background: #fff; border: 1px solid #e5e5e5; }
          .reports-badge img { width: 16px; height: 16px; }
          .reports-badge-num { font-weight: 700; font-size: 14px; color: #3b82f6; }
          .reports-badge-label { font-weight: 500; font-size: 12px; color: #9ca3af; }
          .reports-link { padding: 6px 12px; border-radius: 8px; font-weight: 600; font-size: 12px; background: #3b82f6; color: #fff; text-decoration: none; }
          .reports-link:hover { opacity: 0.9; }
          .reports-prod-list { display: flex; flex-direction: column; }
          .reports-prod-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; }
          .reports-prod-row:hover { background: rgba(243,244,246,0.3); }
          .reports-prod-row-border { border-bottom: 1px solid #e5e5e5; }
          .reports-prod-thumb { display: flex; width: 32px; height: 32px; border-radius: 8px; background: #f5f5f5; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
          .reports-prod-thumb img { width: 100%; height: 100%; object-fit: contain; }
          .reports-prod-name { font-weight: 500; font-size: 14px; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .reports-prod-cat { font-weight: 500; font-size: 12px; color: #9ca3af; width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .reports-prod-stock { font-weight: 700; font-size: 14px; width: 40px; text-align: right; }
          .reports-prod-danger { color: #ea580c; }
          .reports-prod-normal { color: #3b82f6; }
          .reports-no-prod { font-weight: 500; font-size: 14px; color: #9ca3af; text-align: center; padding: 24px 0; }
          .reports-tab-gap { display: flex; flex-direction: column; gap: 12px; }
          .reports-tab-header { display: grid; gap: 12px; padding: 10px 16px; background: #f3f4f6; border-radius: 12px; }
          .reports-tab-items { display: flex; flex-direction: column; gap: 4px; margin-top: 4px; }
          .reports-tab-row { display: grid; gap: 12px; align-items: center; padding: 12px 16px; border-radius: 12px; }
          .reports-tab-row:hover { background: rgba(243,244,246,0.3); }
          .reports-tab-low:hover { background: #fff7ed; }
          .reports-tab-label { font-weight: 600; font-size: 12px; color: #9ca3af; text-transform: uppercase; }
          .reports-tab-label-right { text-align: right; }
          .reports-tab-text { font-weight: 500; font-size: 14px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
          .reports-tab-bold { font-weight: 600; }
          .reports-tab-sm { font-size: 12px; }
          .reports-tab-orange { font-weight: 700; color: #ea580c; text-align: right; }
          .reports-tab-blue { font-weight: 700; color: #3b82f6; text-align: right; }
          .reports-tab-nowrap { white-space: nowrap; }
          .reports-tab-thumb { display: flex; width: 40px; height: 40px; border-radius: 8px; background: #f5f5f5; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; }
          .reports-tab-thumb img { width: 100%; height: 100%; object-fit: contain; }
          .reports-badge-gudang { display: inline-flex; width: fit-content; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; line-height: 1.4; background: rgba(59,130,246,0.1); color: #3b82f6; }
          .reports-badge-outlet { display: inline-flex; width: fit-content; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 600; line-height: 1.4; background: #dcfce7; color: #16a34a; }
        `}</style>

        <main className="flex flex-col flex-1" style={{ gap: 24 }}>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center" style={{ padding: '80px 0', gap: 16 }}>
              <div className="rounded-full" style={{ width: 32, height: 32, border: '4px solid #3b82f6', borderTopColor: 'transparent', animation: 'rspin 1s linear infinite' }} />
              <p className="font-medium text-monday-gray">Loading data...</p>
            </div>
          ) : (
            <>
              <section className="reports-summary-grid">
                <div className="reports-card">
                  <div className="reports-card-icon" style={{ background: 'rgba(59,130,246,0.1)' }}>
                    <img src="/assets/images/icons/buildings-2-blue-fill.svg" alt="icon" />
                  </div>
                  <p className="reports-card-number">{totalWarehouseStock}</p>
                  <p className="reports-card-title">Total Stok Gudang</p>
                  <p className="reports-card-sub">{warehouseList.length} gudang aktif</p>
                </div>
                <div className="reports-card">
                  <div className="reports-card-icon" style={{ background: '#dcfce7' }}>
                    <img src="/assets/images/icons/shop-blue-fill.svg" alt="icon" />
                  </div>
                  <p className="reports-card-number">{totalOutletStock}</p>
                  <p className="reports-card-title">Total Stok Outlet</p>
                  <p className="reports-card-sub">{outletList.length} outlet aktif</p>
                </div>
                <div className="reports-card">
                  <div className="reports-card-icon" style={{ background: '#f3e8ff' }}>
                    <img src="/assets/images/icons/document-text-blue-fill.svg" alt="icon" />
                  </div>
                  <p className="reports-card-number">{totalDistributed}</p>
                  <p className="reports-card-title">Total Terdistribusi</p>
                  <p className="reports-card-sub">Gudang + Outlet</p>
                </div>
                <div className="reports-card">
                  <div className="reports-card-icon" style={{ background: '#ffedd5' }}>
                    <img src="/assets/images/icons/note-2-blue-fill.svg" alt="icon" />
                  </div>
                  <p className="reports-card-number">{allLowStockProducts.length}</p>
                  <p className="reports-card-title">Produk Hampir Habis</p>
                  <p className="reports-card-sub">Stok &#8804; 5</p>
                </div>
              </section>

              <section className="reports-section">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                  <div className="reports-tab-bar">
                    {TABS.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => { setActiveTab(tab.key); setCurrentPage(1); setSearchQuery(""); }}
                        className={`reports-tab-btn ${activeTab === tab.key ? "reports-tab-active" : "reports-tab-inactive"}`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                  <div className="reports-actions">
                    <button onClick={handleDownloadExcel} className="reports-action-btn reports-action-excel">
                      <img src="/assets/images/icons/receive-square-blue-fill.svg" style={{ width: 16, height: 16 }} alt="" />
                      Excel
                    </button>
                    <button onClick={handlePrint} className="reports-action-btn reports-action-print">Print</button>
                  </div>
                </div>

                {showTableToolbar && (
                  <div className="reports-toolbar">
                    <div className="reports-search">
                      <img src="/assets/images/icons/search-normal-black.svg" className="reports-search-icon" alt="" />
                      <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} placeholder="Cari produk, gudang, outlet..." />
                    </div>
                    {activeTab === "distribusi" && (
                      <div className="reports-filter-row">
                        <input type="date" value={filterDateFrom} onChange={(e) => { setFilterDateFrom(e.target.value); setCurrentPage(1); }} className="reports-filter-input" />
                        <span style={{ color: '#9ca3af', fontSize: 14 }}>—</span>
                        <input type="date" value={filterDateTo} onChange={(e) => { setFilterDateTo(e.target.value); setCurrentPage(1); }} className="reports-filter-input" />
                        <select value={filterWarehouse} onChange={(e) => { setFilterWarehouse(e.target.value); setCurrentPage(1); }} className="reports-filter-select">
                          <option value="">Semua Gudang</option>
                          {uniqueWarehouseNames.map((wn) => (<option key={wn} value={wn}>{wn}</option>))}
                        </select>
                        <select value={filterOutlet} onChange={(e) => { setFilterOutlet(e.target.value); setCurrentPage(1); }} className="reports-filter-select">
                          <option value="">Semua Outlet</option>
                          {uniqueOutletNames.map((on) => (<option key={on} value={on}>{on}</option>))}
                        </select>
                      </div>
                    )}
                    {hasActiveFilters && (
                      <button onClick={resetFilters} className="reports-reset-btn">Reset Filter</button>
                    )}
                  </div>
                )}

                <hr className="reports-hr" />

                {activeTab === "stok-habis" && (
                  <LowStockTab
                    paginatedProducts={paginatedLowStock}
                    filteredCount={filteredLowStock.length}
                    searchQuery={searchQuery}
                    renderPagination={renderPagination}
                    renderEmptyState={renderEmptyState}
                  />
                )}

                {activeTab === "gudang" && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {warehouseList.length > 0 ? (
                      warehouseList.map((warehouse) => {
                        const wt = warehouse.products?.reduce((s, p) => s + (p.pivot?.stock ?? 0), 0) ?? 0;
                        return (
                          <div key={warehouse.id} className="reports-wh-card">
                            <div className="reports-wh-head">
                              <div className="reports-wh-left">
                                <div className="reports-wh-icon"><img src={warehouse.photo} alt="" /></div>
                                <div className="flex flex-col">
                                  <p className="reports-wh-name">{warehouse.name}</p>
                                  <p className="reports-wh-phone">{warehouse.phone}</p>
                                </div>
                              </div>
                              <div className="reports-wh-right">
                                <div className="reports-badge">
                                  <img src="/assets/images/icons/box-black.svg" alt="" />
                                  <span className="reports-badge-num">{wt}</span>
                                  <span className="reports-badge-label">stok</span>
                                </div>
                                <Link to={`/warehouse-products/${warehouse.id}`} className="reports-link">Detail</Link>
                              </div>
                            </div>
                            {warehouse.products && warehouse.products.length > 0 ? (
                              <div className="reports-prod-list">
                                {warehouse.products.map((wp, idx) => (
                                  <div key={wp.id} className={`reports-prod-row ${idx < warehouse.products.length - 1 ? "reports-prod-row-border" : ""}`}>
                                    <div className="reports-prod-thumb"><img src={wp.thumbnail} alt="" /></div>
                                    <p className="reports-prod-name">{wp.name}</p>
                                    <p className="reports-prod-cat">{wp.category?.name}</p>
                                    <p className={`reports-prod-stock ${(wp.pivot?.stock ?? 0) <= 5 ? "reports-prod-danger" : "reports-prod-normal"}`}>{wp.pivot?.stock ?? 0}</p>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="reports-no-prod">Belum ada produk</p>}
                          </div>
                        );
                      })
                    ) : renderEmptyState("Belum ada data gudang.")}
                  </div>
                )}

                {activeTab === "outlet" && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {outletList.length > 0 ? (
                      outletList.map((outlet) => {
                        const ot = outlet.products?.reduce((s, p) => s + (p.pivot?.stock ?? 0), 0) ?? 0;
                        return (
                          <div key={outlet.id} className="reports-wh-card">
                            <div className="reports-wh-head">
                              <div className="reports-wh-left">
                                <div className="reports-wh-icon"><img src={outlet.photo} alt="" /></div>
                                <div className="flex flex-col">
                                  <p className="reports-wh-name">{outlet.name}</p>
                                  <p className="reports-wh-phone">{outlet.keeper?.name ?? "No Keeper"}</p>
                                </div>
                              </div>
                              <div className="reports-wh-right">
                                <div className="reports-badge">
                                  <img src="/assets/images/icons/box-black.svg" alt="" />
                                  <span className="reports-badge-num">{ot}</span>
                                  <span className="reports-badge-label">stok</span>
                                </div>
                                <Link to={`/outlet-products/${outlet.id}`} className="reports-link">Detail</Link>
                              </div>
                            </div>
                            {outlet.products && outlet.products.length > 0 ? (
                              <div className="reports-prod-list">
                                {outlet.products.map((op, idx) => (
                                  <div key={op.id} className={`reports-prod-row ${idx < outlet.products.length - 1 ? "reports-prod-row-border" : ""}`}>
                                    <div className="reports-prod-thumb"><img src={op.thumbnail} alt="" /></div>
                                    <p className="reports-prod-name">{op.name}</p>
                                    <p className="reports-prod-cat">{op.category?.name}</p>
                                    <p className={`reports-prod-stock ${(op.pivot?.stock ?? 0) <= 5 ? "reports-prod-danger" : "reports-prod-normal"}`}>{op.pivot?.stock ?? 0}</p>
                                  </div>
                                ))}
                              </div>
                            ) : <p className="reports-no-prod">Belum ada produk</p>}
                          </div>
                        );
                      })
                    ) : renderEmptyState("Belum ada data outlet.")}
                  </div>
                )}

                {activeTab === "distribusi" && (
                  <DistributionTab
                    paginatedRows={paginatedDistribution}
                    filteredCount={filteredDistribution.length}
                    hasActiveFilters={hasActiveFilters}
                    searchQuery={searchQuery}
                    renderPagination={renderPagination}
                    renderEmptyState={renderEmptyState}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
