// ========== UI COMPONENTS - PHILIPPINES VERSION ==========
const Components = {
    // Format currency in Philippine Peso
    formatPeso: (amount) => {
        return `₱${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    },

    // Render dashboard cards
    renderDashboardCards: () => {
        const today = new Date().toISOString().split('T')[0];
        const todayTransactions = AppData.transactions.filter(t => t.date === today);
        const todaySales = todayTransactions.reduce((sum, t) => sum + t.total, 0);
        
        // Calculate best seller
        const productCounts = {};
        AppData.transactions.forEach(t => {
            t.items.forEach(i => {
                productCounts[i.name] = (productCounts[i.name] || 0) + i.qty;
            });
        });
        const bestSeller = Object.entries(productCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Spanish Latte';
        
        // Count low stock items
        const lowStockCount = [...AppData.inventory.ingredients, ...AppData.inventory.materials]
            .filter(i => i.stock <= i.min).length;
        
        return `
            <div class="card-grid">
                <div class="stat-card">
                    <div class="stat-label">Today's Sales</div>
                    <div class="stat-value">${Components.formatPeso(todaySales)}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Orders Today</div>
                    <div class="stat-value">${todayTransactions.length}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Best Seller</div>
                    <div class="stat-value">${bestSeller}</div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Low Stock Items</div>
                    <div class="stat-value">${lowStockCount}</div>
                </div>
            </div>
        `;
    },

    // Render product buttons for POS
    renderProductButtons: (products = AppData.products.slice(0, 4)) => {
        return products.map(p => `
            <button class="product-btn" onclick="App.addToCart(${p.id})">
                <span class="product-emoji">${p.emoji}</span>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${Components.formatPeso(p.price)}</div>
                </div>
            </button>
        `).join('');
    },

    // Render full product catalog
    renderProductCatalog: (filter = 'all') => {
        const filtered = filter === 'all' 
            ? AppData.products 
            : AppData.products.filter(p => p.category === filter);
        
        return filtered.map(p => `
            <button class="product-btn" onclick="App.addToCart(${p.id})">
                <span class="product-emoji">${p.emoji}</span>
                <div class="product-info">
                    <div class="product-name">${p.name}</div>
                    <div class="product-price">${Components.formatPeso(p.price)}</div>
                </div>
            </button>
        `).join('');
    },

    // Render cart items
    renderCart: (cart) => {
        if (cart.length === 0) {
            return `
                <div style="text-align: center; padding: 3rem; color: var(--color-text-muted);">
                    <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                    <p>No items in cart</p>
                    <p style="font-size: 0.9rem;">Select products to start</p>
                </div>
            `;
        }

        return cart.map((item, index) => `
            <div class="cart-item">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem;">${item.emoji}</span>
                    <div>
                        <div class="product-name">${item.name}</div>
                        <div class="product-price">${Components.formatPeso(item.price)} each</div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-bg); padding: 0.3rem; border-radius: var(--radius-md);">
                        <i class="fas fa-minus" onclick="App.updateCartItem(${index}, -1)" style="cursor: pointer; padding: 0.3rem;"></i>
                        <span style="min-width: 30px; text-align: center;">${item.qty}</span>
                        <i class="fas fa-plus" onclick="App.updateCartItem(${index}, 1)" style="cursor: pointer; padding: 0.3rem;"></i>
                    </div>
                    <span style="font-weight: 600; min-width: 80px;">${Components.formatPeso(item.price * item.qty)}</span>
                    <i class="fas fa-trash" onclick="App.removeFromCart(${index})" style="cursor: pointer; color: var(--color-danger);"></i>
                </div>
            </div>
        `).join('');
    },

    // Render customer cards
    renderCustomerCards: (customers = AppData.customers, selectedId = null) => {
        return customers.map(c => {
            const isSelected = selectedId === c.id;
            const stamps = Array(10).fill(0).map((_, i) => `
                <div class="stamp ${i < c.stamps ? 'filled' : ''}">${i < c.stamps ? '☕' : '○'}</div>
            `).join('');
            
            const frequency = c.frequency.map(f => `
                <div class="freq-dot ${f ? 'active' : ''}" title="${f ? 'Visited' : 'No visit'}"></div>
            `).join('');
            
            return `
                <div class="customer-card ${isSelected ? 'selected' : ''}" onclick="App.selectCustomer(${c.id})">
                    <div class="customer-name">${c.name}</div>
                    <div class="customer-contact">${c.email} · ${c.phone}</div>
                    
                    <div style="margin: 1rem 0;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>Stamps: ${c.stamps}/10</span>
                            <span style="color: var(--color-gold);">🎁 ${c.freeDrinks} free</span>
                        </div>
                        <div class="stamp-grid">
                            ${stamps}
                        </div>
                    </div>

                    <div class="customer-stats">
                        <div class="stat-small">
                            <div class="number">${c.visits}</div>
                            <div class="label">Visits</div>
                        </div>
                        <div class="stat-small">
                            <div class="number">${Components.formatPeso(c.spent)}</div>
                            <div class="label">Spent</div>
                        </div>
                        <div class="stat-small">
                            <div class="number">${c.freeDrinks}</div>
                            <div class="label">Free</div>
                        </div>
                    </div>

                    <div style="margin: 1rem 0;">
                        ${c.favorites.map(f => `
                            <span class="favorite-badge">
                                <i class="fas fa-heart" style="color: var(--color-gold);"></i> ${f}
                            </span>
                        `).join('')}
                    </div>

                    <div class="frequency-indicator">
                        ${frequency}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.5rem;">
                        Last visit: ${c.lastVisit}
                    </div>
                </div>
            `;
        }).join('');
    },

    // Render inventory tables
    renderInventory: () => {
        const ingredients = AppData.inventory.ingredients.map(i => {
            const status = i.stock <= i.min ? (i.stock <= i.min/2 ? 'critical' : 'low') : 'normal';
            return `
                <tr>
                    <td>${i.name}</td>
                    <td>${i.stock} ${i.unit}</td>
                    <td>${i.min} ${i.unit}</td>
                    <td><span class="status-badge status-${status}">${status}</span></td>
                </tr>
            `;
        }).join('');
        
        const materials = AppData.inventory.materials.map(m => {
            const status = m.stock <= m.min ? (m.stock <= m.min/2 ? 'critical' : 'low') : 'normal';
            return `
                <tr>
                    <td>${m.name}</td>
                    <td>${m.stock} ${m.unit}</td>
                    <td>${m.min} ${m.unit}</td>
                    <td><span class="status-badge status-${status}">${status}</span></td>
                </tr>
            `;
        }).join('');
        
        return { ingredients, materials };
    },

    // Render employee cards
    renderEmployees: () => {
        return AppData.employees.map(e => `
            <div class="employee-card">
                <div class="employee-avatar">${e.avatar}</div>
                <h3>${e.name}</h3>
                <div class="employee-role">${e.role}</div>
                <div class="employee-stats">
                    <div><i class="fas fa-receipt"></i> ${e.transactions} transactions</div>
                    <div><i class="fas fa-peso-sign"></i> ${Components.formatPeso(e.sales)} in sales</div>
                    <div><i class="fas fa-star" style="color: var(--color-gold);"></i> ${e.rating} rating</div>
                    <div><i class="fas fa-clock"></i> ${e.hours} hours</div>
                </div>
            </div>
        `).join('');
    },

    // Render recent transactions
    renderTransactions: (limit = 5) => {
        return AppData.transactions.slice(-limit).reverse().map(t => `
            <tr>
                <td><strong>#${t.receiptNumber}</strong></td>
                <td>${t.time}</td>
                <td>${t.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</td>
                <td><strong>${Components.formatPeso(t.total)}</strong></td>
                <td><span class="badge">${t.paymentMethod === 'gcash' ? 'GCash' : t.paymentMethod}</span></td>
                <td>${t.customer || 'Walk-in'}</td>
                <td>
                    <button class="btn btn-secondary" style="padding: 0.3rem 1rem;" onclick="App.printReceipt(${t.id})">
                        <i class="fas fa-print"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    },

    // Show notification
    showNotification: (message, type = 'success') => {
        const notif = document.createElement('div');
        notif.className = 'notification';
        notif.textContent = message;
        notif.style.background = type === 'success' ? 'var(--color-primary)' : 'var(--color-danger)';
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 3000);
    }
};

// Make components available globally
window.Components = Components;