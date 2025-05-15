const elements = {
	fastFood: document.querySelector(".food-select"),
	fastFoodPrices: document.querySelector(".price-select"),
	fastFoodNumber: document.querySelector(".fastFoodQuantity input"),
	roasted: document.querySelector(".roasted-select"),
	roastedPrices: document.querySelector(".roasted-price"),
	roastedNumber: document.querySelector(".roastedQuantity input"),
	drinks: document.querySelector(".drinks-select"),
	drinkSizes: document.querySelector(".size-select"),
	drinkPrices: document.querySelector(".drinks-price"),
	drinkNumber: document.querySelector(".drinksQuantity input"),
	totalAmount: document.querySelector("#totalAmount"),
	orderButton: document.querySelector("#orderBtn"),
	orderForm: document.querySelector("#orderForm"),
	fastFoodContainer: document.getElementById("fastFoodContainer"),
	cashRadio: document.querySelector("#cash"),
	cardRadio: document.querySelector("#card"),
	cardDetails: document.querySelector("#cardNumberContainer"),
};

// Menu Data
const menuData = {
	roasted: [
		{ id: "kfs", name: "KFS", price: 45000 },
		{ id: "fish", name: "BALIQ", price: 55000 },
		{ id: "wings", name: "TOVUQ QANOTLARI", price: 40000 },
		{ id: "fries", name: "KARTOSHKA FRIES", price: 15000 },
	],
	fastFood: [
		{ id: "hotdog", name: "XOT DOG", prices: [15000, 22000, 28000] },
		{ id: "nondog", name: "NON DOG", prices: [12000, 18000, 25000] },
		{ id: "pitta", name: "PITTA", prices: [25000, 32000, 38000] },
		{ id: "lavash", name: "LAVASH", prices: [22000, 28000, 32000] },
		{ id: "burger", name: "BURGER", prices: [25000, 32000, 38000] },
	],
	drinks: [
		{
			id: "cola",
			name: "COCA COLA",
			sizes: ["0.5L", "1.0L", "1.5L", "2.0L"],
			prices: [5000, 8000, 12000, 15000],
		},
		{
			id: "pepsi",
			name: "PEPSI",
			sizes: ["0.5L", "1.0L", "1.5L", "2.0L"],
			prices: [5000, 8000, 12000, 15000],
		},
		{
			id: "fanta",
			name: "FANTA",
			sizes: ["0.5L", "1.0L", "1.5L", "2.0L"],
			prices: [5000, 8000, 12000, 15000],
		},
		{
			id: "gorilla",
			name: "GORILLA",
			prices: 12000,
		},
		{
			id: "adrenaline",
			name: "ADRENALINE",
			prices: 17000,
		},
		{
			id: "sok",
			name: "SOK",
			prices: 15000,
		},
	],
};

// Constants for messages
const MESSAGES = {
	SELECT_FOOD: "Ovqat tanlang",
	SELECT_PRICE: "Narxni tanlang",
	SELECT_DRINK: "Ichimlik tanlang",
	SELECT_SIZE: "Hajmini tanlang",
	SELECT_ROASTED: "Qovurilgan taom tanlang",
	ORDER_SUCCESS: "Buyurtmangiz muvaffaqiyatli qabul qilindi!",
	ORDER_FAIL: "Buyurtma yuborishda xatolik yuz berdi",
	VALIDATION_ERROR: "Iltimos, barcha maydonlarni to'ldiring",
};

// Utility Functions
function clearSelect(select, defaultText) {
	if (!select) return;
	select.innerHTML = `<option disabled selected>${defaultText}</option>`;
}

function addOption(select, value, text) {
	if (!select) return;
	const option = document.createElement("option");
	option.value = value;
	option.textContent = text;
	select.appendChild(option);
}

// Menu Initialization
function initializeSelects() {
	// Fast Food
	if (elements.fastFood) {
		clearSelect(elements.fastFood, MESSAGES.SELECT_FOOD);
		menuData.fastFood.forEach((item) => {
			addOption(elements.fastFood, item.id, item.name);
		});
	}

	// Drinks
	if (elements.drinks) {
		clearSelect(elements.drinks, MESSAGES.SELECT_DRINK);
		menuData.drinks.forEach((item) => {
			addOption(elements.drinks, item.id, item.name);
		});
	}

	// Roasted
	if (elements.roasted) {
		clearSelect(elements.roasted, MESSAGES.SELECT_ROASTED);
		menuData.roasted.forEach((item) => {
			addOption(elements.roasted, item.id, item.name);
		});
	}
}

// Event Handlers
function handleFastFoodChange(e) {
	if (!e.target || !e.target.value) return;

	const itemId = e.target.value;
	const item = menuData.fastFood.find((i) => i.id === itemId);
	if (!item) return;

	const container = e.target.closest(".fastFood");
	if (!container) return;

	const priceSelect = container.querySelector(".price-select");
	if (!priceSelect) return;

	clearSelect(priceSelect, MESSAGES.SELECT_PRICE);
	item.prices.forEach((price, index) => {
		// Add size description for different prices
		const sizeText = index === 0 ? "Kichik" : index === 1 ? "O'rta" : "Katta";
		addOption(priceSelect, price, `${sizeText}: ${price.toLocaleString()} so'm`);
	});

	// Mark this as a changed item to trigger total calculation
	priceSelect.addEventListener("change", calculateTotal);
	calculateTotal();
}

// Completely rewritten drinks handler to directly show sizes and make price calculation simpler
function handleDrinksChange(e) {
	if (!e.target || !e.target.value) return;

	const itemId = e.target.value;
	const item = menuData.drinks.find((i) => i.id === itemId);
	if (!item) return;

	const container = e.target.closest(".drinks");
	if (!container) return;

	const sizeSelect = container.querySelector(".size-select");
	const priceSelect = container.querySelector(".drinks-price");

	if (!sizeSelect || !priceSelect) return;

	clearSelect(sizeSelect, MESSAGES.SELECT_SIZE);
	clearSelect(priceSelect, MESSAGES.SELECT_PRICE);

	// Store the drink ID on the container for easy reference
	container.dataset.drinkId = itemId;

	if (Array.isArray(item.prices)) {
		// For drinks with multiple sizes
		item.sizes.forEach((size, index) => {
			const price = item.prices[index];
			// Show size and corresponding price in the size select
			addOption(sizeSelect, index, `${size} - ${price.toLocaleString()} so'm`);
		});

		// When a size is selected, update the hidden price select with the actual price value
		sizeSelect.addEventListener("change", function () {
			const sizeIndex = parseInt(this.value);
			if (isNaN(sizeIndex)) return;

			const price = item.prices[sizeIndex];
			clearSelect(priceSelect, MESSAGES.SELECT_PRICE);
			addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
			priceSelect.value = price;
			priceSelect.dataset.priceIndex = sizeIndex;
			calculateTotal();
		});
	} else {
		// For drinks with a single price
		const price = typeof item.prices === "number" ? item.prices : item.prices[0];
		// No size selection needed for single-price drinks
		addOption(sizeSelect, 0, `Standard - ${price.toLocaleString()} so'm`);
		sizeSelect.value = 0;

		// Update the hidden price select
		addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
		priceSelect.value = price;
		calculateTotal();
	}
}

function handleRoastedChange(e) {
	if (!e.target || !e.target.value) return;

	const itemId = e.target.value;
	const item = menuData.roasted.find((i) => i.id === itemId);
	if (!item) return;

	const container = e.target.closest(".roasted");
	if (!container) return;

	const priceSelect = container.querySelector(".roasted-price");
	if (!priceSelect) return;

	clearSelect(priceSelect, MESSAGES.SELECT_PRICE);
	addOption(priceSelect, item.price, `${item.price.toLocaleString()} so'm`);
	calculateTotal();
}

function handlePaymentMethodChange() {
	if (!elements.cardDetails) return;

	if (elements.cardRadio.checked) {
		elements.cardDetails.innerHTML = `
            <div class="card-details">
                <div class="card-input">
                    <label>
                        <i class="fa-solid fa-credit-card"></i>
                        Karta raqami:
                    </label>
                    <div class="card-number-container">
                        <input type="text" 
                               id="cardNumber"
                               pattern="[0-9]{16}" 
                               maxlength="16" 
                               placeholder="0000 0000 0000 0000" 
                               required />
                        <button type="button" class="copy-card-btn" onclick="copyCardNumber()">
                            <i class="fa-solid fa-copy"></i>
                        </button>
                    </div>
                </div>
                <div class="card-input">
                    <label>
                        <i class="fa-solid fa-user"></i>
                        Karta egasi:
                    </label>
                    <input type="text" 
                           id="cardHolder"
                           placeholder="IVAN IVANOV" 
                           pattern="[A-Za-z\\s]+" 
                           required />
                </div>
            </div>
        `;

		// Add CSS for the card number container
		const style = document.createElement("style");
		style.textContent = `
            .card-number-container {
                display: flex;
                align-items: center;
                width: 100%;
            }
            .card-number-container input {
                flex: 1;
            }
            .copy-card-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 5px 10px;
                color: #007bff;
            }
            .copy-card-btn:hover {
                color: #0056b3;
            }
        `;
		document.head.appendChild(style);
	} else {
		elements.cardDetails.innerHTML = `
            <div class="payment-info">
                <i class="fa-solid fa-money-bill"></i>
                <span>Naqd pul bilan to'lov</span>
            </div>
        `;

		// Add CSS for cash payment info
		const style = document.createElement("style");
		if (!document.querySelector("style[data-payment-style]")) {
			style.setAttribute("data-payment-style", "true");
			style.textContent = `
                .payment-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 10px;
                    background-color: #f8f9fa;
                    border-radius: 5px;
                    margin-top: 10px;
                }
                .payment-info i {
                    color: #28a745;
                    font-size: 1.2rem;
                }
            `;
			document.head.appendChild(style);
		}
	}
}

// Function to copy card number to clipboard
function copyCardNumber() {
	const cardNumberInput = document.getElementById("cardNumber");
	if (!cardNumberInput) return;

	// Copy text to clipboard
	cardNumberInput.select();
	document.execCommand("copy");

	// Show success message
	showToast("Karta raqami nusxalandi!", "success");
}

// Completely rewritten Total Calculation with better error handling and improved drink pricing
function calculateTotal() {
	try {
		let total = 0;

		// Calculate Fast Food total
		document.querySelectorAll(".fastFood").forEach((item) => {
			const foodSelect = item.querySelector(".food-select");
			const priceSelect = item.querySelector(".price-select");
			const quantityInput = item.querySelector('input[type="number"]');

			if (foodSelect?.value && priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
		});

		// Calculate Roasted items total
		document.querySelectorAll(".roasted").forEach((item) => {
			const roastedSelect = item.querySelector(".roasted-select");
			const priceSelect = item.querySelector(".roasted-price");
			const quantityInput = item.querySelector('input[type="number"]');

			if (roastedSelect?.value && priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
		});

		// Calculate Drinks total with improved handling
		document.querySelectorAll(".drinks").forEach((item) => {
			const drinkSelect = item.querySelector(".drinks-select");
			const sizeSelect = item.querySelector(".size-select");
			const priceSelect = item.querySelector(".drinks-price");
			const quantityInput = item.querySelector('input[type="number"]');

			// Method 1: Try to get price from price select
			if (drinkSelect?.value && priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
			// Method 2: If price select doesn't have a value, try to calculate from drink data
			else if (drinkSelect?.value && sizeSelect?.value && quantityInput?.value) {
				const drinkId = drinkSelect.value;
				const sizeIndex = parseInt(sizeSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(sizeIndex) && !isNaN(quantity)) {
					const drink = menuData.drinks.find((d) => d.id === drinkId);
					if (drink) {
						let price;
						if (Array.isArray(drink.prices)) {
							price = drink.prices[sizeIndex];
						} else {
							price = drink.prices;
						}

						if (!isNaN(price)) {
							total += price * quantity;
						}
					}
				}
			}
		});

		// Update total display
		if (elements.totalAmount) {
			elements.totalAmount.textContent = `${total.toLocaleString()}`;
		}

		return total;
	} catch (error) {
		console.error("Error calculating total:", error);
		showToast("Narxlarni hisoblashda xatolik yuz berdi", "error");
		return 0;
	}
}

// Toast notification function
function showToast(message, type = "success") {
	Toastify({
		text: message,
		duration: 3000,
		close: true,
		gravity: "top",
		position: "right",
		backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
		stopOnFocus: true,
	}).showToast();
}

// Improved Add New Item Functions with proper event binding
function addNewItem(type) {
	try {
		const selectors = {
			fastFood: {
				template: ".fastFood",
				defaultMsg: MESSAGES.SELECT_FOOD,
				handler: handleFastFoodChange,
			},
			drinks: {
				template: ".drinks",
				defaultMsg: MESSAGES.SELECT_DRINK,
				handler: handleDrinksChange,
			},
			roasted: {
				template: ".roasted",
				defaultMsg: MESSAGES.SELECT_ROASTED,
				handler: handleRoastedChange,
			},
		};

		const config = selectors[type];
		if (!config) return;

		// Find the first template to clone
		const template = document.querySelector(config.template);
		if (!template) return;

		const newItem = template.cloneNode(true);

		// Reset all selects
		newItem.querySelectorAll("select").forEach((select) => {
			// Clear and reset to default state
			if (
				select.classList.contains("food-select") ||
				select.classList.contains("drinks-select") ||
				select.classList.contains("roasted-select")
			) {
				clearSelect(select, config.defaultMsg);

				// Rebuild options from menu data
				if (type === "fastFood") {
					menuData.fastFood.forEach((item) => {
						addOption(select, item.id, item.name);
					});
				} else if (type === "drinks") {
					menuData.drinks.forEach((item) => {
						addOption(select, item.id, item.name);
					});
				} else if (type === "roasted") {
					menuData.roasted.forEach((item) => {
						addOption(select, item.id, item.name);
					});
				}
			} else {
				// Other selects (price, size) just clear
				select.innerHTML = "";
				select.selectedIndex = -1;
			}
		});

		// Reset quantity
		const quantityInput = newItem.querySelector('input[type="number"]');
		if (quantityInput) {
			quantityInput.value = 1;
			quantityInput.addEventListener("input", calculateTotal);
		}

		// Add remove button
		const removeBtn = document.createElement("button");
		removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
		removeBtn.className = "remove-item";
		removeBtn.onclick = function () {
			newItem.remove();
			calculateTotal();
			showToast(`${type} olib tashlandi`, "success");
		};

		newItem.appendChild(removeBtn);

		// Add event listeners for main select
		const mainSelect = newItem.querySelector(
			type === "fastFood" ? ".food-select" : type === "drinks" ? ".drinks-select" : ".roasted-select"
		);

		if (mainSelect) {
			// Remove old listeners to avoid duplicates
			mainSelect.replaceWith(mainSelect.cloneNode(true));

			// Get the new reference after replacing
			const newMainSelect = newItem.querySelector(
				type === "fastFood" ? ".food-select" : type === "drinks" ? ".drinks-select" : ".roasted-select"
			);

			// Add the handler
			if (newMainSelect) {
				newMainSelect.addEventListener("change", config.handler);
			}
		}

		// Add to container
		const container = template.parentElement;
		const addMoreBtn = container.querySelector(`.${type}AddMore`);

		if (container && addMoreBtn) {
			container.insertBefore(newItem, addMoreBtn.parentElement.nextSibling);
		} else if (type === "fastFood" && elements.fastFoodContainer) {
			elements.fastFoodContainer.appendChild(newItem);
		}

		calculateTotal();
		showToast(`Yangi ${type} qo'shildi`, "success");
	} catch (error) {
		console.error(`Error adding new ${type}:`, error);
		showToast(`${type} qo'shishda xatolik yuz berdi`, "error");
	}
}

// Send order to Telegram bot
function sendOrderToTelegram() {
	try {
		// Проверяем, выбран ли хотя бы один товар
		const hasSelectedItems = checkForSelectedItems();
		if (!hasSelectedItems) {
			showToast("Iltimos, kamida bitta mahsulot tanlang", "error");
			return false;
		}

		// Проверяем только обязательные поля формы
		const form = elements.orderForm;
		const requiredFields = form.querySelectorAll("[required]");
		const isFormValid = Array.from(requiredFields).every((field) => field.value.trim() !== "");

		if (!isFormValid) {
			showToast(MESSAGES.VALIDATION_ERROR, "error");
			return false;
		}

		// Get customer info
		const customerName = form.querySelector('input[type="text"]').value;
		const customerPhone = form.querySelector('input[type="tel"]').value;
		const customerAddress = form.querySelector('input[type="text"]:nth-of-type(2)').value;
		const paymentMethod = elements.cardRadio.checked ? "Karta" : "Naqd pul";

		// Get card details if payment is by card
		let cardDetails = "";
		if (elements.cardRadio.checked) {
			const cardNumber = document.getElementById("cardNumber")?.value || "";
			const cardHolder = document.getElementById("cardHolder")?.value || "";

			if (cardNumber && cardHolder) {
				// Mask card number for security
				const maskedCardNumber = cardNumber.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, "$1 $2 $3 $4");
				cardDetails = `\n💳 *Card Number*: ${maskedCardNumber}\n👤 *Card Holder*: ${cardHolder}\n`;
			}
		}

		// Format order details
		let orderDetails = `🍔 *75BURGER NEW ORDER* 🍔\n\n`;
		orderDetails += `👤 *Customer*: ${customerName}\n`;
		orderDetails += `📞 *Phone*: ${customerPhone}\n`;
		orderDetails += `🏠 *Address*: ${customerAddress}\n`;
		orderDetails += `💰 *Payment*: ${paymentMethod}${cardDetails}\n`;

		// Add fast food items
		orderDetails += `\n🌭 *FAST FOOD*:\n`;
		let hasFastFood = false;
		document.querySelectorAll(".fastFood").forEach((item, index) => {
			const foodSelect = item.querySelector(".food-select");
			const priceSelect = item.querySelector(".price-select");
			const quantity = item.querySelector('input[type="number"]').value;

			if (foodSelect.selectedIndex !== 0 && priceSelect.selectedIndex !== 0) {
				const foodName = foodSelect.options[foodSelect.selectedIndex].text;
				const priceText = priceSelect.options[priceSelect.selectedIndex].text;
				orderDetails += `   ${index + 1}. ${foodName} - ${priceText} x ${quantity}\n`;
				hasFastFood = true;
			}
		});

		if (!hasFastFood) {
			orderDetails += `   Yo'q\n`;
		}

		// Add roasted items
		orderDetails += `\n🍗 *ROASTED*:\n`;
		let hasRoasted = false;
		document.querySelectorAll(".roasted").forEach((item, index) => {
			const roastedSelect = item.querySelector(".roasted-select");
			const priceSelect = item.querySelector(".roasted-price");
			const quantity = item.querySelector('input[type="number"]').value;

			if (roastedSelect.selectedIndex !== 0 && priceSelect.selectedIndex !== 0) {
				const foodName = roastedSelect.options[roastedSelect.selectedIndex].text;
				const priceText = priceSelect.options[priceSelect.selectedIndex].text;
				orderDetails += `   ${index + 1}. ${foodName} - ${priceText} x ${quantity}kg\n`;
				hasRoasted = true;
			}
		});

		if (!hasRoasted) {
			orderDetails += `   Yo'q\n`;
		}

		// Add drinks with improved formatting
		orderDetails += `\n🥤 *DRINKS*:\n`;
		let hasDrinks = false;
		document.querySelectorAll(".drinks").forEach((item, index) => {
			const drinkSelect = item.querySelector(".drinks-select");
			const sizeSelect = item.querySelector(".size-select");
			const quantity = item.querySelector('input[type="number"]').value;

			if (drinkSelect.selectedIndex !== 0 && sizeSelect.selectedIndex !== 0) {
				const drinkName = drinkSelect.options[drinkSelect.selectedIndex].text;
				const sizeText = sizeSelect.options[sizeSelect.selectedIndex].text;

				orderDetails += `   ${index + 1}. ${drinkName} - ${sizeText} x ${quantity}\n`;
				hasDrinks = true;
			}
		});

		if (!hasDrinks) {
			orderDetails += `   Yo'q\n`;
		}

		// Add total
		const total = elements.totalAmount.textContent;
		orderDetails += `\n💵 *TOTAL*: ${total} so'm`;

		// Your bot token and chat ID should be configured
		const BOT_TOKEN = "YOUR_BOT_TOKEN"; // Replace with your actual token
		const CHAT_ID = "YOUR_CHAT_ID"; // Replace with your actual chat ID

		// For demonstration purposes, we'll log the order details
		console.log("Order to be sent to Telegram:", orderDetails);

		// In a real implementation, you would send this to your Telegram bot using:
		/*
        fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: orderDetails,
                parse_mode: 'Markdown'
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showToast(MESSAGES.ORDER_SUCCESS, "success");
                form.reset();
                resetOrderForm();
            } else {
                showToast(MESSAGES.ORDER_FAIL, "error");
            }
        })
        .catch(error => {
            console.error('Error sending order to Telegram:', error);
            showToast(MESSAGES.ORDER_FAIL, "error");
        });
        */

		// For now, just show a success message
		showToast(MESSAGES.ORDER_SUCCESS, "success");
		return true;
	} catch (error) {
		console.error("Error sending order:", error);
		showToast(MESSAGES.ORDER_FAIL, "error");
		return false;
	}
}

// Добавьте новую функцию для проверки выбранных товаров
function checkForSelectedItems() {
	// Проверка FastFood
	const hasFastFood = Array.from(document.querySelectorAll(".fastFood")).some((item) => {
		const foodSelect = item.querySelector(".food-select");
		return foodSelect?.selectedIndex > 0;
	});

	// Проверка Drinks
	const hasDrinks = Array.from(document.querySelectorAll(".drinks")).some((item) => {
		const drinkSelect = item.querySelector(".drinks-select");
		return drinkSelect?.selectedIndex > 0;
	});

	// Проверка Roasted
	const hasRoasted = Array.from(document.querySelectorAll(".roasted")).some((item) => {
		const roastedSelect = item.querySelector(".roasted-select");
		return roastedSelect?.selectedIndex > 0;
	});

	// Возвращаем true, если хотя бы один тип товара выбран
	return hasFastFood || hasDrinks || hasRoasted;
}

// Reset order form after successful submission
function resetOrderForm() {
	try {
		// Reset customer info fields
		const form = elements.orderForm;
		if (form) {
			form.reset();
		}

		// Reset all selects to default
		document.querySelectorAll("select").forEach((select) => {
			select.selectedIndex = 0;
		});

		// Reset all quantities to 1
		document.querySelectorAll('input[type="number"]').forEach((input) => {
			input.value = 1;
		});

		// Remove all additional items (except for the first of each type)
		document.querySelectorAll(".remove-item").forEach((btn) => {
			btn.click();
		});

		// Reset payment to cash by default
		if (elements.cashRadio) {
			elements.cashRadio.checked = true;
			handlePaymentMethodChange();
		}

		// Reset card fields if they exist
		const cardNumber = document.getElementById("cardNumber");
		const cardHolder = document.getElementById("cardHolder");
		if (cardNumber) cardNumber.value = "";
		if (cardHolder) cardHolder.value = "";

		// Reset total
		calculateTotal();

		showToast("Forma tozalandi", "success");
	} catch (error) {
		console.error("Error resetting form:", error);
	}
}

// Initialize App
function initializeApp() {
	try {
		console.log("Initializing app...");

		// Initialize selects
		initializeSelects();

		// Add event listeners for selects
		document.querySelectorAll(".food-select").forEach((select) => {
			select.addEventListener("change", handleFastFoodChange);
		});

		document.querySelectorAll(".drinks-select").forEach((select) => {
			select.addEventListener("change", handleDrinksChange);
		});

		document.querySelectorAll(".roasted-select").forEach((select) => {
			select.addEventListener("change", handleRoastedChange);
		});

		// Add quantity change listeners
		document.querySelectorAll('input[type="number"]').forEach((input) => {
			input.addEventListener("input", calculateTotal);
		});

		// Add price select change listeners
		document.querySelectorAll(".price-select, .roasted-price, .drinks-price").forEach((select) => {
			select.addEventListener("change", calculateTotal);
		});

		// Add payment method listeners
		elements.cashRadio?.addEventListener("change", handlePaymentMethodChange);
		elements.cardRadio?.addEventListener("change", handlePaymentMethodChange);

		// Add new item button listeners with improved functionality
		document.querySelector(".fastFoodAddMore")?.addEventListener("click", () => addNewItem("fastFood"));
		document.querySelector(".drinksAddMore")?.addEventListener("click", () => addNewItem("drinks"));
		document.querySelector(".roastedAddMore")?.addEventListener("click", () => addNewItem("roasted"));

		// Order button event listener
		elements.orderButton?.addEventListener("click", () => {
			if (sendOrderToTelegram()) {
				// Reset form after successful order
				setTimeout(resetOrderForm, 2000);
			}
		});

		// Initial payment method setup
		handlePaymentMethodChange();

		// Initial total calculation
		calculateTotal();

		// Show welcome toast
		showToast("75Burger ilovasiga xush kelibsiz!", "success");

		console.log("App initialized successfully");
	} catch (error) {
		console.error("Error initializing app:", error);
		showToast("Ilovani ishga tushirishda xatolik yuz berdi", "error");
	}
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
