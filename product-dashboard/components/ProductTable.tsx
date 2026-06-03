"use client";

import { useMemo, useState } from "react";
import {
  Page,
  Card,
  Tabs,
  IndexTable,
  Badge,
  Button,
  Popover,
  ActionList,
  TextField,
  BlockStack,
  InlineStack,
} from "@shopify/polaris";

import type { Product } from "@/types/Product";
import CategoryFilter from "@/FilterComponents/Category";
import { MoreFiltersSheet } from "@/FilterComponents/MoreFilter";

interface Props {
  products: Product[];
  onSelect: (product: Product) => void;
}

const statuses = ["Active", "Draft", "Archived"];
const vendors = ["Company 123", "Rustic LTD", "partners-demo", "Boring Rock"];

/* CATEGORY NORMALIZER */
const getCategoryKey = (category: string) => {
  const c = category.toLowerCase();

  if (
    c.includes("clothing") ||
    c.includes("shirt") ||
    c.includes("men") ||
    c.includes("women")
  ) {
    return "clothes";
  }

  if (c.includes("jewelery") || c.includes("accessory") || c.includes("bag")) {
    return "accessories";
  }

  if (c.includes("electronic")) {
    return "electronics";
  }

  return "clothes";
};

export default function ProductTable({ products, onSelect }: Props) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [search, setSearch] = useState("");
  const [moreActive, setMoreActive] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  const [moreFilterOpen, setMoreFilterOpen] = useState(false);

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

  /* FORMATTED DATA */
  const formatted = useMemo(() => {
    return (products || []).map((p) => ({
      ...p,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      vendor: vendors[Math.floor(Math.random() * vendors.length)],
      inventory:
        Math.random() > 0.3
          ? Math.floor(Math.random() * 2000)
          : -Math.floor(Math.random() * 200),
      categoryKey: getCategoryKey(p.category),
    }));
  }, [products]);

  /* FILTER LOGIC */
  const filtered = useMemo(() => {
    let data = formatted;

    // SEARCH
    if (search) {
      data = data.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // TABS
    if (selectedTab === 1) data = data.filter((p) => p.status === "Active");
    if (selectedTab === 2) data = data.filter((p) => p.status === "Draft");
    if (selectedTab === 3) data = data.filter((p) => p.status === "Archived");

    // CATEGORY
    if (selectedCategories.length > 0) {
      data = data.filter((p) =>
        selectedCategories.includes(p.categoryKey),
      );
    }

    // VENDOR
    if (selectedVendors.length > 0) {
      data = data.filter((p) =>
        selectedVendors.includes(p.vendor),
      );
    }

    return data;
  }, [formatted, search, selectedTab, selectedCategories, selectedVendors]);

  return (
    <Page title="Products" primaryAction={<Button>Add product</Button>}>
      {/* ACTION BAR */}
      <Card>
        <InlineStack align="space-between" gap="300" wrap>
          <InlineStack gap="200" wrap>
            <Button onClick={() => console.log("export")}>Export</Button>
            <Button onClick={() => console.log("import")}>Import</Button>

            <Popover
              active={moreActive}
              activator={
                <Button onClick={() => setMoreActive(!moreActive)}>
                  More
                </Button>
              }
              onClose={() => setMoreActive(false)}
            >
              <ActionList items={moreOptions} />
            </Popover>
          </InlineStack>
        </InlineStack>
      </Card>

      <BlockStack gap="400">
        {/* TABS */}
        <Card>
          <Tabs tabs={tabs} selected={selectedTab} onSelect={setSelectedTab} />
        </Card>

        {/* SEARCH + FILTERS (RESPONSIVE) */}
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between" gap="300" wrap>
              
              {/* SEARCH */}
              <div style={{ flex: 1, minWidth: 220 }}>
                <TextField
                  labelHidden
                  label="Search"
                  placeholder="Search products..."
                  value={search}
                  onChange={setSearch}
                  autoComplete="off"
                />
              </div>

              {/* CATEGORY */}
              <div style={{ minWidth: 160 }}>
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                />
              </div>

              {/* MORE FILTERS */}
              <div style={{ minWidth: 160 }}>
                <Button fullWidth onClick={() => setMoreFilterOpen(true)}>
                  More Filters
                </Button>
              </div>

            </InlineStack>
          </BlockStack>
        </Card>

        {/* TABLE */}
        <Card>
          <div style={{ overflowX: "auto" }}>
            <IndexTable
              resourceName={{ singular: "product", plural: "products" }}
              itemCount={filtered.length}
              selectable={false}
              headings={[
                { title: "Product" },
                { title: "Status" },
                { title: "Inventory" },
                { title: "Type" },
                { title: "Vendor" },
              ]}
            >
              {filtered.map((p, i) => (
                <IndexTable.Row
                  id={String(p.id)}
                  key={p.id}
                  position={i}
                  onClick={() => onSelect(p)}
                >
                  <IndexTable.Cell>
                    <InlineStack gap="200">
                      <img
                        src={p.image}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: "cover",
                          borderRadius: 6,
                        }}
                      />
                      {p.title.trim().substring(0, 15) + "..."}
                    </InlineStack>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <Badge
                      tone={
                        p.status === "Active"
                          ? "success"
                          : p.status === "Draft"
                          ? "attention"
                          : "info"
                      }
                    >
                      {p.status}
                    </Badge>
                  </IndexTable.Cell>

                  <IndexTable.Cell>
                    <span style={{ color: p.inventory < 0 ? "red" : "inherit" }}>
                      {p.inventory}
                    </span>
                  </IndexTable.Cell>

                  <IndexTable.Cell>{p.category}</IndexTable.Cell>
                  <IndexTable.Cell>{p.vendor}</IndexTable.Cell>
                </IndexTable.Row>
              ))}
            </IndexTable>
          </div>
        </Card>
      </BlockStack>

      {/* FILTER SHEET */}
      <MoreFiltersSheet
        open={moreFilterOpen}
        setOpen={setMoreFilterOpen}
        vendors={vendors}
        selectedVendors={selectedVendors}
        setSelectedVendors={setSelectedVendors}
      />
    </Page>
  );
}