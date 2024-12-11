let currentWeekOffset = 0;
let currentMonthOffset = 0;

const greenShades = [
    '#6b8e23', '#556b2f', '#8fbc8f', '#b2d3c2',
    '#708238', '#3b7a57', '#66cdaa', '#2e8b57',
    '#98fb98', '#00a36c'
];

const categoryColors = {};

// Assign a color to a category
function getCategoryColor(category) {
    if (!categoryColors[category]) {
        const colorIndex = Object.keys(categoryColors).length % greenShades.length;
        categoryColors[category] = greenShades[colorIndex];
    }
    return categoryColors[category];
}

// Fetch weekly data for the bar chart from the backend
async function fetchWeeklyData(weekOffset) {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() - (weekOffset * 7)));
    startOfWeek.setHours(0, 0, 0, 0);
    const startDate = startOfWeek.toISOString().split('T')[0];

    try {
        const response = await fetch(`http://localhost:3000/expenses/by-date/${startDate}`);
        if (!response.ok) throw new Error(`Failed to fetch weekly data: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching weekly data:', error);
        return [];
    }
}

// Fetch monthly data for the pie chart from the backend
async function fetchMonthlyData(monthOffset) {
    const now = new Date();
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthOffset, 1);
    const monthString = `${targetMonth.getFullYear()}-${String(targetMonth.getMonth() + 1).padStart(2, '0')}`;

    try {
        const response = await fetch(`http://localhost:3000/expenses/by-month/${monthString}`);
        if (!response.ok) throw new Error(`Failed to fetch monthly data: ${response.statusText}`);
        return await response.json();
    } catch (error) {
        console.error('Error fetching monthly data:', error);
        return [];
    }
}

// Update the charts using backend data
async function updateCharts(weekOffset, monthOffset) {
    console.log('Updating charts:', { weekOffset, monthOffset });

    // Update weekly spending chart
    const weeklyExpenses = await fetchWeeklyData(weekOffset);
    const weeklyData = processWeeklyData(weeklyExpenses, weekOffset);
    weeklySpendingChart.data.labels = weeklyData.labels;
    weeklySpendingChart.data.datasets = weeklyData.datasets;
    weeklySpendingChart.update();

    // Update pie chart for monthly data
    const monthlyExpenses = await fetchMonthlyData(monthOffset);
    const categoryData = processMonthlyCategoryData(monthlyExpenses);
    if (categoryData.values.length === 0) {
        expenditureCategoryChart.data.datasets[0].data = [1];
        expenditureCategoryChart.data.labels = ['No Data'];
        expenditureCategoryChart.options.plugins.legend.display = false;
    } else {
        expenditureCategoryChart.data.datasets[0].data = categoryData.values;
        expenditureCategoryChart.data.labels = categoryData.labels;
        expenditureCategoryChart.data.datasets[0].backgroundColor = categoryData.colors;
        expenditureCategoryChart.options.plugins.legend.display = true;
    }
    expenditureCategoryChart.update();

    updateWeekLabel(weekOffset);
    updateMonthLabel(monthOffset);
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
        const expenseDate = new Date(expense.date);
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

function processMonthlyCategoryData(expenses) {
    const categoryTotals = {};

    expenses.forEach((expense) => {
        const category = expense.category;
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += expense.total;
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
    currentWeekOffset += 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextWeekButton').addEventListener('click', () => {
    console.log('Next week clicked');
    currentWeekOffset -= 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('previousMonthButton').addEventListener('click', () => {
    console.log('Previous month clicked');
    currentMonthOffset -= 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextMonthButton').addEventListener('click', () => {
    console.log('Next month clicked');
    currentMonthOffset += 1;
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
    document.getElementById('deleteSelected').addEventListener('click', deleteSelectedExpenses);
    document.getElementById('editSelected').addEventListener('click', editSelectedExpense);

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
    function loadExpenses(filters = {}) {

        expenseLogsTable.innerHTML = '';
    
        const transaction = db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        const request = store.getAll();
    
        request.onsuccess = (event) => {
            const expenses = event.target.result;
            const filteredExpenses = expenses.filter(expense => {
                return (!filters.date || expense.date === filters.date) &&
                       (!filters.category || expense.category.toLowerCase().includes(filters.category.toLowerCase())) &&
                       (!filters.amount || expense.amount === parseFloat(filters.amount));
            });
    
            filteredExpenses.forEach(expense => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <input type="checkbox" class="select-checkbox" data-id="${expense.id}">
                    </td>
                    <td>${expense.date}</td>
                    <td>${expense.label}</td>
                    <td>${expense.amount.toFixed(2)}</td>
                    <td>${expense.category}</td>
                `;
                expenseLogsTable.appendChild(row);
            });

        };

        request.onerror = (event) => {
            console.error('Error loading expenses:', event);
        };
    }

    function openEditModal(expense) {
        document.getElementById('editExpenseLabel').value = expense.label;
        document.getElementById('editExpenseAmount').value = expense.amount;
        document.getElementById('editExpenseCategory').value = expense.category;
        document.getElementById('editExpenseDate').value = expense.date;
        document.getElementById('editExpenseModal').dataset.expenseId = expense.id;
        document.getElementById('editExpenseModal').style.display = 'block';
    }

    document.getElementById('closeModalButton').addEventListener('click', () => {
        document.getElementById('editExpenseModal').style.display = 'none';
    });
    
    document.getElementById('saveChangesButton').addEventListener('click', () => {
        const expenseId = parseInt(document.getElementById('editExpenseModal').dataset.expenseId, 10);
        const label = document.getElementById('editExpenseLabel').value;
        const amount = parseFloat(document.getElementById('editExpenseAmount').value);
        const category = document.getElementById('editExpenseCategory').value;
        const date = document.getElementById('editExpenseDate').value;
    
        if (!label || isNaN(amount) || !category || !date) {
            alert('Please fill out all fields.');
            return;
        }
    
        const updatedExpense = { id: expenseId, label, amount, category, date };
    
        const transaction = db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        const request = store.put(updatedExpense);
    
        request.onsuccess = () => {
            console.log('Expense updated:', updatedExpense);
            document.getElementById('editExpenseModal').style.display = 'none'; // Close modal
            loadExpenses(); // Refresh the logs
        };
    
        request.onerror = (event) => {
            console.error('Error updating expense:', event);
        };
    }); 

    function editSelectedExpense() {
        const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
        if (selectedCheckboxes.length !== 1) {
            alert('Please select exactly one row to edit.');
            return;
        }
        const selectedId = parseInt(selectedCheckboxes[0].dataset.id, 10);
        const transaction = db.transaction(['expenses'], 'readonly');
        const store = transaction.objectStore('expenses');
        const request = store.get(selectedId);
        request.onsuccess = (event) => {
            const expense = event.target.result;
            if (expense) {
                openEditModal(expense);
            } else {
                alert('Expense not found!');
            }
        };
        request.onerror = (event) => {
            console.error('Error fetching expense for editing:', event);
        };
    }
    
    function updateExpense(id) {
        const label = document.getElementById('expenseLabel').value;
        const amount = parseFloat(document.getElementById('expenseAmount').value);
        const category = document.getElementById('expenseCategory').value;
        const date = document.getElementById('date').value;
        if (!label || isNaN(amount) || !category || !date) {
            alert('Please fill out all fields.');
            return;
        }
        const updatedExpense = { id, label, amount, category, date };
        const transaction = db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        const request = store.put(updatedExpense);
    
        request.onsuccess = () => {
            console.log('Expense updated:', updatedExpense);
            document.getElementById('submitExpense').textContent = 'Submit';
            document.getElementById('submitExpense').onclick = addExpense;
            clearEnteredData();
            loadExpenses();
        };
    
        request.onerror = (event) => {
            console.error('Error updating expense:', event);
        };
    }

    function deleteSelectedExpenses() {
        const selectedCheckboxes = document.querySelectorAll('.select-checkbox:checked');
        const idsToDelete = Array.from(selectedCheckboxes).map(checkbox => parseInt(checkbox.dataset.id, 10));
        if (idsToDelete.length === 0) {
            alert('No rows selected for deletion.');
            return;
        }
        const transaction = db.transaction(['expenses'], 'readwrite');
        const store = transaction.objectStore('expenses');
        idsToDelete.forEach(id => {
            const request = store.delete(id);
            request.onsuccess = () => {
                console.log(`Expense with ID ${id} deleted.`);
            };
            request.onerror = (event) => {
                console.error(`Error deleting expense with ID ${id}:`, event);
            };
        });
        transaction.oncomplete = () => {
            loadExpenses();
        };
    }

    applyFilters.addEventListener('click', () => {
        const filters = {
            date: filterDate.value || null,
            category: filterCategory.value || null,
            amount: filterAmount.value || null
        };
        loadExpenses(filters);
    });

    clearFilters.addEventListener('click', () => {
        filterDate.value = '';
        filterCategory.value = '';
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
// access the backend data base
const BASE_URL = "http://localhost:3000/custom-tips";

// DOM Elements
const tipsList = document.getElementById("tips-list");
const addTipButton = document.getElementById("addTipButton");
const newTipInput = document.getElementById("newTip");
const cashRefreshButton = document.getElementById("cashRefresh");

// fetch and display tips
async function fetchTips() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) throw new Error("Failed to fetch tips");
  
      const tips = await response.json();
      displayTips(tips);
    } catch (error) {
      console.error("Error fetching tips:", error);
    }
  }
  
  // display tips in the "3 Tips for the Week" section
  function displayTips(tips) {
    tipsList.innerHTML = ""; // Clear the current list
    const maxTips = 3; // Limit to 3 tips
    tips.slice(0, maxTips).forEach(tip => {
      const li = document.createElement("li");
      li.textContent = tip.tip;
      tipsList.appendChild(li);
    });
  }

// add new tip
async function addTip() {
    const newTip = newTipInput.value.trim();
    if (!newTip) {
      alert("Please enter a tip.");
      return;
    }
  
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tip: newTip }),
      });
      if (!response.ok) throw new Error("Failed to add tip");
  
      const result = await response.json();
      console.log("Tip added:", result);
      newTipInput.value = ""; // Clear the input field
      fetchTips(); // Refresh the tips list
    } catch (error) {
      console.error("Error adding tip:", error);
    }
  }

// fetch most expensive expense
async function fetchMostExpensiveExpense() {
    try {
        const response = await fetch('http://localhost:3000/tips/most-expensive');;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const { label, amount } = data;
  
        document.getElementById('biggest-expense').textContent = ` ${label} - $${amount.toFixed(2)}`;

    } catch (error) {
        console.error('Error fetching the most expensive expense:', error);
        document.getElementById('biggest-expense').textContent = 'Error fetching expense';
    }
  }

// fetch most expensive category
async function fetchMostExpensiveCategory() {
    try {
      const response = await fetch('http://localhost:3000/tips/most-expensive-category');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      const { category, total_amount } = data;
  
      // Ensure total_amount is valid before formatting
      if (total_amount !== undefined && total_amount !== null) {
        document.getElementById('biggest-category').textContent = ` ${category} - $${total_amount.toFixed(2)}`;
      } else {
        document.getElementById('biggest-category').textContent = ` ${category} - Amount not available`;
      }
    } catch (error) {
      console.error('Error fetching the most expensive category:', error);
      document.getElementById('biggest-category').textContent = 'Error fetching category';
    }
  }

//when page loads display tips
window.onload = function(){
    fetchMostExpensiveExpense();
    fetchMostExpensiveCategory();

};

// Refresh tips when clicking on the cash icon
cashRefreshButton.addEventListener("click", fetchTips);

// Add a new tip when the Add Tip button is clicked
addTipButton.addEventListener("click", addTip);

// Initial Fetch
fetchTips();

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
    // const clearPlanner = document.getElementById('clear-planner');
    // const clearWishlist = document.getElementById('clear-wishlist');

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

    /*
        - Known Issues:
            -adding and deleting items refresh the page
            - clearing the list is bugged so it is commented out for now
            - editing items not implemented
    */
    addItemForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        //const data = { name, description };

        if (!name) {
            alert('Item name is required');
            return;
        }

        if (!description) {
            alert('Item description is required');
            return;
        }

        const endpoint = currentList.id === 'planner-list' ? 'http://localhost:3000/notes' : 'http://localhost:3000/wishlist';
        console.log(endpoint);

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: name, content: description }),
            });

            console.log(response);

            if (!response.ok) {
                throw new Error('Failed to add item');
            }

            const item = await response.json();
            console.log(item);

            const li = document.createElement('li');
            li.textContent = `${name} - ${description}`;
            currentList.appendChild(li);

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.type = 'button';
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                await deleteItem(endpoint, item.id, li);
            });
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

    async function loadItems() {
        try {
            const wishlistResponse = await fetch('http://localhost:3000/wishlist');

            if (!wishlistResponse.ok) {
                throw new Error('Failed to retrieve wishlist items');
            }
            
            const wishlistItems = await wishlistResponse.json();
            const wishlistList = document.getElementById('wishlist-list');
            console.log(wishlistItems);

            wishlistItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.title} - ${item.content}`;
                wishlistList.appendChild(li);
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.type = 'button';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    await deleteItem('http://localhost:3000/wishlist', item.id, li);
                });
                li.appendChild(deleteBtn);
            });

            const plannerResponse = await fetch('http://localhost:3000/notes');  
            if (!plannerResponse.ok) {
                throw new Error('Failed to retrieve planner items');
            }

            const plannerItems = await plannerResponse.json();
            const plannerList = document.getElementById('planner-list');
            console.log(plannerItems);
            plannerItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.title} - ${item.content}`;
                plannerList.appendChild(li);
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.type = 'button';
                deleteBtn.textContent = 'X';
                deleteBtn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    await deleteItem('http://localhost:3000/notes', item.id, li);
                });
                li.appendChild(deleteBtn);
            });
        }
        catch(error) {
            console.error("Error loading items:", error);
        }
    }

    // function editItem(storeName, item) {
    //     const tx = db.transaction(storeName, 'readwrite');
    //     const store = tx.objectStore(storeName);
    //     store.put(item);
    // }
    
    async function deleteItem(endpoint, id, li) {
        try {
            console.log('Deleting item:', id);
            console.log(endpoint);
            console.log(`${endpoint}/${id}`);

            const response = await fetch(`${endpoint}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log(response);
            if (!response.ok) {
                throw new Error('Failed to delete item');
            }

            li.remove();
            console.log('Item deleted:', id);
        }
        catch(error) {
            console.error('Error deleting item:', error);
        }
    }

    // async function clearItems(list_id) {
    //     try {
    //         const list = document.getElementById(list_id);
    //         while (list.firstChild) {
    //             const response = await fetch(`http://localhost:3000/${list_id}`, {
    //                 method: 'DELETE',
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             });
    
    //             console.log(response);
    //             if (!response.ok) {
    //                 throw new Error('Failed to clear items');
    //             }
    
    //             const data = await response.json();
    //             console.log('Items cleared:', data);
    //         }
            
    //     }
    //     catch(error) {
    //         console.error('Error clearing items:', error);
    //     }
    // }

    // clearPlanner.addEventListener('click', () => {
    //     clearItems('notes');
    //     console.log('Planner cleared');
    //     document.getElementById('planner-list').innerHTML = '';
    // });
    // clearWishlist.addEventListener('click', () => {
    //     clearItems('wishlist');
    //     console.log('Wishlist cleared');
    //     document.getElementById('wishlist-list').innerHTML = '';
    // });

    loadItems();
});