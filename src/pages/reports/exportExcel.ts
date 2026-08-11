import ExcelJS from "exceljs";
import type { LowStockProduct, DistributionRow } from "./useReportsData";

const HEADER_FILL_COLOR = "0A3A89";
const HEADER_FONT_COLOR = "FFFFFF";
const ZEBRA_STRIPE_COLOR = "F5F7FA";
const STOCK_HIGHLIGHT_COLOR = "FEE2E2";
const STOCK_LOW_FONT_COLOR = "DC2626";

function formatDateIndonesian(dateString: string): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function getTodayString(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function getExportDateString(): string {
  return new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateAutoWidth(value: string): number {
  let length = 0;
  for (const char of value) {
    const code = char.charCodeAt(0);
    if (code > 0x7f) {
      length += 2;
    } else {
      length += 1;
    }
  }
  return Math.max(length + 3, 10);
}

function setColumnWidthsBasedOnData(
  worksheet: ExcelJS.Worksheet,
  headerRowNumber: number,
  lastDataRowNumber: number,
  totalColumns: number
) {
  for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
    let maxWidth = 0;
    for (let rowNum = headerRowNumber; rowNum <= lastDataRowNumber; rowNum++) {
      const cell = worksheet.getRow(rowNum).getCell(colIndex);
      const cellValue = cell.value != null ? String(cell.value) : "";
      const cellWidth = calculateAutoWidth(cellValue);
      if (cellWidth > maxWidth) {
        maxWidth = cellWidth;
      }
    }
    worksheet.getColumn(colIndex).width = Math.min(maxWidth, 45);
  }
}

function applyBorderToRange(
  worksheet: ExcelJS.Worksheet,
  startRow: number,
  endRow: number,
  startCol: number,
  endCol: number
) {
  for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
    const row = worksheet.getRow(rowNum);
    for (let colIndex = startCol; colIndex <= endCol; colIndex++) {
      const cell = row.getCell(colIndex);
      cell.border = {
        top: { style: "thin", color: { argb: "D1D5DB" } },
        left: { style: "thin", color: { argb: "D1D5DB" } },
        bottom: { style: "thin", color: { argb: "D1D5DB" } },
        right: { style: "thin", color: { argb: "D1D5DB" } },
      };
    }
  }
}

function applyHeaderStyle(headerRow: ExcelJS.Row, totalColumns: number) {
  for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
    const cell = headerRow.getCell(colIndex);
    cell.font = { bold: true, color: { argb: HEADER_FONT_COLOR }, size: 11 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: HEADER_FILL_COLOR },
    };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin", color: { argb: HEADER_FILL_COLOR } },
      left: { style: "thin", color: { argb: "D1D5DB" } },
      bottom: { style: "medium", color: { argb: HEADER_FILL_COLOR } },
      right: { style: "thin", color: { argb: "D1D5DB" } },
    };
  }
  headerRow.height = 30;
}

function applyZebraStripe(
  row: ExcelJS.Row,
  rowIndex: number,
  totalColumns: number
) {
  if (rowIndex % 2 === 0) {
    for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
      row.getCell(colIndex).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: ZEBRA_STRIPE_COLOR },
      };
    }
  }
}

function addTitleBlock(
  worksheet: ExcelJS.Worksheet,
  title: string,
  totalData: number,
  totalColumns: number
) {
  const titleRow = worksheet.addRow([title]);
  titleRow.font = { bold: true, size: 16, color: { argb: "1F2937" } };
  titleRow.alignment = { horizontal: "left", vertical: "middle" };
  titleRow.height = 32;
  worksheet.mergeCells(titleRow.number, 1, titleRow.number, totalColumns);

  const exportDate = getExportDateString();
  const infoRow = worksheet.addRow([`Diekspor pada: ${exportDate}  •  Total: ${totalData} data`]);
  infoRow.font = { italic: true, size: 10, color: { argb: "6B7280" } };
  infoRow.alignment = { horizontal: "left", vertical: "middle" };
  infoRow.height = 22;
  worksheet.mergeCells(infoRow.number, 1, infoRow.number, totalColumns);

  const spacerRow = worksheet.addRow([]);
  spacerRow.height = 8;
}

function setupFreezeAndFilter(
  worksheet: ExcelJS.Worksheet,
  headerRowNumber: number,
  totalColumns: number
) {
  worksheet.views = [{ state: "frozen", ySplit: headerRowNumber }];

  worksheet.autoFilter = {
    from: { row: headerRowNumber, column: 1 },
    to: { row: headerRowNumber, column: totalColumns },
  };
}

function downloadWorkbook(workbook: ExcelJS.Workbook, filename: string) {
  workbook.xlsx.writeBuffer().then((buffer) => {
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  });
}

export async function exportLowStockToExcel(
  lowStockProducts: LowStockProduct[],
  _totalWarehouseStock: number,
  _totalOutletStock: number,
  _totalDistributed: number
) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Senopati Coffee";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Stok Hampir Habis");

  const totalColumns = 6;
  const headers = ["No", "Nama Produk", "Kategori", "Sumber", "Tipe", "Stok"];

  addTitleBlock(worksheet, "Laporan Stok Hampir Habis", lowStockProducts.length, totalColumns);

  const headerRowNumber = 4;
  const headerRow = worksheet.addRow(headers);
  applyHeaderStyle(headerRow, totalColumns);

  lowStockProducts.forEach((lowStockItem, index) => {
    const rowData = [
      index + 1,
      lowStockItem.name,
      lowStockItem.category?.name ?? "-",
      lowStockItem.sourceName,
      lowStockItem.sourceType,
      lowStockItem.unit
        ? `${lowStockItem.stock} ${lowStockItem.unit}`
        : lowStockItem.stock,
    ];
    const dataRow = worksheet.addRow(rowData);
    const rowIndex = index + 1;

    dataRow.font = { size: 10 };
    dataRow.alignment = { vertical: "middle" };

    dataRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    dataRow.getCell(2).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(3).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(4).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(5).alignment = { horizontal: "center", vertical: "middle" };

    const stockCell = dataRow.getCell(6);
    stockCell.alignment = { horizontal: "right", vertical: "middle" };

    if (lowStockItem.stock <= 5) {
      stockCell.font = { bold: true, size: 10, color: { argb: STOCK_LOW_FONT_COLOR } };
      for (let colIndex = 1; colIndex <= totalColumns; colIndex++) {
        dataRow.getCell(colIndex).fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: STOCK_HIGHLIGHT_COLOR },
        };
      }
    } else {
      stockCell.font = { bold: true, size: 10, color: { argb: "1053D5" } };
      applyZebraStripe(dataRow, rowIndex, totalColumns);
    }

    dataRow.height = 24;
  });

  const lastDataRowNumber = headerRowNumber + lowStockProducts.length;

  applyBorderToRange(worksheet, headerRowNumber, lastDataRowNumber, 1, totalColumns);
  setColumnWidthsBasedOnData(worksheet, headerRowNumber, lastDataRowNumber, totalColumns);
  setupFreezeAndFilter(worksheet, headerRowNumber, totalColumns);

  const today = getTodayString();
  await downloadWorkbook(workbook, `laporan-stok-habis-${today}.xlsx`);
}

export async function exportDistributionToExcel(distributionRows: DistributionRow[]) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Senopati Coffee";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet("Riwayat Distribusi");

  const totalColumns = 7;
  const headers = ["No", "Tanggal", "Gudang", "Outlet", "Produk", "Jumlah", "Staff"];

  addTitleBlock(worksheet, "Laporan Riwayat Distribusi", distributionRows.length, totalColumns);

  const headerRowNumber = 4;
  const headerRow = worksheet.addRow(headers);
  applyHeaderStyle(headerRow, totalColumns);

  distributionRows.forEach((distributionRow, index) => {
    const rowData = [
      index + 1,
      formatDateIndonesian(distributionRow.date),
      distributionRow.warehouse,
      distributionRow.outlet,
      distributionRow.product,
      distributionRow.unit
        ? `${distributionRow.quantity} ${distributionRow.unit}`
        : distributionRow.quantity,
      distributionRow.staff,
    ];
    const dataRow = worksheet.addRow(rowData);
    const rowIndex = index + 1;

    dataRow.font = { size: 10 };
    dataRow.alignment = { vertical: "middle" };

    dataRow.getCell(1).alignment = { horizontal: "center", vertical: "middle" };
    dataRow.getCell(2).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(3).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(4).alignment = { horizontal: "left", vertical: "middle" };
    dataRow.getCell(5).alignment = { horizontal: "left", vertical: "middle" };

    const quantityCell = dataRow.getCell(6);
    quantityCell.alignment = { horizontal: "right", vertical: "middle" };
    quantityCell.font = { bold: true, size: 10, color: { argb: "1053D5" } };

    dataRow.getCell(7).alignment = { horizontal: "left", vertical: "middle" };

    applyZebraStripe(dataRow, rowIndex, totalColumns);
    dataRow.height = 24;
  });

  const lastDataRowNumber = headerRowNumber + distributionRows.length;

  applyBorderToRange(worksheet, headerRowNumber, lastDataRowNumber, 1, totalColumns);
  setColumnWidthsBasedOnData(worksheet, headerRowNumber, lastDataRowNumber, totalColumns);
  setupFreezeAndFilter(worksheet, headerRowNumber, totalColumns);

  const today = getTodayString();
  await downloadWorkbook(workbook, `laporan-distribusi-${today}.xlsx`);
}
