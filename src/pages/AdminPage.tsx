import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface EventItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  date: string;
  location: string;
  price: string;
  image: string;
  official_link?: string;
  featured?: boolean;
}

export default function AdminPage() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // State untuk melacak mode Edit (null = Mode Tambah Baru)
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form States
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("Concert");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [officialLink, setOfficialLink] = useState("");
  const [featured, setFeatured] = useState(false);

  // 1. Cek Sesi Login Admin
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
      } else {
        setCheckingAuth(false);
        fetchEvents();
      }
    });
  }, [navigate]);

  // 2. Fetch Data Artikel/Event dari Supabase
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setEvents(data);
    } else if (error) {
      console.error("Error fetching events:", error);
    }
  };

  // 3. Auto Generate Slug dari Judul (Hanya aktif saat tambah baru / edit manual)
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      const generatedSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
      setSlug(generatedSlug);
    }
  };

  // 4. Reset Form ke Kondisi Awal
  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("Concert");
    setExcerpt("");
    setContent("");
    setDate("");
    setLocation("");
    setPrice("");
    setImage("");
    setOfficialLink("");
    setFeatured(false);
  };

  // 5. Trigger Edit (Isi Form dengan Data Artikel yang Dipilih)
  const handleStartEdit = (item: EventItem) => {
    setEditingId(item.id);
    setTitle(item.title);
    setSlug(item.slug);
    setCategory(item.category || "Concert");
    setExcerpt(item.excerpt || "");
    setContent(item.content || "");
    setDate(item.date || "");
    setLocation(item.location || "");
    setPrice(item.price || "");
    setImage(item.image || "");
    setOfficialLink(item.official_link || "");
    setFeatured(!!item.featured);
    setMsg("");

    // Scroll halus ke atas menuju form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 6. Submit Handler (Tambah Baru atau Update Artikel)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const eventPayload = {
      title,
      slug,
      category,
      excerpt,
      content,
      date,
      location,
      price,
      image,
      official_link: officialLink,
      featured,
    };

    if (editingId) {
      // --- MODE EDIT (UPDATE) ---
      const { error } = await supabase
        .from("events")
        .update(eventPayload)
        .eq("id", editingId);

      if (error) {
        console.error(error);
        setMsg(`❌ Gagal memperbarui data: ${error.message}`);
      } else {
        setMsg("✅ Artikel berhasil diperbarui!");
        resetForm();
        fetchEvents();
      }
    } else {
      // --- MODE TAMBAH BARU (INSERT) ---
      const { error } = await supabase.from("events").insert([eventPayload]);

      if (error) {
        console.error(error);
        setMsg(`❌ Gagal menambah data: ${error.message}`);
      } else {
        setMsg("✅ Artikel berhasil dipublikasikan ke database!");
        resetForm();
        fetchEvents();
      }
    }
    setLoading(false);
  };

  // 7. Delete Handler
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini dari database?")) return;

    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      if (editingId === id) resetForm();
      fetchEvents();
    } else {
      alert(`Gagal hapus data: ${error.message}`);
    }
  };

  // 8. Logout Handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  if (checkingAuth) {
    return (
      <div className="p-12 text-center text-sm text-slate-500 font-medium">
        Memeriksa hak akses...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-8">
      {/* Header Admin */}
      <div className="flex justify-between items-center border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Kelola artikel, berita, dan event GlobalFoc
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="text-xs font-semibold text-indigo-600 hover:underline border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
          >
            &larr; Lihat Web Utama
          </Link>
          <button
            onClick={handleLogout}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div
          className={`p-3 rounded-xl text-sm font-medium ${
            msg.startsWith("✅")
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {msg}
        </div>
      )}

      {/* Form Input / Edit Artikel */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4"
      >
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h2 className="text-lg font-bold text-slate-800">
            {editingId ? "Edit Artikel" : "Tambah Artikel / Event Baru"}
          </h2>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs font-semibold text-rose-600 hover:underline"
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Judul Artikel
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Jadwal & Harga Tiket SEVENTEEN Jakarta 2026"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              URL Slug
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 text-slate-600 outline-hidden"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Kategori Artikel
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value="News">News (Berita Terkini)</option>
              <option value="Viral">Viral (Kontroversi / Hot Topic)</option>
              <option value="Concert">Concert (Konser Musik)</option>
              <option value="Festival">Festival (Musik & Acara)</option>
              <option value="Trends">Trends (Hiburan & Pop Culture)</option>
              <option value="Lifestyle">
                Lifestyle (Olahraga & Gaya Hidup)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Tanggal Event
            </label>
            <input
              type="text"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="15 Nov 2026 / 15-17 Nov 2026"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estimasi Harga Tiket
            </label>
            <input
              type="text"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Rp 1.500.000 - Rp 3.800.000"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Lokasi / Venue
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="GBK Madya Stadium, Jakarta"
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              URL Gambar (Cover Image)
            </label>
            <input
              type="url"
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Ringkasan Singkat (Excerpt)
          </label>
          <input
            type="text"
            required
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="Ringkasan 1-2 kalimat untuk preview di beranda..."
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">
            Isi Artikel Lengkap (Content / Paragraf Deskripsi)
          </label>
          <textarea
            rows={5}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tulis deskripsi lengkap, rincian seatplan, syarat & ketentuan, panduan war tiket..."
            className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Link Official War Tiket (Opsional)
            </label>
            <input
              type="url"
              value={officialLink}
              onChange={(e) => setOfficialLink(e.target.value)}
              placeholder="https://..."
              className="w-full text-sm border border-slate-300 rounded-lg p-2.5 outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 pt-4">
            <input
              type="checkbox"
              id="featured"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-xs border-slate-300"
            />
            <label
              htmlFor="featured"
              className="text-xs font-medium text-slate-700"
            >
              Jadikan Artikel Utama / Featured (Headline Home)
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 font-bold py-3 rounded-xl text-sm transition-all shadow-xs disabled:opacity-50 text-white ${
              editingId
                ? "bg-amber-600 hover:bg-amber-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loading
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan Artikel"
                : "Publish Artikel ke Database"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-4 py-3 rounded-xl text-sm transition-colors"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* Tabel Data Artikel */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800 text-sm">
            Daftar Artikel di Database ({events.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200">
                <th className="p-3">Judul</th>
                <th className="p-3">Kategori</th>
                <th className="p-3">Tanggal</th>
                <th className="p-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-900">{e.title}</td>
                  <td className="p-3">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500">{e.date}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      onClick={() => handleStartEdit(e)}
                      className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-2.5 py-1 rounded font-semibold transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e.id)}
                      className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2.5 py-1 rounded font-semibold transition-colors"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
