document.addEventListener('DOMContentLoaded', () => {
    const expenseLabel = document.getElementById('expenseLabel');
    const expenseAmount = document.getElementById('expenseAmount');
    const expenseCategory = document.getElementById('expenseCategory');
    const submitExpense = document.getElementById('submitExpense');
    const expenseLogsTable = document.querySelector('#expenseLogs tbody');
    const logsView = document.getElementById('logsView');

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

    
});
