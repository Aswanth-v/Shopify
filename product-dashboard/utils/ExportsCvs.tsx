import papa from "papaparse";

export function exportToCsv(data: any[], filename: string) {
  const csv = papa.unparse(data);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });   
 
const url = URL.createObjectURL(blob);

const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "products.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}