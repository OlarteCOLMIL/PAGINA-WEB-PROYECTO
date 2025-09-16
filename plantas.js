
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

  // 2) Utilidad para formatear en pesos colombianos (COP)
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
  .modal-planta .btn-ghost{background:#eee}
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

    li.style.cursor = "pointer";
    li.addEventListener("click", () => openModal(data, img?.src || null));
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

  function onEsc(e) {
    if (e.key === "Escape") closeModal();
  }


  modal.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof Element && target.hasAttribute("data-close")) {
      closeModal();
    }
  });
});
