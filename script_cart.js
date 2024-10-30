// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    // EDIT BUTTON FUNCTIONALITY
    const editButtons = document.querySelectorAll('.buttonEdit');
    const textAreas = document.querySelectorAll('.inputText');

    editButtons.forEach((button, index) => {
        const textArea = textAreas[index];
        let isEditable = false;

        button.addEventListener('click', function () {
            if (!isEditable) {
                textArea.removeAttribute('readonly');
                textArea.focus();
                button.textContent = 'Save';
                isEditable = true;
            } else {
                textArea.setAttribute('readonly', true);
                button.textContent = 'Edit';
                isEditable = false;
            }
        });
    });

    // SIZE CHANGE FUNCTIONALITY
    let currentSize = 38; // Default starting size
    const minSize = 34;
    const maxSize = 44;

    const decreaseButton = document.querySelector('.sizeDecreaseButton');
    const increaseButton = document.querySelector('.sizeIncreaseButton');
    const currentSizeDisplay = document.querySelector('.currentSize');

    function updateSize() {
        currentSizeDisplay.textContent = currentSize;
    }

    decreaseButton.addEventListener('click', () => {
        if (currentSize > minSize) {
            currentSize--;
            updateSize();
        }
    });

    increaseButton.addEventListener('click', () => {
        if (currentSize < maxSize) {
            currentSize++;
            updateSize();
        }
    });

    // INITIAL SIZE DISPLAY
    updateSize();

    // QUANTITY UPDATE FUNCTIONALITY
    const subtotalItemsText = document.querySelector('#subtotalItems h2');
    const subtotalPriceText = document.querySelector('#subtotalPrice h2');
    const totalPriceText = document.querySelector('#totalText h2');

    function updateSubtotal() {
        let subtotal = 0;
        const cartItems = document.querySelectorAll('.cartItems');

        cartItems.forEach(item => {
            const quantityCount = parseInt(item.querySelector('.quantityCount').textContent);
            const priceElement = item.querySelector('.itemDetails p:nth-of-type(5)');
            const priceValue = parseFloat(priceElement.textContent.replace('$', '').trim());

            subtotal += quantityCount * priceValue;
        });

        subtotalItemsText.textContent = `Subtotal ( ${getTotalItems()} items )`;
        subtotalPriceText.textContent = `$${subtotal.toFixed(2)}`;
        totalPriceText.textContent = `$${subtotal.toFixed(2)}`;
    }

    function getTotalItems() {
        let totalItems = 0;
        const cartItems = document.querySelectorAll('.cartItems');

        cartItems.forEach(item => {
            const quantityCount = parseInt(item.querySelector('.quantityCount').textContent);
            totalItems += quantityCount;
        });

        return totalItems;
    }

    // PARENT CONTAINER FOR ALL CART ITEMS
    const cartContainer = document.querySelector('.cartItems'); // Adjust this selector as needed

    // Long press functionality for quantity buttons
    let intervalId;
    const longPressInterval = 220; // Time in milliseconds between updates

    function startUpdating(button, operation) {
        const cartItem = button.closest('.cartItems');
        const quantityCountElement = cartItem.querySelector('.quantityCount');
        let quantityCount = parseInt(quantityCountElement.textContent); // Get the current quantity

        // Start the interval to keep updating
        intervalId = setInterval(() => {
            if (operation === 'increase') {
                quantityCount++;
            } else if (operation === 'decrease') {
                quantityCount = Math.max(0, quantityCount - 1); // Prevent negative quantity
            }
            quantityCountElement.textContent = quantityCount; // Update the display
            updateSubtotal(); // Update the subtotal after changing quantity
            updateTotalQuantity(); // Update the total quantity display
        }, longPressInterval);
    }

    function stopUpdating() {
        clearInterval(intervalId);
    }

    // QUANTITY BUTTON EVENT LISTENER USING EVENT DELEGATION
    cartContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('quantityButton')) {
            const button = event.target;
            const cartItem = button.closest('.cartItems'); // Find the closest cart item
            const quantityCountElement = cartItem.querySelector('.quantityCount'); // Get the quantity element

            let quantityCount = parseInt(quantityCountElement.textContent); // Get the current quantity

            // Update quantity based on button clicked
            if (button.textContent === '+') {
                quantityCount++;
            } else if (button.textContent === '-') {
                quantityCount = Math.max(0, quantityCount - 1); // Prevent negative quantity
            }

            // Update the quantity display in the cart item
            quantityCountElement.textContent = quantityCount;

            // Update subtotals and total quantity display
            updateSubtotal();
            updateTotalQuantity();
        }
    });

    // Adding event listeners for long press functionality
    cartContainer.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('quantityButton')) {
            const button = event.target;
            const operation = button.textContent === '+' ? 'increase' : 'decrease';
            startUpdating(button, operation);
        }
    });

    cartContainer.addEventListener('mouseup', stopUpdating);
    cartContainer.addEventListener('mouseleave', stopUpdating);

    // UPDATE TOTAL QUANTITY
    function updateTotalQuantity() {
        let totalQuantity = 0;
        const cartItems = document.querySelectorAll('.cartItems');

        // Calculate total quantity of items in the cart
        cartItems.forEach(item => {
            const itemQuantity = parseInt(item.querySelector('.quantityCount').textContent);
            totalQuantity += itemQuantity; // Sum up quantities
        });

        const shoppingCartText = document.querySelector('#shoppingCartText'); // Assuming this contains the h1
        const h1Element = shoppingCartText.querySelector('h1');
        if (h1Element) {
            h1Element.textContent = `Shopping Cart ( ${totalQuantity} items )`;
        }
    }

    // INITIAL CART UPDATE
    updateSubtotal();
    updateTotalQuantity();
});
