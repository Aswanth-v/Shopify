// components/AddProductModal.tsx
"use client";

import { useState } from "react";
import {
  Modal,
  FormLayout,
  TextField,
  Select,
  Button,
  InlineStack,
} from "@shopify/polaris";
import type { Product } from "@/types/Product";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (product: Product) => void;
  existingIds: number[]; // to generate a unique ID
}

const emptyForm = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  ratingRate: "",
  ratingCount: "",
};

export default function AddProductModal({ open, onClose, onAdd, existingIds }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { label: "Select category", value: "" },
    { label: "Men's Clothing", value: "men's clothing" },
    { label: "Women's Clothing", value: "women's clothing" },
    { label: "Jewelery", value: "jewelery" },
    { label: "Electronics", value: "electronics" },
  ];

  // Simple validation
  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.price || isNaN(Number(form.price))) newErrors.price = "Valid price is required";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // true = valid
  };

  const handleAdd = () => {
    if (!validate()) return; // stop if invalid

    // Generate new unique ID
    const newId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    const newProduct: Product = {
      id: newId,
      title: form.title.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      category: form.category,
      // Fallback image if user leaves it blank
      image: form.image.trim() || "https://via.placeholder.com/150",
      rating: {
        rate: Number(form.ratingRate) || 0,
        count: Number(form.ratingCount) || 0,
      },
    };

    onAdd(newProduct);      
    setForm(emptyForm);     
    setErrors({});          
    onClose();             
  };

  const handleClose = () => {
    setForm(emptyForm);     // reset on cancel too
    setErrors({});
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Add product"
      primaryAction={{
        content: "Add product",
        onAction: handleAdd,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleClose,
        },
      ]}
    >
      <Modal.Section>
        <FormLayout>
          {/* Title */}
          <TextField
            label="Title"
            value={form.title}
            onChange={(val) => setForm((prev) => ({ ...prev, title: val }))}
            error={errors.title}
            autoComplete="off"
            placeholder="e.g. Blue Denim Jacket"
          />

          {/* Price */}
          <TextField
            label="Price"
            value={form.price}
            onChange={(val) => setForm((prev) => ({ ...prev, price: val }))}
            error={errors.price}
            autoComplete="off"
            type="number"
            prefix="$"
            placeholder="0.00"
          />

          {/* Category */}
          <Select
            label="Category"
            options={categories}
            value={form.category}
            onChange={(val) => setForm((prev) => ({ ...prev, category: val }))}
            error={errors.category}
          />

          {/* Description */}
          <TextField
            label="Description"
            value={form.description}
            onChange={(val) => setForm((prev) => ({ ...prev, description: val }))}
            error={errors.description}
            autoComplete="off"
            multiline={3}
            placeholder="Product description..."
          />

          {/* Image URL (optional) */}
          <TextField
            label="Image URL (optional)"
            value={form.image}
            onChange={(val) => setForm((prev) => ({ ...prev, image: val }))}
            autoComplete="off"
            placeholder="https://..."
          />

          {/* Rating — optional fields side by side */}
          <FormLayout.Group>
            <TextField
              label="Rating (0-5)"
              value={form.ratingRate}
              onChange={(val) => setForm((prev) => ({ ...prev, ratingRate: val }))}
              autoComplete="off"
              type="number"
              placeholder="4.5"
            />
            <TextField
              label="Rating count"
              value={form.ratingCount}
              onChange={(val) => setForm((prev) => ({ ...prev, ratingCount: val }))}
              autoComplete="off"
              type="number"
              placeholder="120"
            />
          </FormLayout.Group>
        </FormLayout>
      </Modal.Section>
    </Modal>
  );
}