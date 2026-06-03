'use client'
import {
  Modal, Text, Badge, InlineStack, BlockStack,
  Divider, Button, Box, Card
} from '@shopify/polaris'
import type { Product } from '@/types/Product'
import { trackEvent } from '../analytics.tsx/PageTracking'
import { useEffect } from 'react'

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductModal({ product, onClose }: Props) {
  useEffect(() => {
    if (product) trackEvent('modal_open', product)
  }, [product])

  const handleClose = () => {
    if (product) trackEvent('modal_close', product)
    onClose()
  }

  if (!product) return null

  const stars = Math.round(product.rating.rate)

  return (
    <Modal
      open={!!product}
      onClose={handleClose}
      title=""
      size="large"
    >
      <Modal.Section>
        <InlineStack gap="800" align="start" blockAlign="start" wrap={false}>

          {/* LEFT — image */}
          <div style={{
            width: 260,
            minWidth: 260,
            height: 280,
            borderRadius: 12,
            border: "1px solid #e1e3e5",
            background: "#f6f6f7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
            />
          </div>

          {/* RIGHT — details */}
          <BlockStack gap="400">

            {/* Title + category */}
            <BlockStack gap="200">
              <Badge tone="info">{product.category}</Badge>
              <Text variant="headingXl" as="h2">{product.title}</Text>
            </BlockStack>

            {/* Price */}
            <InlineStack gap="300" blockAlign="center">
              <Text variant="heading2xl" as="p" tone="success">
                ${product.price}
              </Text>
            </InlineStack>

            {/* Rating */}
            <InlineStack gap="200" blockAlign="center">
              <InlineStack gap="050">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Text key={i} as="span" tone={i < stars ? "caution" : "subdued"}>
                    ★
                  </Text>
                ))}
              </InlineStack>
              <Text as="span" variant="bodySm" tone="subdued">
                {product.rating.rate} out of 5 · {product.rating.count} reviews
              </Text>
            </InlineStack>

            <Divider />

            {/* Description */}
            <BlockStack gap="150">
              <Text as="p" variant="bodySm" fontWeight="semibold">About this product</Text>
              <Text as="p" tone="subdued" variant="bodySm">
                {product.description}
              </Text>
            </BlockStack>

            <Divider />

            {/* Actions */}
            <InlineStack gap="300">
              <Button variant="primary" tone="success" size="large">
                Add to cart
              </Button>
              <Button size="large" onClick={handleClose}>
                Close
              </Button>
            </InlineStack>

          </BlockStack>
        </InlineStack>
      </Modal.Section>
    </Modal>
  )
}