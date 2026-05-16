export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  rating: Rating;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  address: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
}