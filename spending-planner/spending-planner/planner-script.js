import 'player.style.css';

function load_wishlist() {
    const wishlist = document.getElementById('wishlist');
    wishlist.innerHTML = '';
    const items = JSON.parse(localStorage.getItem('wishlist')) || [];
    items.forEach((item, idx) => {
        const item = document.createElement('li');
        item.textContent = `${item.name}: $${item.price}`;
        wishlist.appendChild(item);
    });
}
function add_to_wishlist() {
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;

    if (name && amount) {
        const new_item = {name, price: parseFloat(price)};
        const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        wishlist.push(new_item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        document.getElementById('name').value = '';
        document.getElementById('price').value = '';
        load_wishlist();
    }
}

document.getElementById('wishlist').addEventListener('add_to_wishlist', add_to_wishlist);
document.addEventListener('DOMContentLoaded', load_wishlist);