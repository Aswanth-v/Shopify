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
          { title: "image" },
          { title: "Category" },
          { title: "Price" },
        ]}
      >
        {products.map((product, index) => (
          <IndexTable.Row
            id={product.id.toString()}
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
             />
            </IndexTable.Cell>
            <IndexTable.Cell>
              {product.title.trim().length > 30 ? `${product.title.trim().substring(0,10)}...` : product.title.trim()}
            </IndexTable.Cell>

            <IndexTable.Cell>
              {product.category}
            </IndexTable.Cell>

            <IndexTable.Cell>
              ${product.price}
            </IndexTable.Cell>
          </IndexTable.Row>
        ))}
      </IndexTable>
    </Card>
  );
}