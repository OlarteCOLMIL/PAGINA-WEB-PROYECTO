
document.addEventListener("DOMContentLoaded", () => {

  const PLANTAS = [
    {
      id: 1,
      nombre: "Anturio",
      precio: 42000,
      specs: {
        "Luz": "Indirecta brillante",
        "Riego": "Moderado (cuando se seque la capa superior 2–3 cm)",
        "Tamaño": "20–50 cm de alto",
        "Ideal": "Interiores húmedos y ventilados"
      }
    },
    {
      id: 2,
      nombre: "Amor ardiente",
      precio: 39000,
      specs: {
        "Luz": "Plena a parcial (4–6 h de sol)",
        "Riego": "Bajo a moderado",
        "Floración": "Estacional, colores intensos",
        "Ideal": "Jardines y balcones luminosos"
      }
    },
    {
      id: 3,
      nombre: "Vinca",
      precio: 28000,
      specs: {
        "Luz": "Sol o semisombra",
        "Riego": "Moderado; tolera sequía ligera",
        "Crecimiento": "Rápido y tapizante",
        "Ideal": "Exterior resistente"
      }
    },
    {
      id: 4,
      nombre: "Jade",
      precio: 30000,
      specs: {
        "Luz": "Alta/sol filtrado",
        "Riego": "Bajo (suculenta)",
        "Tamaño": "Hasta 1 m con el tiempo",
        "Ideal": "Interior luminoso"
      }
    },
    {
      id: 5,
      nombre: "Begonia Big",
      precio: 37000,
      specs: {
        "Luz": "Indirecta brillante",
        "Riego": "Constante sin encharcar",
        "Floración": "Abundante gran parte del año",
        "Ideal": "Interior o exterior protegido"
      }
    },
    {
      id: 6,
      nombre: "Ruda",
      precio: 25000,
      specs: {
        "Luz": "Sol directo",
        "Riego": "Escaso; buen drenaje",
        "Aroma": "Fuerte, tradicional",
        "Ideal": "Maceta exterior o huerto"
      }
    }
  ];

  const money = (n) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);


  const css = `
  .modal-planta{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:9999}
  .modal-planta.open{display:flex}
  .modal-planta .modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.5)}
  .modal-planta .modal-dialog{position:relative;background:#fff;border-radius:14px;max-width:860px;width:min(92vw,860px);
    display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,.25)}
  @media (max-width:720px){.modal-planta .modal-dialog{grid-template-columns:1fr}}
  .modal-planta .modal-close{position:absolute;top:8px;right:8px;border:0;background:#eee;width:36px;height:36px;border-radius:8px;
    cursor:pointer;font-size:22px;line-height:1}
  .modal-planta .modal-img{width:100%;height:100%;object-fit:cover;border-radius:12px;aspect-ratio:4/3}
  .modal-planta .modal-body{padding:6px 8px}
  .modal-planta .modal-title{margin:0 0 6px 0;font-size:1.5rem}
  .modal-planta .modal-price{margin:0 0 10px 0;font-weight:700;color:#2e7d32}
  .modal-planta .modal-specs{list-style:none;padding-left:0;margin:0;display:grid;gap:6px}
  .modal-planta .modal-specs li{background:#f6f6f6;border-radius:8px;padding:8px 10px}
  .modal-planta .modal-actions{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap}
  .modal-planta .btn{padding:.6rem 1rem;border:0;border-radius:10px;cursor:pointer}
  .modal-planta .btn-primary{background:#2e7d32;color:#fff}
  `;
  const style = document.createElement("style");
  style.id = "modal-planta-styles";
  style.textContent = css;
  document.head.appendChild(style);


  const modal = document.createElement("div");
  modal.className = "modal-planta";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="modal-planta-titulo">
      <button class="modal-close" aria-label="Cerrar" data-close="true">×</button>
      <img class="modal-img" alt="" />
      <div class="modal-body">
        <h3 id="modal-planta-titulo" class="modal-title"></h3>
        <p class="modal-price"></p>
        <ul class="modal-specs"></ul>
        <div class="modal-actions">
          <button class="btn btn-primary" data-close="true">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const els = {
    img: modal.querySelector(".modal-img"),
    title: modal.querySelector(".modal-title"),
    price: modal.querySelector(".modal-price"),
    specs: modal.querySelector(".modal-specs")
  };


  const items = document.querySelectorAll("#plantas .catalogo li");
  items.forEach((li, idx) => {
    const data = PLANTAS[idx];
    if (!data) return;

    const fig = li.querySelector("figure");
    const img = fig?.querySelector("img");
    const cap = fig?.querySelector("figcaption");


    if (cap) cap.textContent = data.nombre;


    const price = document.createElement("div");
    price.className = "price-badge";
    price.textContent = money(data.precio);
    price.style.position = "absolute";
    price.style.right = "10px";
    price.style.top = "10px";
    price.style.background = "#2e7d32";
    price.style.color = "#fff";
    price.style.padding = ".35rem .5rem";
    price.style.borderRadius = "10px";
    price.style.fontWeight = "700";
    price.style.boxShadow = "0 6px 18px rgba(0,0,0,.15)";

    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    fig?.parentElement?.insertBefore(wrapper, fig);
    wrapper.appendChild(fig);
    wrapper.appendChild(price);

    li.style.cursor = "pointer";
    li.addEventListener("click", () => openModal(data, img?.src || null));


    if (img && !img.hasAttribute("loading")) img.setAttribute("loading", "lazy");


    li.dataset.search = [
      data.nombre,
      ...Object.values(data.specs)
    ].join(" ").toLowerCase();
  });

  function openModal(data, src) {
    els.title.textContent = data.nombre;
    els.price.textContent = money(data.precio);
    els.img.src = src || "";
    els.img.alt = data.nombre;

    els.specs.innerHTML = "";
    Object.entries(data.specs).forEach(([label, value]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${label}:</strong> ${value}`;
      els.specs.appendChild(li);
    });

    modal.classList.add("open");
    document.addEventListener("keydown", onEsc);
  }
  function closeModal() {
    modal.classList.remove("open");
    document.removeEventListener("keydown", onEsc);
  }
  function onEsc(e) { if (e.key === "Escape") closeModal(); }
  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof Element && target.hasAttribute("data-close")) {
      closeModal();
    }
  });


  const input = document.querySelector("#buscar");
  const clearBtn = document.querySelector("#limpiarFiltro");
  const catalogItems = Array.from(document.querySelectorAll("#plantas .catalogo > li"));

  function applyFilter() {
    const q = (input?.value || "").toLowerCase().trim();
    let visibles = 0;
    catalogItems.forEach(li => {
      const ok = q === "" || li.dataset.search?.includes(q);
      li.style.display = ok ? "" : "none";
      if (ok) visibles++;
    });

    document.querySelector("#plantas .catalogo").dataset.results = String(visibles);
  }
  input?.addEventListener("input", applyFilter);
  clearBtn?.addEventListener("click", () => { if (input) { input.value = ""; applyFilter(); input.focus(); } });
  applyFilter();


  const navToggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  navToggle?.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    navToggle.setAttribute("aria-expanded", String(open));
  });

  nav?.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a) { document.body.classList.remove("nav-open"); navToggle?.setAttribute("aria-expanded", "false"); }
  });


  const sections = [...document.querySelectorAll("main section, .sobre, .comentarios, .contacto")];
  const links = [...document.querySelectorAll(".nav-link")];
  const map = new Map(sections.map(s => [s.id, s]));
  const ioActive = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target.id) {
        links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id));
      }
    });
  }, { threshold: 0.6 });
  sections.forEach(s => ioActive.observe(s));

  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        revealIO.unobserve(e.target);
      }
    });
  }, { threshold: 0.18 });
  document.querySelectorAll(".reveal").forEach(el => revealIO.observe(el));


  const toTop = document.querySelector(".to-top");
  function onScroll() {
    if (!toTop) return;
    const y = window.scrollY || document.documentElement.scrollTop;
    toTop.hidden = y < 300;
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

});

document.addEventListener("DOMContentLoaded", () => {
  const PLANTAS = [
    { id: 1, nombre: "Anturio", precio: 42000, specs: { "Luz": "Indirecta brillante", "Riego": "Moderado (cuando se seque la capa superior 2–3 cm)", "Tamaño": "20–50 cm de alto", "Ideal": "Interiores húmedos y ventilados" } },
    { id: 2, nombre: "Amor ardiente", precio: 39000, specs: { "Luz": "Plena a parcial (4–6 h de sol)", "Riego": "Bajo a moderado", "Floración": "Estacional, colores intensos", "Ideal": "Jardines y balcones luminosos" } },
    { id: 3, nombre: "Vinca", precio: 28000, specs: { "Luz": "Sol o semisombra", "Riego": "Moderado; tolera sequía ligera", "Crecimiento": "Rápido y tapizante", "Ideal": "Exterior resistente" } },
    { id: 4, nombre: "Jade", precio: 30000, specs: { "Luz": "Alta/sol filtrado", "Riego": "Bajo (suculenta)", "Tamaño": "Hasta 1 m con el tiempo", "Ideal": "Interior luminoso" } },
    { id: 5, nombre: "Begonia Big", precio: 37000, specs: { "Luz": "Indirecta brillante", "Riego": "Constante sin encharcar", "Floración": "Abundante gran parte del año", "Ideal": "Interior o exterior protegido" } },
    { id: 6, nombre: "Ruda", precio: 25000, specs: { "Luz": "Sol directo", "Riego": "Escaso; buen drenaje", "Aroma": "Fuerte, tradicional", "Ideal": "Maceta exterior o huerto" } }
  ];

  const money = (n) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(n);

  const css = `
  .modal-planta{position:fixed;inset:0;display:none;align-items:center;justify-content:center;z-index:9999}
  .modal-planta.open{display:flex}
  .modal-planta .modal-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.5)}
  .modal-planta .modal-dialog{position:relative;background:#fff;border-radius:14px;max-width:860px;width:min(92vw,860px);
    display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:16px;box-shadow:0 10px 40px rgba(0,0,0,.25)}
  @media (max-width:720px){.modal-planta .modal-dialog{grid-template-columns:1fr}}
  .modal-planta .modal-close{position:absolute;top:8px;right:8px;border:0;background:#eee;width:36px;height:36px;border-radius:8px;cursor:pointer;font-size:22px;line-height:1}
  .modal-planta .modal-img{width:100%;height:100%;object-fit:cover;border-radius:12px;aspect-ratio:4/3}
  .modal-planta .modal-body{padding:6px 8px}
  .modal-planta .modal-title{margin:0 0 6px 0;font-size:1.5rem}
  .modal-planta .modal-price{margin:0 0 10px 0;font-weight:700;color:#2e7d32}
  .modal-planta .modal-specs{list-style:none;padding-left:0;margin:0;display:grid;gap:6px}
  .modal-planta .modal-specs li{background:#f6f6f6;border-radius:8px;padding:8px 10px}
  .modal-planta .modal-actions{margin-top:12px;display:flex;gap:8px;flex-wrap:wrap}
  .modal-planta .btn{padding:.6rem 1rem;border:0;border-radius:10px;cursor:pointer}
  .modal-planta .btn-primary{background:#2e7d32;color:#fff}
  .price-badge{position:absolute;right:10px;top:10px;background:#2e7d32;color:#fff;padding:.35rem .5rem;border-radius:10px;font-weight:700;box-shadow:0 6px 18px rgba(0,0,0,.15)}
  .cart-bubble{position:fixed;bottom:16px;left:16px;z-index:1000;background:#2e7d32;color:#fff;font-weight:700;border-radius:50%;width:50px;height:50px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 18px rgba(0,0,0,.25)}
  .toast{position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:.6rem 1rem;border-radius:8px;opacity:0;transition:opacity .3s;z-index:1000}
  .toast.show{opacity:1}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.className = "modal-planta";
  modal.innerHTML = `
    <div class="modal-backdrop" data-close="true"></div>
    <div class="modal-dialog" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="Cerrar" data-close="true">×</button>
      <img class="modal-img" alt="" />
      <div class="modal-body">
        <h3 class="modal-title"></h3>
        <p class="modal-price"></p>
        <ul class="modal-specs"></ul>
        <div class="modal-actions">
          <button class="btn btn-primary" data-add>Agregar al carrito</button>
          <button class="btn" data-close="true">Cerrar</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const els = {
    img: modal.querySelector(".modal-img"),
    title: modal.querySelector(".modal-title"),
    price: modal.querySelector(".modal-price"),
    specs: modal.querySelector(".modal-specs"),
    add: modal.querySelector("[data-add]")
  };

  const cart = { count: 0 };
  const cartBubble = document.createElement("div");
  cartBubble.className = "cart-bubble";
  cartBubble.textContent = "🛒 0";
  document.body.appendChild(cartBubble);

  const toast = document.createElement("div");
  toast.className = "toast";
  document.body.appendChild(toast);

  const items = document.querySelectorAll("#plantas .catalogo li");
  items.forEach((li, idx) => {
    const data = PLANTAS[idx];
    if (!data) return;
    const fig = li.querySelector("figure");
    const img = fig?.querySelector("img");
    const cap = fig?.querySelector("figcaption");
    if (cap) cap.textContent = data.nombre;
    const price = document.createElement("div");
    price.className = "price-badge";
    price.textContent = money(data.precio);
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";
    fig?.parentElement?.insertBefore(wrapper, fig);
    wrapper.appendChild(fig);
    wrapper.appendChild(price);
    li.style.cursor = "pointer";
    li.addEventListener("click", () => openModal(data, img?.src || null));
    if (img && !img.hasAttribute("loading")) img.setAttribute("loading", "lazy");
  });

  function openModal(data, src) {
    els.title.textContent = data.nombre;
    els.price.textContent = money(data.precio);
    els.img.src = src || "";
    els.img.alt = data.nombre;
    els.specs.innerHTML = "";
    Object.entries(data.specs).forEach(([label, value]) => {
      const li = document.createElement("li");
      li.innerHTML = `<strong>${label}:</strong> ${value}`;
      els.specs.appendChild(li);
    });
    els.add.onclick = () => addToCart(data);
    modal.classList.add("open");
    document.addEventListener("keydown", onEsc);
  }

  function closeModal() {
    modal.classList.remove("open");
    document.removeEventListener("keydown", onEsc);
  }
  function onEsc(e) { if (e.key === "Escape") closeModal(); }
  modal.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });

  function addToCart(data) {
    cart.count++;
    cartBubble.textContent = `🛒 ${cart.count}`;
    showToast(`${data.nombre} agregado al carrito`);
    closeModal();
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1800);
  }
});
