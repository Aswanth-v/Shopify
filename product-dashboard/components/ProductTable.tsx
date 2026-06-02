"use client";

import { useMemo, useState } from "react";
import { Card, IndexTable } from "@shopify/polaris";
import type { Product } from "@/types/Product";
import ProductFilters from "../FilterComponents/Statusfilter";
interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

const statuses = ["Active", "Draft", "Archived"];
const vendors = ["Company 123", "Rustic LTD", "partners-demo", "Boring Rock"];

export default function ProductTable({ products, onSelect }: Props) {
  const [selectedStatus, setSelectedStatus] = useState("All");

  // enrich products
  const formattedProducts = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        inventory:
          Math.random() > 0.2
            ? Math.floor(Math.random() * 2000)
            : "not tracked",
        vendor:
          vendors[Math.floor(Math.random() * vendors.length)],
      })),
    [products]
  );

  // filter logic (kept here intentionally — "brain layer")
  const filteredProducts = useMemo(() => {
    if (selectedStatus === "All") return formattedProducts;

    return formattedProducts.filter(
      (p) => p.status === selectedStatus
    );
  }, [formattedProducts, selectedStatus]);

  return (
    <Card>
      {/* FILTER COMPONENT */}
      <ProductFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      {/* TABLE */}
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
                width={50}
                height={50}
                className="rounded border"
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
    </Card>
  );
}