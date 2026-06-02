"use client";

import { useMemo, useState } from "react";
import { Card, IndexTable } from "@shopify/polaris";
import type { Product } from "@/types/Product";
import { ProductFilters, SearchFilters } from "../FilterComponents/Statusfilter";

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

const statuses = ["Active", "Draft", "Archived"];
const vendors = ["Company 123", "Rustic LTD", "partners-demo", "Boring Rock"];

export default function ProductTable({ products, onSelect }: Props) {
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [search, setSearch] = useState("");

  const formattedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        inventory:
          Math.random() > 0.2
            ? Math.floor(Math.random() * 2000)
            : "not tracked",
        vendor: vendors[Math.floor(Math.random() * vendors.length)],
      })),
    [products]
  );

  const filteredProducts = useMemo(() => {
    let data = formattedProducts;

    if (selectedStatus !== "All") {
      data = data.filter((p) => p.status === selectedStatus);
    }

    if (search.trim()) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    return data;
  }, [formattedProducts, selectedStatus, search]);

  return (
    <Card>
      <ProductFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />
      <SearchFilters search={search} setSearch={setSearch} />

      {/* ===================== DESKTOP TABLE ===================== */}
      <div className="hidden md:block">
        <IndexTable
          resourceName={{ singular: "product", plural: "products" }}
          itemCount={filteredProducts.length}
          selectable={false}
          headings={[
            { title: "" },
            { title: "Product" },
            { title: "Status" },
            { title: "Inventory" },
            { title: "Type" },
            { title: "Vendor" },
          ]}
        >
          {filteredProducts.map((product, index) => (
            <IndexTable.Row
              id={String(product.id)}
              key={product.id}
              position={index}
              onClick={() => onSelect(product)}
            >
              <IndexTable.Cell>
                <img
                  src={product.image}
                  alt={product.title}
                  style={{
                    width: 45,
                    height: 45,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              </IndexTable.Cell>

              <IndexTable.Cell>
                <div className="font-medium">
                  {product.title.length > 40
                    ? `${product.title.slice(0, 40)}...`
                    : product.title}
                </div>
              </IndexTable.Cell>

              <IndexTable.Cell>
                <span
                  className={`font-medium ${
                    product.status === "Active"
                      ? "text-green-600"
                      : product.status === "Draft"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {product.status}
                </span>
              </IndexTable.Cell>

              <IndexTable.Cell>{product.inventory}</IndexTable.Cell>

              <IndexTable.Cell>{product.category}</IndexTable.Cell>

              <IndexTable.Cell>{product.vendor}</IndexTable.Cell>
            </IndexTable.Row>
          ))}
        </IndexTable>
      </div>

      {/* ===================== MOBILE CARD VIEW ===================== */}
      <div className="md:hidden space-y-3 mt-3">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            onClick={() => onSelect(product)}
            className="flex items-center gap-3 p-3 border rounded-lg"
          >
            <img
              src={product.image}
              alt={product.title}
              style={{
                width: 50,
                height: 50,
                objectFit: "cover",
                borderRadius: 6,
              }}
            />

            <div className="flex flex-col">
              <div className="font-medium text-sm">
                {product.title.length > 35
                  ? `${product.title.slice(0, 15)}...`
                  : product.title}
              </div>

              <div className="text-xs text-gray-500">
                <span
                  className={`font-medium ${
                    product.status === "Active"
                      ? "text-green-600"
                      : product.status === "Draft"
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {product.status}
                </span> • {product.inventory} • {product.vendor}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}