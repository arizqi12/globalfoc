export function getPostUrl(post: { category: string; slug: string }): string {
  if (!post || !post.category) return "#";

  const cat = post.category.toLowerCase();

  // Routing untuk Event / Acara
  if (["concert", "festival", "event"].includes(cat)) {
    return `/event/${post.slug}`;
  }

  // Routing untuk Berita & Kontroversi / Viral
  if (["news", "viral", "trends", "hot"].includes(cat)) {
    return `/news/${post.slug}`;
  }

  // Default Routing untuk Artikel Umum
  return `/article/${post.slug}`;
}
