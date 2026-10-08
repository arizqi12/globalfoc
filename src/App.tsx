import { useEffect, useState } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  location: string;
  price: string;
  image: string;
  excerpt: string;
  featured?: boolean;
}

// 1. HALAMAN UTAMA (BLOG FEED STYLE)
function HomePage({
  events,
  loading,
}: {
  events: EventItem[];
  loading: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (loading)
    return (
      <div className="p-12 text-center text-slate-500">Memuat artikel...</div>
    );

  const categories = ["All", "Concert", "Festival", "Trends"];
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter((e) => e.category === selectedCategory);

  const featuredPost = events.find((e) => e.featured) || events[0];
  const regularPosts = filteredEvents.filter((e) => e.id !== featuredPost?.id);

  return (
    <div className="space-y-8">
      {/* Category Pills Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Headline Post (Hero Article) */}
      {featuredPost && selectedCategory === "All" && (
        <article className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs grid md:grid-cols-2 gap-6 items-center">
          <div className="h-64 md:h-full w-full overflow-hidden">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full font-semibold">
                {featuredPost.category}
              </span>
              <span className="text-xs text-slate-400">• Featured</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-snug">
              <Link
                to={`/event/${featuredPost.slug}`}
                className="hover:text-indigo-600"
              >
                {featuredPost.title}
              </Link>
            </h2>
            <p className="text-slate-600 text-sm line-clamp-2">
              {featuredPost.excerpt}
            </p>
            <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
              <span>📍 {featuredPost.location}</span>
              <Link
                to={`/event/${featuredPost.slug}`}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Read Article &rarr;
              </Link>
            </div>
          </div>
        </article>
      )}

      {/* Banner Iklan Tengah */}
      <div className="p-3 bg-slate-200 border border-dashed border-slate-400 rounded-lg text-center text-xs text-slate-600">
        [ Slot Iklan Banner - Monetag / Adsterra ]
      </div>

      {/* Grid Cards (3 Kolom/Responsif HP) */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {regularPosts.map((post) => (
          <article
            key={post.id}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              <div className="h-44 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4 space-y-2">
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                  {post.category}
                </span>
                <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
                  <Link
                    to={`/event/${post.slug}`}
                    className="hover:text-indigo-600"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-slate-500 text-xs line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
              <span>{post.date}</span>
              <Link
                to={`/event/${post.slug}`}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Read &rarr;
              </Link>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

// 2. HALAMAN DETAIL ARTIKEL / BLOG
function DetailPage({ events }: { events: EventItem[] }) {
  const { slug } = useParams();
  const post = events.find((e) => e.slug === slug);

  if (!post)
    return (
      <div className="p-8 text-center text-slate-500">
        Artikel tidak ditemukan.
      </div>
    );

  return (
    <article className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 space-y-6 max-w-3xl mx-auto shadow-2xs">
      <Link
        to="/"
        className="text-xs text-indigo-600 font-semibold hover:underline"
      >
        &larr; Kembali ke Beranda
      </Link>

      <header className="space-y-3">
        <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-semibold border border-indigo-200">
          {post.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
          <span>🗓️ {post.date}</span>
          <span>📍 {post.location}</span>
          <span>💰 {post.price}</span>
        </div>
      </header>

      <div className="rounded-xl overflow-hidden h-72 md:h-96 w-full">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Area Banner Iklan Dalam Artikel */}
      <div className="p-3 bg-slate-100 border border-dashed border-slate-300 rounded text-center text-xs text-slate-500">
        [ Slot Iklan Banner Tengah Artikel ]
      </div>

      <div className="prose prose-slate text-slate-700 text-sm leading-relaxed space-y-4">
        <p className="text-base font-medium text-slate-900">{post.excerpt}</p>
        <p>
          Informasi mengenai penjualan tiket resmi untuk{" "}
          <strong>{post.title}</strong> telah diperbarui. Penggemar disarankan
          untuk selalu memantau kanal resmi penjualan agar terhindar dari
          penipuan.
        </p>
        <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 space-y-2">
          <h4 className="font-bold text-indigo-900 text-sm">
            Ringkasan Event:
          </h4>
          <ul className="list-disc list-inside text-xs space-y-1 text-indigo-800">
            <li>
              <strong>Lokasi:</strong> {post.location}
            </li>
            <li>
              <strong>Estimasi Harga:</strong> {post.price}
            </li>
            <li>
              <strong>Tanggal Pelaksanaan:</strong> {post.date}
            </li>
          </ul>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <a
          href="https://google.com"
          target="_blank"
          rel="noreferrer"
          className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm shadow-sm transition-all"
        >
          Cek Official Link & War Tiket
        </a>
      </div>
    </article>
  );
}

// 3. MAIN WRAPPER
export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-indigo-600"
          >
            GlobalFoc<span className="text-slate-900">.</span>
          </Link>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
            Global Portal
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={<HomePage events={events} loading={loading} />}
          />
          <Route path="/event/:slug" element={<DetailPage events={events} />} />
        </Routes>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        © 2026 GlobalFoc. Everyday Hub for Events & Trends.
      </footer>
    </div>
  );
}
