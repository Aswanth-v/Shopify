// export interface Product {
//   id: number;
//   title: string;
//   price: number;
//   description: string;
//   category: string;
//   image: string;
// }
export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export interface AnalyticsEvent {
  id: string
  event: string
  product_id: number | null
  product_name: string | null
  product_category: string | null
  session_id: string
  created_at: string
}