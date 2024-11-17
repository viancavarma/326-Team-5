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