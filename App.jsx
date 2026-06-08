import { useState, useRef } from "react";

// Every book of the Bible with chapter counts
const BOOKS = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36],
  ["Deuteronomy", 34], ["Joshua", 24], ["Judges", 21], ["Ruth", 4],
  ["1 Samuel", 31], ["2 Samuel", 24], ["1 Kings", 22], ["2 Kings", 25],
  ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10], ["Nehemiah", 13],
  ["Esther", 10], ["Job", 42], ["Psalms", 150], ["Proverbs", 31],
  ["Ecclesiastes", 12], ["Song of Solomon", 8], ["Isaiah", 66], ["Jeremiah", 52],
  ["Lamentations", 5], ["Ezekiel", 48], ["Daniel", 12], ["Hosea", 14],
  ["Joel", 3], ["Amos", 9], ["Obadiah", 1], ["Jonah", 4], ["Micah", 7],
  ["Nahum", 3], ["Habakkuk", 3], ["Zephaniah", 3], ["Haggai", 2],
  ["Zechariah", 14], ["Malachi", 4], ["Matthew", 28], ["Mark", 16],
  ["Luke", 24], ["John", 21], ["Acts", 28], ["Romans", 16],
  ["1 Corinthians", 16], ["2 Corinthians", 13], ["Galatians", 6],
  ["Ephesians", 6], ["Philippians", 4], ["Colossians", 4],
  ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6],
  ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1], ["Hebrews", 13],
  ["James", 5], ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5],
  ["2 John", 1], ["3 John", 1], ["Jude", 1], ["Revelation", 22],
];

// Verse counts per chapter (approximate, used for random picking)
const VERSE_COUNTS = {
  "Genesis": [31,25,24,26,32,22,24,22,29,32,32,20,18,24,21,16,27,33,38,18,34,24,20,67,34,35,46,22,35,43,55,32,20,31,29,43,36,30,23,23,57,38,34,34,28,34,31,22,33,26],
  "Psalms": [6,12,8,8,12,10,17,9,20,18,7,8,6,7,5,11,15,50,14,9,13,31,6,10,22,12,14,9,11,13,25,11,22,23,28,13,40,23,14,18,14,12,5,27,18,12,10,15,21,23,21,11,7,9,24,14,12,12,18,14,9,13,12,11,14,20,8,36,37,6,24,20,28,23,11,13,21,72,13,20,17,8,19,13,14,17,7,19,53,17,16,16,5,23,11,13,12,9,9,5,8,28,22,35,45,48,43,13,31,7,10,10,9,8,18,19,2,29,176,7,8,9,4,8,5,6,5,6,8,8,3,18,3,3,21,26,9,8,24,13,10,7,12,15,21,10,20,14,9,6],
};

function randomVerse() {
  const [book, chapters] = BOOKS[Math.floor(Math.random() * BOOKS.length)];
  const chapter = Math.floor(Math.random() * chapters) + 1;
  const maxVerse = (VERSE_COUNTS[book] && VERSE_COUNTS[book][chapter - 1]) || 20;
  const verse = Math.floor(Math.random() * maxVerse) + 1;
  return { book, chapter, verse, ref: `${book} ${chapter}:${verse}` };
}

async function fetchVerse(ref) {
  const url = `https://bible-api.com/${encodeURIComponent(ref)}?translation=kjv`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("API error");
  const data = await res.json();
  if (!data.text || data.text.trim() === "") throw new Error("Empty verse");
  return {
    ref: data.reference,
    text: data.text.trim().replace(/\s+/g, " "),
  };
}

// Icons
const HeartIcon = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const RefreshIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const XIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const S = {
  app: { maxWidth: 560, margin: "0 auto", padding: "1.25rem 1rem 4rem", minHeight: "100vh", fontFamily: "'Georgia', serif", background: "#f9f6f1", color: "#2c2318" },
  header: { textAlign: "center", paddingBottom: "1.25rem", borderBottom: "1px solid #e5ddd0", marginBottom: "1.25rem" },
  title: { fontSize: "1.55rem", fontWeight: 400, color: "#2c2318", letterSpacing: "0.02em", marginBottom: "0.15rem" },
  subtitle: { fontSize: "0.7rem", color: "#9a8e80", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "system-ui, sans-serif" },
  nav: { display: "flex", background: "#eee8df", borderRadius: 8, padding: 3, marginBottom: "1.25rem", gap: 2 },
  navBtn: (active) => ({ flex: 1, padding: "0.55rem", border: "none", background: active ? "#fff" : "transparent", fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", color: active ? "#2c2318" : "#9a8e80", cursor: "pointer", borderRadius: 6, fontWeight: active ? 500 : 400, boxShadow: active ? "0 1px 4px rgba(0,0,0,0.08)" : "none", transition: "all 0.18s" }),
  card: (fading) => ({ background: "#fff", borderRadius: 12, padding: "1.75rem 1.5rem", marginBottom: "1rem", boxShadow: "0 2px 12px rgba(44,35,24,0.07)", border: "1px solid #e5ddd0", minHeight: 200, display: "flex", flexDirection: "column", justifyContent: "center", opacity: fading ? 0.2 : 1, transition: "opacity 0.25s" }),
  ref: { fontFamily: "system-ui, sans-serif", fontSize: "0.7rem", fontWeight: 600, color: "#9a6b3a", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.9rem" },
  verseText: { fontSize: "1.15rem", lineHeight: 1.85, fontStyle: "italic", color: "#2c2318" },
  actions: { display: "flex", gap: "0.6rem", marginBottom: "0.75rem" },
  btnPrimary: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.45rem", padding: "0.72rem 1rem", borderRadius: 8, fontFamily: "system-ui, sans-serif", fontSize: "0.83rem", cursor: "pointer", fontWeight: 500, border: "none", background: "#2c2318", color: "#f9f6f1" },
  btnIcon: (active) => ({ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.72rem", borderRadius: 8, cursor: "pointer", border: `1px solid ${active ? "#c0795a" : "#e5ddd0"}`, background: active ? "#fdf0ee" : "#fff", color: active ? "#c0795a" : "#9a8e80", minWidth: 42 }),
  btnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  statusCenter: { textAlign: "center", color: "#9a8e80", fontFamily: "system-ui, sans-serif", fontSize: "0.9rem", fontStyle: "italic", padding: "2.5rem 0" },
  errorMsg: { textAlign: "center", color: "#c0795a", fontFamily: "system-ui, sans-serif", fontSize: "0.85rem", padding: "2rem 0", lineHeight: 1.7 },
  searchWrap: { position: "relative", marginBottom: "1rem" },
  searchInput: { width: "100%", padding: "0.68rem 2.4rem 0.68rem 2.4rem", border: "1px solid #e5ddd0", borderRadius: 8, fontFamily: "system-ui, sans-serif", fontSize: "0.86rem", background: "#fff", color: "#2c2318", outline: "none" },
  favItem: { background: "#fff", border: "1px solid #e5ddd0", borderRadius: 10, padding: "1.1rem 1.2rem", marginBottom: "0.6rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" },
  favRef: { fontFamily: "system-ui, sans-serif", fontSize: "0.68rem", fontWeight: 600, color: "#9a6b3a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "0.3rem" },
  favText: { fontSize: "0.92rem", lineHeight: 1.65, fontStyle: "italic", color: "#2c2318" },
  removeBtn: { background: "none", border: "none", color: "#c5bdb4", cursor: "pointer", padding: "0.2rem", flexShrink: 0 },
  empty: { textAlign: "center", padding: "3rem 1rem", color: "#9a8e80", fontFamily: "system-ui, sans-serif", fontSize: "0.88rem", lineHeight: 1.7 },
  toast: { position: "fixed", bottom: "1.75rem", left: "50%", transform: "translateX(-50%)", background: "#2c2318", color: "#f9f6f1", padding: "0.55rem 1.2rem", borderRadius: 20, fontFamily: "system-ui, sans-serif", fontSize: "0.8rem", zIndex: 999, whiteSpace: "nowrap" },
  note: { fontFamily: "system-ui, sans-serif", fontSize: "0.75rem", color: "#b0a898", textAlign: "center", marginTop: "0.5rem" },
};

export default function App() {
  const [page, setPage] = useState("home");
  const [verse, setVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fading, setFading] = useState(false);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("bibleapp_favs") || "[]"); } catch { return []; }
  });
  const [searchQ, setSearchQ] = useState("");
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const isFav = verse ? favorites.some(f => f.ref === verse.ref) : false;

  async function draw() {
    setFading(true);
    await new Promise(r => setTimeout(r, 220));
    setFading(false);
    setLoading(true);
    setError(null);
    let attempts = 0;
    while (attempts < 5) {
      try {
        const { ref } = randomVerse();
        const v = await fetchVerse(ref);
        setVerse(v);
        setLoading(false);
        return;
      } catch {
        attempts++;
      }
    }
    setError("Couldn't fetch a verse. Please check your internet connection and try again.");
    setLoading(false);
  }

  function toggleFav() {
    if (!verse) return;
    const updated = isFav ? favorites.filter(f => f.ref !== verse.ref) : [verse, ...favorites];
    setFavorites(updated);
    localStorage.setItem("bibleapp_favs", JSON.stringify(updated));
    showToast(isFav ? "Removed" : "Saved ♥");
  }

  function removeFav(ref) {
    const updated = favorites.filter(f => f.ref !== ref);
    setFavorites(updated);
    localStorage.setItem("bibleapp_favs", JSON.stringify(updated));
  }

  function showToast(msg) {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2000);
  }

  function shareVerse(v) {
    const text = `"${v.text}"\n— ${v.ref} (KJV)`;
    if (navigator.share) { navigator.share({ text }).catch(() => {}); }
    else { navigator.clipboard.writeText(text).then(() => showToast("Copied!")); }
  }

  const filtered = searchQ.trim()
    ? favorites.filter(f => f.ref.toLowerCase().includes(searchQ.toLowerCase()) || f.text.toLowerCase().includes(searchQ.toLowerCase()))
    : favorites;

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.title}>Daily Word</div>
        <div style={S.subtitle}>King James Version · Whole Bible</div>
      </div>

      <div style={S.nav}>
        <button style={S.navBtn(page === "home")} onClick={() => setPage("home")}>Draw</button>
        <button style={S.navBtn(page === "favs")} onClick={() => setPage("favs")}>
          Favorites{favorites.length > 0 ? ` (${favorites.length})` : ""}
        </button>
      </div>

      {page === "home" && (
        <>
          <div style={S.card(fading)}>
            {!verse && !loading && !error && (
              <div style={S.statusCenter}>
                Tap "Draw a verse" to begin 🙏
              </div>
            )}
            {loading && <div style={S.statusCenter}>Drawing from the whole Bible…</div>}
            {error && (
              <div style={S.errorMsg}>
                {error}
              </div>
            )}
            {verse && !loading && (
              <>
                <div style={S.ref}>{verse.ref}</div>
                <div style={S.verseText}>"{verse.text}"</div>
              </>
            )}
          </div>

          <div style={S.actions}>
            <button
              style={{ ...S.btnPrimary, ...(loading ? S.btnDisabled : {}) }}
              onClick={draw}
              disabled={loading}
            >
              <RefreshIcon /> {verse ? "Draw another verse" : "Draw a verse"}
            </button>
            <button
              style={{ ...S.btnIcon(isFav), ...((!verse || loading) ? S.btnDisabled : {}) }}
              onClick={toggleFav}
              disabled={!verse || loading}
              title={isFav ? "Remove" : "Save"}
            >
              <HeartIcon filled={isFav} />
            </button>
            <button
              style={{ ...S.btnIcon(false), ...((!verse || loading) ? S.btnDisabled : {}) }}
              onClick={() => verse && shareVerse(verse)}
              disabled={!verse || loading}
              title="Share"
            >
              <ShareIcon />
            </button>
          </div>
          <div style={S.note}>Draws from all 66 books · Requires internet</div>
        </>
      )}

      {page === "favs" && (
        <>
          <div style={S.searchWrap}>
            <span style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", color: "#9a8e80", pointerEvents: "none" }}><SearchIcon /></span>
            <input
              style={S.searchInput}
              placeholder="Search by reference or keyword…"
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
            />
            {searchQ && (
              <button onClick={() => setSearchQ("")} style={{ position: "absolute", right: "0.85rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#9a8e80", cursor: "pointer" }}>
                <XIcon />
              </button>
            )}
          </div>

          {favorites.length === 0
            ? <div style={S.empty}><div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>✦</div>No favorites yet.<br />Draw a verse and tap the heart to save it.</div>
            : filtered.length === 0
              ? <div style={S.empty}>No verses match "{searchQ}"</div>
              : filtered.map((f, i) => (
                  <div key={i} style={S.favItem}>
                    <div style={{ flex: 1 }}>
                      <div style={S.favRef}>{f.ref}</div>
                      <div style={S.favText}>"{f.text.length > 180 ? f.text.slice(0, 180) + "…" : f.text}"</div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <button style={{ background: "none", border: "none", color: "#9a8e80", cursor: "pointer", padding: "0.2rem" }} onClick={() => shareVerse(f)}><ShareIcon /></button>
                      <button style={S.removeBtn} onClick={() => removeFav(f.ref)}><XIcon /></button>
                    </div>
                  </div>
                ))
          }
        </>
      )}

      {toast && <div style={S.toast}>{toast}</div>}
    </div>
  );
}
