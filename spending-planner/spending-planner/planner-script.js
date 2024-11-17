document.addEventListener('DOMContentLoaded', () => {
    const addPlannerBtn = document.getElementById('add-planner');
    const addWishlistBtn = document.getElementById('add-wishlist');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('close-popup');
    const addItemForm = document.getElementById('add-item-form');
    const popupTitle = document.getElementById('popup-title');

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

    addItemForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('item-name').value;
        const description = document.getElementById('item-description').value;
        const data = { name, description };

        if (!name) {
            alert('Item name is required');
            return;
        }

        const storeName = currentList.id === 'planner-list' ? 'planner' : 'wishlist';
        const tx = db.transaction(storeName, 'readwrite');
        const store = tx.objectStore(storeName);  
        store.add(data);

        const li = document.createElement('li');
        li.textContent = description ? `${name} - ${description}` : name;
        currentList.appendChild(li);
        closePopup();
    });

    window.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });

    let db;
    const request = indexedDB.open('spending-planner', 1);
    request.onupgradeneeded = function(event) {
        event.target.result;
        
        if (!db.objectStoreNames.contains('planner')) {
            db.createObjectStore('planner', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('wishlist')) {
            db.createObjectStore('wishlist', { keyPath: 'id', autoIncrement: true });
        }
    };
    request.onsuccess = function(event) {
        db = event.target.result;
        loadItems();
    };
    request.onerror = function(event) {
        console.error('Database error: ' + event.target.errorCode);
    }

    function loadItems() {
        const tx = db.transaction(['planner', 'wishlist'], 'readonly');
        const plannerStore = tx.objectStore('planner');
        const wishlistStore = tx.objectStore('wishlist');

        wishlistStore.getAll().onsuccess = function(event) {
            const wishlistItems = event.target.result;
            const wishlistList = document.getElementById('wishlist-list');
            wishlistItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.description ? `${item.name} - ${item.description}` : item.name;
                wishlistList.appendChild(li);
            });
        }
        plannerStore.getAll().onsuccess = function(event) {
            const plannerItems = event.target.result;
            const plannerList = document.getElementById('planner-list');
            plannerItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item.description ? `${item.name} - ${item.description}` : item.name;
                plannerList.appendChild(li);
            });
        }
    }
});