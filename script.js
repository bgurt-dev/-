const products = [
  {
    id: 1,
    name: 'Echo Mini',
    category: 'audio',
    tag: 'Хіт продажу',
    description: 'Насичений звук у компактній колонці, яку зручно брати із собою.',
    price: 129,
    accent: 'purple',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Drift Pro',
    category: 'travel',
    tag: 'Новинка',
    description: 'Легкий павербанк, який допоможе зарядити ваші пристрої.',
    price: 179,
    accent: 'cyan',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Nest Beam',
    category: 'home',
    tag: 'Розумний гаджет',
    description: 'М’яке регульоване освітлення для затишку в будь-якій кімнаті.',
    price: 219,
    accent: 'gold',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'Orbit Dock',
    category: 'work',
    tag: 'Для робочого столу',
    description: 'Зручна зарядна станція для ваших щоденних пристроїв.',
    price: 89,
    accent: 'blue',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Pulse Buds',
    category: 'audio',
    tag: 'Бездротові',
    description: 'Зручні навушники з чистим звуком під час дзвінків і тривалою роботою.',
    price: 149,
    accent: 'pink',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Luma Pack',
    category: 'travel',
    tag: 'Компактний',
    description: 'Компактний органайзер для подорожей із кишенею для трекера.',
    price: 99,
    accent: 'green',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 7,
    name: 'AirSlate',
    category: 'work',
    tag: 'Для продуктивності',
    description: 'Тонка бездротова клавіатура для зосередженої роботи будь-де.',
    price: 249,
    accent: 'indigo',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 8,
    name: 'Glow Hub',
    category: 'home',
    tag: 'Підключений',
    description: 'Об’єднайте пристрої розумного дому в одному зручному центрі.',
    price: 159,
    accent: 'orange',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=900&q=80'
  }
];

const state = {
  cart: new Map(),
  currentFilter: 'all',
  searchTerm: '',
  sortBy: 'featured',
  favorites: new Set()
};

const productsGrid = document.getElementById('product-grid');
const cartCount = document.getElementById('cart-count');
const cartButton = document.getElementById('open-cart');
const cartDialog = document.getElementById('cart-dialog');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const resultsCount = document.getElementById('results-count');
const searchInput = document.getElementById('product-search');
const sortSelect = document.getElementById('sort-products');
const filterButtons = document.querySelectorAll('.filter');
const currency = new Intl.NumberFormat('uk-UA', {
  style: 'currency',
  currency: 'USD'
});
const categoryNames = {
  audio: 'Аудіо',
  travel: 'Подорожі',
  home: 'Для дому',
  work: 'Для роботи'
};
const gadgetPlural = new Intl.PluralRules('uk');
const gadgetForms = {
  one: 'гаджет',
  few: 'гаджети',
  many: 'гаджетів',
  other: 'гаджета'
};

function getVisibleProducts() {
  const searchTerm = state.searchTerm.trim().toLowerCase();
  const visibleProducts = products.filter((product) => {
    const matchesCategory = state.currentFilter === 'all'
      || product.category === state.currentFilter;
    const matchesSearch = !searchTerm
      || `${product.name} ${product.category} ${categoryNames[product.category]} ${product.description}`.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesSearch;
  });

  if (state.sortBy === 'price-low') {
    visibleProducts.sort((first, second) => first.price - second.price);
  } else if (state.sortBy === 'price-high') {
    visibleProducts.sort((first, second) => second.price - first.price);
  } else if (state.sortBy === 'name') {
    visibleProducts.sort((first, second) => first.name.localeCompare(second.name));
  }

  return visibleProducts;
}

function renderProducts() {
  const visibleProducts = getVisibleProducts();
  const form = gadgetPlural.select(visibleProducts.length);
  resultsCount.textContent = `${visibleProducts.length} ${gadgetForms[form]}`;

  if (visibleProducts.length === 0) {
    productsGrid.innerHTML = '<p class="empty-state">За вашим запитом нічого не знайдено. Спробуйте іншу назву або категорію.</p>';
    return;
  }

  productsGrid.innerHTML = visibleProducts.map((product) => {
    const favorite = state.favorites.has(product.id);
    return `
      <article class="product-card">
        <div class="product-visual">
          <img src="${product.image}" alt="${product.name} — гаджет для повсякденного життя" loading="lazy">
          <span class="product-tag">${product.tag}</span>
        </div>
        <div class="product-info">
          <p class="product-category">${categoryNames[product.category]}</p>
          <div class="product-meta">
            <h3>${product.name}</h3>
            <span class="product-rating" aria-label="${product.rating.toLocaleString('uk-UA')} з 5 зірок">★ ${product.rating.toLocaleString('uk-UA')}</span>
          </div>
          <p class="product-description">${product.description}</p>
          <div class="price-row">
            <span class="price">${currency.format(product.price)}</span>
          </div>
          <div class="product-actions">
            <button class="add-btn" data-add="${product.id}" type="button">До кошика</button>
            <button class="favorite-btn${favorite ? ' active' : ''}" data-favorite="${product.id}" type="button" aria-label="${favorite ? 'Вилучити' : 'Додати'} ${product.name} ${favorite ? 'з' : 'до'} обраного" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function updateCartCount() {
  const count = Array.from(state.cart.values()).reduce((total, quantity) => total + quantity, 0);
  const form = gadgetPlural.select(count);
  const itemForms = { one: 'товар', few: 'товари', many: 'товарів', other: 'товару' };
  cartCount.textContent = String(count);
  cartButton.setAttribute('aria-label', `Відкрити кошик, ${count} ${itemForms[form]}`);
}

function renderCart() {
  const entries = Array.from(state.cart.entries());
  const subtotal = entries.reduce((total, [id, quantity]) => {
    const product = products.find((item) => item.id === id);
    return total + product.price * quantity;
  }, 0);

  if (entries.length === 0) {
    cartItems.innerHTML = '<p class="cart-empty">Кошик порожній. Знайдіть гаджет до вподоби.</p>';
  } else {
    cartItems.innerHTML = entries.map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return `
        <article class="cart-item">
          <div class="cart-item-icon accent-${product.accent}" aria-hidden="true"></div>
          <div class="cart-item-info">
            <h3>${product.name}</h3>
            <span>${currency.format(product.price)} за шт.</span>
            <div class="quantity-controls" aria-label="Кількість товару ${product.name}">
              <button type="button" data-cart-action="decrease" data-id="${id}" aria-label="Зменшити кількість товару ${product.name}">−</button>
              <span>${quantity}</span>
              <button type="button" data-cart-action="increase" data-id="${id}" aria-label="Збільшити кількість товару ${product.name}">+</button>
            </div>
          </div>
          <div class="cart-item-end">
            <strong>${currency.format(product.price * quantity)}</strong>
            <button class="remove-item" type="button" data-cart-action="remove" data-id="${id}">Видалити</button>
          </div>
        </article>
      `;
    }).join('');
  }

  cartSubtotal.textContent = currency.format(subtotal);
  updateCartCount();
}

productsGrid.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button) return;

  if (button.dataset.add) {
    const id = Number(button.dataset.add);
    state.cart.set(id, (state.cart.get(id) || 0) + 1);
    renderCart();
    button.textContent = 'Додано';
    window.setTimeout(() => {
      if (button.isConnected) button.textContent = 'До кошика';
    }, 900);
  }

  if (button.dataset.favorite) {
    const id = Number(button.dataset.favorite);
    if (state.favorites.has(id)) {
      state.favorites.delete(id);
    } else {
      state.favorites.add(id);
    }
    renderProducts();
  }
});

document.getElementById('filters').addEventListener('click', (event) => {
  const button = event.target.closest('[data-category]');
  if (!button) return;

  state.currentFilter = button.dataset.category;
  filterButtons.forEach((filterButton) => {
    const isActive = filterButton === button;
    filterButton.classList.toggle('active', isActive);
    filterButton.setAttribute('aria-pressed', String(isActive));
  });
  renderProducts();
});

searchInput.addEventListener('input', () => {
  state.searchTerm = searchInput.value;
  renderProducts();
});

sortSelect.addEventListener('change', () => {
  state.sortBy = sortSelect.value;
  renderProducts();
});

cartItems.addEventListener('click', (event) => {
  const button = event.target.closest('[data-cart-action]');
  if (!button) return;

  const id = Number(button.dataset.id);
  const quantity = state.cart.get(id);
  if (button.dataset.cartAction === 'remove' || (button.dataset.cartAction === 'decrease' && quantity === 1)) {
    state.cart.delete(id);
  } else if (button.dataset.cartAction === 'decrease') {
    state.cart.set(id, quantity - 1);
  } else if (button.dataset.cartAction === 'increase') {
    state.cart.set(id, quantity + 1);
  }
  renderCart();
});

cartButton.addEventListener('click', () => {
  renderCart();
  cartDialog.showModal();
});

document.getElementById('close-cart').addEventListener('click', () => {
  cartDialog.close();
});

cartDialog.addEventListener('click', (event) => {
  if (event.target === cartDialog) cartDialog.close();
});

document.getElementById('checkout-button').addEventListener('click', () => {
  document.getElementById('checkout-message').textContent =
    'Поверни мамі карточку і більше так не роби.';
});

document.getElementById('theme-toggle').addEventListener('click', (event) => {
  const isLight = document.body.classList.toggle('light-theme');
  event.currentTarget.setAttribute('aria-pressed', String(isLight));
});

renderProducts();
renderCart();
