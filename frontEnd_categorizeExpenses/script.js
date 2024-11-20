document.addEventListener('DOMContentLoaded', () => {
    const expenseLabel = document.getElementById('expenseLabel');
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseCategory = document.getElementById('expenseCategory');
    const submitExpense = document.getElementById('submitExpense');
    const expenseLogsTable = document.querySelector('#expenseLogs tbody');
    const filterDate = document.getElementById('filterDate');
    const filterCategory = document.getElementById('filterCategory');
    const filterLabel = document.getElementById('filterLabel');
    const filterAmount = document.getElementById('filterAmount');
    const applyFilters = document.getElementById('applyFilters');
    const clearFilters = document.getElementById('clearFilters');
    const navButtons = document.querySelectorAll('.nav-button');
    const sections = document.querySelectorAll('.main');

    // Indexed Data-Base setup
    let db;
    const request = indexedDB.open('ExpenseDB', 1);

    request.onerror = (event) => {
        console.error('Error opening IndexedDB:', event);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('IndexedDB initialized.');
        loadExpenses();
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expenseStore.createIndex('date', 'date', { unique: false });
        expenseStore.createIndex('label', 'label', { unique: false });
        expenseStore.createIndex('amount', 'amount', { unique: false });
        expenseStore.createIndex('category', 'category', { unique: false });
        console.log('Object store created.');
    };

    // Add expense
    submitExpense.addEventListener('click', () => {
        const expense = {
            date: new Date().toISOString().split('T')[0],
            label: expenseLabel.value,
            amount: parseFloat(expenseAmount.value),
            category: expenseCategory.value
        };

        const transaction = db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        const request = store.add(expense);

        request.onsuccess = () => {
            console.log('Expense added:', expense);
            loadExpenses();
            clearForm();
        };

        request.onerror = (event) => {
            console.error('Error adding expense:', event);
        };
    });

    function clearForm() {
        expenseLabel.value = '';
        expenseAmount.value = '';
        expenseCategory.value = '';
    }

    // Log of expenses
    function loadExpenses() {
        expenseLogsTable.innerHTML = '';

        const transaction = db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        const request = store.getAll();

        request.onsuccess = (event) => {
            const expenses = event.target.result;
            const filteredExpenses = expenses.filter(expense => {
                return (!filters.date || expense.date === filters.date) &&
                       (!filters.category || expense.category.toLowerCase().includes(filters.category.toLowerCase())) &&
                       (!filters.label || expense.label.toLowerCase().includes(filters.label.toLowerCase())) &&
                       (!filters.amount || expense.amount === parseFloat(filters.amount));
            });

            filteredExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${expense.date}</td>
                    <td>${expense.label}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                `;
                expenseLogsTable.appendChild(row);
            });
        };
    }

    applyFilters.addEventListener('click', () => {
        const filters = {
            date: filterDate.value || null,
            category: filterCategory.value || null,
            label: filterLabel.value || null,
            amount: filterAmount.value || null
        };
        loadExpenses(filters);
    });

    clearFilters.addEventListener('click', () => {
        filterDate.value = '';
        filterCategory.value = '';
        filterLabel.value = '';
        filterAmount.value = '';
        loadExpenses();
    });

    // Navigation function
    function showSection(targetId) {
        sections.forEach(section => {
            section.style.display = section.id === targetId ? 'block' : 'none';
        });
    }

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            showSection(targetId);
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        });
    });
    showSection('addExpenditure');
});
