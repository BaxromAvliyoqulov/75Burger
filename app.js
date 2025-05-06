// Entry point for the 75Burger application

// DOM Elements
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

function getDefaultText(category) {
	const texts = {
		fastFood: "Ovqat tanlang",
		drinks: "Ichimlik tanlang",
		roasted: "Qovurilgan taom tanlang",
	};
	return texts[category] || "Tanlang";
}

// Menu Initialization
function initializeSelects() {
	// Fast Food
	if (elements.fastFood) {
		clearSelect(elements.fastFood, "Ovqat tanlang");
		menuData.fastFood.forEach((item) => {
			addOption(elements.fastFood, item.id, item.name);
		});
	}

	// Drinks
	if (elements.drinks) {
		clearSelect(elements.drinks, "Ichimlik tanlang");
		menuData.drinks.forEach((item) => {
			addOption(elements.drinks, item.id, item.name);
		});
	}

	// Roasted
	if (elements.roasted) {
		clearSelect(elements.roasted, "Qovurilgan taom tanlang");
		menuData.roasted.forEach((item) => {
			addOption(elements.roasted, item.id, item.name);
		});
	}
}

// Event Handlers
function handleFastFoodChange(e) {
	const itemId = e.target.value;
	const item = menuData.fastFood.find((i) => i.id === itemId);
	if (!item) return;

	const priceSelect = e.target.closest(".fastFood").querySelector(".price-select");
	if (!priceSelect) return;

	clearSelect(priceSelect, "Narxni tanlang");
	item.prices.forEach((price) => {
		addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
	});

	calculateTotal();
}

function handleDrinksChange(e) {
	const itemId = e.target.value;
	const item = menuData.drinks.find((i) => i.id === itemId);
	if (!item) return;

	const container = e.target.closest(".drinks");
	const sizeSelect = container.querySelector(".size-select");
	const priceSelect = container.querySelector(".drinks-price");

	if (!sizeSelect || !priceSelect) return;

	clearSelect(sizeSelect, "Hajmini tanlang");
	clearSelect(priceSelect, "Narxni tanlang");

	if (item.sizes) {
		item.sizes.forEach((size, index) => {
			addOption(sizeSelect, index, size);
		});

		sizeSelect.onchange = (event) => {
			const sizeIndex = parseInt(event.target.value);
			const price = item.prices[sizeIndex];

			clearSelect(priceSelect, "Narxni tanlang");
			addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
			calculateTotal();
		};
	} else {
		const price = typeof item.prices === "number" ? item.prices : item.prices[0];
		addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
		calculateTotal();
	}
}

function handleRoastedChange(e) {
	const itemId = e.target.value;
	const item = menuData.roasted.find((i) => i.id === itemId);
	if (!item) return;

	const container = e.target.closest(".roasted");
	const priceSelect = container.querySelector(".roasted-price");
	if (!priceSelect) return;

	clearSelect(priceSelect, "Narxni tanlang");
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
					<input type="text" 
						   pattern="[0-9]{16}" 
						   maxlength="16" 
						   placeholder="0000 0000 0000 0000" 
						   required />
				</div>
				<div class="card-input">
					<label>
						<i class="fa-solid fa-user"></i>
						Karta egasi:
					</label>
					<input type="text" 
						   placeholder="IVAN IVANOV" 
						   pattern="[A-Za-z\s]+" 
						   required />
				</div>
			</div>
		`;
	} else {
		elements.cardDetails.innerHTML = "";
	}
}

// Total Calculation
function calculateTotal() {
	try {
		let total = 0;

		// Calculate Fast Food total
		document.querySelectorAll(".fastFood").forEach((foodItem) => {
			const priceSelect = foodItem.querySelector(".price-select");
			const quantityInput = foodItem.querySelector('input[type="number"]');

			if (priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
		});

		// Calculate Drinks total
		document.querySelectorAll(".drinks").forEach((drinkItem) => {
			const priceSelect = drinkItem.querySelector(".drinks-price");
			const quantityInput = drinkItem.querySelector('input[type="number"]');

			if (priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
		});

		// Calculate Roasted total
		document.querySelectorAll(".roasted").forEach((roastedItem) => {
			const priceSelect = roastedItem.querySelector(".roasted-price");
			const quantityInput = roastedItem.querySelector('input[type="number"]');

			if (priceSelect?.value && quantityInput?.value) {
				const price = parseInt(priceSelect.value);
				const quantity = parseInt(quantityInput.value);

				if (!isNaN(price) && !isNaN(quantity)) {
					total += price * quantity;
				}
			}
		});

		// Update total display
		if (elements.totalAmount) {
			elements.totalAmount.textContent = `${total.toLocaleString()} so'm`;
		}

		return total;
	} catch (error) {
		console.error("Error calculating total:", error);
		return 0;
	}
}

// Add New Food Item
function addNewFoodItem() {
	const template = document.querySelector(".fastFood");
	if (!template) return;

	const newFastFood = template.cloneNode(true);

	// Reset values
	const foodSelect = newFastFood.querySelector(".food-select");
	const priceSelect = newFastFood.querySelector(".price-select");
	const quantityInput = newFastFood.querySelector('input[type="number"]');

	if (foodSelect) foodSelect.selectedIndex = 0;
	if (priceSelect) clearSelect(priceSelect, "Narxni tanlang");
	if (quantityInput) quantityInput.value = 1;

	// Add remove button
	const removeBtn = document.createElement("button");
	removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	removeBtn.className = "remove-item";
	removeBtn.onclick = function () {
		newFastFood.remove();
		calculateTotal();
	};

	newFastFood.appendChild(removeBtn);

	// Add event listeners
	foodSelect?.addEventListener("change", handleFastFoodChange);
	priceSelect?.addEventListener("change", calculateTotal);
	quantityInput?.addEventListener("input", calculateTotal);

	elements.fastFoodContainer.appendChild(newFastFood);
	calculateTotal();
}

// Add New Items Functions
function addNewRoastedItem() {
	const template = document.querySelector(".roasted");
	if (!template) return;

	const newRoasted = template.cloneNode(true);

	// Reset values
	const roastedSelect = newRoasted.querySelector(".roasted-select");
	const priceSelect = newRoasted.querySelector(".roasted-price");
	const quantityInput = newRoasted.querySelector('input[type="number"]');

	if (roastedSelect) roastedSelect.selectedIndex = 0;
	if (priceSelect) clearSelect(priceSelect, "Narxni tanlang");
	if (quantityInput) quantityInput.value = 1;

	// Add remove button
	const removeBtn = document.createElement("button");
	removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	removeBtn.className = "remove-item";
	removeBtn.onclick = function () {
		newRoasted.remove();
		calculateTotal();
	};

	newRoasted.appendChild(removeBtn);

	// Add event listeners
	roastedSelect?.addEventListener("change", handleRoastedChange);
	priceSelect?.addEventListener("change", calculateTotal);
	quantityInput?.addEventListener("input", calculateTotal);

	// Add to container
	const container = document.querySelector(".roasted").parentElement;
	container.insertBefore(newRoasted, document.querySelector(".roastedAddMore"));
	calculateTotal();
}

function addNewDrinksItem() {
	const template = document.querySelector(".drinks");
	if (!template) return;

	const newDrinks = template.cloneNode(true);

	// Reset values
	const drinksSelect = newDrinks.querySelector(".drinks-select");
	const sizeSelect = newDrinks.querySelector(".size-select");
	const priceSelect = newDrinks.querySelector(".drinks-price");
	const quantityInput = newDrinks.querySelector('input[type="number"]');

	if (drinksSelect) drinksSelect.selectedIndex = 0;
	if (sizeSelect) clearSelect(sizeSelect, "Hajmini tanlang");
	if (priceSelect) clearSelect(priceSelect, "Narxni tanlang");
	if (quantityInput) quantityInput.value = 1;

	// Add remove button
	const removeBtn = document.createElement("button");
	removeBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
	removeBtn.className = "remove-item";
	removeBtn.onclick = function () {
		newDrinks.remove();
		calculateTotal();
	};

	newDrinks.appendChild(removeBtn);

	// Add event listeners
	drinksSelect?.addEventListener("change", handleDrinksChange);
	sizeSelect?.addEventListener("change", calculateTotal);
	priceSelect?.addEventListener("change", calculateTotal);
	quantityInput?.addEventListener("input", calculateTotal);

	// Add to container
	const container = document.querySelector(".drinks").parentElement;
	container.insertBefore(newDrinks, document.querySelector(".drinksAddMore"));
	calculateTotal();
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

		// Add payment method listeners
		elements.cashRadio?.addEventListener("change", handlePaymentMethodChange);
		elements.cardRadio?.addEventListener("change", handlePaymentMethodChange);

		// Add new item button listeners for each section
		document.querySelectorAll(".roastedAddMore").forEach((btn) => {
			btn.addEventListener("click", addNewRoastedItem);
		});

		document.querySelectorAll(".fastFoodAddMore").forEach((btn) => {
			btn.addEventListener("click", addNewFoodItem);
		});

		document.querySelectorAll(".drinksAddMore").forEach((btn) => {
			btn.addEventListener("click", addNewDrinksItem);
		});

		// Initial payment method setup
		handlePaymentMethodChange();

		// Initial total calculation
		calculateTotal();

		console.log("App initialized successfully");
	} catch (error) {
		console.error("Error initializing app:", error);
	}
}

// Start the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);
