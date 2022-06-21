// Bring in the declaration for a class and the items from that class from the DOM.
declare class Product{
    code: string;
    name: string;
    price: string;
    image: string;
    quantity: number;
}
declare const PRODUCTS: Product[]

/**
 * Add a new item to the basket by either updating the quantity of a pre-existing item
 * or adding an entirely new item to the basket.
 * 
 * @param {string} productCode The product code being addded or updated to the basket.
 * @return {void} This function does not return anything.
 */
function addItemToBasket(productCode: string): void {
    // Target the items section of the basket.
    let data: Product = PRODUCTS[getProductIndex(productCode)]

    // Increase the quantity property that will be read later on.
    data.quantity++

    // Update the basket with the new quantity information.
    updateBasketItem(data)

    // Update the DOM to reflect meta changes.
    updateDOM()
}

/**
 * Reprint a product in the basket to the DOM after it has been updated.
 * 
 * @param {Product} product The product object that holds all the information required to make or update the element.
 * @returns {void} This function does not return anything.
 */
function updateBasketItem(product: Product): void {
    const ELEMENT = getOrCreateBasketElementForProduct(product)

    ELEMENT.innerHTML = `
        <div class="information">
            <h1 class="basket-item-name">${product.name}</h1>
            <h2 class="basket-item-price"
                data-total-price="${getTotalPrice(product.price, product.quantity)}">${product.price} x ${product.quantity} = ${getTotalPrice(product.price, product.quantity)}</h2>
        </div>
        <div class="buttons">
            <button class="button-remove" onclick="removeItemFromBasket('${product.code}')">-</button>
            <button class="button-add" onclick="addItemToBasket('${product.code}')">+</button>
        </div>`
}

/**
 * Either remove one from the quantity and then update the DOM or remove the element from the DOM.
 * 
 * @param {Element} element The element that represents the item in the basket.
 * @param {Product} product The product that holds the data relating to this element.
 * @return {void} This function doesn't return anything.
 */
function removeItemFromBasket(productCode: string): void {
    // Retrieve the product from `productCode`.
    const PRODUCT = PRODUCTS[getProductIndex(productCode)]

    // Retrieve the DOM element from the product..,-,möläkäpjåoj
    const ELEMENT = getOrCreateBasketElementForProduct(PRODUCT)

    // If the quantity is more than 1 then reduce it by 1. Otherwise, remove the whole element.
    if (PRODUCT.quantity > 1) {
        PRODUCT.quantity--
        updateBasketItem(PRODUCT)
    }

    // In the event that this itemn only has a quantity of one. Removing that one will remove the element altogether.
    else {
        PRODUCT.quantity = 0
        ELEMENT.remove()
    }

    // Update the meta data on the DOM.
    updateDOM()
}

/**
 * Get the total price from multiplying the price and the quantity together.
 * Price is represented as a string as described in its parameter.
 * 
 * @param {string|null} price The price in string format so that it looks like this: £83.00
 * @param {number} quantity The amount of items in the basket.
 * @returns {string} A string that represents how much the total cost is formatted to GBP.
 */
function getTotalPrice(price: string|null, quantity: number): string {
    // In the event of data not beign parsed correctly, throw a relevant error.
    if (price === null || quantity === 0) return 'Sorry, a pricing error has occured.'

    /* Use regex to remove all non numbered characters from the string.
       This will take a price like this --> £83.00 to this --> 8300. */
    let priceInPence: number = parseInt(price.replaceAll(/\D/g, ''))

    /* Multiply the price in pence by the quantity of items to get the total price in pence.
       We are also converting this back into a string. */
    let totalPrice: number = priceInPence * quantity

    /* Replace the substring with itself with a decimal point prepended to it and then append that
       onto a '£' character. The end result will convert this --> '16600' to this --> '£166.00' */
    return '£' + (totalPrice / 100).toFixed(2)
}

/**
 * Combine all the total prices for all products in the basket and assign it to the appropriate element on the DOM.
 * 
 * @return {void} This function doesn't return anything.
 */
function generateCombinedOverallPrice(): void {
    let combinedTotalPrice: number = 0
    const TOTAL_PRICES_FOR_EACH_ELEMENT: NodeListOf<HTMLHeadingElement> = document.querySelectorAll('[data-total-price]')

    for (const ELEMENT of TOTAL_PRICES_FOR_EACH_ELEMENT) {
        let temporaryString: string = (ELEMENT.getAttribute('data-total-price') ?? '£0.00').replaceAll(/[^\d.]/g, '')
        combinedTotalPrice += parseFloat(temporaryString ?? '0')
    }

    const COMBINED_TOTAL_PRICE = document.getElementById('combined-total-price')as HTMLHeadingElement
    COMBINED_TOTAL_PRICE.innerText = 'Total Price: £' + getDiscount(combinedTotalPrice).toFixed(2)
}

/**
 * Retrieve the index for the product so that we can access data about it.
 * 
 * @param {string} productCode The code property for the product we watnt the index for.
 * @return {number} The index for the produuct.
 */
function getProductIndex(productCode: string): number{
    // Remove all non-numbers from the code property.
    productCode = productCode.replaceAll(/\D/g, '')

    // Convert the code into a number data type.
    let index: number = parseInt(productCode)

    // P001 will become index 0 so we need to remove one from the value of index before returning it.
    return index - 1
}

/**
 * Retrieve the element from the basket in the DOM or create the element for the basket in the DOM and return it.
 * 
 * @param {Product} product The product in which we use to build or retireve the correct element from/for the DOM.
 * @returns {HTMLDivElement} The element that represents the product in the basket in the DOM.
 */
function getOrCreateBasketElementForProduct(product: Product): HTMLDivElement {
    // Grab the element from the DOM.
    let element: HTMLDivElement = document.getElementById(`basket-item-${product.code}`) as HTMLDivElement

    // If the element is null then that means that we didn't find it in the DOM. Now we must create it.
    if (element === null) {
        // Assign attributes to the newly created element.
        element = document.createElement('div')
        element.id = `basket-item-${product.code}`
        element.classList.add('basket-item')

        const BASKET = document.getElementById('basket-items') as HTMLDivElement

        // Append the element to `BASKET`.
        BASKET.appendChild(element)
    }

    return element
}

/**
 * Update nummerous pieces of text on the DOM.
 * 
 * @return {void} This function doesn't return anything.
 */
function updateDOM(): void {
    /* If the basket is empty then show the empty basket message and display the combined total price elemement.
       If the basket is populated then show the combined total price and hide the empty basket message. */
    const BASKET = document.getElementById('basket-items') as HTMLDivElement
    const NO_ITEMS = document.getElementById('no-items-message') as HTMLHeadingElement
    const COMBINED_TOTAL_PRICE = document.getElementById('combined-total-price') as HTMLHeadingElement

    if (BASKET.children.length === 0) {
        COMBINED_TOTAL_PRICE.style.display = 'none'
        NO_ITEMS.style.display = 'block'
    }
    else {
        COMBINED_TOTAL_PRICE.style.display = 'block'
        NO_ITEMS.style.display = 'none'
    }

    // After everything has been added, calculate the total cost of all the products combined.
    generateCombinedOverallPrice()
}

/**
 * Get the discount in which we are to apply to the overall cost depending on the user's entered code.
 * 
 * @param {number} totalPrice The total price of the order before discounts are applied.
 * @returns {number} The total price of the order after discounts are applied.
 */
function getDiscount(totalPrice: number): number {
    // Get the input element we are to read from.
    const INPUT: HTMLInputElement = document.getElementById('discount-code') as HTMLInputElement

    // Extract the value from the input elememnt.
    const ENTERED_CODE: string = INPUT.value

    // Placeholder variable placed here for scope purposes. It is used in the switch statement and the return statement.
    let discount: number = 0

    // Check for codes from a switch case statement that can marginally support more options for additional codes.
    switch (ENTERED_CODE.toLowerCase().replaceAll(/[^a-z\d]/g, '')) {
        case "helloworld":
            discount = totalPrice * 0.1 // 10% discount
            break
    }
    return totalPrice - discount
}