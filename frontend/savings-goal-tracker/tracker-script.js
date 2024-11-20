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
            goalItem.innerHTML = `
                <div class="goal-details">
                    <span><strong>${goal.name}</strong> (${goal.current}/${goal.target})</span>
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