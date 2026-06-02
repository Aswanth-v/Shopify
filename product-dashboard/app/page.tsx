"use client";

import { useEffect, useState } from "react";
import {
  Page as PolarisPage,
  Button,
  ButtonGroup,
  Popover,
  ActionList,
} from "@shopify/polaris";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModel";
import type { Product } from "@/types/Product";

export default function Page() {
  const [moreActive, setMoreActive] = useState(false);

  const moreOptions = [
    { content: "Option A", onAction: () => console.log("A") },
    { content: "Option B", onAction: () => console.log("B") },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <PolarisPage fullWidth title="Product ">
      <div className="flex justify-between items-center mb-3">
        <ButtonGroup>
          <Button>Export</Button>
          <Button>Import</Button>
          <Popover
            active={moreActive}
            activator={
              <Button disclosure onClick={() => setMoreActive(!moreActive)}>
                More Options
              </Button>
            }
            onClose={() => setMoreActive(false)}
          >
            <ActionList items={moreOptions} />
          </Popover>
          <Button variant="primary">Add Product</Button>
        </ButtonGroup>
      </div>

      
      <ProductTable
       products={products} 
      onSelect={setSelectedProduct} />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </PolarisPage>
  );
}
