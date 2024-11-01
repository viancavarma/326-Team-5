let db;
let currentWeekOffset = 0;
let currentMonthOffset = 0;

// Predefined green shades for category colors
const greenShades = [
    '#6b8e23', '#556b2f', '#8fbc8f', '#b2d3c2',
    '#708238', '#3b7a57', '#66cdaa', '#2e8b57',
    '#98fb98', '#00a36c'
];

// Map to store category colors dynamically
const categoryColors = {};

// Function to assign a shade of green for each category
function getCategoryColor(category) {
    if (!categoryColors[category]) {
        const colorIndex = Object.keys(categoryColors).length % greenShades.length;
        categoryColors[category] = greenShades[colorIndex];
    }
    return categoryColors[category];
}

// Initialize IndexedDB and Create Object Store
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

// Initialize IndexedDB
initIndexedDB();

// Function to add an expense to IndexedDB
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

// Clear entered data in the form fields
function clearEnteredData() {
    document.getElementById('expenseAmount').value = '';
    document.getElementById('expenseCategory').value = '';
    document.getElementById('expenseDate').value = '';
}

// Retrieve and Update Data in Charts
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
    getAllExpenses((expenses) => {
        const weeklyData = processWeeklyData(expenses, weekOffset);
        const categoryData = processMonthlyCategoryData(expenses, monthOffset);

        // Update weekly spending stacked bar chart
        weeklySpendingChart.data.labels = weeklyData.labels;
        weeklySpendingChart.data.datasets = weeklyData.datasets;
        weeklySpendingChart.update();

        // Update pie chart with category data
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

// Process weekly data and create datasets for stacked bar chart by category
function processWeeklyData(expenses, weekOffset) {
    const dayTotalsByCategory = {};
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay() - (weekOffset * 7)));
    startOfWeek.setHours(0, 0, 0, 0); // Set startOfWeek to midnight for consistent comparison

    // Initialize each day within the week with empty category totals
    for (let i = 0; i < 7; i++) {
        const day = new Date(startOfWeek);
        day.setDate(startOfWeek.getDate() + i);
        const dayName = day.toLocaleDateString('default', { weekday: 'long' });
        dayTotalsByCategory[dayName] = {};
    }

    // Filter and sum expenses for the specified week
    expenses.forEach((expense) => {
        const expenseDate = new Date(expense.date + "T00:00:00"); // Ensure consistent time
        expenseDate.setHours(0, 0, 0, 0); // Set to midnight for consistency
        const dayDifference = Math.floor((expenseDate - startOfWeek) / (1000 * 60 * 60 * 24)); // Calculate day difference

        if (dayDifference >= 0 && dayDifference < 7) { // Check if within the current week
            const dayName = Object.keys(dayTotalsByCategory)[dayDifference];
            const category = expense.category;

            if (!dayTotalsByCategory[dayName][category]) {
                dayTotalsByCategory[dayName][category] = 0;
            }
            dayTotalsByCategory[dayName][category] += expense.amount;
        }
    });

    // Extract categories and prepare datasets
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




// Process monthly data for pie chart with consistent colors
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

// Initialize Charts
// Initialize Charts
const weeklySpendingChart = new Chart(document.getElementById('weeklyChart').getContext('2d'), {
    type: 'bar',
    data: {
        labels: [], // Initial empty labels
        datasets: [] // Dynamic datasets for stacked categories
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
                max: 100,  // Set max to 100
                ticks: {
                    stepSize: 10  // Increment by 10
                }
            }
        },
        interaction: {
            mode: 'nearest', // Activates the hover effect on the nearest element
            axis: 'x', // Hover on the x-axis
            intersect: false // Ensures all stacks in the same x-axis are hovered together
        },
        plugins: {
            tooltip: {
                enabled: true,
                mode: 'nearest', // Shows the tooltip for the nearest dataset segment
                intersect: false, // Displays tooltips for all stacks in the bar on hover
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
            intersect: false // Ensures all parts of the stacked bar respond to hover
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
document.getElementById('addExpenseButton').addEventListener('click', () => {
    const amount = document.getElementById('expenseAmount').value;
    const category = document.getElementById('expenseCategory').value;
    const date = document.getElementById('expenseDate').value;
    addExpense(amount, category, date);
});

document.getElementById('clearDataButton').addEventListener('click', clearEnteredData);

document.getElementById('previousWeekButton').addEventListener('click', () => {
    currentWeekOffset += 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextWeekButton').addEventListener('click', () => {
    currentWeekOffset -= 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('previousMonthButton').addEventListener('click', () => {
    currentMonthOffset -= 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});

document.getElementById('nextMonthButton').addEventListener('click', () => {
    currentMonthOffset += 1;
    updateCharts(currentWeekOffset, currentMonthOffset);
});
