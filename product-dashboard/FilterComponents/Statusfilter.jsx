"use client";

export function ProductFilters({
  selectedStatus,
  setSelectedStatus,
}) {
  const statuses = ["All", "Active", "Draft", "Archived"];

  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
      {statuses.map((status) => (
        <button
          key={status}
          onClick={() => setSelectedStatus(status)}
          style={{
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #ccc",
            background: selectedStatus === status ? "#111" : "#fff",
            color: selectedStatus === status ? "#fff" : "#000",
            cursor: "pointer",
          }}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export  function SearchFilters({
  search,
  setSearch,
  status,
  setStatus,
}) {
  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search products..."
      />

      {["All", "Active", "Draft", "Archived"].map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          style={{
            fontWeight: status === s ? "bold" : "normal",
          }}
        >
          {s}
        </button>
      ))}
    </>
  );
}