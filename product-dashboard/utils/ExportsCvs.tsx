import papa from "papaparse";

export function exportToCsv(data: any[], filename: string) {
  const flattened = data.map(({ rating, ...rest }) => ({
    ...rest,
    "rating.rate": rating?.rate ?? 0,
    "rating.count": rating?.count ?? 0,
  }));

  const csv = papa.unparse(flattened);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url); 
}

export function importCsv(csvText: string) {
  const result = papa.parse(csvText, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true, 
  });


  return result.data.map((row: any) => ({
    ...row,
    id: Number(row.id),
    price: Number(row.price),
    rating: {
      rate: Number(row["rating.rate"] ?? row.rating?.rate ?? 0),
      count: Number(row["rating.count"] ?? row.rating?.count ?? 0),
    },
  }));
}