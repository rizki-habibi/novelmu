"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, ChevronLeft, ChevronRight, Heart, Menu, Sparkles, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Chapter = {
  id: string;
  chapter_number: number;
  chapter_label: string;
  title: string;
  excerpt: string;
  content: string;
  mood: string;
};

type Story = {
  id: string;
  title: string;
  subtitle: string;
  author: string;
};

export default function Home() {
  const [story, setStory] = useState<Story | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function loadNovel() {
      const { data: storyData, error: storyError } = await supabase
        .from("novel_stories")
        .select("id,title,subtitle,author")
        .eq("slug", "perjalanan-rizki-habibi")
        .eq("status", "published")
        .single();

      if (storyError || !storyData) {
        setLoading(false);
        return;
      }

      const { data: chapterData } = await supabase
        .from("novel_chapters")
        .select("id,chapter_number,chapter_label,title,excerpt,content,mood")
        .eq("story_id", storyData.id)
        .eq("published", true)
        .order("sort_order", { ascending: true });

      setStory(storyData);
      setChapters(chapterData ?? []);
      setLoading(false);
    }

    loadNovel();
  }, []);

  const chapter = chapters[active];
  const progress = chapters.length ? ((active + 1) / chapters.length) * 100 : 0;

  const moodText = useMemo(() => {
    if (!chapter) return "";
    const map: Record<string, string> = {
      romantis: "sebuah bab tentang rasa yang tumbuh perlahan",
      sendu: "sebuah bab tentang jalan yang pernah terasa berat",
      reflektif: "sebuah bab untuk menatap kembali perjalanan",
      nostalgia: "sebuah bab yang mengingatkan rumah dan masa lalu",
      harapan: "sebuah bab tentang hari yang belum datang"
    };
    return map[chapter.mood] ?? "sebuah bab dari perjalanan yang terus berjalan";
  }, [chapter]);

  const go = (direction: number) => {
    setActive((current) => Math.min(Math.max(current + direction, 0), chapters.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="loading">
        <div className="loading-heart"><Heart size={28} fill="currentColor" /></div>
        <p>Membuka halaman cerita...</p>
      </main>
    );
  }

  if (!story || !chapter) {
    return (
      <main className="loading">
        <BookOpen size={36} />
        <p>Cerita belum tersedia.</p>
      </main>
    );
  }

  return (
    <main className="novel-shell">
      <div className="grain" />
      <header className="topbar">
        <button className="icon-btn mobile-only" onClick={() => setMenuOpen(true)} aria-label="Buka daftar bab">
          <Menu size={21} />
        </button>
        <a className="brand" href="#top">NOVELMU</a>
        <div className="topbar-meta">Rizki Habibi · Kisah Nyata</div>
        <div className="topbar-right">
          <span>{active + 1} / {chapters.length}</span>
          <div className="progress"><span style={{ width: progress + "%" }} /></div>
        </div>
      </header>

      <aside className={menuOpen ? "chapter-drawer open" : "chapter-drawer"}>
        <div className="drawer-head">
          <div>
            <small>DAFTAR BAB</small>
            <strong>Perjalanan</strong>
          </div>
          <button className="icon-btn" onClick={() => setMenuOpen(false)} aria-label="Tutup daftar bab"><X size={20} /></button>
        </div>
        <div className="chapter-list">
          {chapters.map((item, index) => (
            <button
              key={item.id}
              className={index === active ? "chapter-link active" : "chapter-link"}
              onClick={() => { setActive(index); setMenuOpen(false); }}
            >
              <span>{String(item.chapter_number).padStart(2, "0")}</span>
              <div>
                <small>{item.chapter_label}</small>
                <b>{item.title}</b>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <section id="top" className="hero">
        <div className="hero-glow" />
        <div className="hero-inner">
          <p className="eyebrow"><Sparkles size={14} /> SEBUAH NOVEL DIGITAL</p>
          <h1>{story.title}</h1>
          <p className="hero-subtitle">{story.subtitle}</p>
          <div className="author-line">
            <span className="line" />
            <span>ditulis oleh {story.author}</span>
            <span className="line" />
          </div>
          <div className="heart-seal"><Heart size={18} fill="currentColor" /></div>
        </div>
      </section>

      <section className="reading-layout">
        <nav className="desktop-chapters">
          <p>ISI CERITA</p>
          {chapters.map((item, index) => (
            <button
              key={item.id}
              className={index === active ? "side-link active" : "side-link"}
              onClick={() => setActive(index)}
            >
              <span>{String(item.chapter_number).padStart(2, "0")}</span>
              <em>{item.title}</em>
            </button>
          ))}
        </nav>

        <article className="chapter-card">
          <div className="chapter-top">
            <span>{chapter.chapter_label}</span>
            <span className="chapter-number">BAB {String(chapter.chapter_number).padStart(2, "0")}</span>
          </div>
          <p className="chapter-mood">{moodText}</p>
          <h2>{chapter.title}</h2>
          <p className="excerpt">{chapter.excerpt}</p>
          <div className="ornament"><span /><Heart size={15} fill="currentColor" /><span /></div>
          <div className="story-copy">
            {chapter.content.split(". ").map((sentence, index) => (
              <p key={index}>{sentence}{sentence.endsWith(".") ? "" : "."}</p>
            ))}
          </div>
          <div className="chapter-footer">
            <span>Rizki Habibi</span>
            <span>♥</span>
          </div>
          <div className="reader-nav">
            <button disabled={active === 0} onClick={() => go(-1)}><ChevronLeft size={18} /> Sebelumnya</button>
            <button disabled={active === chapters.length - 1} onClick={() => go(1)}>Berikutnya <ChevronRight size={18} /></button>
          </div>
        </article>
      </section>

      <footer className="footer">
        <Heart size={16} fill="currentColor" />
        <span>Cerita ini masih berjalan. Halaman terakhir belum ditulis.</span>
        <Heart size={16} fill="currentColor" />
      </footer>
    </main>
  );
}