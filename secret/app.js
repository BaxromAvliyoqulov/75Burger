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
function initializeSelects() {
	if (elements.fastFood) {
		clearSelect(elements.fastFood, MESSAGES.SELECT_FOOD);
		menuData.fastFood.forEach((item) => {
			addOption(elements.fastFood, item.id, item.name);
		});
	}
	if (elements.drinks) {
		clearSelect(elements.drinks, MESSAGES.SELECT_DRINK);
		menuData.drinks.forEach((item) => {
			addOption(elements.drinks, item.id, item.name);
		});
	}
	if (elements.roasted) {
		clearSelect(elements.roasted, MESSAGES.SELECT_ROASTED);
		menuData.roasted.forEach((item) => {
			addOption(elements.roasted, item.id, item.name);
		});
	}
}
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
		const sizeText = index === 0 ? "Kichik" : index === 1 ? "O'rta" : "Katta";
		addOption(priceSelect, price, `${sizeText}: ${price.toLocaleString()} so'm`);
	});
	priceSelect.addEventListener("change", calculateTotal);
	calculateTotal();
}
function handleDrinksChange(e) {
	if (!e.target || !e.target.value) return;
	const itemId = e.target.value;
	const item = menuData.drinks.find((i) => i.id === itemId);
	if (!item) return;
	const container = e.target.closest(".drinks");
	if (!container) return;
	const sizeSelect = container.querySelector(".size-select");
	container.dataset.drinkId = itemId;
	if (Array.isArray(item.prices)) {
		item.sizes.forEach((size, index) => {
			const price = item.prices[index];
			addOption(sizeSelect, index, `${size} - ${price.toLocaleString()} so'm`);
		});
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
		const price = typeof item.prices === "number" ? item.prices : item.prices[0];
		addOption(sizeSelect, 0, `Standard - ${price.toLocaleString()} so'm`);
		sizeSelect.value = 0;
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

	// Удаляем старые стили
	const oldStyle = document.querySelector("style[data-payment-style]");
	if (oldStyle) {
		oldStyle.remove();
	}

	// Создаем новый элемент стиля
	const style = document.createElement("style");
	style.setAttribute("data-payment-style", "true");

	if (elements.cardRadio.checked) {
		// Для оплаты картой
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
                        <button type="button" class="copy-card-btn">
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

		// Стили для карты
		style.textContent = `
            .card-details {
                margin-top: 15px;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 5px;
            }
            .card-input {
                margin-bottom: 10px;
            }
            .card-input label {
                display: block;
                margin-bottom: 5px;
            }
            .card-number-container {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            .card-number-container input,
            .card-input input {
                width: 100%;
                padding: 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
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

		// Добавляем обработчик для кнопки копирования
		const copyBtn = elements.cardDetails.querySelector(".copy-card-btn");
		if (copyBtn) {
			copyBtn.addEventListener("click", copyCardNumber);
		}
	} else {
		// Для оплаты наличными
		elements.cardDetails.innerHTML = `
            <div class="payment-info">
                <i class="fa-solid fa-money-bill"></i>
                <span>Naqd pul bilan to'lov</span>
            </div>
        `;

		// Стили для наличных
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
	}

	// Добавляем стили
	document.head.appendChild(style);
}

// Обновляем функцию копирования
function copyCardNumber() {
	try {
		const cardNumberInput = document.getElementById("cardNumber");
		if (!cardNumberInput) {
			console.error("Card number input not found");
			return;
		}

		cardNumberInput.select();
		document.execCommand("copy");

		// Снимаем выделение
		window.getSelection().removeAllRanges();

		showToast("Karta raqami nusxalandi!", "success");
	} catch (error) {
		console.error("Error copying card number:", error);
		showToast("Karta raqamini nusxalashda xatolik!", "error");
	}
}
function calculateTotal() {
	try {
		let total = 0;
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
		document.querySelectorAll(".drinks").forEach((item) => {
			const drinkSelect = item.querySelector(".drinks-select");
			const sizeSelect = item.querySelector(".size-select");
			const priceSelect = item.querySelector(".drinks-price");
			const quantityInput = item.querySelector('input[type="number"]');
			if (drinkSelect?.value && priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);
				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			} else if (drinkSelect?.value && sizeSelect?.value && quantityInput?.value) {
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
		const template = document.querySelector(config.template);
		if (!template) return;
		const newItem = template.cloneNode(true);
		newItem.querySelectorAll("select").forEach((select) => {
			if (
				select.classList.contains("food-select") ||
				select.classList.contains("drinks-select") ||
				select.classList.contains("roasted-select")
			) {
				clearSelect(select, config.defaultMsg);
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
				select.innerHTML = "";
				select.selectedIndex = -1;
			}
		});
		const quantityInput = newItem.querySelector('input[type="number"]');
		if (quantityInput) {
			quantityInput.value = 1;
			quantityInput.addEventListener("input", calculateTotal);
		}
		const removeBtn = document.createElement("button");
		removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
		removeBtn.className = "remove-item";
		removeBtn.onclick = function () {
			newItem.remove();
			calculateTotal();
			showToast(`${type} olib tashlandi`, "success");
		};
		newItem.appendChild(removeBtn);
		const mainSelect = newItem.querySelector(
			type === "fastFood" ? ".food-select" : type === "drinks" ? ".drinks-select" : ".roasted-select"
		);
		if (mainSelect) {
			mainSelect.replaceWith(mainSelect.cloneNode(true));
			const newMainSelect = newItem.querySelector(
				type === "fastFood" ? ".food-select" : type === "drinks" ? ".drinks-select" : ".roasted-select"
			);
			if (newMainSelect) {
				newMainSelect.addEventListener("change", config.handler);
			}
		}
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
function sendOrderToTelegram() {
	try {
		const hasSelectedItems = checkForSelectedItems();
		if (!hasSelectedItems) {
			showToast("Iltimos, kamida bitta mahsulot tanlang", "error");
			return false;
		}
		const form = elements.orderForm;
		const requiredFields = form.querySelectorAll("[required]");
		const isFormValid = Array.from(requiredFields).every((field) => field.value.trim() !== "");
		if (!isFormValid) {
			showToast(MESSAGES.VALIDATION_ERROR, "error");
			return false;
		}
		const customerName = form.querySelector('input[type="text"]').value;
		const customerPhone = form.querySelector('input[type="tel"]').value;
		const customerAddress = form.querySelector('input[type="text"]:nth-of-type(2)').value;
		const paymentMethod = elements.cardRadio.checked ? "Karta" : "Naqd pul";
		let cardDetails = "";
		if (elements.cardRadio.checked) {
			const cardNumber = document.getElementById("cardNumber")?.value || "";
			const cardHolder = document.getElementById("cardHolder")?.value || "";
			if (cardNumber && cardHolder) {
				const maskedCardNumber = cardNumber.replace(/^(\d{4})(\d{4})(\d{4})(\d{4})$/, "$1 $2 $3 $4");
				cardDetails = `\n💳 *Card Number*: ${maskedCardNumber}\n👤 *Card Holder*: ${cardHolder}\n`;
			}
		}
		let orderDetails = `🍔 *75BURGER NEW ORDER* 🍔\n\n`;
		orderDetails += `👤 *Customer*: ${customerName}\n`;
		orderDetails += `📞 *Phone*: ${customerPhone}\n`;
		orderDetails += `🏠 *Address*: ${customerAddress}\n`;
		orderDetails += `💰 *Payment*: ${paymentMethod}${cardDetails}\n`;
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
		const total = elements.totalAmount.textContent;
		orderDetails += `\n💵 *TOTAL*: ${total} so'm`;
		const BOT_TOKEN = "YOUR_BOT_TOKEN";
		const CHAT_ID = "YOUR_CHAT_ID";
		console.log("Order to be sent to Telegram:", orderDetails);
		showToast(MESSAGES.ORDER_SUCCESS, "success");
		return true;
	} catch (error) {
		console.error("Error sending order:", error);
		showToast(MESSAGES.ORDER_FAIL, "error");
		return false;
	}
}
function checkForSelectedItems() {
	const hasFastFood = Array.from(document.querySelectorAll(".fastFood")).some((item) => {
		const foodSelect = item.querySelector(".food-select");
		return foodSelect?.selectedIndex > 0;
	});
	const hasDrinks = Array.from(document.querySelectorAll(".drinks")).some((item) => {
		const drinkSelect = item.querySelector(".drinks-select");
		return drinkSelect?.selectedIndex > 0;
	});
	const hasRoasted = Array.from(document.querySelectorAll(".roasted")).some((item) => {
		const roastedSelect = item.querySelector(".roasted-select");
		return roastedSelect?.selectedIndex > 0;
	});
	return hasFastFood || hasDrinks || hasRoasted;
}
function resetOrderForm() {
	try {
		const form = elements.orderForm;
		if (form) {
			form.reset();
		}
		document.querySelectorAll("select").forEach((select) => {
			select.selectedIndex = 0;
		});
		document.querySelectorAll('input[type="number"]').forEach((input) => {
			input.value = 1;
		});
		document.querySelectorAll(".remove-item").forEach((btn) => {
			btn.click();
		});
		if (elements.cashRadio) {
			elements.cashRadio.checked = true;
			handlePaymentMethodChange();
		}
		const cardNumber = document.getElementById("cardNumber");
		const cardHolder = document.getElementById("cardHolder");
		if (cardNumber) cardNumber.value = "";
		if (cardHolder) cardHolder.value = "";
		calculateTotal();
		showToast("Forma tozalandi", "success");
	} catch (error) {
		console.error("Error resetting form:", error);
	}
}
function initializeApp() {
	try {
		console.log("Initializing app...");
		initializeSelects();
		document.querySelectorAll(".food-select").forEach((select) => {
			select.addEventListener("change", handleFastFoodChange);
		});
		document.querySelectorAll(".drinks-select").forEach((select) => {
			select.addEventListener("change", handleDrinksChange);
		});
		document.querySelectorAll(".roasted-select").forEach((select) => {
			select.addEventListener("change", handleRoastedChange);
		});
		document.querySelectorAll('input[type="number"]').forEach((input) => {
			input.addEventListener("input", calculateTotal);
		});
		document.querySelectorAll(".price-select, .roasted-price, .drinks-price").forEach((select) => {
			select.addEventListener("change", calculateTotal);
		});
		elements.cashRadio?.addEventListener("change", handlePaymentMethodChange);
		elements.cardRadio?.addEventListener("change", handlePaymentMethodChange);
		document.querySelector(".fastFoodAddMore")?.addEventListener("click", () => addNewItem("fastFood"));
		document.querySelector(".drinksAddMore")?.addEventListener("click", () => addNewItem("drinks"));
		document.querySelector(".roastedAddMore")?.addEventListener("click", () => addNewItem("roasted"));
		elements.orderButton?.addEventListener("click", () => {
			if (sendOrderToTelegram()) {
				setTimeout(resetOrderForm, 2000);
			}
		});
		handlePaymentMethodChange();
		calculateTotal();
		showToast("75Burger ilovasiga xush kelibsiz!", "success");
		console.log("App initialized successfully");
	} catch (error) {
		console.error("Error initializing app:", error);
		showToast("Ilovani ishga tushirishda xatolik yuz berdi", "error");
	}
}
document.addEventListener("DOMContentLoaded", initializeApp);
