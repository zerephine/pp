// ========== DATA STORE - PHILIPPINE PESOS VERSION ==========
const AppData = {
    products: [
        { id: 1, name: 'Espresso', price: 120, category: 'Hot', emoji: '☕', sales: 145 },
        { id: 2, name: 'Spanish Latte', price: 150, category: 'Hot', emoji: '🥤', sales: 278 },
        { id: 3, name: 'Iced Latte', price: 140, category: 'Iced', emoji: '🧊', sales: 198 },
        { id: 4, name: 'Matcha Latte', price: 135, category: 'Non-Coffee', emoji: '🍵', sales: 156 },
        { id: 5, name: 'Croissant', price: 90, category: 'Snacks', emoji: '🥐', sales: 210 },
        { id: 6, name: 'Blueberry Muffin', price: 95, category: 'Snacks', emoji: '🧁', sales: 134 },
        { id: 7, name: 'Cold Brew', price: 130, category: 'Iced', emoji: '🧋', sales: 167 },
        { id: 8, name: 'Chai Latte', price: 125, category: 'Hot', emoji: '🫖', sales: 145 },
        { id: 9, name: 'Ensaymada', price: 70, category: 'Snacks', emoji: '🥐', sales: 189 },
        { id: 10, name: 'Pandesal (5 pcs)', price: 45, category: 'Snacks', emoji: '🥖', sales: 256 }
    ],
    
    inventory: {
        ingredients: [
            { id: 1, name: 'Espresso', stock: 1600, min: 400, unit: 'ml', recipe: { 'Spanish Latte': 60, 'Espresso': 30, 'Iced Latte': 60 } },
            { id: 2, name: 'Milk', stock: 900, min: 700, unit: 'ml', recipe: { 'Spanish Latte': 120, 'Iced Latte': 150 } },
            { id: 3, name: 'Condensed Milk', stock: 150, min: 200, unit: 'ml', recipe: { 'Spanish Latte': 20 } },
            { id: 4, name: 'Vanilla Syrup', stock: 320, min: 100, unit: 'ml', recipe: { 'Spanish Latte': 10, 'Iced Latte': 15 } },
            { id: 5, name: 'Matcha Powder', stock: 500, min: 100, unit: 'g', recipe: { 'Matcha Latte': 15 } },
            { id: 6, name: 'Coffee Beans', stock: 2500, min: 500, unit: 'g', recipe: { 'Espresso': 18 } }
        ],
        materials: [
            { id: 1, name: '12oz Cups', stock: 140, min: 100, unit: 'pcs' },
            { id: 2, name: 'Lids', stock: 90, min: 100, unit: 'pcs' },
            { id: 3, name: 'Straws', stock: 300, min: 150, unit: 'pcs' },
            { id: 4, name: 'Napkins', stock: 500, min: 200, unit: 'pcs' },
            { id: 5, name: 'Brown Bags', stock: 150, min: 50, unit: 'pcs' }
        ]
    },
    
    customers: [
        { 
            id: 1, 
            name: 'Maria Santos', 
            email: 'maria.santos@email.com', 
            phone: '0917 123 4567',
            joinDate: '2025-12-01',
            visits: 48, 
            spent: 12450.50, 
            stamps: 8, 
            freeDrinks: 3,
            favorites: ['Spanish Latte', 'Ensaymada'],
            frequency: [1,1,1,1,1,0,0,1,1,1,1,1],
            lastVisit: '2026-03-01'
        },
        { 
            id: 2, 
            name: 'Jose Reyes', 
            email: 'jose.reyes@email.com', 
            phone: '0922 345 6789',
            joinDate: '2026-01-15',
            visits: 23, 
            spent: 6450.30, 
            stamps: 4, 
            freeDrinks: 1,
            favorites: ['Iced Latte', 'Pandesal'],
            frequency: [1,0,1,1,0,0,0,1,1,0,1,0],
            lastVisit: '2026-02-28'
        },
        { 
            id: 3, 
            name: 'Ana Cruz', 
            email: 'ana.cruz@email.com', 
            phone: '0933 567 8901',
            joinDate: '2025-10-10',
            visits: 67, 
            spent: 18975.75, 
            stamps: 9, 
            freeDrinks: 5,
            favorites: ['Espresso', 'Blueberry Muffin'],
            frequency: [1,1,1,1,1,1,1,1,1,1,1,1],
            lastVisit: '2026-03-02'
        },
        { 
            id: 4, 
            name: 'Pedro Garcia', 
            email: 'pedro.garcia@email.com', 
            phone: '0944 789 0123',
            joinDate: '2026-02-01',
            visits: 12, 
            spent: 3450.50, 
            stamps: 2, 
            freeDrinks: 0,
            favorites: ['Cold Brew'],
            frequency: [1,1,0,0,0,0,0,0,0,0,0,0],
            lastVisit: '2026-02-25'
        }
    ],
    
    transactions: [
        { id: 1, receiptNumber: 1001, time: '09:34', date: '2026-03-01', items: [{ name: 'Spanish Latte', qty: 2 }], subtotal: 300, tax: 24, total: 324, paymentMethod: 'cash', customer: 'Maria Santos' },
        { id: 2, receiptNumber: 1002, time: '09:15', date: '2026-03-01', items: [{ name: 'Iced Latte', qty: 1 }, { name: 'Croissant', qty: 1 }], subtotal: 230, tax: 18.40, total: 248.40, paymentMethod: 'card', customer: 'Jose Reyes' },
        { id: 3, receiptNumber: 1003, time: '10:22', date: '2026-03-02', items: [{ name: 'Espresso', qty: 2 }], subtotal: 240, tax: 19.20, total: 259.20, paymentMethod: 'cash', customer: 'Ana Cruz' },
        { id: 4, receiptNumber: 1004, time: '11:05', date: '2026-03-02', items: [{ name: 'Pandesal', qty: 3 }], subtotal: 135, tax: 10.80, total: 145.80, paymentMethod: 'gcash', customer: null }
    ],
    
    employees: [
        { id: 1, name: 'Maya Chen', role: 'Shift Lead', avatar: '👩‍💼', transactions: 124, sales: 45680, rating: 4.9, hours: 160 },
        { id: 2, name: 'James Kim', role: 'Barista', avatar: '👨‍🍳', transactions: 98, sales: 32450, rating: 4.7, hours: 145 },
        { id: 3, name: 'Elena Rose', role: 'Cashier', avatar: '👩‍💻', transactions: 137, sales: 51230, rating: 5.0, hours: 168 }
    ],
    
    settings: {
        storeName: 'Beanstalk Café - Philippines',
        taxRate: 0.12, // 12% VAT
        currency: '₱',
        currencySymbol: '₱',
        stampThreshold: 10,
        stampsPerSpend: 200, // 1 stamp per ₱200 spent
        gcashEnabled: true,
        paymayaEnabled: true
    },
    
    session: {
        cart: [],
        selectedCustomer: null,
        currentUser: 'Cashier #1'
    }
};

// Transaction state
const TransactionState = {
    currentTransaction: null,
    paymentMethod: null,
    cashTendered: 0,
    change: 0,
    receiptNumber: 1005,
    isProcessing: false
};

// Make data available globally
window.AppData = AppData;
window.TransactionState = TransactionState;