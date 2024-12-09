//Dashboard
let db;
let currentWeekOffset = 0;
let currentMonthOffset = 0;

const greenShades = [
    '#6b8e23', '#556b2f', '#8fbc8f', '#b2d3c2',
    '#708238', '#3b7a57', '#66cdaa', '#2e8b57',
    '#98fb98', '#00a36c'
];

const categoryColors = {};

function getCategoryColor(category) {
    if (!categoryColors[category]) {
        const colorIndex = Object.keys(categoryColors).length % greenShades.length;
        categoryColors[category] = greenShades[colorIndex];
    }
    return categoryColors[category];
}

function initIndexedDB() {
    const request = indexedDB.open('ExpenseDB', 1);

    request.onerror = (event) => {
        console.log('Error opening IndexedDB:', event);
    };

    request.onsuccess = (event) => {
        db = event.target.result;
        console.log('IndexedDB initialized.');
        updateCharts(currentWeekOffset, currentMonthOffset);
    };

    request.onupgradeneeded = (event) => {
        db = event.target.result;
        const expenseStore = db.createObjectStore('expenses', { keyPath: 'id', autoIncrement: true });
        expenseStore.createIndex('category', 'category', { unique: false });
        expenseStore.createIndex('amount', 'amount', { unique: false });
        expenseStore.createIndex('date', 'date', { unique: false });
        console.log('Object store created.');
    };
}

initIndexedDB();

function addExpense(amount, category, date) {
    const transaction = db.transaction(['expenses'], 'readwrite');
    const store = transaction.objectStore('expenses');

    const expense = { amount: parseFloat(amount), category, date };
    const request = store.add(expense);

    request.onsuccess = () => {
        console.log('Expense added:', expense);
        updateCharts(currentWeekOffset, currentMonthOffset);
    };

    request.onerror = (event) => {
        console.log('Error adding expense:', event);
    };
}

function clearEnteredData() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDate').value = '';
}

function getAllExpenses(callback) {
    const transaction = db.transaction(['expenses'], 'readonly');
    const store = transaction.objectStore('expenses');

    const request = store.getAll();
    request.onsuccess = (event) => {
        const expenses = event.target.result;
        callback(expenses);
    };

    request.onerror = (event) => {
        console.log('Error retrieving expenses:', event);
    };
}

function updateCharts(weekOffset, monthOffset) {
    console.log('Updating charts:', { weekOffset, monthOffset });

    getAllExpenses((expenses) => {
        console.log('Expenses retrieved:', expenses);

        const weeklyData = processWeeklyData(expenses, weekOffset);
        const categoryData = processMonthlyCategoryData(expenses, monthOffset);

        console.log('Weekly data:', weeklyData);
        console.log('Category data:', categoryData);

        // Update weekly spending chart
        weeklySpendingChart.data.labels = weeklyData.labels;
        weeklySpendingChart.data.datasets = weeklyData.datasets;
        weeklySpendingChart.update();

        // Update pie chart for monthly data
        if (categoryData.values.length === 0) {
            expenditureCategoryChart.data.datasets[0].data = [1]; // Placeholder for no data
            expenditureCategoryChart.data.labels = ['No Data'];
            expenditureCategoryChart.options.plugins.legend.display = false;
        } else {
            expenditureCategoryChart.data.datasets[0].data = categoryData.values;
            expenditureCategoryChart.data.labels = categoryData.labels;
            expenditureCategoryChart.data.datasets[0].backgroundColor = categoryData.colors;
            expenditureCategoryChart.options.plugins.legend.display = true;
        }
        expenditureCategoryChart.update();

        // Update week and month labels
        updateWeekLabel(weekOffset);
        updateMonthLabel(monthOffset);
    });
}

function updateWeekLabel(weekOffset) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() - (weekOffset * 7)));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startOfWeekFormatted = `${startOfWeek.getDate()} ${startOfWeek.toLocaleString('default', { month: 'short' })}`;
    const endOfWeekFormatted = `${endOfWeek.getDate()} ${endOfWeek.toLocaleString('default', { month: 'short' })}`;

    document.getElementById('weekLabel').textContent = `${startOfWeekFormatted} - ${endOfWeekFormatted}`;
}

function updateMonthLabel(monthOffset) {
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

    const monthName = currentMonth.toLocaleString('default', { month: 'long' });
    const year = currentMonth.getFullYear();

    document.getElementById('monthLabel').textContent = `${monthName} ${year}`;
}

function processWeeklyData(expenses, weekOffset) {
    const dayTotalsByCategory = {};
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() - (weekOffset * 7)));
    startOfWeek.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayName = day.toLocaleDateString('default', { weekday: 'long' });
        dayTotalsByCategory[dayName] = {};
    }

    expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date + "T00:00:00");
        expenseDate.setHours(0, 0, 0, 0);
        const dayDifference = Math.floor((expenseDate - startOfWeek) / (1000 * 60 * 60 * 24));
        if (dayDifference >= 0 && dayDifference < 7) {
            const dayName = Object.keys(dayTotalsByCategory)[dayDifference];
            const category = expense.category;

            if (!dayTotalsByCategory[dayName][category]) {
                dayTotalsByCategory[dayName][category] = 0;
            }
            dayTotalsByCategory[dayName][category] += expense.amount;
        }
    });

    const categories = new Set();
    Object.values(dayTotalsByCategory).forEach(dayData => {
        Object.keys(dayData).forEach(category => categories.add(category));
    });

    const datasets = Array.from(categories).map(category => ({
        label: category,
        data: Object.keys(dayTotalsByCategory).map(day => dayTotalsByCategory[day][category] || 0),
        backgroundColor: getCategoryColor(category),
    }));

    return { labels: Object.keys(dayTotalsByCategory), datasets };
}

function processMonthlyCategoryData(expenses, monthOffset) {
    const categoryTotals = {};
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);

    expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date);
        if (
            expenseDate.getFullYear() === targetMonth.getFullYear() &&
            expenseDate.getMonth() === targetMonth.getMonth()
        ) {
            const category = expense.category;
            if (!categoryTotals[category]) {
                categoryTotals[category] = 0;
            }
            categoryTotals[category] += expense.amount;
        }
    });

    return {
        labels: Object.keys(categoryTotals),
        values: Object.values(categoryTotals),
        colors: Object.keys(categoryTotals).map(category => getCategoryColor(category))
    };
}

const weeklySpendingChart = new Chart(document.getElementById('weeklyChart').getContext('2d'), {
    type: 'bar',
    data: {
        labels: [],
        datasets: []
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                stacked: true
            },
            y: {
                beginAtZero: true,
                stacked: true,
                max: 100,
                ticks: {
                    stepSize: 10
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: true
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'nearest',
                intersect: false,
                callbacks: {
                    label: function(tooltipItem) {
                        const label = tooltipItem.dataset.label || '';
                        return `${label}: ${tooltipItem.raw}`;
                    }
                }
            },
            legend: {
                position: 'top'
            }
        },
        hover: {
            mode: 'nearest',
            intersect: false
        }
    }
});



const expenditureCategoryChart = new Chart(document.getElementById('expenditureChart').getContext('2d'), {
    type: 'pie',
    data: {
        labels: [],
        datasets: [{
            data: [],
            backgroundColor: [] // Dynamic colors
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            }
        }
    }
});

// Event Listeners
document.getElementById('previousWeekButton').addEventListener('click', () => {
    console.log('Previous week clicked');
    currentWeekOffset += 1; // Move to the previous week
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextWeekButton').addEventListener('click', () => {
    console.log('Next week clicked');
    currentWeekOffset -= 1; // Move to the next week
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('previousMonthButton').addEventListener('click', () => {
    console.log('Previous month clicked');
    currentMonthOffset -= 1; // Move to the previous month
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextMonthButton').addEventListener('click', () => {
    console.log('Next month clicked');
    currentMonthOffset += 1; // Move to the next month
    updateCharts(currentWeekOffset, currentMonthOffset);
});


//Expenditure and Logs
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
});

//saving goal

document.addEventListener('DOMContentLoaded', () => {
    const addGoalButton = document.getElementById('add-goal-btn');
    const goalList = document.getElementById('goal-list');

    let goals = []; 

    addGoalButton.addEventListener('click', () => {
        const goalName = document.getElementById('goal-name').value;
        const targetAmount = parseFloat(document.getElementById('target-amount').value);
        const currentAmount = parseFloat(document.getElementById('current-amount').value);
        const deadline = document.getElementById('goal-deadline').value;

        if (!goalName || isNaN(targetAmount) || isNaN(currentAmount) || !deadline) {
            alert('Please fill in all fields.');
            return;
        }

        const newGoal = {
            id: Date.now(), 
            name: goalName,
            target: targetAmount,
            current: currentAmount,
            deadline: deadline,
        };

        goals.push(newGoal);
        renderGoals();
        clearForm();
    });

    function renderGoals() {
        goalList.innerHTML = '';
    
        goals.forEach(goal => {
            const progressPercent = Math.min((goal.current / goal.target) * 100, 100).toFixed(1);
    
            const goalItem = document.createElement('li');
            goalItem.classList.add('goal-item'); 
            goalItem.innerHTML = `
                <div class="goal-details">
                    <span><strong>${goal.name}</strong> (${goal.current} / ${goal.target})</span>
                    <span>Deadline: ${goal.deadline}</span>
                </div>
                <div class="goal-progress-container">
                    <div class="goal-progress-bar" style="width: ${progressPercent}%"></div>
                </div>
                <div class="goal-actions">
                    <button onclick="editGoal(${goal.id})">Edit</button>
                    <button onclick="deleteGoal(${goal.id})">Delete</button>
                </div>
            `;
    
            goalList.appendChild(goalItem);
        });
    }

    function clearForm() {
        document.getElementById('goal-name').value = '';
        document.getElementById('target-amount').value = '';
        document.getElementById('current-amount').value = '';
        document.getElementById('goal-deadline').value = '';
    }

    window.editGoal = function (id) {
        const goal = goals.find(g => g.id === id);
        if (goal) {
            document.getElementById('goal-name').value = goal.name;
            document.getElementById('target-amount').value = goal.target;
            document.getElementById('current-amount').value = goal.current;
            document.getElementById('goal-deadline').value = goal.deadline;

            goals = goals.filter(g => g.id !== id); 
            renderGoals();
        }
    };

    window.deleteGoal = function (id) {
        goals = goals.filter(goal => goal.id !== id);
        renderGoals();
    };
});


//Tips
// list of different tips that are helpful to financial wellness
const allTips = ['50-30-20 Rule: 50% of paycheck -> regular expenses; 30% -> personal expenses; 20% -> savings',
    'Go shopping with a list to prevent overspending',
    "Don't succumb to the instant gratification of spending (think it over)",
    'Track all of your spending in our app',
    'Buy necessities in bulk',
    'Stick to your savings goals',
    'Automate transfers to savings account',
    'Review your subscriptions',
    'Try only carrying cash to avoid overspending with cards',
    'Take advantage of coupons and discounts',
    "Limit your 'want' purchases",
    'Take advantage of free public resources'
]

// access the user-generated tips
function getUserTips(){
    const userTips = localStorage.getItem('userTips');
    return userTips ? JSON.parse(userTips) : [];
}

// add the user tips to the tip list
function addUserTip(tip){
    const userTips = getUserTips();
    userTips.push(tip);
    localStorage.setItem('userTips', JSON.stringify(userTips));
}


// shuffle the list of tips
function shuffleTips(array) {
    return array.sort(() => Math.random() - 0.5);
}

// get the tips for the week
function getWeeklyTips(forceRefresh = false) {
    const userTips = getUserTips();
    
    const ALLtips = [...allTips, ...userTips];
    // when refresh button is clicked, will shuffle tips regardless of day
    if (forceRefresh) {
        const shuffledTips = shuffleTips(ALLtips).slice(0,3);
        localStorage.setItem('weeklyTips', JSON.stringify(shuffledTips));
        return shuffledTips;
    }

    const lastTips = localStorage.getItem('weeklyTips');
    const lastWeek = localStorage.getItem('week');

    const currentWeek = new Date().getWeekNumber();

    if (lastTips && lastWeek == currentWeek) {
        return JSON.parse(lastTips);
    } else {
        const shuffledTips = shuffleTips([...allTips]).slice(0,3);
        localStorage.setItem('weeklyTips', JSON.stringify(shuffledTips));
        localStorage.setItem('week', currentWeek);
        return shuffledTips;
    }
}

// display the tips for the week
function displayTips(refresh = false){
    const tipsList = document.getElementById('tips-list');
    const weeklyTips = getWeeklyTips(refresh);

    tipsList.innerHTML = '';
    weeklyTips.forEach(tip => {
        const li = document.createElement('li');
        li.textContent = tip;
        tipsList.appendChild(li);
    });
}

Date.prototype.getWeekNumber = function () {
    const oneJan = new Date(this.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((this - oneJan) / (24 * 60 * 60 * 1000));
    return Math.ceil((numberOfDays + oneJan.getDay() + 1) / 7);
};

//when page loads display tips
window.onload = function(){
    displayTips(false);
};

//listen to click of tip button and add to the tips
document.getElementById('addTipButton').addEventListener('click', function() {
    const tipInput = document.getElementById('newTip');
    const addedTip = tipInput.value;

    if (addedTip) {
        addUserTip(addedTip);
        tipInput.value = '';
    }
});

document.getElementById('cashRefresh').addEventListener('click', function(){
    displayTips(true);
})

//Notifications

let notifications = [
    { id: 1, message: "You have a new message!", read: false, important: false },
    { id: 2, message: "Your subscription is about to expire.", read: false, important: true },
    { id: 3, message: "Your order has been shipped.", read: true, important: false },
];

// notifications start to showing up
function renderNotifications() {
    const notificationsList = document.getElementById('notifications-list');
    notificationsList.innerHTML = '';

    if (notifications.length === 0) {
        notificationsList.innerHTML = '<li>No notifications available.</li>';
    } else {
        notifications.forEach(notification => {
            const li = document.createElement('li');
            li.className = notification.read ? 'notification-read' : '';
            li.innerHTML = `
                <div class="notification-content">
                    ${notification.important ? '<strong>⭐ </strong>' : ''}
                    ${notification.message}
                </div>
                <div class="notification-actions">
                    <button onclick="markAsRead(${notification.id})">Mark as Read</button>
                    <button onclick="markAsImportant(${notification.id})">
                        ${notification.important ? 'Unmark Important' : 'Mark Important'}
                    </button>
                    <button onclick="archiveNotification(${notification.id})">Archive</button>
                    <button onclick="deleteNotification(${notification.id})">Delete</button>
                </div>
            `;
            notificationsList.appendChild(li);
        });
    }
}

// Mark as read
function markAsRead(id) {
    notifications = notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
    );
    renderNotifications();
}

// Mark as important
function markAsImportant(id) {
    notifications = notifications.map(notification =>
        notification.id === id ? { ...notification, important: !notification.important } : notification
    );
    renderNotifications();
}

// Archive notification
function archiveNotification(id) {
    console.log(`Archived notification ${id}`); 
    notifications = notifications.filter(notification => notification.id !== id);
    renderNotifications();
}

// Delete notification
function deleteNotification(id) {
    notifications = notifications.filter(notification => notification.id !== id);
    renderNotifications();
}

// Clear all notifications
function clearNotifications() {
    notifications = [];
    renderNotifications();
}

// Event listener for clear button
document.getElementById('clear-notifications-btn').addEventListener('click', clearNotifications);

// Initial render
document.addEventListener('DOMContentLoaded', renderNotifications);

//Settings
//maybe want session storage not local storage
function storeInput() {
    const newUsername = document.getElementById("username-input").value;
    const newEmail = document.getElementById("email-input").value;
    const newPassword = document.getElementById("password-input").value;

    const account_information = {
        user: newUsername,
        email: newEmail,
        pass: newPassword
    };

    localStorage.setItem("accountInformation", JSON.stringify(account_information));
    console.log("Account Information stored in localStorage.");
}

// Retrieve the stored account information from localStorage
const storedAccountInfo = JSON.parse(localStorage.getItem("accountInformation"));

// Check if the information exists i think
if (storedAccountInfo) {
    const storedUsername = storedAccountInfo.user;
    const storedEmail = storedAccountInfo.email;
    const storedPassword = storedAccountInfo.pass;

    
    console.log("Retrieved Stored Username:", storedUsername);
    console.log("Retrieved Stored Email:", storedEmail);
    console.log("Retrieved Stored Password:", storedPassword);
} else {
    console.log("No account information found in localStorage.");
}

//Planner-Notes

document.addEventListener('DOMContentLoaded', () => {
    const addPlannerBtn = document.getElementById('add-planner');
    const addWishlistBtn = document.getElementById('add-wishlist');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('close-popup');
    const addItemForm = document.getElementById('add-item-form');
    const popupTitle = document.getElementById('popup-title');
    const clearPlanner = document.getElementById('clear-planner');
    const clearWishlist = document.getElementById('clear-wishlist');

    let currentList = null;

    function showPopup(title, listId) {
        popup.style.display = 'block';
        popupTitle.textContent = title;
        currentList = document.getElementById(listId);
    }

    function closePopup() {
        popup.style.display = 'none';
        addItemForm.reset();
    }

    addPlannerBtn.addEventListener('click', () => {
        showPopup('Add to Planner', 'planner-list');
    });

    addWishlistBtn.addEventListener('click', () => {
        showPopup('Add to Wishlist', 'wishlist-list');
    });

    closePopupBtn.addEventListener('click', closePopup);

    addItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const data = { name, description };

        if (!name) {
            alert('Item name is required');
            return;
        }

        if (!description) {
            alert('Item description is required');
            return;
        }

        const endpoint = currentList.id === 'planner-list' ? 'NotesRoutes' : '/WishlistRoutes';
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            
            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const item = await response.json();

            const li = document.createElement('li');
            li.textContent = description ? `${name} - ${description}` : name;
            currentList.appendChild(li);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', () => deleteItem(endpoint, item.id, li));
            li.appendChild(deleteBtn);

            closePopup();
        }
        catch(error) {
            console.error('Error adding item:', error);
        }
    });

    window.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    function loadItems() {
        wishlistStore.getAll().onsuccess = function(event) {
            const wishlistItems = event.target.result;
            const wishlistList = document.getElementById('wishlist-list');

            wishlistItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.description ? `${item.name} - ${item.description}` : item.name;
                wishlistList.appendChild(li);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', function() {
                    wishlistList.removeChild(li);
                    deleteItem('wishlist', item);
                });
                li.appendChild(deleteBtn);
            });
        }
        plannerStore.getAll().onsuccess = function(event) {
            const plannerItems = event.target.result;
            const plannerList = document.getElementById('planner-list');

            plannerItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.description ? `${item.name} - ${item.description}` : item.name;
                plannerList.appendChild(li);

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', function() {
                    plannerList.removeChild(li);
                    deleteItem('planner', item);
                });
                li.appendChild(deleteBtn);
            });
        }
    }

    // function editItem(storeName, item) {
    //     const tx = db.transaction(storeName, 'readwrite');
    //     const store = tx.objectStore(storeName);
    //     store.put(item);
    // }
    
    function deleteItem(storeName, item) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.delete(item.id);
    }

    function clearItems(storeName) {
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);
        store.clear();
    }

    clearPlanner.addEventListener('click', () => {
        clearItems('planner');
        document.getElementById('planner-list').innerHTML = '';
    });
    clearWishlist.addEventListener('click', () => {
        clearItems('wishlist');
        document.getElementById('wishlist-list').innerHTML = '';
    });

    loadItems();
});