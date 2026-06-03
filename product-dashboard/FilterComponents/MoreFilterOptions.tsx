// "use client";

// import { useState } from "react";
// import { Popover, Button, ChoiceList } from "@shopify/polaris";

// const categories = [
//   { label: "Electronics", value: "electronics" },
//   { label: "Jewelery", value: "jewelery" },
//   { label: "Men's Clothing", value: "men's clothing" },
//   { label: "Women's Clothing", value: "women's clothing" },
// ];
// interface Props {
//   selectedCategories: string[];
//   setSelectedCategories: (val: string[]) => void;
// }
// export  function CategoryFilter({
//   selectedCategories,
//   setSelectedCategories,
// }: Props) {
//   const [active, setActive] = useState(false);

//   return (
//     <div className="w-full max-w-xs flex justify-end">
//       <Popover
//         active={active}
//         activator={
//           <button
//             onClick={() => setActive(!active)}
//             className="
//               w-auto px-3 py-2
//               border border-gray-300 rounded-md
//               text-left bg-white
//               flex justify-between items-center
//               focus:outline-none focus:ring-2 focus:ring-black/20
              
//             "
//           >
//             <span>
//               {selectedCategories.length > 0
//                 ? `Category (${selectedCategories.length})`
//                 : "Filter category"}
//             </span>

//             <span>▾</span>
//           </button>
//         }
//         onClose={() => setActive(false)}
//       >
//         <div className="p-3 w-56">
//           <ChoiceList
//             title="Category"
//             titleHidden
//             choices={categories}
//             selected={selectedCategories}
//             onChange={setSelectedCategories}
//             allowMultiple
//           />
//         </div>
//       </Popover>
//     </div>
//   );
// }