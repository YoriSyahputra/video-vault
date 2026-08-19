import Dexie from "dexie";

// Inisialisasi IndexedDB via Dexie
const db = new Dexie("VideoVaultDB");
db.version(1).stores({
  videos: "++id, title, url, category, createdAt",
});

// App State
let currentCategory = "Semua";
let searchQuery = "";

// DOM Elements
const videoGrid = document.getElementById("video-grid");
const emptyState = document.getElementById("empty-state");
const categoryFilters = document.getElementById("category-filters");
const searchInput = document.getElementById("search-input");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modal-title");
const videoForm = document.getElementById("video-form");
const formId = document.getElementById("form-id");
const formTitle = document.getElementById("form-title");
const formUrl = document.getElementById("form-url");
const formThumbnail = document.getElementById("form-thumbnail");
const formCategory = document.getElementById("form-category");
const btnOpenModal = document.getElementById("btn-open-modal");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnCancel = document.getElementById("btn-cancel");

// Modal Controller
function openModal(editData = null) {
  videoForm.reset();
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
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

function closeModal() {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
  videoForm.reset();
}

btnOpenModal.addEventListener("click", () => openModal());
btnCloseModal.addEventListener("click", closeModal);
btnCancel.addEventListener("click", closeModal);

// Render Filter Kategori
async function renderCategories() {
  const allVideos = await db.videos.toArray();
  const categories = [
    "Semua",
    ...new Set(allVideos.map((v) => v.category.trim())),
  ];

  categoryFilters.innerHTML = categories
    .map(
      (cat) => `
    <button data-category="${cat}" class="category-btn px-3 py-1.5 rounded-lg border whitespace-nowrap transition ${
      currentCategory === cat
        ? "bg-accent border-accent text-white font-medium"
        : "bg-surface border-zinc-800 text-zinc-400 hover:text-white"
    }">
      ${cat}
    </button>
  `,
    )
    .join("");

  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      currentCategory = e.currentTarget.dataset.category;
      renderCategories();
      renderVideos();
    });
  });
}

// Render Daftar Card Video
async function renderVideos() {
  let collection = db.videos.orderBy("id").reverse();
  let videos = await collection.toArray();

  if (currentCategory !== "Semua") {
    videos = videos.filter(
      (v) => v.category.toLowerCase() === currentCategory.toLowerCase(),
    );
  }

  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    videos = videos.filter((v) => v.title.toLowerCase().includes(q));
  }

  if (videos.length === 0) {
    videoGrid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");
  videoGrid.innerHTML = videos
    .map((video) => {
      const thumb =
        video.thumbnail ||
        "https://placehold.co/600x340/18181b/71717a?text=No+Thumbnail";
      return `
      <div class="bg-surface border border-zinc-800/80 rounded-xl overflow-hidden flex flex-col group hover:border-zinc-700 transition shadow-sm">
        <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="relative aspect-video bg-zinc-900 block overflow-hidden">
          <img src="${thumb}" alt="${video.title}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300" onerror="this.src='https://placehold.co/600x340/18181b/71717a?text=Error+Thumbnail'" />
          <span class="absolute bottom-2 right-2 bg-black/80 backdrop-blur text-[10px] font-medium text-white px-2 py-0.5 rounded">
            ${video.category}
          </span>
        </a>
        
        <div class="p-3 flex flex-col justify-between flex-1 gap-3">
          <a href="${video.url}" target="_blank" rel="noopener noreferrer" class="font-medium text-sm text-zinc-100 hover:text-accent line-clamp-2 transition">
            ${video.title}
          </a>
          
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800/50">
            <button data-id="${video.id}" class="btn-edit text-xs text-zinc-400 hover:text-white px-2 py-1 rounded bg-zinc-800/50 hover:bg-zinc-800 transition">
              Edit
            </button>
            <button data-id="${video.id}" class="btn-delete text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-500/10 hover:bg-rose-500/20 transition">
              Hapus
            </button>
          </div>
        </div>
      </div>
    `;
    })
    .join("");

  // Event Edit & Hapus
  document.querySelectorAll(".btn-edit").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      const data = await db.videos.get(id);
      if (data) openModal(data);
    });
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = Number(e.currentTarget.dataset.id);
      if (confirm("Hapus video ini dari penyimpanan lokal?")) {
        await db.videos.delete(id);
        await renderCategories();
        await renderVideos();
      }
    });
  });
}

// Handler Submit Form
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

  if (id) {
    await db.videos.update(id, payload);
  } else {
    await db.videos.add(payload);
  }

  closeModal();
  await renderCategories();
  await renderVideos();
});

// Handler Pencarian
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  renderVideos();
});

// Load awal
renderCategories();
renderVideos();
