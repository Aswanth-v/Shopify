"use client";

import { Modal, Card, ChoiceList } from "@shopify/polaris";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;

  vendors: string[];
  selectedVendors: string[];
  setSelectedVendors: (v: string[]) => void;
}

export  function MoreFiltersSheet({
  open,
  setOpen,
  vendors,
  selectedVendors,
  setSelectedVendors,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      title="More Filters"
      primaryAction={{
        content: "Apply",
        onAction: () => setOpen(false),
      }}
      secondaryActions={[
        {
          content: "Clear",
          onAction: () => setSelectedVendors([]),
        },
      ]}
    >
      <Modal.Section>
        <Card>
          <ChoiceList
            title="Vendors"
            titleHidden
            allowMultiple
            choices={vendors.map((v) => ({
              label: v,
              value: v,
            }))}
            selected={selectedVendors}
            onChange={setSelectedVendors}
          />
        </Card>
      </Modal.Section>
    </Modal>
  );
}