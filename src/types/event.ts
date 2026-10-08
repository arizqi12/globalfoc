export interface EventItem {
  id: string;
  created_at?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string; // Isi deskripsi lengkap
  date: string;
  location: string;
  price: string;
  image: string;
  official_link?: string;
  featured?: boolean;
}
