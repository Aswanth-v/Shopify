// "use client";

// import { useEffect, useState } from "react";
// import {
//   Page as PolarisPage,
//   Button,
//   ButtonGroup,
//   Popover,
//   ActionList,
// } from "@shopify/polaris";
// import ProductTable from "@/components/ProductTable";
// import ProductModal from "@/components/ProductModel";
// import type { Product } from "@/types/Product";

// export default function Page() {
//   const [moreActive, setMoreActive] = useState(false);

//   const moreOptions = [
//     { content: "Option A", onAction: () => console.log("A") },
//     { content: "Option B", onAction: () => console.log("B") },
//   ];

//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log("Fetched products:", data); 
//         setProducts(data);
//       })
//       .catch((error) => console.error("Error fetching products:", error));
//   }, []);

//   return (
//     <PolarisPage >
//       <ProductTable
//        products={products} 
//       onSelect={setSelectedProduct} />

//       <ProductModal
//         product={selectedProduct}
//         onClose={() => setSelectedProduct(null)}
//       />
//     </PolarisPage>
//   );
// }
'use client'
import { useEffect, useState } from 'react'
import ProductTable from '@/components/ProductTable'
import ProductModal from '@/components/ProductModel'
import type { Product } from '@/types/Product'
import { trackEvent } from '../analytics.tsx/PageTracking'

export default function Page() {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    trackEvent('page_view')
    fetch('https://fakestoreapi.com/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => console.error('Error fetching products:', error))
  }, [])

  const handleSelect = (product: Product) => {
    trackEvent('product_click', product)
    setSelectedProduct(product)
  }

  return (
    <>
      <ProductTable products={products} onSelect={handleSelect} />
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  )
}