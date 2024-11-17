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

    
});
