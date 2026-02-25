// ========== MAIN APPLICATION - PHILIPPINES VERSION ==========
const App = {
    // Initialize the app
    init: () => {
        App.setupNavigation();
        App.setupKeyboardShortcuts();
        App.renderHomePage();
    },

    // Setup navigation
    setupNavigation: () => {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (AppData.session.cart.length > 0) {
                    if (!confirm('You have items in your cart. Leave page?')) {
                        return;
                    }
                }
                
                document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
                item.classList.add('active');
                
                const pageId = item.dataset.page;
                
                switch(pageId) {
                    case 'home': App.renderHomePage(); break;
                    case 'products': App.renderProductsPage(); break;
                    case 'inventory': App.renderInventoryPage(); break;
                    case 'calendar': App.renderCalendarPage(); break;
                    case 'loyalty': App.renderLoyaltyPage(); break;
                    case 'employees': App.renderEmployeesPage(); break;
                }
            });
        });
    },

    // Setup keyboard shortcuts
    setupKeyboardShortcuts: () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                if (AppData.session.cart.length > 0) {
                    if (confirm('Start new transaction?')) {
                        AppData.session.cart = [];
                        AppData.session.selectedCustomer = null;
                        App.renderHomePage();
                    }
                }
            }
            if (e.key === 'F2') {
                e.preventDefault();
                if (AppData.session.cart.length > 0) {
                    App.showPaymentModal();
                }
            }
            if (e.key === 'Escape') {
                if (AppData.session.cart.length > 0) {
                    if (confirm('Cancel current transaction?')) {
                        AppData.session.cart = [];
                        AppData.session.selectedCustomer = null;
                        App.renderHomePage();
                    }
                }
            }
        });
    },

    // ========== PAGE RENDERING ==========
    renderHomePage: () => {
        const page = document.getElementById('home-page');
        
        const subtotal = AppData.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subtotal * AppData.settings.taxRate;
        const total = subtotal + tax;
        
        const today = new Date().toISOString().split('T')[0];
        const todaySales = AppData.transactions
            .filter(t => t.date === today)
            .reduce((sum, t) => sum + t.total, 0);
        const todayTransactions = AppData.transactions.filter(t => t.date === today).length;
        
        page.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h1>Point of Sale - Philippines</h1>
                <div style="display: flex; gap: 1rem;">
                    <span class="badge">
                        <i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}
                    </span>
                    <span class="badge">
                        <i class="fas fa-clock"></i> <span id="currentTime">${new Date().toLocaleTimeString()}</span>
                    </span>
                </div>
            </div>

            ${Components.renderDashboardCards()}

            <div style="display: grid; grid-template-columns: 1fr 400px; gap: 2rem;">
                <div class="panel">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h3>Product Catalog</h3>
                        <div style="display: flex; gap: 0.5rem;">
                            <input type="text" id="productSearch" placeholder="Search products..." class="search-input" style="padding: 0.5rem 1rem;">
                            <button class="btn btn-secondary" onclick="App.searchProducts()">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
                        <button class="category-tab active" data-category="all">All</button>
                        <button class="category-tab" data-category="Hot">☕ Hot</button>
                        <button class="category-tab" data-category="Iced">🧊 Iced</button>
                        <button class="category-tab" data-category="Non-Coffee">🍵 Non-Coffee</button>
                        <button class="category-tab" data-category="Snacks">🥐 Snacks</button>
                    </div>
                    
                    <div class="product-grid" id="productGrid">
                        ${Components.renderProductButtons()}
                    </div>
                </div>

                <div class="panel" style="display: flex; flex-direction: column;">
                    <div style="background: var(--color-secondary); padding: 1rem; border-radius: var(--radius-lg); margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span><i class="fas fa-receipt"></i> Transaction #${TransactionState.receiptNumber}</span>
                            <span>${new Date().toLocaleTimeString()}</span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <span class="badge">Items: ${AppData.session.cart.reduce((sum, i) => sum + i.qty, 0)}</span>
                            <span class="badge">Qty: ${AppData.session.cart.length}</span>
                        </div>
                    </div>

                    <div class="cart-items" id="cartContainer">
                        ${Components.renderCart(AppData.session.cart)}
                    </div>

                    <div style="background: var(--color-bg); padding: 1rem; border-radius: var(--radius-lg); margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Subtotal:</span>
                            <span>${Components.formatPeso(subtotal)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>VAT (${AppData.settings.taxRate * 100}%):</span>
                            <span>${Components.formatPeso(tax)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 1.5rem; font-weight: 600; border-top: 2px solid var(--color-border); padding-top: 1rem;">
                            <span>Total:</span>
                            <span>${Components.formatPeso(total)}</span>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <button class="btn btn-secondary" onclick="App.holdTransaction()">
                            <i class="fas fa-pause"></i> Hold
                        </button>
                        <button class="btn btn-secondary" onclick="App.voidTransaction()">
                            <i class="fas fa-times"></i> Void
                        </button>
                        <button class="btn btn-secondary" onclick="App.discountTransaction()">
                            <i class="fas fa-percent"></i> Discount
                        </button>
                        <button class="btn btn-primary" onclick="App.showPaymentModal()" ${AppData.session.cart.length === 0 ? 'disabled' : ''}>
                            <i class="fas fa-peso-sign"></i> Pay (F2)
                        </button>
                    </div>
                </div>
            </div>

            <div class="table-container mt-2">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3>Recent Transactions</h3>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Receipt #</th>
                            <th>Time</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Payment</th>
                            <th>Customer</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${Components.renderTransactions()}
                    </tbody>
                </table>
            </div>
        `;

        // Add category tab listeners
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                App.filterProducts(tab.dataset.category);
            });
        });

        // Add product search listener
        const searchInput = document.getElementById('productSearch');
        if (searchInput) {
            searchInput.addEventListener('input', App.searchProducts);
        }

        // Update time every second
        if (!window.timeInterval) {
            window.timeInterval = setInterval(() => {
                const timeElement = document.getElementById('currentTime');
                if (timeElement) {
                    timeElement.textContent = new Date().toLocaleTimeString();
                }
            }, 1000);
        }

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    renderProductsPage: (filter = 'all') => {
        const page = document.getElementById('products-page');
        
        page.innerHTML = `
            <h1>Product Catalog</h1>
            
            <div style="display: flex; gap: 1rem; margin-bottom: 2rem;">
                <button class="btn category-tab ${filter === 'all' ? 'active' : ''}" data-filter="all">All</button>
                <button class="btn category-tab ${filter === 'Hot' ? 'active' : ''}" data-filter="Hot">Hot</button>
                <button class="btn category-tab ${filter === 'Iced' ? 'active' : ''}" data-filter="Iced">Iced</button>
                <button class="btn category-tab ${filter === 'Non-Coffee' ? 'active' : ''}" data-filter="Non-Coffee">Non-Coffee</button>
                <button class="btn category-tab ${filter === 'Snacks' ? 'active' : ''}" data-filter="Snacks">Snacks</button>
            </div>

            <div class="product-grid" style="grid-template-columns: repeat(4, 1fr);">
                ${Components.renderProductCatalog(filter)}
            </div>
        `;

        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                App.renderProductsPage(tab.dataset.filter);
            });
        });

        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    renderInventoryPage: () => {
        const page = document.getElementById('inventory-page');
        const inventory = Components.renderInventory();
        
        page.innerHTML = `
            <h1>Inventory Management</h1>
            
            <div class="inventory-grid">
                <div class="inventory-card">
                    <h3><i class="fas fa-flask"></i> Ingredients</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Stock</th>
                                <th>Min</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventory.ingredients}
                        </tbody>
                    </table>
                </div>
                
                <div class="inventory-card">
                    <h3><i class="fas fa-box"></i> Materials</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Stock</th>
                                <th>Min</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${inventory.materials}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    renderCalendarPage: () => {
        const page = document.getElementById('calendar-page');
        
        let days = '';
        for (let d = 1; d <= 31; d++) {
            const revenue = 5000 + Math.floor(Math.random() * 8000);
            days += `
                <div class="cal-day" onclick="App.showSalesDetail(${d}, ${revenue})">
                    <div class="day-number">${d}</div>
                    <span class="sales-amount">${Components.formatPeso(revenue)}</span>
                </div>
            `;
        }
        
        page.innerHTML = `
            <h1>Sales Calendar</h1>
            
            <div class="calendar-container">
                <div class="calendar-header">
                    <h2>March 2026</h2>
                    <div>
                        <button class="btn btn-secondary"><i class="fas fa-chevron-left"></i></button>
                        <button class="btn btn-secondary"><i class="fas fa-chevron-right"></i></button>
                    </div>
                </div>
                
                <div class="weekdays">
                    <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                </div>
                
                <div class="calendar-grid" id="calendarGrid">
                    ${days}
                </div>
            </div>

            <div class="inventory-card mt-2" id="salesDetail">
                <h3>📊 Select a date to view sales details</h3>
            </div>
        `;
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    renderLoyaltyPage: () => {
        const page = document.getElementById('loyalty-page');
        
        page.innerHTML = `
            <h1>Customer Loyalty Program</h1>
            
            <div class="loyalty-header">
                <div class="search-box">
                    <input type="text" id="customerSearch" placeholder="Search by name, email, or phone...">
                    <button class="btn btn-secondary" onclick="App.searchCustomers()">
                        <i class="fas fa-search"></i> Search
                    </button>
                    <button class="btn btn-primary" onclick="App.showAddCustomerModal()">
                        <i class="fas fa-plus"></i> Add Customer
                    </button>
                </div>
            </div>

            <div class="customer-grid" id="customerGrid">
                ${Components.renderCustomerCards(AppData.customers, AppData.session.selectedCustomer?.id)}
            </div>
        `;
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    renderEmployeesPage: () => {
        const page = document.getElementById('employees-page');
        
        page.innerHTML = `
            <h1>Staff Performance</h1>
            
            <div class="employee-grid">
                ${Components.renderEmployees()}
            </div>

            <div class="inventory-card mt-2">
                <h3>🏆 Top Performer of the Month</h3>
                <div style="display: flex; align-items: center; gap: 2rem; margin-top: 1rem;">
                    <div style="font-size: 4rem;">👩‍💼</div>
                    <div>
                        <h2>Elena Rose</h2>
                        <p>137 transactions · ${Components.formatPeso(51230)} in sales · 5.0 rating</p>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        page.classList.add('active');
    },

    // ========== TRANSACTION FUNCTIONS ==========
    addToCart: (productId) => {
        const product = AppData.products.find(p => p.id === productId);
        const existing = AppData.session.cart.find(i => i.id === productId);
        
        if (existing) {
            existing.qty++;
        } else {
            AppData.session.cart.push({ ...product, qty: 1 });
        }
        
        App.renderHomePage();
        Components.showNotification(`Added ${product.name} to cart`);
    },

    updateCartItem: (index, delta) => {
        if (AppData.session.cart[index]) {
            AppData.session.cart[index].qty = Math.max(1, AppData.session.cart[index].qty + delta);
            App.renderHomePage();
        }
    },

    removeFromCart: (index) => {
        const removed = AppData.session.cart[index];
        AppData.session.cart.splice(index, 1);
        App.renderHomePage();
        Components.showNotification(`Removed ${removed.name} from cart`);
    },

    holdTransaction: () => {
        if (AppData.session.cart.length > 0) {
            if (!AppData.heldTransactions) AppData.heldTransactions = [];
            AppData.heldTransactions.push({
                id: Date.now(),
                cart: [...AppData.session.cart],
                time: new Date().toLocaleTimeString(),
                customer: AppData.session.selectedCustomer
            });
            
            AppData.session.cart = [];
            AppData.session.selectedCustomer = null;
            App.renderHomePage();
            Components.showNotification('Transaction on hold');
        }
    },

    voidTransaction: () => {
        if (AppData.session.cart.length > 0) {
            if (confirm('Void current transaction?')) {
                AppData.session.cart = [];
                AppData.session.selectedCustomer = null;
                App.renderHomePage();
                Components.showNotification('Transaction voided');
            }
        }
    },

    discountTransaction: () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 400px;">
                <h3>Apply Discount</h3>
                <div style="margin: 1rem 0;">
                    <label>Discount Type:</label>
                    <select id="discountType" class="modal-input">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (₱)</option>
                    </select>
                </div>
                <div>
                    <label>Amount:</label>
                    <input type="number" id="discountAmount" class="modal-input" min="0" step="0.01">
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-primary" onclick="App.applyDiscount()">Apply</button>
                    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    },

    applyDiscount: () => {
        const type = document.getElementById('discountType').value;
        const amount = parseFloat(document.getElementById('discountAmount').value);
        
        if (amount > 0) {
            const subtotal = AppData.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
            const discountAmount = type === 'percentage' ? subtotal * (amount / 100) : amount;
            
            Components.showNotification(`Discount of ${Components.formatPeso(discountAmount)} applied`);
            closeModal();
            App.renderHomePage();
        }
    },

    showPaymentModal: () => {
        const subtotal = AppData.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subtotal * AppData.settings.taxRate;
        const total = subtotal + tax;
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <h2>Complete Transaction</h2>
                <p style="color: var(--color-text-muted); margin-bottom: 2rem;">Receipt #${TransactionState.receiptNumber}</p>
                
                <div style="background: var(--color-bg); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>${Components.formatPeso(subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>VAT (12%):</span>
                        <span>${Components.formatPeso(tax)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 1.8rem; font-weight: 600; border-top: 2px solid var(--color-border); padding-top: 1rem;">
                        <span>Total:</span>
                        <span>${Components.formatPeso(total)}</span>
                    </div>
                </div>

                <h3>Select Payment Method</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 2rem;">
                    <button class="btn payment-method btn-secondary" onclick="App.selectPaymentMethod('cash', this)">
                        <i class="fas fa-money-bill-wave"></i> Cash
                    </button>
                    <button class="btn payment-method btn-secondary" onclick="App.selectPaymentMethod('card', this)">
                        <i class="fas fa-credit-card"></i> Card
                    </button>
                    <button class="btn payment-method btn-secondary" onclick="App.selectPaymentMethod('gcash', this)">
                        <i class="fas fa-mobile-alt"></i> GCash
                    </button>
                    <button class="btn payment-method btn-secondary" onclick="App.selectPaymentMethod('paymaya', this)">
                        <i class="fas fa-mobile-alt"></i> PayMaya
                    </button>
                </div>

                <div id="cashInput" style="display: none; margin-bottom: 2rem;">
                    <label>Amount Tendered (₱):</label>
                    <input type="number" id="cashTendered" class="modal-input" value="${total.toFixed(2)}" step="0.01" min="${total.toFixed(2)}">
                    <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding: 1rem; background: var(--color-bg); border-radius: var(--radius-md);">
                        <span>Change:</span>
                        <span style="font-size: 1.5rem; font-weight: 600;" id="changeAmount">₱0.00</span>
                    </div>
                </div>

                <div class="modal-buttons">
                    <button class="btn btn-primary" onclick="App.processPayment(${total})" style="flex: 1;">
                        <i class="fas fa-check"></i> Complete Payment
                    </button>
                    <button class="btn btn-secondary" onclick="closeModal()" style="flex: 1;">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    selectPaymentMethod: (method, button) => {
        TransactionState.paymentMethod = method;
        document.querySelectorAll('.payment-method').forEach(btn => {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-secondary');
        });
        button.classList.remove('btn-secondary');
        button.classList.add('btn-primary');
        
        const cashInput = document.getElementById('cashInput');
        if (method === 'cash') {
            cashInput.style.display = 'block';
            
            const cashField = document.getElementById('cashTendered');
            if (cashField) {
                cashField.addEventListener('input', (e) => {
                    const total = parseFloat(document.querySelector('.modal-content div[style*="font-size: 1.8rem"] span:last-child').textContent.replace('₱', ''));
                    const tendered = parseFloat(e.target.value) || 0;
                    const change = tendered - total;
                    document.getElementById('changeAmount').textContent = `₱${change.toFixed(2)}`;
                    TransactionState.cashTendered = tendered;
                    TransactionState.change = change;
                });
            }
        } else {
            cashInput.style.display = 'none';
        }
    },

    processPayment: (total) => {
        if (!TransactionState.paymentMethod) {
            Components.showNotification('Please select payment method', 'error');
            return;
        }

        if (TransactionState.paymentMethod === 'cash') {
            if (TransactionState.cashTendered < total) {
                Components.showNotification('Insufficient cash tendered', 'error');
                return;
            }
        }

        const subtotal = AppData.session.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
        const tax = subtotal * AppData.settings.taxRate;

        const transaction = {
            id: AppData.transactions.length + 1,
            receiptNumber: TransactionState.receiptNumber++,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            date: new Date().toISOString().split('T')[0],
            items: [...AppData.session.cart],
            subtotal: subtotal,
            tax: tax,
            total: total,
            paymentMethod: TransactionState.paymentMethod,
            cashTendered: TransactionState.cashTendered,
            change: TransactionState.change,
            customer: AppData.session.selectedCustomer?.name || null
        };
        
        AppData.transactions.push(transaction);
        
        // Update inventory
        AppData.session.cart.forEach(item => {
            if (item.name.includes('Latte')) {
                AppData.inventory.ingredients[0].stock -= 60 * item.qty;
                AppData.inventory.ingredients[1].stock -= 120 * item.qty;
            }
            AppData.inventory.materials[0].stock -= 1 * item.qty;
        });

        // Update customer loyalty
        if (AppData.session.selectedCustomer) {
            const customer = AppData.session.selectedCustomer;
            const stampsEarned = Math.floor(total / 200) || 1; // 1 stamp per ₱200
            customer.stamps += stampsEarned;
            customer.visits++;
            customer.spent += total;
            customer.lastVisit = new Date().toISOString().split('T')[0];
            
            while (customer.stamps >= 10) {
                customer.stamps -= 10;
                customer.freeDrinks++;
                Components.showNotification(`🎉 ${customer.name} earned a free drink!`);
            }
            
            // Update favorites
            transaction.items.forEach(item => {
                if (!customer.favorites.includes(item.name)) {
                    customer.favorites.push(item.name);
                    if (customer.favorites.length > 5) {
                        customer.favorites.shift();
                    }
                }
            });
        }
        
        App.showReceipt(transaction);
        
        AppData.session.cart = [];
        AppData.session.selectedCustomer = null;
        TransactionState.paymentMethod = null;
        TransactionState.cashTendered = 0;
        TransactionState.change = 0;
        
        closeModal();
        App.renderHomePage();
        Components.showNotification('Payment completed!');
    },

    showReceipt: (transaction) => {
        const receipt = `
            <div style="background: white; padding: 2rem; max-width: 300px; margin: 0 auto; font-family: monospace;">
                <div style="text-align: center; margin-bottom: 1rem;">
                    <h2>${AppData.settings.storeName}</h2>
                    <p>123 Ayala Avenue, Makati City</p>
                    <p>Tel: (02) 8123 4567</p>
                    <p>VAT REG: 123-456-789-000</p>
                </div>
                
                <div style="border-top: 1px dashed black; border-bottom: 1px dashed black; padding: 1rem 0; margin: 1rem 0;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Receipt #${transaction.receiptNumber}</span>
                        <span>${transaction.time}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Date: ${transaction.date}</span>
                        <span>Cashier: ${AppData.session.currentUser}</span>
                    </div>
                </div>

                <div style="margin: 1rem 0;">
                    ${transaction.items.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.3rem;">
                            <span>${item.qty}x ${item.name}</span>
                            <span>${Components.formatPeso(item.price * item.qty)}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="border-top: 1px dashed black; padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>Subtotal:</span>
                        <span>${Components.formatPeso(transaction.subtotal)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>VAT (12%):</span>
                        <span>${Components.formatPeso(transaction.tax)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                        <span>TOTAL:</span>
                        <span>${Components.formatPeso(transaction.total)}</span>
                    </div>
                </div>

                ${transaction.paymentMethod === 'cash' ? `
                    <div style="margin-top: 1rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>Cash:</span>
                            <span>${Components.formatPeso(transaction.cashTendered)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>Change:</span>
                            <span>${Components.formatPeso(transaction.change)}</span>
                        </div>
                    </div>
                ` : `
                    <div style="margin-top: 1rem; text-align: center;">
                        <span>Paid via ${transaction.paymentMethod === 'gcash' ? 'GCash' : transaction.paymentMethod}</span>
                    </div>
                `}

                <div style="text-align: center; margin-top: 2rem;">
                    <p>Thank you for visiting!</p>
                    <p>☕ This serves as your official receipt</p>
                    <p>Follow us @beanstalkcafe.ph</p>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 350px;">
                ${receipt}
                <div style="display: flex; gap: 1rem; margin-top: 1rem;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="window.print()">
                        <i class="fas fa-print"></i> Print
                    </button>
                    <button class="btn btn-secondary" style="flex: 1;" onclick="closeModal()">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    printReceipt: (transactionId) => {
        const transaction = AppData.transactions.find(t => t.id === transactionId);
        if (transaction) {
            App.showReceipt(transaction);
        }
    },

    // ========== PRODUCT FUNCTIONS ==========
    filterProducts: (category) => {
        const products = category === 'all' 
            ? AppData.products 
            : AppData.products.filter(p => p.category === category);
        
        const grid = document.getElementById('productGrid');
        if (grid) {
            grid.innerHTML = Components.renderProductButtons(products);
        }
    },

    searchProducts: () => {
        const searchTerm = document.getElementById('productSearch').value.toLowerCase();
        const filtered = AppData.products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) || 
            p.category.toLowerCase().includes(searchTerm)
        );
        
        const grid = document.getElementById('productGrid');
        if (grid) {
            grid.innerHTML = Components.renderProductButtons(filtered);
        }
    },

    // ========== CUSTOMER FUNCTIONS ==========
    selectCustomer: (customerId) => {
        const customer = AppData.customers.find(c => c.id === customerId);
        AppData.session.selectedCustomer = customer;
        App.renderLoyaltyPage();
        App.renderHomePage();
        Components.showNotification(`Selected: ${customer.name}`);
    },

    searchCustomers: () => {
        const term = document.getElementById('customerSearch').value.toLowerCase();
        const filtered = AppData.customers.filter(c => 
            c.name.toLowerCase().includes(term) || 
            c.email.toLowerCase().includes(term) || 
            c.phone.includes(term)
        );
        
        document.getElementById('customerGrid').innerHTML = Components.renderCustomerCards(filtered, AppData.session.selectedCustomer?.id);
    },

    showCustomerSelector: () => {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <h3>Select Customer</h3>
                <div style="margin: 1rem 0;">
                    <input type="text" id="customerSearchModal" placeholder="Search customers..." class="modal-input">
                </div>
                <div style="max-height: 300px; overflow-y: auto;">
                    ${AppData.customers.map(c => `
                        <div class="customer-list-item" onclick="App.selectCustomerFromModal(${c.id})">
                            <strong>${c.name}</strong><br>
                            <small>${c.email} · Stamps: ${c.stamps}/10</small>
                        </div>
                    `).join('')}
                    <div class="customer-list-item" onclick="App.selectCustomerFromModal(null)" style="background: var(--color-bg);">
                        <strong>Walk-in Customer</strong>
                    </div>
                </div>
                <div class="modal-buttons">
                    <button class="btn btn-secondary" onclick="closeModal()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        const searchInput = document.getElementById('customerSearchModal');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = AppData.customers.filter(c => 
                    c.name.toLowerCase().includes(term) || 
                    c.email.toLowerCase().includes(term)
                );
                
                const listDiv = modal.querySelector('div[style*="max-height: 300px"]');
                listDiv.innerHTML = filtered.map(c => `
                    <div class="customer-list-item" onclick="App.selectCustomerFromModal(${c.id})">
                        <strong>${c.name}</strong><br>
                        <small>${c.email} · Stamps: ${c.stamps}/10</small>
                    </div>
                `).join('') + `
                    <div class="customer-list-item" onclick="App.selectCustomerFromModal(null)" style="background: var(--color-bg);">
                        <strong>Walk-in Customer</strong>
                    </div>
                `;
            });
        }
    },

    selectCustomerFromModal: (customerId) => {
        if (customerId) {
            AppData.session.selectedCustomer = AppData.customers.find(c => c.id === customerId);
        } else {
            AppData.session.selectedCustomer = null;
        }
        closeModal();
        App.renderHomePage();
        Components.showNotification(AppData.session.selectedCustomer ? 
            `Customer selected: ${AppData.session.selectedCustomer.name}` : 
            'Walk-in customer');
    },

    showAddCustomerModal: () => {
        document.getElementById('customerModal').style.display = 'flex';
    },

    // ========== CALENDAR FUNCTIONS ==========
    showSalesDetail: (date, revenue) => {
        const orders = 15 + Math.floor(Math.random() * 20);
        const bestSeller = ['Espresso', 'Spanish Latte', 'Iced Latte', 'Ensaymada'][Math.floor(Math.random() * 4)];
        
        document.getElementById('salesDetail').innerHTML = `
            <h3>📊 March ${date}, 2026</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin: 1rem 0;">
                <div class="stat-small">
                    <div class="number">${Components.formatPeso(revenue)}</div>
                    <div class="label">Revenue</div>
                </div>
                <div class="stat-small">
                    <div class="number">${orders}</div>
                    <div class="label">Orders</div>
                </div>
                <div class="stat-small">
                    <div class="number">${bestSeller}</div>
                    <div class="label">Best Seller</div>
                </div>
            </div>
            <div style="margin-top: 1rem;">
                <strong>Sample Transactions:</strong><br>
                08:30 - Spanish Latte x2 ₱300<br>
                10:15 - Iced Latte x1 ₱140<br>
                11:45 - Ensaymada x3 ₱210
            </div>
        `;
    }
};

// Make App available globally
window.App = App;

// ========== GLOBAL FUNCTIONS ==========
function addNewCustomer() {
    const name = document.getElementById('newName').value;
    const email = document.getElementById('newEmail').value;
    const phone = document.getElementById('newPhone').value;

    if (!name || !email || !phone) {
        Components.showNotification('Please fill all fields', 'error');
        return;
    }

    const newCustomer = {
        id: AppData.customers.length + 1,
        name, email, phone,
        joinDate: new Date().toISOString().split('T')[0],
        visits: 0,
        spent: 0,
        stamps: 0,
        freeDrinks: 0,
        favorites: [],
        frequency: Array(12).fill(0),
        lastVisit: 'Never'
    };

    AppData.customers.push(newCustomer);
    closeModal();
    App.renderLoyaltyPage();
    Components.showNotification(`Customer ${name} added!`);
    
    document.getElementById('newName').value = '';
    document.getElementById('newEmail').value = '';
    document.getElementById('newPhone').value = '';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    document.getElementById('customerModal').style.display = 'none';
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});