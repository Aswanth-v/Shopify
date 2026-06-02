"use client";

import { Card, IndexTable } from "@shopify/polaris";
import type { Product } from "@/types/Product";

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

export default function ProductTable({
  products,
  onSelect,
}: Props) {
  return (
    <Card>
      <IndexTable
        resourceName={{
          singular: "product",
          plural: "products",
        }}
        itemCount={products.length}
        selectable={false}
       headings={[
  { title: "Product" },
  { title: "Status" },
  { title: "Inventory" },
  { title: "Type" },
  { title: "Vendor" },
]}
      >
        {products.map((product, index) => (
          <IndexTable.Row
            id={String(product.id)}
            key={product.id}
            position={index}
            onClick={() => onSelect(product)}
          >
            {/* Product */}
            <IndexTable.Cell>
              <div className="flex items-center gap-3">
                <img
                  src={product.image}
                  alt={product.title}
                  width={50}
                  height={50}
                  className="rounded border"
                />

                <div>
                  <p className="font-medium">
                    {product.title.length > 30
                      ? `${product.title.slice(0, 30)}...`
                      : product.title}
                  </p>
                </div>
              </div>
            </IndexTable.Cell>

            {/* Status */}
            <IndexTable.Cell>
              <span className="text-green-600 font-medium">
                Active
              </span>
            </IndexTable.Cell>

            {/* Category */}
            <IndexTable.Cell>
              {product.category}
            </IndexTable.Cell>

            {/* Price */}
            <IndexTable.Cell>
              ${product.price}
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}