export interface ProductSpec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categoryName: string;
  price: string;
  sku: string;
  featured: boolean;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  materialGrade: string;
  specs: ProductSpec[];
  related: string[];
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
}

export interface Client {
  name: string;
  logo: string;
}
