"use strict";
function addItemToBasket(productCode) {
    let data = PRODUCTS[getProductIndex(productCode)];
    data.quantity++;
    updateBasketItem(data);
    updateDOM();
}
function updateBasketItem(product) {
    const ELEMENT = getOrCreateBasketElementForProduct(product);
    ELEMENT.innerHTML = `
        <div class="information">
            <h1 class="basket-item-name">${product.name}</h1>
            <h2 class="basket-item-price"
                data-total-price="${getTotalPrice(product.price, product.quantity)}">${product.price} x ${product.quantity} = ${getTotalPrice(product.price, product.quantity)}</h2>
        </div>
        <div class="buttons">
            <button class="button-remove" onclick="removeItemFromBasket('${product.code}')">-</button>
            <button class="button-add" onclick="addItemToBasket('${product.code}')">+</button>
        </div>`;
}
function removeItemFromBasket(productCode) {
    const PRODUCT = PRODUCTS[getProductIndex(productCode)];
    const ELEMENT = getOrCreateBasketElementForProduct(PRODUCT);
    if (PRODUCT.quantity > 1) {
        PRODUCT.quantity--;
        updateBasketItem(PRODUCT);
    }
    else {
        PRODUCT.quantity = 0;
        ELEMENT.remove();
    }
    updateDOM();
}
function getTotalPrice(price, quantity) {
    if (price === null || quantity === 0)
        return 'Sorry, a pricing error has occured.';
    let priceInPence = parseInt(price.replaceAll(/\D/g, ''));
    let totalPrice = priceInPence * quantity;
    return '£' + (totalPrice / 100).toFixed(2);
}
function generateCombinedOverallPrice() {
    let combinedTotalPrice = 0;
    const TOTAL_PRICES_FOR_EACH_ELEMENT = document.querySelectorAll('[data-total-price]');
    for (const ELEMENT of TOTAL_PRICES_FOR_EACH_ELEMENT) {
        let temporaryString = (ELEMENT.getAttribute('data-total-price') ?? '£0.00').replaceAll(/[^\d.]/g, '');
        combinedTotalPrice += parseFloat(temporaryString ?? '0');
    }
    const COMBINED_TOTAL_PRICE = document.getElementById('combined-total-price');
    COMBINED_TOTAL_PRICE.innerText = 'Total Price: £' + getDiscount(combinedTotalPrice).toFixed(2);
}
function getProductIndex(productCode) {
    productCode = productCode.replaceAll(/\D/g, '');
    let index = parseInt(productCode);
    return index - 1;
}
function getOrCreateBasketElementForProduct(product) {
    let element = document.getElementById(`basket-item-${product.code}`);
    if (element === null) {
        element = document.createElement('div');
        element.id = `basket-item-${product.code}`;
        element.classList.add('basket-item');
        const BASKET = document.getElementById('basket-items');
        BASKET.appendChild(element);
    }
    return element;
}
function updateDOM() {
    const BASKET = document.getElementById('basket-items');
    const NO_ITEMS = document.getElementById('no-items-message');
    const COMBINED_TOTAL_PRICE = document.getElementById('combined-total-price');
    if (BASKET.children.length === 0) {
        COMBINED_TOTAL_PRICE.style.display = 'none';
        NO_ITEMS.style.display = 'block';
    }
    else {
        COMBINED_TOTAL_PRICE.style.display = 'block';
        NO_ITEMS.style.display = 'none';
    }
    generateCombinedOverallPrice();
}
function getDiscount(totalPrice) {
    const INPUT = document.getElementById('discount-code');
    const ENTERED_CODE = INPUT.value;
    let discount = 0;
    switch (ENTERED_CODE.toLowerCase().replaceAll(/[^a-z\d]/g, '')) {
        case "helloworld":
            discount = totalPrice * 0.1;
            break;
    }
    return totalPrice - discount;
}
