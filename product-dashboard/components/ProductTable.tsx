"use client";

import { useMemo, useState, useRef } from "react";
import {
  Page,
  Card,
  Tabs,
  IndexTable,
  Badge,
  Button,
  TextField,
  BlockStack,
  InlineStack,
  Text,
  EmptyState,
  Icon,
} from "@shopify/polaris";
import { SearchIcon, FilterIcon } from "@shopify/polaris-icons";
import type { Product, FormattedProduct } from "@/types/Product";
import CategoryFilter from "@/FilterComponents/Category";
import { MoreFiltersSheet } from "@/FilterComponents/MoreFilter";
import { exportToCsv, importCsv } from "../utils/ExportsCvs";
import AddProductModal from "../components/AddProduct"; // ✅ new import

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

const statuses = ["Active", "Draft", "Archived"];
const vendors = ["Company 123", "Rustic LTD", "partners-demo", "Boring Rock"];

const getCategoryKey = (category: string) => {
  const c = (category || "").toLowerCase();
  if (
    c.includes("clothing") ||
    c.includes("shirt") ||
    c.includes("men") ||
    c.includes("women")
  )
    return "clothes";
  if (c.includes("jewelery") || c.includes("accessory") || c.includes("bag"))
    return "accessories";
  if (c.includes("electronic")) return "electronics";
  return "clothes";
};

const statusTone = (status: string) => {
  if (status === "Active") return "success";
  if (status === "Draft") return "attention";
  return "info";
};

export default function ProductTable({ products, onSelect }: Props) {
  const [importedProducts, setImportedProducts] = useState<Product[]>([]);
  const [manualProducts, setManualProducts] = useState<Product[]>([]); // ✅ new
  const [addModalOpen, setAddModalOpen] = useState(false);             // ✅ new
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const tabs = [
    { id: "all", content: "All" },
    { id: "active", content: "Active" },
    { id: "draft", content: "Draft" },
    { id: "archived", content: "Archived" },
  ];

  const moreOptions = [
    { content: "Option A", onAction: () => console.log("A") },
    { content: "Option B", onAction: () => console.log("B") },
  ];

  // ✅ Merge all 3 sources: API + imported CSV + manually added
  const allProducts = useMemo(() => {
    const maxId =
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.id)))
        : 0;

    const reIndexedImports = importedProducts.map((p, i) => ({
      ...p,
      id: maxId + i + 1,
    }));

    // manualProducts already have unique IDs generated inside the modal
    return [...products, ...reIndexedImports, ...manualProducts];
  }, [products, importedProducts, manualProducts]);

  const formatted = useMemo((): FormattedProduct[] => {
    return allProducts.map((p) => {
      const id = Number(p.id) || 0;
      return {
        ...p,
        id,
        price: Number(p.price) || 0,
        rating: {
          rate: Number(p.rating?.rate) || 0,
          count: Number(p.rating?.count) || 0,
        },
        status: statuses[id % statuses.length],
        vendor: vendors[id % vendors.length],
        inventory:
          id % 3 === 0
            ? -Math.floor(id * 7)
            : Math.floor((Number(p.rating?.count) || 0) / 2),
        categoryKey: getCategoryKey(p.category || ""),
      };
    });
  }, [allProducts]);

  const filtered = useMemo(() => {
    let data = formatted;
    if (search)
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    if (selectedTab === 1) data = data.filter((p) => p.status === "Active");
    if (selectedTab === 2) data = data.filter((p) => p.status === "Draft");
    if (selectedTab === 3) data = data.filter((p) => p.status === "Archived");
    if (selectedCategories.length > 0)
      data = data.filter((p) => selectedCategories.includes(p.categoryKey));
    if (selectedVendors.length > 0)
      data = data.filter((p) => selectedVendors.includes(p.vendor));
    return data;
  }, [formatted, search, selectedTab, selectedCategories, selectedVendors]);

  const activeFiltersCount = selectedCategories.length + selectedVendors.length;

  // ✅ Called by modal when user submits the form
  const handleAddProduct = (product: Product) => {
    setManualProducts((prev) => [...prev, product]);
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = importCsv(text);
      setImportedProducts((prev) => [...prev, ...(data as Product[])]);
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <Page
      title="Products"
      subtitle={`${filtered.length} products`}
      primaryAction={
        // ✅ Now opens the modal instead of doing nothing
        <Button
          variant="primary"
          tone="success"
          onClick={() => setAddModalOpen(true)}
        >
          Add product
        </Button>
      }
      secondaryActions={[
        {
          content: "Export",
          onAction: () => exportToCsv(filtered, "products"),
        },
        {
          content: "Import",
          onAction: () => fileInputRef.current?.click(),
        },
      ]}
      actionGroups={[
        {
          title: "More",
          actions: moreOptions,
        },
      ]}
    >
      <BlockStack gap="400">
        {/* TABS */}
        <Card padding="0">
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
        </Card>

        {/* SEARCH + FILTERS */}
        <Card>
          <InlineStack align="space-between" gap="300" wrap blockAlign="center">
            <div style={{ flex: 1, minWidth: 240 }}>
              <TextField
                labelHidden
                label="Search"
                placeholder="Search products..."
                value={search}
                onChange={setSearch}
                autoComplete="off"
                prefix={<Icon source={SearchIcon} />}
                clearButton
                onClearButtonClick={() => setSearch("")}
              />
            </div>
            <InlineStack gap="200">
              <div style={{ minWidth: 160 }}>
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>
              <Button onClick={() => setMoreFilterOpen(true)} icon={FilterIcon}>
                Filters{" "}
                {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ""}
              </Button>
            </InlineStack>
          </InlineStack>
        </Card>

        {/* TABLE */}
        <Card padding="0">
          {filtered.length === 0 ? (
            <EmptyState
              heading="No products found"
              image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
            >
              <Text as="p" tone="subdued">
                Try adjusting your search or filters.
              </Text>
            </EmptyState>
          ) : (
            <IndexTable
              resourceName={{ singular: "product", plural: "products" }}
              itemCount={filtered.length}
              selectable={false}
              headings={[
                { title: "Product" },
                { title: "Status" },
                { title: "Inventory" },
                { title: "Category" },
                { title: "Vendor" },
                { title: "Price" },
              ]}
            >
              {filtered.map((p, i) => (
                <IndexTable.Row
                  id={`product-${i}`}
                  key={`product-${i}`}
                  position={i}
                  onClick={() => onSelect(p)}
                >
                  <IndexTable.Cell>
                    <InlineStack gap="300" blockAlign="center">
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          overflow: "hidden",
                          border: "1px solid #e1e3e5",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            padding: 4,
                          }}
                        />
                      </div>
                      <BlockStack gap="050">
                        <Text as="span" variant="bodySm" fontWeight="semibold">
                          {p.title.length > 30
                            ? p.title.substring(0,15) + "…"
                            : p.title}
                        </Text>
                        <Text as="span" variant="bodySm" tone="subdued">
                          ⭐ {p.rating.rate} ({p.rating.count})
                        </Text>
                      </BlockStack>
                    </InlineStack>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Badge tone={statusTone(p.status)}>{p.status}</Badge>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Text
                      as="span"
                      variant="bodySm"
                      tone={
                        p.inventory < 0
                          ? "critical"
                          : p.inventory < 10
                            ? "caution"
                            : "success"
                      }
                      fontWeight={p.inventory < 0 ? "semibold" : "regular"}
                    >
                      {p.inventory < 0
                        ? `${p.inventory} oversold`
                        : `${p.inventory} in stock`}
                    </Text>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Badge tone="info">{p.category}</Badge>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Text as="span" variant="bodySm" tone="subdued">
                      {p.vendor}
                    </Text>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Text as="span" variant="bodySm" fontWeight="semibold">
                      ${p.price}
                    </Text>
                  </IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          )}
        </Card>
      </BlockStack>

      <MoreFiltersSheet
        open={moreFilterOpen}
        setOpen={setMoreFilterOpen}
        vendors={vendors}
        selectedVendors={selectedVendors}
        setSelectedVendors={setSelectedVendors}
      />

      {/* ✅ Add Product Modal */}
      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddProduct}
        existingIds={allProducts.map((p) => p.id)}
      />

      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </Page>
  );
}