"use client";

import React, { useState, useEffect } from "react";
import type { Product } from "@/types/Product";

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);

   useEffect(() => {
    console.log("Fetching data...");

    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("Data:", data);
        setProducts(data);
      });
  }, []);

  return (
    <div>
      <h1>Products</h1>
    </div>
  );
}