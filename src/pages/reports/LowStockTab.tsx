import { LowStockProduct } from "./useReportsData";

interface LowStockTabProps {
  paginatedProducts: LowStockProduct[];
  filteredCount: number;
  searchQuery: string;
  renderPagination: () => React.ReactNode;
  renderEmptyState: (message: string, showReset?: boolean) => React.ReactNode;
}

export default function LowStockTab({
  paginatedProducts,
  filteredCount,
  searchQuery,
  renderPagination,
  renderEmptyState,
}: LowStockTabProps) {
  if (filteredCount === 0) {
    return renderEmptyState(
      searchQuery
        ? `Tidak ada produk hampir habis yang cocok dengan "${searchQuery}".`
        : "Semua stok produk dalam kondisi aman."
    );
  }

  const headerStyle = { gridTemplateColumns: '56px 1fr 1fr 100px' };

  return (
    <div className="reports-tab-gap">
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 600 }}>
          <div className="reports-tab-header" style={headerStyle}>
            <span className="reports-tab-label">Gambar</span>
            <span className="reports-tab-label">Nama Produk</span>
            <span className="reports-tab-label">Sumber</span>
            <span className="reports-tab-label reports-tab-label-right">Stok</span>
          </div>
          <div className="reports-tab-items">
            {paginatedProducts.map((item) => (
              <div
                key={`${item.sourceType}-${item.sourceId}-${item.id}`}
                className="reports-tab-row reports-tab-low"
                style={headerStyle}
              >
                <div className="reports-tab-thumb"><img src={item.thumbnail} alt="" /></div>
                <div className="flex flex-col" style={{ gap: 2, minWidth: 0 }}>
                  <p className="reports-tab-text reports-tab-bold">{item.name}</p>
                  <p className="reports-tab-text reports-tab-sm">{item.category?.name}</p>
                </div>
                <div className="flex flex-col" style={{ gap: 4, minWidth: 0 }}>
                  <p className="reports-tab-text">{item.sourceName}</p>
                  <span className={item.sourceType === "Gudang" ? "reports-badge-gudang" : "reports-badge-outlet"}>
                    {item.sourceType}
                  </span>
                </div>
                <p className="reports-tab-text reports-tab-orange">{item.stock}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderPagination()}
    </div>
  );
}
