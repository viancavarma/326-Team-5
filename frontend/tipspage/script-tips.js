// list of different tips that are helpful to financial wellness
const allTips = ['50-30-20 Rule: 50% of paycheck should go to regular expenses; 30% should go to personal expenses; 20% should go to savings',
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


// shuffle the list of tips
function shuffleTips(array) {
    return array.sort(() => Math.random() - 0.5);
}

// get the tips for the week
function getWeeklyTips() {
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
function displayTips(){
    const tipsList = document.getElementById('tips-list');
    const weeklyTips = getWeeklyTips();

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


displayTips();