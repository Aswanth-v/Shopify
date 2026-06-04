"use client";

import { useState } from "react";
import { Card, Button } from "@shopify/polaris";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;

  vendors: string[];
  selectedVendors: string[];
  setSelectedVendors: (v: string[]) => void;
}

export function MoreFiltersSheet({
  open,
  setOpen,
  vendors,
  selectedVendors,
  setSelectedVendors,
}: Props) {
  const [vendorOpen, setVendorOpen] = useState(false);

  const toggleVendor = (vendor: string) => {
    if (selectedVendors.includes(vendor)) {
      setSelectedVendors(selectedVendors.filter((v) => v !== vendor));
    } else {
      setSelectedVendors([...selectedVendors, vendor]);
    }
  };

  return (
    <>
      {/* BACKDROP */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}

      {/* RIGHT SHEET */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: 360,
          height: "100%",
          background: "white",
          zIndex: 1000,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "0.25s ease",
          padding: 16,
        }}
      >
        <h3 style={{ marginBottom: 16 }}>More Filters</h3>

        {/* 🔽 VENDOR ACCORDION */}
        <div>
          <button
            onClick={() => setVendorOpen(!vendorOpen)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: "#fff",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 500,
            }}
          >
            <span>
              Vendors{" "}
              {selectedVendors.length > 0 ? `(${selectedVendors.length})` : ""}
            </span>
            <span>{vendorOpen ? "▲" : "▼"}</span>
          </button>
          
          <div
            style={{
              maxHeight: vendorOpen ? 200 : 0,
              overflow: "hidden",
              transition: "max-height 0.3s ease",
            }}
          >
            <Card>
              <div
                style={{
                  padding: 10,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {vendors.map((vendor) => (
                  <label
                    key={vendor}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor)}
                      onChange={() => toggleVendor(vendor)}
                    />
                    {vendor}
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button onClick={() => setSelectedVendors([])}>Clear</Button>
          <Button onClick={() => setOpen(false)}>Apply</Button>
        </div>
      </div>
    </>
  );
}
