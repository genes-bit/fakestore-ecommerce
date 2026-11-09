const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const emptyState = document.getElementById('emptyState');
const productGrid = document.getElementById('productGrid');
const noResults = document.getElementById('noResults');

const cartBtn = document.getElementById('cartBtn');
const cartDrawer = document.getElementById('cartDrawer');
const cartOverlay = document.getElementById('cartOverlay');
const closeCartBtn = document.getElementById('closeCartBtn');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

let allProducts = [];
let cart = [];

async function fetchProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    allProducts = await response.json();
  } catch (error) {
    console.error('Error al cargar la API:', error);
  }
}

function executeSearch() {
  const query = searchInput.value.toLowerCase().trim();

  emptyState.classList.add('hidden');

  let filtered = allProducts;

  if (query !== '') {
    filtered = allProducts.filter(p => {
      const title = p.title.toLowerCase();
      const category = p.category.toLowerCase();

      if (query === 'jewelery' || query === 'jewelry' || query === 'joyas' || query === 'joyeria') {
        return category.includes('jewelery') || title.includes('gold') || title.includes('ring') || title.includes('silver');
      }

      return title.includes(query) || category.includes(query);
    });
  }

  if (filtered.length > 0) {
    renderProducts(filtered);
    noResults.classList.add('hidden');
    productGrid.classList.remove('hidden');
  } else {
    productGrid.classList.add('hidden');
    noResults.classList.remove('hidden');
  }
}

function renderProducts(products) {
  productGrid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.title}">
      <span class="category">${p.category}</span>
      <h4>${p.title}</h4>
      <div class="price-row">
        <span class="price">$${p.price} USD</span>
        <button class="add-btn" data-id="${p.id}">Agregar</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = allProducts.find(p => p.id === id);
  if (item) {
    cart.push(item);
    updateCartUI();
  }
}

function updateCartUI() {
  cartBtn.innerHTML = `<i class="fa-solid fa-cart-shopping"></i> Carrito (${cart.length})`;

  if (cart.length === 0) {
    cartItemsList.innerHTML = '<p style="text-align:center; padding: 20px; color: #666;">El carrito está vacío.</p>';
    cartTotal.textContent = '0.00';
    return;
  }

  let total = 0;
  cartItemsList.innerHTML = cart.map((item, index) => {
    total += item.price;
    return `
      <div class="cart-item">
        <input type="checkbox" class="item-checkbox" checked />
        <img src="${item.image}" alt="${item.title}">
        <div style="flex:1;">
          <div style="font-size:0.8rem; font-weight:bold;">${item.title.substring(0, 16)}...</div>
          <small style="color:#10b981; font-weight:bold;">$${item.price} USD</small>
        </div>
        <button class="remove-btn" data-index="${index}">Eliminar</button>
      </div>
    `;
  }).join('');

  cartTotal.textContent = total.toFixed(2);
}

function openCart() {
  cartDrawer.classList.add('open');
  cartOverlay.classList.remove('hidden');
}

function closeCart() {
  cartDrawer.classList.remove('open');
  cartOverlay.classList.add('hidden');
}

function handleCheckout() {
  if (cart.length === 0) {
    alert('Error de compra: El carrito está vacío. Agrega productos antes de finalizar.');
    return;
  }

  alert('¡Compra realizada con éxito! Gracias por tu compra.');
  cart = [];
  updateCartUI();
  closeCart();
}

productGrid.addEventListener('click', (e) => {
  if (e.target.classList.contains('add-btn')) {
    const id = Number(e.target.getAttribute('data-id'));
    addToCart(id);
  }
});

cartItemsList.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const index = Number(e.target.getAttribute('data-index'));
    cart.splice(index, 1);
    updateCartUI();
  }
});

searchBtn.addEventListener('click', executeSearch);
searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') executeSearch();
});

cartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', handleCheckout);

fetchProducts();