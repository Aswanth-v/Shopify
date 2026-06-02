"use client";

import { Modal } from "@shopify/polaris";
import type { Product } from "@/types/Product";

interface Props {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({
  product,
  onClose,
}: Props) {
  if (!product) return null;

  return (
    <Modal
      open={!!product}
      onClose={onClose}
      title={product.title}
    >
      <Modal.Section>
        <img
          src={product.image}
          alt={product.title}
          width={200}
        />

        <p>{product.description}</p>

        <h3>${product.price}</h3>
      </Modal.Section>
    </Modal>
  );
}