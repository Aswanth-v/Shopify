"use client";

import { useEffect, useState } from "react";
import { Page as PolarisPage } from "@shopify/polaris";
import ProductTable from "@/components/ProductTable";
import ProductModal from "@/components/ProductModel";
import type { Product } from "@/types/Product";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data)=>{
        setProducts(data);
        console.log(data)
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  return (
    <PolarisPage title="Products">
      <ProductTable
        products={products}
        onSelect={setSelectedProduct}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </PolarisPage>
  );
}