"use client";

import { useState, useCallback } from "react";
import { Popover, Button, ChoiceList, Card } from "@shopify/polaris";

interface Props {
  selectedCategories: string[];
  setSelectedCategories: (val: string[]) => void;
}

const categories = [
  { label: "Clothes", value: "clothes" },
  { label: "Accessories", value: "accessories" },
  { label: "Electronics", value: "electronics" },
];

export default function CategoryFilter({
  selectedCategories = [], // ✅ prevents runtime crash
  setSelectedCategories,
}: Props) {
  const [active, setActive] = useState(false);

  const togglePopover = useCallback(() => {
    setActive((v) => !v);
  }, []);

  return (
    <Popover
      active={active}
      activator={
        <Button onClick={togglePopover}>
          Category{" "}
          {selectedCategories?.length > 0
            ? `(${selectedCategories.length})`
            : ""}
        </Button>
      }
      onClose={() => setActive(false)}
    >
      <Card>
        <div style={{ padding: 12, width: 220 }}>
          <ChoiceList
            title="Categories"
            titleHidden
            allowMultiple
            choices={categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        </div>
      </Card>
    </Popover>
  );
}