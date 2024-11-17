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
