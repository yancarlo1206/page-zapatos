// nombre, tipo, cuerpo, suela, acento, acento2, fondo, precio
const P = [
  ["Nube", "sneaker", "#e63946", "#f1faee", "#1d3557", "#f1faee", "#ffe1e3", 189900],
  ["Ruta", "boot", "#8d5a2b", "#2b1d10", "#d9a066", "#f4e3c8", "#f3e2cc", 329900],
  ["Alba", "loafer", "#1f2a44", "#0e1424", "#d4a72c", "#d4a72c", "#dbe3f5", 259900],
  ["Menta", "sneaker", "#2a9d8f", "#ffffff", "#264653", "#e9c46a", "#d5f2ee", 199900],
  ["Sol", "sneaker", "#ffb703", "#ffffff", "#14161c", "#14161c", "#fff0c2", 179900],
  ["Roble", "boot", "#2f2f35", "#f0ece4", "#ff6b35", "#ffffff", "#e4e4ea", 349900],
  ["Bruma", "loafer", "#b58bd9", "#4a2c66", "#f5e6ff", "#f5e6ff", "#efe3fa", 239900],
  ["Coral", "sneaker", "#ff7f50", "#fff7ed", "#7b2d26", "#fff7ed", "#ffe4d6", 194900],
  ["Cielo", "sneaker", "#4cc9f0", "#ffffff", "#3a0ca3", "#ffffff", "#d9f3fc", 204900]
];
const TIPOS = { sneaker: "Tenis", boot: "Botas", loafer: "Mocasines" };
const TALLAS = [36, 37, 38, 39, 40, 41, 42, 43, 44];
const $ = s => document.querySelector(s);
const fmt = n => "$ " + n.toLocaleString("es-CO");
const svg = (p, c = "") => `<svg class="${c}" viewBox="0 0 300 180" role="img" aria-label="Zapato ${p[0]}" style="--body:${p[2]};--sole:${p[3]};--accent:${p[4]};--accent2:${p[5]}"><use href="#${p[1]}"/></svg>`;

let filtro = "Todos", view = "cart", orden = 0, cart = [];
try { cart = JSON.parse(localStorage.getItem("paso-cart") || "[]") } catch (e) { cart = [] }
if (!Array.isArray(cart)) cart = [];
cart = cart.filter(c => c && P[c.i] && c.q > 0 && TALLAS.includes(Number(c.t)));
const save = () => { try { localStorage.setItem("paso-cart", JSON.stringify(cart)) } catch (e) { } };

$("#heroImg").innerHTML = svg(["Nube", "sneaker", "#e63946", "#ffffff", "#14161c", "#ffffff"]);

function renderChips() {
  $("#chips").innerHTML = ["Todos", ...Object.values(TIPOS)].map(t => `<button data-f="${t}" aria-pressed="${t === filtro}">${t}</button>`).join("");
}
function renderGrid() {
  $("#tienda").innerHTML = P.map((p, i) => ({ p, i })).filter(({ p }) => filtro === "Todos" || TIPOS[p[1]] === filtro).map(({ p, i }) =>
    `<article class="card"><div class="pic" style="--c:${p[6]}">${svg(p)}</div><div class="info"><div class="row"><span class="name">${p[0]}</span><span>${fmt(p[7])}</span></div><div class="kind">${TIPOS[p[1]]}</div><select id="t${i}" aria-label="Talla de ${p[0]}"><option value="">Elige tu talla</option>${TALLAS.map(t => `<option>${t}</option>`).join("")}</select><button class="add" data-add="${i}">Agregar al carrito</button></div></article>`).join("");
}
const subtotal = () => cart.reduce((s, c) => s + P[c.i][7] * c.q, 0);

function renderCart() {
  $("#cnt").textContent = cart.reduce((s, c) => s + c.q, 0);
  const sub = subtotal(), env = (sub === 0 || sub >= 250000) ? 0 : 12000, tot = sub + env;
  let h = "";
  if (view === "done") {
    h = `<div class="msg"><h3>¡Pedido recibido!</h3><p>Pedido n.º ${orden}. Te enviaremos la confirmación al correo que indicaste.</p><p class="kind">Esto es una demostración: no se hizo ningún cobro real.</p><button class="add" data-go="close">Seguir comprando</button></div>`;
  } else if (!cart.length) {
    h = `<div class="msg"><h3>Tu carrito está vacío</h3><p>Elige un par y una talla para empezar.</p><button class="add" data-go="close">Ver zapatos</button></div>`;
  } else {
    const sum = `<dl class="sum"><div><dt>Subtotal</dt><dd>${fmt(sub)}</dd></div><div><dt>Envío</dt><dd>${env ? fmt(env) : "Gratis"}</dd></div><div class="tot"><dt>Total</dt><dd>${fmt(tot)}</dd></div></dl>`;
    if (view === "checkout") {
      h = `<form id="co"><label>Nombre completo<input name="n" required autocomplete="name"></label><label>Correo<input name="e" type="email" required autocomplete="email"></label><label>Dirección de entrega<input name="d" required autocomplete="street-address"></label><label>Ciudad<input name="c" required autocomplete="address-level2"></label><p class="kind">Pagas al recibir tu pedido.</p>${sum}<button class="add" type="submit">Confirmar pedido</button><button type="button" class="lnk" data-go="cart">Volver al carrito</button></form>`;
    } else {
      h = `<ul class="items">${cart.map((c, k) => { const p = P[c.i]; return `<li class="it"><div class="th" style="--c:${p[6]}">${svg(p)}</div><div><b>${p[0]}</b><div class="kind">Talla ${c.t} · ${fmt(p[7])}</div><div class="q"><button data-q="${k}" data-d="-1" aria-label="Quitar una unidad">−</button><span>${c.q}</span><button data-q="${k}" data-d="1" aria-label="Agregar una unidad">+</button></div></div><div class="ct"><b>${fmt(p[7] * c.q)}</b><button class="lnk" data-rm="${k}">Quitar</button></div></li>` }).join("")}</ul>${sum}<button class="add" data-go="checkout">Finalizar compra</button>`;
    }
  }
  $("#dbody").innerHTML = h;
}
function openCart(v) {
  if (v) view = v;
  renderCart();
  $("#drawer").classList.add("open"); $("#shade").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  $("#closeBtn").focus();
}
function closeCart() {
  $("#drawer").classList.remove("open"); $("#shade").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  if (view === "done" || view === "checkout") view = "cart";
  renderCart();
}

$("#chips").addEventListener("click", e => {
  const b = e.target.closest("[data-f]"); if (!b) return;
  filtro = b.dataset.f; renderChips(); renderGrid();
});
$("#tienda").addEventListener("click", e => {
  const b = e.target.closest("[data-add]"); if (!b) return;
  const i = Number(b.dataset.add), sel = $("#t" + i);
  if (!sel.value) { sel.classList.add("err"); sel.focus(); return }
  sel.classList.remove("err");
  const t = sel.value, f = cart.find(c => c.i === i && String(c.t) === t);
  if (f) f.q++; else cart.push({ i, t, q: 1 });
  save(); renderCart();
  b.textContent = "¡Agregado!";
  setTimeout(() => { b.textContent = "Agregar al carrito" }, 1200);
});
$("#tienda").addEventListener("change", e => { if (e.target.matches("select")) e.target.classList.remove("err") });
$("#dbody").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.dataset.q !== undefined) {
    const c = cart[b.dataset.q]; c.q += Number(b.dataset.d);
    if (c.q < 1) cart.splice(b.dataset.q, 1);
    save(); renderCart();
  } else if (b.dataset.rm !== undefined) {
    cart.splice(b.dataset.rm, 1); save(); renderCart();
  } else if (b.dataset.go) {
    if (b.dataset.go === "close") closeCart();
    else { view = b.dataset.go; renderCart() }
  }
});
$("#dbody").addEventListener("submit", e => {
  e.preventDefault();
  orden = Math.floor(1000 + Math.random() * 9000);
  cart = []; save(); view = "done"; renderCart();
});
$("#cartBtn").addEventListener("click", () => openCart(cart.length ? "cart" : "cart"));
$("#closeBtn").addEventListener("click", closeCart);
$("#shade").addEventListener("click", closeCart);
document.addEventListener("keydown", e => { if (e.key === "Escape") closeCart() });

renderChips(); renderGrid(); renderCart();
