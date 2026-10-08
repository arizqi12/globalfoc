import { useEffect, useState, useRef } from "react";
import { Routes, Route, Link, useParams } from "react-router-dom";

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------
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

interface AdsterraBannerProps {
  atKey: string;
  height?: number;
  width?: number;
}

// ----------------------------------------------------------------------
// KOMPONEN IKLAN ADSTERRA (BANNER)
// ----------------------------------------------------------------------
function AdsterraBanner({
  atKey,
  height = 90,
  width = 728,
}: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // Clean up container
    bannerRef.current.innerHTML = "";

    const confScript = document.createElement("script");
    confScript.type = "text/javascript";
    confScript.text = `
      atOptions = {
        'key' : '${atKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `;

    const adScript = document.createElement("script");
    adScript.type = "text/javascript";
    adScript.src = `//www.highperformanceformat.com/${atKey}/invoke.js`;

    bannerRef.current.appendChild(confScript);
    bannerRef.current.appendChild(adScript);
  }, [atKey, height, width]);

  return (
    <div className="my-6 flex justify-center items-center overflow-hidden bg-slate-100 p-2 rounded-xl border border-dashed border-slate-300 min-h-[100px]">
      <div ref={bannerRef} />
    </div>
  );
}

// ----------------------------------------------------------------------
// 1. HALAMAN UTAMA (HOME / BLOG FEED)
// ----------------------------------------------------------------------
function HomePage({
  events,
  loading,
}: {
  events: EventItem[];
  loading: boolean;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Memuat artikel & event...
      </div>
    );
  }

  const categories = ["All", "Concert", "Festival", "Trends"];
  const filteredEvents =
    selectedCategory === "All"
      ? events
      : events.filter(
          (e) => e.category.toLowerCase() === selectedCategory.toLowerCase(),
        );

  const featuredPost = events.find((e) => e.featured) || events[0];
  const regularPosts = filteredEvents.filter((e) => e.id !== featuredPost?.id);

  return (
    <div className="space-y-8">
      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-200 text-sm">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full font-medium transition-all ${
              selectedCategory === cat
                ? "bg-indigo-600 text-white shadow-xs"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Article (Hero Section) */}
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
                className="hover:text-indigo-600 transition-colors"
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

      {/* Slot Iklan Banner Adsterra (Ganti KEY_ADSTERRA dengan key milikmu) */}
      <AdsterraBanner
        atKey="8157ab8b546ad933d958680a417a9cc4"
        height={90}
        width={728}
      />

      {/* Grid Articles Section */}
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
                    className="hover:text-indigo-600 transition-colors"
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

// ----------------------------------------------------------------------
// 2. HALAMAN DETAIL ARTIKEL (TARGET SEO)
// ----------------------------------------------------------------------
function DetailPage({ events }: { events: EventItem[] }) {
  const { slug } = useParams();
  const post = events.find((e) => e.slug === slug);

  if (!post) {
    return (
      <div className="p-12 text-center text-slate-500">
        Artikel tidak ditemukan.{" "}
        <Link to="/" className="text-indigo-600 underline">
          Kembali ke beranda
        </Link>
      </div>
    );
  }

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
        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 border-y border-slate-100 py-3">
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

      {/* Slot Iklan Banner Tengah Artikel */}
      <AdsterraBanner
        atKey="YOUR_ADSTERRA_BANNER_KEY"
        height={90}
        width={728}
      />

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

// ----------------------------------------------------------------------
// 3. MAIN APP ROUTER
// ----------------------------------------------------------------------
export default function App() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/events.json")
      .then((res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then((data: EventItem[]) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load events:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-black tracking-tight text-indigo-600"
          >
            GlobalFoc<span className="text-slate-900">.</span>
          </Link>
          <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full border border-indigo-200">
            Global Hub
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Routes>
          <Route
            path="/"
            element={<HomePage events={events} loading={loading} />}
          />
          <Route path="/event/:slug" element={<DetailPage events={events} />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        © 2026 GlobalFoc. Your Everyday Hub for Events, Trends & Insights.
      </footer>
    </div>
  );
}
