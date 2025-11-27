// Data produk (sesuaikan dengan produk nyata Anda)
const PRODUCTS = [
  {id:1,name:"HNI Health 500ml",category:"madu",price:125000,desc:"Madu murni sumber energi & imun",img:"https://hni.net/public/front/img/produk/hni-health-3_18-11-24_.png",sold:320},
  {id:2,name:"Fibdrink Original",category:"suplemen",price:85000,desc:"Minuman serat untuk kesehatan pencernaan",img:"https://hni.net/public/front/img/produk/fibdrink_10-12-22_.png",sold:250},
  {id:3,name:"Sevel Stamina",category:"lainnya",price:65000,desc:"Ramuan tradisional untuk stamina",img:"https://hni.net/public/front/img/produk/sevel-stamina_11-09-25_.png",sold:180},
  {id:4,name:"Zidavit Multivitamin",category:"suplemen",price:99000,desc:"Suplemen vitamin lengkap untuk keluarga",img:"https://hni.net/public/front/img/produk/zidavit_18-11-24_.png",sold:210},
  {id:5,name:"Fibdrink Lemon",category:"lainnya",price:78000,desc:"Fibdrink varian lemon, menyegarkan",img:"https://hni.net/public/front/img/produk/fibdrink-lemon_20-10-23_.png",sold:140},
  {id:6,name:"Madu SJ 250ml",category:"madu",price:69000,desc:"Madu organik pilihan",img:"https://hni.net/public/front/img/produk/MADU%20SJ-1_07-01-19_.png",sold:280},
  {id:7,name:"Madu Campuran Propolis 350ml",category:"madu",price:99000,desc:"Madu + propolis untuk perlindungan ekstra",img:"https://hni.net/public/front/img/produk/hni-health-3_18-11-24_.png",sold:210},
  {id:8,name:"Suplemen Omega Herbal",category:"suplemen",price:145000,desc:"Kaya omega dari sumber nabati",img:"https://hni.net/public/front/img/produk/fibdrink_10-12-22_.png",sold:110}
];

// REVIEW SAMPLE
const REVIEWS = [
  {name:"Siti R", text:"Produk sampai cepat, madu asli enak. Saya pesan lagi!"},
  {name:"Budi A", text:"Suplemennya membantu stamina saya saat kerja shift."},
  {name:"Maya L", text:"Pelayanan ramah & packing rapi. Recommended."}
];

// Nomor WhatsApp toko (format internasional, tanpa +)
const WHATSAPP_NUMBER = "6282241900467";

// ---- Cart logic (localStorage) ----
const CART_KEY = "herbaprima_cart_v1";
function getCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY))||[];
  }catch(e){return [];}
}
function saveCart(cart){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function addToCart(id, qty=1){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item) item.qty += qty; else cart.push({id,qty});
  saveCart(cart); refreshCartUI();
}
function removeFromCart(id){
  let cart = getCart().filter(i=>i.id!==id); saveCart(cart); refreshCartUI();
}
function updateQty(id, qty){
  const cart = getCart();
  const item = cart.find(i=>i.id===id);
  if(item){ item.qty = Math.max(0,qty); }
  saveCart(cart); refreshCartUI();
}
function cartSummary(){
  const cart = getCart();
  let total = 0;
  const details = cart.map(ci=>{
    const p = PRODUCTS.find(x=>x.id===ci.id);
    const subtotal = (p ? p.price : 0) * ci.qty;
    total += subtotal;
    return {...p, qty:ci.qty, subtotal};
  });
  return {items:details, total};
}

// ---- Render functions ----
function rupiah(v){
  return 'Rp' + v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function renderProductsGrid(targetId, products){
  const el = document.getElementById(targetId);
  if(!el) return;
  el.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-media"><img src="${p.img}" alt="${p.name}"></div>
      <div class="product-title">${p.name}</div>
      <div class="product-price">${rupiah(p.price)}</div>
      <div class="product-actions">
        <a class="btn btn-ghost" href="product.html?id=${p.id}">Detail</a>
        <button class="btn btn-primary" data-add="${p.id}">Tambah</button>
      </div>
    `;
    el.appendChild(card);
  });
  // attach add buttons
  el.querySelectorAll('[data-add]').forEach(b=>{
    b.addEventListener('click', ev=>{
      const id = parseInt(b.getAttribute('data-add'),10);
      addToCart(id,1);
      b.textContent = "Ditambahkan ✓";
      setTimeout(()=> b.textContent = "Tambah", 1200);
    });
  });
}

function renderBestsellers(){
  const sorted = [...PRODUCTS].sort((a,b)=>b.sold - a.sold).slice(0,3);
  renderProductsGrid('bestsellers', sorted);
}

function renderReviews(){
  const el = document.getElementById('reviewsCarousel');
  if(!el) return;
  el.innerHTML = '';
  REVIEWS.forEach(r=>{
    const div = document.createElement('div');
    div.className = 'review-card';
    div.innerHTML = `<strong>${r.name}</strong><p style="color:var(--muted)">${r.text}</p>`;
    el.appendChild(div);
  });
}

function refreshCartUI(){
  const counts = document.querySelectorAll('#cartCount, #cartCount2, #cartCount3, #cartCount4');
  const cart = getCart();
  const totalQty = cart.reduce((s,i)=>s+i.qty,0);
  counts.forEach(c=>{ if(c) c.textContent = totalQty; });
  // Update overlay content
  const cartItemsEl = document.getElementById('cartItems');
  if(cartItemsEl){
    const {items, total} = cartSummary();
    cartItemsEl.innerHTML = '';
    if(items.length===0){ cartItemsEl.innerHTML = '<p>Keranjang kosong</p>'; }
    items.forEach(it=>{
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${it.img}" alt="${it.name}">
        <div style="flex:1">
          <div style="font-weight:600">${it.name}</div>
          <div style="color:var(--muted)"> ${rupiah(it.price)} x <span class="qty">${it.qty}</span></div>
        </div>
        <div style="text-align:right">
          <div>${rupiah(it.subtotal)}</div>
          <div style="margin-top:6px">
            <button class="btn btn-ghost small dec" data-id="${it.id}">-</button>
            <button class="btn btn-ghost small inc" data-id="${it.id}">+</button>
            <button class="btn btn-ghost small rm" data-id="${it.id}">hapus</button>
          </div>
        </div>
      `;
      cartItemsEl.appendChild(div);
    });
    document.getElementById('cartTotal').textContent = rupiah(total);

    // events
    cartItemsEl.querySelectorAll('.inc').forEach(b=>{
      b.addEventListener('click',()=> updateQty(parseInt(b.dataset.id,10), getQty(parseInt(b.dataset.id,10))+1));
    });
    cartItemsEl.querySelectorAll('.dec').forEach(b=>{
      b.addEventListener('click',()=> updateQty(parseInt(b.dataset.id,10), Math.max(1,getQty(parseInt(b.dataset.id,10))-1)));
    });
    cartItemsEl.querySelectorAll('.rm').forEach(b=>{
      b.addEventListener('click',()=> removeFromCart(parseInt(b.dataset.id,10)));
    });
  }

  // order summary on checkout
  const orderItemsEl = document.getElementById('orderItems');
  if(orderItemsEl){
    const {items,total} = cartSummary();
    orderItemsEl.innerHTML = '';
    if(items.length===0){ orderItemsEl.innerHTML = '<p>Keranjang kosong</p>'; }
    items.forEach(it=>{
      const div = document.createElement('div');
      div.style.display='flex';div.style.justifyContent='space-between';div.style.marginBottom='0.5rem';
      div.innerHTML = `<div>${it.name} x ${it.qty}</div><div>${rupiah(it.subtotal)}</div>`;
      orderItemsEl.appendChild(div);
    });
    const orderTotalEl = document.getElementById('orderTotal');
    if(orderTotalEl) orderTotalEl.textContent = rupiah(total);
  }
}

function getQty(id){
  const cart = getCart();
  const it = cart.find(x=>x.id===id); return it?it.qty:0;
}

// ---- Product detail page rendering ----
function renderProductDetail(){
  const el = document.getElementById('productDetail');
  if(!el) return;
  const qp = new URLSearchParams(location.search);
  const id = parseInt(qp.get('id')||'0',10);
  const prod = PRODUCTS.find(p=>p.id===id) || PRODUCTS[0];
  el.innerHTML = `
    <div class="product-detail-card" style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
      <div>
        <div style="background:var(--soft);border-radius:12px;padding:1rem;text-align:center">
          <img src="${prod.img}" alt="${prod.name}" style="max-width:100%;height:320px;object-fit:contain">
        </div>
      </div>
      <div>
        <h1>${prod.name}</h1>
        <div style="color:var(--muted);margin-bottom:0.6rem">${prod.desc}</div>
        <div style="font-size:1.2rem;color:var(--accent);font-weight:700">${rupiah(prod.price)}</div>
        <div style="margin-top:1rem;display:flex;gap:0.6rem;align-items:center">
          <label>Jumlah <input id="qtySelect" type="number" min="1" value="1" style="width:80px;padding:0.4rem;border-radius:8px;border:1px solid #e6eef0"></label>
          <button id="addToCartBtn" class="btn btn-primary">Tambah ke Keranjang</button>
          <a href="checkout.html" class="btn btn-ghost">Checkout</a>
        </div>
        <div style="margin-top:1.2rem;color:var(--muted)">
          <strong>Terjual:</strong> ${prod.sold} &nbsp; | &nbsp; <strong>Kategori:</strong> ${prod.category}
        </div>
      </div>
    </div>
  `;
  const btn = document.getElementById('addToCartBtn');
  btn.addEventListener('click', ()=>{
    const qty = parseInt(document.getElementById('qtySelect').value||'1',10);
    addToCart(prod.id, qty);
    btn.textContent = 'Ditambahkan ✓';
    setTimeout(()=> btn.textContent = 'Tambah ke Keranjang', 900);
  });
}

// ---- Hero slider basic ----
function initSlider(){
  const slider = document.getElementById('heroSlider');
  if(!slider) return;
  const slides = slider.querySelectorAll('.slide');
  let idx = 0;
  function show(i){
    slides.forEach((s,si)=> s.style.display = (si===i? 'block':'none'));
  }
  show(0);
  const nextBtn = slider.querySelector('.next');
  const prevBtn = slider.querySelector('.prev');
  nextBtn.addEventListener('click', ()=> { idx = (idx+1)%slides.length; show(idx); });
  prevBtn.addEventListener('click', ()=> { idx = (idx-1+slides.length)%slides.length; show(idx); });
  setInterval(()=>{ idx=(idx+1)%slides.length; show(idx); }, 5000);
}

// ---- Header cart overlay toggles ----
function initCartOverlay(){
  const cartBtn = document.getElementById('cartBtn');
  const cartBtn2 = document.getElementById('cartBtn2');
  const cartBtn3 = document.getElementById('cartBtn3');
  const cartBtn4 = document.getElementById('cartBtn4');
  const overlay = document.getElementById('cartOverlay');
  const close = document.getElementById('closeCart');
  if(cartBtn) cartBtn.addEventListener('click', ()=> toggleCart());
  [cartBtn2,cartBtn3,cartBtn4].forEach(b=>{ if(b) b.addEventListener('click', ()=> toggleCart()); });
  if(close) close.addEventListener('click', ()=> toggleCart());
  overlay && overlay.addEventListener('click', (e)=> { if(e.target === overlay) toggleCart(); });
}
function toggleCart(){
  const overlay = document.getElementById('cartOverlay');
  if(!overlay) return;
  if(overlay.classList.contains('hidden')){ overlay.classList.remove('hidden'); overlay.setAttribute('aria-hidden','false'); }
  else { overlay.classList.add('hidden'); overlay.setAttribute('aria-hidden','true'); }
}

// ---- Filter on products page ----
function initFilters(){
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.filter;
      if(mode==='all') renderProductsGrid('productsGridFull', PRODUCTS);
      else renderProductsGrid('productsGridFull', PRODUCTS.filter(p=>p.category===mode));
    });
  });
}

// ---- Checkout form -> WhatsApp ----
function initCheckoutForm(){
  const form = document.getElementById('checkoutForm');
  if(!form) return;
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const addr = document.getElementById('custAddress').value.trim();
    const note = document.getElementById('custNote').value.trim();
    const {items,total} = cartSummary();
    if(items.length===0){ alert('Keranjang kosong. Silakan tambahkan produk sebelum checkout.'); return; }
    // Build message
    let msg = `*Pesanan dari ${name}*\n`;
    msg += `No HP: ${phone}\n`;
    msg += `Alamat: ${addr}\n\n`;
    msg += `*Detail Pesanan:*\n`;
    items.forEach(it=> msg += `- ${it.name} x ${it.qty} = ${rupiah(it.subtotal)}\n`);
    msg += `\n*Total*: ${rupiah(total)}\n`;
    if(note) msg += `\nCatatan: ${note}\n`;
    msg += `\nMohon konfirmasi ketersediaan & estimasi pengiriman. Terima kasih.`;
    // open WA
    const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
    window.open(waLink, '_blank');
  });
}

// ---- General init on DOMContentLoaded ----
document.addEventListener('DOMContentLoaded', ()=>{
  // set years
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());
  document.getElementById('year2') && (document.getElementById('year2').textContent = new Date().getFullYear());
  document.getElementById('year3') && (document.getElementById('year3').textContent = new Date().getFullYear());

  // render home product preview (take first 4)
  renderProductsGrid('productsGrid', PRODUCTS.slice(0,4));
  renderProductsGrid('productsGridFull', PRODUCTS); // for products page (if present)
  renderBestsellers();
  renderReviews();
  initSlider();
  initCartOverlay();
  initFilters();
  refreshCartUI();
  renderProductDetail();
  initCheckoutForm();

  // attach global events to update UI after modification
  window.addEventListener('storage', refreshCartUI);
});