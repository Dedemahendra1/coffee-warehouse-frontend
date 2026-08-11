import { DistributionRow } from "./useReportsData";

interface DistributionTabProps {
  paginatedRows: DistributionRow[];
  filteredCount: number;
  hasActiveFilters: boolean;
  searchQuery: string;
  renderPagination: () => React.ReactNode;
  renderEmptyState: (message: string, showReset?: boolean) => React.ReactNode;
}

function formatDateIndonesian(dateString: string): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function DistributionTab({
  paginatedRows,
  filteredCount,
  hasActiveFilters,
  searchQuery: _searchQuery,
  renderPagination,
  renderEmptyState,
}: DistributionTabProps) {
  if (filteredCount === 0) {
    return renderEmptyState(
      hasActiveFilters
        ? "Tidak ada data distribusi yang cocok dengan filter yang dipilih."
        : "Belum ada riwayat distribusi.",
      hasActiveFilters
    );
  }

  const headerStyle = { gridTemplateColumns: '120px 1fr 1fr 1fr 80px 1fr' };

  return (
    <div className="reports-tab-gap">
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 700 }}>
          <div className="reports-tab-header" style={headerStyle}>
            <span className="reports-tab-label">Tanggal</span>
            <span className="reports-tab-label">Gudang</span>
            <span className="reports-tab-label">Outlet</span>
            <span className="reports-tab-label">Produk</span>
            <span className="reports-tab-label reports-tab-label-right">Jumlah</span>
            <span className="reports-tab-label">Staff</span>
          </div>
          <div className="reports-tab-items">
            {paginatedRows.map((row) => (
              <div
                key={row.id}
                className="reports-tab-row"
                style={headerStyle}
              >
                <p className="reports-tab-text reports-tab-nowrap">{formatDateIndonesian(row.date)}</p>
                <p className="reports-tab-text">{row.warehouse}</p>
                <p className="reports-tab-text">{row.outlet}</p>
                <p className="reports-tab-text reports-tab-bold">{row.product}</p>
                <p className="reports-tab-text reports-tab-blue">{row.quantity} {row.unit}</p>
                <p className="reports-tab-text">{row.staff}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderPagination()}
    </div>
  );
}
