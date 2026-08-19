import Dexie from "dexie";

/* =========================================================
   Database
   ========================================================= */
const db = new Dexie("VideoVaultDB");
db.version(1).stores({
  videos: "++id, title, url, category, createdAt",
});

/* =========================================================
   Constants & helpers
   ========================================================= */
const PAGE_SIZE = 8;
const FALLBACK_THUMB = "https://placehold.co/600x340/13131a/52525b?text=No+Thumbnail";
const ERROR_THUMB = "https://placehold.co/600x340/13131a/52525b?text=Gagal+Memuat";

const ICON_PATHS = {
  play: '<path d="M6 4.2c0-.9.98-1.44 1.73-.96l12.4 7.8a1.14 1.14 0 0 1 0 1.92l-12.4 7.8A1.14 1.14 0 0 1 6 19.8V4.2Z" />',
  moreVertical:
    '<circle cx="12" cy="5" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="12" cy="19" r="1.5" />',
  link: '<rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />',
  check: '<path d="M20 6 9 17l-5-5" />',
  film: '<rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4" />',
  externalLink:
    '<path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />',
  trash:
    '<path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" />',
  checkCircle: '<circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 5-5" />',
  alertCircle: '<circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" />',
};

function icon(name, cls = "w-4 h-4") {
  const isFill = name === "play" || name === "moreVertical";
  return `<svg class="${cls}" viewBox="0 0 24 24" fill="${isFill ? "currentColor" : "none"}" stroke="${
    isFill ? "none" : "currentColor"
  }" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICON_PATHS[name] || ""}</svg>`;
}

function escapeHtml(str = "") {
  return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function debounce(fn, delay = 150) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return "Baru saja";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} menit lalu`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr} jam lalu`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Kemarin";
  if (day < 7) return `${day} hari lalu`;
  return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

function isDirectVideo(url) {
  return /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(url || "");
}

/* =========================================================
   App state
   ========================================================= */
let allVideosCache = [];
let filteredVideos = [];
let currentCategory = "Semua";
let searchQuery = "";
let sortBy = "newest";
let loadedCount = 0;
let activeVideo = null;

/* =========================================================
   DOM references
   ========================================================= */
const videoGrid = document.getElementById("video-grid");
const skeletonGrid = document.getElementById("skeleton-grid");
const emptyState = document.getElementById("empty-state");
const btnEmptyAdd = document.getElementById("btn-empty-add");
const scrollSentinel = document.getElementById("scroll-sentinel");
const loadingMore = document.getElementById("loading-more");

const categoryFilters = document.getElementById("category-filters");
const searchInput = document.getElementById("search-input");
const btnClearSearch = document.getElementById("btn-clear-search");
const videoCountEl = document.getElementById("video-count");

const btnSort = document.getElementById("btn-sort");
const sortPanel = document.getElementById("sort-panel");

const btnOpenModal = document.getElementById("btn-open-modal");
const modalBackdrop = document.getElementById("modal-backdrop");
const modal = document.getElementById("modal");
const modalPanel = document.getElementById("modal-panel");
const modalTitle = document.getElementById("modal-title");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancel = document.getElementById("btn-cancel");
const videoForm = document.getElementById("video-form");
const formId = document.getElementById("form-id");
const formTitle = document.getElementById("form-title");
const formUrl = document.getElementById("form-url");
const formThumbnail = document.getElementById("form-thumbnail");
const formCategory = document.getElementById("form-category");
const categoryDatalist = document.getElementById("category-datalist");
const thumbPreviewImg = document.getElementById("thumb-preview-img");
const thumbPlaceholderIcon = document.getElementById("thumb-placeholder-icon");

const sheetBackdrop = document.getElementById("sheet-backdrop");
const bottomSheet = document.getElementById("bottom-sheet");
const sheetThumb = document.getElementById("sheet-thumb");
const sheetTitle = document.getElementById("sheet-title");
const sheetPreviewBtn = document.getElementById("sheet-preview");
const sheetCopyBtn = document.getElementById("sheet-copy");
const sheetEditBtn = document.getElementById("sheet-edit");
const sheetDeleteBtn = document.getElementById("sheet-delete");
const sheetCancelBtn = document.getElementById("sheet-cancel");

const previewModal = document.getElementById("preview-modal");
const previewBackdrop = document.getElementById("preview-backdrop");
const previewPanel = document.getElementById("preview-panel");
const previewTitle = document.getElementById("preview-title");
const previewContent = document.getElementById("preview-content");
const previewFallback = document.getElementById("preview-fallback");
const previewExternalLink = document.getElementById("preview-external-link");
const btnClosePreview = document.getElementById("btn-close-preview");

const toastContainer = document.getElementById("toast-container");

/* =========================================================
   Ripple (global delegation, works for present & future elements)
   ========================================================= */
document.addEventListener("pointerdown", (e) => {
  const el = e.target.closest("[data-ripple]");
  if (!el) return;
  const rect = el.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const span = document.createElement("span");
  span.className = "ripple-el";
  span.style.width = span.style.height = `${size}px`;
  const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
  const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;
  span.style.left = `${x}px`;
  span.style.top = `${y}px`;
  el.appendChild(span);
  span.addEventListener("animationend", () => span.remove());
});

/* =========================================================
   Toast notifications
   ========================================================= */
const TOAST_STYLES = {
  success: { i: "checkCircle", border: "border-emerald-400/30", text: "text-emerald-300", bg: "bg-emerald-400/15" },
  delete: { i: "trash", border: "border-rose-400/30", text: "text-rose-300", bg: "bg-rose-400/15" },
  error: { i: "alertCircle", border: "border-rose-400/30", text: "text-rose-300", bg: "bg-rose-400/15" },
};

function showToast(message, type = "success") {
  const style = TOAST_STYLES[type] || TOAST_STYLES.success;
  const toast = document.createElement("div");
  toast.className = `toast pointer-events-auto flex items-center gap-2.5 bg-surface/95 backdrop-blur-xl border ${style.border} rounded-2xl pl-2.5 pr-4 py-2.5 shadow-2xl shadow-black/40 max-w-[calc(100vw-2rem)]`;
  toast.innerHTML = `
    <span class="w-7 h-7 rounded-full ${style.bg} ${style.text} flex items-center justify-center flex-shrink-0">${icon(
    style.i,
    "w-4 h-4"
  )}</span>
    <span class="text-[13px] font-medium text-zinc-100">${escapeHtml(message)}</span>
  `;
  toastContainer.appendChild(toast);
  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("toast-show")));
  setTimeout(() => {
    toast.classList.remove("toast-show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, 2600);
}

/* =========================================================
   Overlay open/close helpers
   ========================================================= */
function openModal(editData = null) {
  videoForm.reset();
  updateCategoryDatalist();
  if (editData) {
    modalTitle.textContent = "Edit Video";
    formId.value = editData.id;
    formTitle.value = editData.title;
    formUrl.value = editData.url;
    formThumbnail.value = editData.thumbnail || "";
    formCategory.value = editData.category;
  } else {
    modalTitle.textContent = "Tambah Video";
    formId.value = "";
  }
  updateThumbPreview();

  modal.classList.remove("pointer-events-none");
  modalBackdrop.classList.remove("pointer-events-none");
  requestAnimationFrame(() => {
    modalBackdrop.classList.remove("opacity-0");
    modalPanel.classList.remove("scale-95", "opacity-0");
  });
  setTimeout(() => formTitle.focus({ preventScroll: true }), 300);
}

function closeModal() {
  modalBackdrop.classList.add("opacity-0");
  modalPanel.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    modal.classList.add("pointer-events-none");
    modalBackdrop.classList.add("pointer-events-none");
    videoForm.reset();
  }, 300);
}

function openBottomSheet(video) {
  activeVideo = video;
  sheetThumb.src = video.thumbnail || FALLBACK_THUMB;
  sheetThumb.onerror = () => (sheetThumb.src = ERROR_THUMB);
  sheetTitle.textContent = video.title;

  const previewable = !!getYouTubeId(video.url) || isDirectVideo(video.url);
  sheetPreviewBtn.classList.toggle("hidden", !previewable);

  sheetBackdrop.classList.remove("pointer-events-none");
  requestAnimationFrame(() => {
    sheetBackdrop.classList.remove("opacity-0");
    bottomSheet.classList.remove("translate-y-full");
  });
}

function closeBottomSheet() {
  sheetBackdrop.classList.add("opacity-0");
  bottomSheet.classList.add("translate-y-full");
  setTimeout(() => {
    sheetBackdrop.classList.add("pointer-events-none");
  }, 300);
}

function openPreview(video, ytId, isDirect) {
  previewTitle.textContent = video.title;
  previewContent.classList.remove("hidden");
  previewFallback.classList.add("hidden");

  if (ytId) {
    previewContent.innerHTML = `<iframe class="w-full h-full" src="https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0" title="${escapeHtml(
      video.title
    )}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
  } else if (isDirect) {
    previewContent.innerHTML = `<video class="w-full h-full" src="${video.url}" controls autoplay playsinline></video>`;
  } else {
    previewContent.classList.add("hidden");
    previewFallback.classList.remove("hidden");
    previewExternalLink.href = video.url;
  }

  previewModal.classList.remove("hidden");
  previewModal.classList.add("flex");
  requestAnimationFrame(() => {
    previewBackdrop.classList.remove("opacity-0");
    previewPanel.classList.remove("scale-95", "opacity-0");
  });
}

function closePreview() {
  previewBackdrop.classList.add("opacity-0");
  previewPanel.classList.add("scale-95", "opacity-0");
  setTimeout(() => {
    previewModal.classList.add("hidden");
    previewModal.classList.remove("flex");
    previewContent.innerHTML = ""; // stop playback
  }, 300);
}

function openPreviewOrExternal(video) {
  const ytId = getYouTubeId(video.url);
  const direct = isDirectVideo(video.url);
  if (!ytId && !direct) {
    window.open(video.url, "_blank", "noopener,noreferrer");
    return;
  }
  openPreview(video, ytId, direct);
}

function openSortPanel() {
  sortPanel.classList.remove("opacity-0", "scale-95", "pointer-events-none");
}
function closeSortPanel() {
  sortPanel.classList.add("opacity-0", "scale-95", "pointer-events-none");
}

/* =========================================================
   Copy link
   ========================================================= */
async function copyLink(url, btnEl) {
  try {
    await navigator.clipboard.writeText(url);
  } catch (err) {
    const ta = document.createElement("textarea");
    ta.value = url;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
    } catch (_) {
      /* no-op */
    }
    document.body.removeChild(ta);
  }

  if (btnEl) {
    const original = btnEl.innerHTML;
    btnEl.innerHTML = icon("check", "w-3.5 h-3.5");
    btnEl.classList.add("text-emerald-400");
    setTimeout(() => {
      btnEl.innerHTML = original;
      btnEl.classList.remove("text-emerald-400");
    }, 1400);
  }
  showToast("Link berhasil disalin!", "success");
}

/* =========================================================
   Category datalist & thumbnail preview (form)
   ========================================================= */
function updateCategoryDatalist() {
  const categories = [...new Set(allVideosCache.map((v) => v.category.trim()).filter(Boolean))];
  categoryDatalist.innerHTML = categories.map((c) => `<option value="${escapeHtml(c)}"></option>`).join("");
}

function updateThumbPreview() {
  const url = formThumbnail.value.trim();
  if (url) {
    thumbPreviewImg.src = url;
    thumbPreviewImg.classList.remove("hidden");
    thumbPlaceholderIcon.classList.add("hidden");
  } else {
    thumbPreviewImg.classList.add("hidden");
    thumbPlaceholderIcon.classList.remove("hidden");
  }
}
thumbPreviewImg.addEventListener("error", () => {
  thumbPreviewImg.classList.add("hidden");
  thumbPlaceholderIcon.classList.remove("hidden");
});

/* =========================================================
   Rendering: categories
   ========================================================= */
function renderCategories() {
  const categories = ["Semua", ...new Set(allVideosCache.map((v) => v.category.trim()).filter(Boolean))];
  categoryFilters.innerHTML = categories
    .map((cat) => {
      const active = currentCategory === cat;
      return `<button data-category="${escapeHtml(cat)}" data-ripple class="category-btn ripple-container flex-shrink-0 px-3.5 py-2 rounded-xl border text-[12.5px] font-medium whitespace-nowrap transition-all ${
        active
          ? "bg-gradient-to-r from-accent to-accent2 border-transparent text-white shadow-lg shadow-accent/25"
          : "bg-white/[0.04] border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.07]"
      }">${escapeHtml(cat)}</button>`;
    })
    .join("");
}

/* =========================================================
   Rendering: video cards
   ========================================================= */
function platformBadge(url) {
  if (getYouTubeId(url)) {
    return `<span class="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-rose-400">${icon(
      "play",
      "w-3 h-3"
    )}</span>`;
  }
  if (isDirectVideo(url)) {
    return `<span class="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-accent2">${icon(
      "film",
      "w-3.5 h-3.5"
    )}</span>`;
  }
  return `<span class="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-400">${icon(
    "externalLink",
    "w-3.5 h-3.5"
  )}</span>`;
}

function createVideoCardHTML(video, delayMs) {
  const thumb = video.thumbnail || FALLBACK_THUMB;
  return `
  <article class="video-card ripple-container group relative rounded-2xl overflow-hidden bg-white/[0.035] border border-white/[0.08] backdrop-blur-xl hover:border-white/[0.15] transition-colors duration-300 animate-card-in" style="animation-delay:${delayMs}ms" data-id="${video.id}" data-ripple>
    <div class="card-thumb relative aspect-video bg-zinc-900 overflow-hidden cursor-pointer">
      <img src="${thumb}" loading="lazy" alt="${escapeHtml(video.title)}" class="w-full h-full object-cover transition-transform duration-500 group-active:scale-95" onerror="this.src='${ERROR_THUMB}'" />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div class="w-11 h-11 rounded-full bg-white/90 flex items-center justify-center shadow-xl text-zinc-900">${icon(
          "play",
          "w-4 h-4 ml-0.5"
        )}</div>
      </div>
      <span class="absolute top-2 left-2 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[10px] font-medium text-white/90 border border-white/10 max-w-[65%] truncate">${escapeHtml(
        video.category
      )}</span>
      ${platformBadge(video.url)}
    </div>
    <div class="p-3 space-y-2.5">
      <h3 class="card-title text-[13px] font-semibold leading-snug line-clamp-2 cursor-pointer hover:text-accent2 transition-colors">${escapeHtml(
        video.title
      )}</h3>
      <div class="flex items-center justify-between pt-1.5 border-t border-white/[0.06]">
        <span class="text-[10.5px] text-zinc-500">${timeAgo(video.createdAt)}</span>
        <div class="flex items-center gap-1">
          <button class="btn-copy ripple-container w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-accent2 hover:bg-white/5 active:scale-90 transition" data-ripple title="Salin link">${icon(
            "link",
            "w-3.5 h-3.5"
          )}</button>
          <button class="btn-more ripple-container w-7 h-7 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 active:scale-90 transition" data-ripple title="Opsi lainnya">${icon(
            "moreVertical",
            "w-3.5 h-3.5"
          )}</button>
        </div>
      </div>
    </div>
  </article>`;
}

function showEmptyState() {
  videoGrid.classList.add("hidden");
  emptyState.classList.remove("hidden");
  scrollSentinel.classList.add("hidden");
}
function hideEmptyState() {
  emptyState.classList.add("hidden");
  videoGrid.classList.remove("hidden");
  scrollSentinel.classList.remove("hidden");
}

function updateVideoCount() {
  const n = allVideosCache.length;
  videoCountEl.textContent = n === 0 ? "Belum ada video" : `${n} video tersimpan`;
}

/* =========================================================
   Sorting & filtering
   ========================================================= */
function sortVideos(videos) {
  const arr = [...videos];
  switch (sortBy) {
    case "oldest":
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "title":
      arr.sort((a, b) => a.title.localeCompare(b.title, "id"));
      break;
    case "category":
      arr.sort((a, b) => a.category.localeCompare(b.category, "id"));
      break;
    case "newest":
    default:
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
  }
  return arr;
}

function applyFiltersAndRender() {
  let videos = [...allVideosCache];
  if (currentCategory !== "Semua") {
    videos = videos.filter((v) => v.category.toLowerCase() === currentCategory.toLowerCase());
  }
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    videos = videos.filter((v) => v.title.toLowerCase().includes(q));
  }
  filteredVideos = sortVideos(videos);
  renderInitial();
}

/* =========================================================
   Pagination / infinite scroll
   ========================================================= */
function renderInitial() {
  loadedCount = 0;
  videoGrid.innerHTML = "";
  if (filteredVideos.length === 0) {
    showEmptyState();
    return;
  }
  hideEmptyState();
  renderNextBatch();
}

function renderNextBatch() {
  const nextItems = filteredVideos.slice(loadedCount, loadedCount + PAGE_SIZE);
  const html = nextItems.map((v, i) => createVideoCardHTML(v, Math.min(i, 8) * 55)).join("");
  videoGrid.insertAdjacentHTML("beforeend", html);
  loadedCount += nextItems.length;
  loadingMore.classList.add("hidden");
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && loadedCount < filteredVideos.length) {
        loadingMore.classList.remove("hidden");
        renderNextBatch();
      }
    });
  },
  { rootMargin: "200px" }
);
io.observe(scrollSentinel);

/* =========================================================
   Data loading
   ========================================================= */
function showSkeleton() {
  skeletonGrid.classList.remove("hidden");
  videoGrid.classList.add("hidden");
  emptyState.classList.add("hidden");
}
function hideSkeleton() {
  skeletonGrid.classList.add("hidden");
}

async function reloadVideos({ skeleton = false } = {}) {
  if (skeleton) showSkeleton();
  try {
    allVideosCache = await db.videos.toArray();
  } catch (err) {
    console.error("Gagal memuat data dari IndexedDB:", err);
    allVideosCache = [];
    showToast("Gagal memuat data lokal", "error");
  }
  renderCategories();
  applyFiltersAndRender();
  updateVideoCount();
  if (skeleton) hideSkeleton();
}

/* =========================================================
   Event: Header / Sort
   ========================================================= */
btnSort.addEventListener("click", (e) => {
  e.stopPropagation();
  const isOpen = !sortPanel.classList.contains("opacity-0");
  isOpen ? closeSortPanel() : openSortPanel();
});

function updateSortPanelUI() {
  document.querySelectorAll(".sort-option").forEach((btn) => {
    const isActive = btn.dataset.sort === sortBy;
    btn.querySelector(".sort-check").classList.toggle("hidden", !isActive);
    btn.classList.toggle("text-white", isActive);
  });
}

sortPanel.addEventListener("click", (e) => {
  const opt = e.target.closest(".sort-option");
  if (!opt) return;
  sortBy = opt.dataset.sort;
  updateSortPanelUI();
  closeSortPanel();
  applyFiltersAndRender();
});

document.addEventListener("click", (e) => {
  if (!sortPanel.classList.contains("opacity-0") && !sortPanel.contains(e.target) && e.target !== btnSort && !btnSort.contains(e.target)) {
    closeSortPanel();
  }
});

/* =========================================================
   Event: Search
   ========================================================= */
const handleSearch = debounce(() => {
  applyFiltersAndRender();
}, 150);

searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  btnClearSearch.classList.toggle("hidden", searchQuery.trim() === "");
  handleSearch();
});

btnClearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchQuery = "";
  btnClearSearch.classList.add("hidden");
  applyFiltersAndRender();
  searchInput.focus();
});

/* =========================================================
   Event: Category filters (delegated)
   ========================================================= */
categoryFilters.addEventListener("click", (e) => {
  const btn = e.target.closest(".category-btn");
  if (!btn) return;
  currentCategory = btn.dataset.category;
  renderCategories();
  applyFiltersAndRender();
});

/* =========================================================
   Event: Modal open/close
   ========================================================= */
btnOpenModal.addEventListener("click", () => openModal());
btnEmptyAdd.addEventListener("click", () => openModal());
btnCloseModal.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", closeModal);
formThumbnail.addEventListener("input", updateThumbPreview);

videoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = formId.value ? Number(formId.value) : null;
  const payload = {
    title: formTitle.value.trim(),
    url: formUrl.value.trim(),
    thumbnail: formThumbnail.value.trim(),
    category: formCategory.value.trim(),
    createdAt: new Date().toISOString(),
  };

  try {
    if (id) {
      const existing = await db.videos.get(id);
      await db.videos.update(id, { ...payload, createdAt: existing?.createdAt || payload.createdAt });
      showToast("Perubahan berhasil disimpan!", "success");
    } else {
      await db.videos.add(payload);
      showToast("Video berhasil ditambahkan!", "success");
    }
    closeModal();
    await reloadVideos();
  } catch (err) {
    console.error(err);
    showToast("Gagal menyimpan video", "error");
  }
});

/* =========================================================
   Event: Video grid actions (delegated)
   ========================================================= */
videoGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".video-card");
  if (!card) return;
  const id = Number(card.dataset.id);
  const video = allVideosCache.find((v) => v.id === id);
  if (!video) return;

  const moreBtn = e.target.closest(".btn-more");
  const copyBtn = e.target.closest(".btn-copy");
  const thumbLink = e.target.closest(".card-thumb");
  const titleLink = e.target.closest(".card-title");

  if (moreBtn) {
    openBottomSheet(video);
    return;
  }
  if (copyBtn) {
    copyLink(video.url, copyBtn);
    return;
  }
  if (thumbLink || titleLink) {
    openPreviewOrExternal(video);
  }
});

/* =========================================================
   Event: Bottom sheet actions
   ========================================================= */
sheetCancelBtn.addEventListener("click", closeBottomSheet);
sheetBackdrop.addEventListener("click", closeBottomSheet);

sheetPreviewBtn.addEventListener("click", () => {
  const video = activeVideo;
  closeBottomSheet();
  if (!video) return;
  const ytId = getYouTubeId(video.url);
  const direct = isDirectVideo(video.url);
  openPreview(video, ytId, direct);
});

sheetCopyBtn.addEventListener("click", () => {
  if (!activeVideo) return;
  copyLink(activeVideo.url, null);
  closeBottomSheet();
});

sheetEditBtn.addEventListener("click", () => {
  const video = activeVideo;
  closeBottomSheet();
  if (video) setTimeout(() => openModal(video), 200);
});

sheetDeleteBtn.addEventListener("click", async () => {
  const video = activeVideo;
  closeBottomSheet();
  if (!video) return;
  setTimeout(async () => {
    if (confirm(`Hapus "${video.title}" dari penyimpanan lokal?`)) {
      try {
        await db.videos.delete(video.id);
        await reloadVideos();
        showToast("Video berhasil dihapus", "delete");
      } catch (err) {
        console.error(err);
        showToast("Gagal menghapus video", "error");
      }
    }
  }, 200);
});

/* =========================================================
   Event: Preview modal
   ========================================================= */
btnClosePreview.addEventListener("click", closePreview);
previewBackdrop.addEventListener("click", closePreview);

/* =========================================================
   Global: Escape key closes topmost overlay
   ========================================================= */
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (!previewModal.classList.contains("hidden")) return closePreview();
  if (!sheetBackdrop.classList.contains("pointer-events-none")) return closeBottomSheet();
  if (!modal.classList.contains("pointer-events-none")) return closeModal();
  if (!sortPanel.classList.contains("opacity-0")) return closeSortPanel();
});

/* =========================================================
   Init
   ========================================================= */
reloadVideos({ skeleton: true });
