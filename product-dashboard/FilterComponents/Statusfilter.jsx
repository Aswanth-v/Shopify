// "use client";

// export function ProductFilters({ selectedStatus, setSelectedStatus }) {
//   const statuses = ["All", "Active", "Draft", "Archived"];

//   return (
//     <div className="flex gap-2.5 mb-3">
//       {statuses.map((status) => (
//         <button
//           key={status}
//           onClick={() => setSelectedStatus(status)}
//           className={`px-3 py-1.5 rounded-md border transition-colors cursor-pointer
//             ${
//               selectedStatus === status
//                 ? "bg-black text-white border-black"
//                 : "bg-white text-black border-gray-300 hover:bg-gray-100"
//             }`}
//         >
//           {status}
//         </button>
//       ))}
//     </div>
//   );
// }

// export function SearchFilters({ search, setSearch }) {
//   return (
//     <div className="mb-3">
//       <input
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Search products by name..."
//         className="px-2.5 py-2 border border-gray-300 rounded-md w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-black/20"
//       />
//     </div>
//   );
// }