/* ─── CONFIGURACIÓN: edita aquí precios, enlace de pago y fin de la oferta ─── */
const CONFIG = {
  priceNow: 299,              // precio de lanzamiento (MXN)
  priceOld: 599,              // precio regular (MXN)
  checkoutUrl: '#',           // enlace a tu pasarela (Hotmart, Stripe, Gumroad, etc.)
  offerEnds: '2026-10-31T23:59:00-06:00', // fecha real de fin de la oferta (Samhain)
};

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const mxn = n => '$' + n.toLocaleString('es-MX');

/* Precios y enlaces */
$$('[data-price-now]').forEach(el => el.textContent = mxn(CONFIG.priceNow));
$$('[data-price-old]').forEach(el => el.textContent = mxn(CONFIG.priceOld));
$$('[data-checkout]').forEach(el => el.href = CONFIG.checkoutUrl);
let total = 0;
$$('[data-value]').forEach(el => { const v = +el.dataset.value; total += v; el.textContent = 'Valor ' + mxn(v); });
$$('[data-bonus-total]').forEach(el => el.textContent = mxn(total));
$$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

/* Cuenta regresiva */
const end = new Date(CONFIG.offerEnds).getTime();
const pad = n => String(Math.max(0, n)).padStart(2, '0');
function tick() {
  const d = Math.max(0, end - Date.now());
  const days = Math.floor(d / 864e5), h = Math.floor(d / 36e5) % 24, m = Math.floor(d / 6e4) % 60, s = Math.floor(d / 1e3) % 60;
  $$('[data-countdown]').forEach(c => {
    $('[data-d]', c).textContent = pad(days); $('[data-h]', c).textContent = pad(h);
    $('[data-m]', c).textContent = pad(m); $('[data-s]', c).textContent = pad(s);
  });
  if (d === 0) $$('.bar__txt').forEach(t => t.textContent = 'La oferta de lanzamiento terminó');
}
tick(); setInterval(tick, 1000);

/* Luna de hoy */
const PHASES = {
  nueva:     { name: 'luna nueva',  d: '',                                             desc: 'Cielo oscuro: momento de mirar hacia adentro y empezar algo pequeño.', dish: 'Cacao de la Luna Nueva' },
  creciente: { name: 'creciente',   d: 'M12 2A10 10 0 0 1 12 22A5 10 0 0 0 12 2Z',      desc: 'La luz crece cada noche: cocina lo que sube, masas, panes y fermentos.', dish: 'Hotcakes de Maíz Azul y Miel' },
  llena:     { name: 'luna llena',  d: 'M12 2A10 10 0 0 1 12 22A10 10 0 0 1 12 2Z',     desc: 'La noche más luminosa: mesas compartidas, gratitud y celebración.', dish: 'Mole Ritual de Cacao' },
  menguante: { name: 'menguante',   d: 'M12 2A10 10 0 0 0 12 22A5 10 0 0 1 12 2Z',      desc: 'La luz disminuye: tiempo de soltar, aprovechar y cerrar ciclos.', dish: 'Pan de Plátano con Especias' },
};
(function moon() {
  const syn = 29.530588853, ref = Date.UTC(2000, 0, 6, 18, 14);
  const age = (((Date.now() - ref) / 864e5) % syn + syn) % syn;
  const k = age < 1.85 || age > 27.68 ? 'nueva' : age < 13.3 ? 'creciente' : age < 16.3 ? 'llena' : 'menguante';
  const p = PHASES[k];
  $('[data-moon-path]').setAttribute('d', p.d);
  $('[data-moon-name]').textContent = p.name;
  $('[data-moon-desc]').textContent = p.desc;
  $('[data-moon-dish]').textContent = p.dish;
})();

/* Oráculo: cartas de intención */
const CARDS = [
  ['Amor','♡','Me trato con la ternura que doy.','Cocina: Agua de Jamaica y Naranja'],
  ['Abundancia','✺','Reconozco lo que ya tengo.','Cocina: Arroz de la Abundancia'],
  ['Protección','✥','Cuido mis límites con calma.','Cocina: Albóndigas en Chipotle del Hogar'],
  ['Claridad','✧','Veo lo que es, no lo que temo.','Cocina: Yogur con Cacao y Amaranto'],
  ['Valor','△','Doy el siguiente paso.','Cocina: Chilaquiles del Amanecer'],
  ['Descanso','◐','Descansar también es avanzar.','Cocina: Avena de Canela y Vainilla'],
  ['Soltar','▽','Dejo ir lo que ya cumplió su ciclo.','Cocina: Tinga de Flor de Jamaica'],
  ['Alegría','✿','Me permito disfrutar.','Cocina: Chocolate Caliente Ritual'],
  ['Creatividad','✦','Hago sin pedir permiso.','Cocina: Trufas de Cacao y Chile Ancho'],
  ['Nuevo comienzo','☾','Empiezo sin saberlo todo.','Cocina: Cacao de la Luna Nueva'],
  ['Gratitud','❋','Gracias por esta mesa.','Cocina: Calabaza de la Cosecha en Pipián'],
  ['Paz','○','Respiro y me quedo aquí.','Cocina: Arroz con Leche de Luna'],
  ['Comunidad','⁂','No camino en soledad.','Cocina: Pozole Verde de la Cosecha'],
  ['Paciencia','⧗','Lo bueno se cuece despacio.','Cocina: Frijoles de Olla del Hogar'],
  ['Celebración','✺','Hoy celebro lo cotidiano.','Cocina: Buñuelos con Miel de Piloncillo'],
];
const card = $('[data-card]');
let last = -1;
function draw() {
  const flip = () => {
    let i; do { i = Math.floor(Math.random() * CARDS.length); } while (i === last); last = i;
    const [t, g, p, tip] = CARDS[i];
    $('[data-c-n]').textContent = String(i + 1).padStart(2, '0');
    $('[data-c-g]').textContent = g; $('[data-c-t]').textContent = t;
    $('[data-c-p]').textContent = p; $('[data-c-tip]').textContent = tip;
    card.classList.add('is-flipped');
  };
  if (card.classList.contains('is-flipped')) { card.classList.remove('is-flipped'); setTimeout(flip, 600); } else flip();
}
$('[data-draw]').addEventListener('click', draw);
card.addEventListener('click', draw);

/* Frases que rotan */
const FEEL = ['“Quiero cocinar algo esta noche.”','“Quiero preparar una infusión.”','“Quiero aprender de la luna.”','“Quiero invitar a mis amigos.”','“Quiero crear mi propio ritual.”','“Quiero que mi cocina se sienta distinta.”','“Quiero imprimir los trackers.”','“Quiero armar mi despensa bruja.”'];
const feel = $('[data-rotate]'); let fi = 0;
setInterval(() => { feel.classList.add('is-out'); setTimeout(() => { fi = (fi + 1) % FEEL.length; feel.textContent = FEEL[fi]; feel.classList.remove('is-out'); }, 600); }, 3200);

/* Aparición al hacer scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } }), { threshold: .12 });
$$('.reveal').forEach(el => io.observe(el));

/* CTA fijo en móvil */
const sticky = $('[data-sticky]'), price = $('#precio');
const onScroll = () => {
  const r = price.getBoundingClientRect();
  sticky.classList.toggle('is-on', scrollY > 700 && !(r.top < innerHeight && r.bottom > 0));
};
addEventListener('scroll', onScroll, { passive: true });
