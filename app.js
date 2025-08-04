// Dom elements
const elements = {
	form: document.querySelector("#orderForm"),
	fastFoodSelect: document.querySelector(".food-select"),
	roastedSelect: document.querySelector(".roasted-select"),
	drinksSelect: document.querySelector(".drinks-select"),
	priceSelects: document.querySelectorAll(".price-select, .roasted-price, .drinks-price"),
	quantityInputs: document.querySelectorAll('input[type="number"]'),
	totalAmount: document.querySelector("#totalAmount"),
	cashRadio: document.querySelector("#cash"),
	cardRadio: document.querySelector("#card"),
	cardDetails: document.querySelector("#cardNumberContainer"),
	orderButton: document.querySelector("#orderBtn"),
};

// Fixed Menu items
const menuData = {
	roasted: [
		{ id: "kfs", name: "KFS", price: 85000 },
		{ id: "fish", name: "BALIQ", price: 70000 },
		{ id: "wings", name: "TOVUQ QANOTLARI", price: 80000 },
		{ id: "fries", name: "KARTOSHKA FRIES", price: 15000 },
	],
	fastFood: [
		{ id: "hotdog", name: "XOT DOG", prices: [15000, 20000] },
		{ id: "bighotdog", name: "BIG XOT DOG", prices: [35000, 40000] },
		{ id: "nondog", name: "NON DOG", prices: [20000, 25000, 30000] },
		{ id: "pitta", name: "PITTA", prices: [30000, 35000, 40000] },
		{ id: "lavash", name: "LAVASH", prices: [30000, 35000, 40000] },
		{ id: "burger", name: "BURGER", prices: [30000] },
	],
	drinks: [
		{
			id: "cola",
			name: "COCA COLA",
			sizes: ["0.5L", "1.0L", "1.5L"],
			prices: [8000, 12000, 15000],
		},
		{
			id: "pepsi",
			name: "PEPSI",
			sizes: ["0.5L", "1.0L", "1.5L"],
			prices: [8000, 12000, 15000],
		},
		{
			id: "fanta",
			name: "FANTA",
			sizes: ["0.5L", "1.0L", "1.5L"],
			prices: [8000, 12000, 15000],
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

// Utility functions
function clearSelect(select, placeholder) {
	if (!select) return;
	select.innerHTML = `<option disabled selected>${placeholder}</option>`;
}

function addOption(select, value, label) {
	if (!select) return;
	const option = document.createElement("option");
	option.value = value;
	option.textContent = label;
	select.appendChild(option);
}

function showToast(message, type = "success") {
	if (typeof Toastify !== 'undefined') {
		Toastify({
			text: message,
			duration: 3000,
			close: true,
			gravity: "top",
			position: "right",
			backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
		}).showToast();
	} else {
		alert(message); // Fallback if Toastify is not available
	}
}

// Payment Method Change Handler
function handlePaymentMethodChange() {
	if (!elements.cardDetails) return;
	elements.cardDetails.classList.toggle("show", elements.cardRadio?.checked || false);
}

// Copy Card Number Function
function copyCardNumber() {
	const cardNumberElement = document.querySelector("#cardNumber");
	if (!cardNumberElement) return;
	
	const cardNumber = cardNumberElement.textContent;

	// Create temporary input
	const tempInput = document.createElement("input");
	tempInput.value = cardNumber.replace(/\s/g, ""); // Remove spaces
	document.body.appendChild(tempInput);

	// Select and copy
	tempInput.select();
	document.execCommand("copy");

	// Remove temporary input
	document.body.removeChild(tempInput);

	// Show notification
	showToast("Karta raqami nusxalandi!");
}

// Add More Section
function addMoreSection(selector, containerId) {
	const original = document.querySelector(selector);
	if (!original) return;
	
	const clone = original.cloneNode(true);

	// Clear values
	clone.querySelectorAll("select, input").forEach((el) => {
		if (el.tagName === "SELECT") el.selectedIndex = 0;
		if (el.type === "number") el.value = 1;
	});

	// Remove plus icon if exists
	const plusIcon = clone.querySelector(".fa-plus");
	if (plusIcon) {
		plusIcon.parentElement.remove();
	}

	// Add delete button
	const deleteBtn = document.createElement("button");
	deleteBtn.type = "button";
	deleteBtn.className = "delete-btn";
	deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
	deleteBtn.onclick = () => {
		clone.remove();
		calculateTotal();
	};
	clone.appendChild(deleteBtn);

	// Find correct container for each type
	let container;
	if (selector.includes("fastFood")) {
		container = document.getElementById("fastFoodContainer");
	} else if (selector.includes("roasted")) {
		container = document.getElementById("roastedContainer");
	} else if (selector.includes("drinks")) {
		container = document.getElementById("drinksContainer");
	}

	if (!container) {
		console.error(`Container not found for ${selector}`);
		return;
	}

	// Add to container
	container.appendChild(clone);

	// Add listeners
	clone.querySelectorAll("select, input[type='number']").forEach((el) => {
		el.addEventListener("change", calculateTotal);
	});

	// Add specific handlers
	if (selector.includes("fastFood")) {
		const foodSelect = clone.querySelector(".food-select");
		if (foodSelect) {
			foodSelect.addEventListener("change", handleFastFoodChange);
			// Reinitialize options
			fillFastFoodOptions(foodSelect);
		}
	} else if (selector.includes("roasted")) {
		const roastedSelect = clone.querySelector(".roasted-select");
		if (roastedSelect) {
			roastedSelect.addEventListener("change", handleRoastedChange);
			// Reinitialize options
			fillRoastedOptions(roastedSelect);
		}
	} else if (selector.includes("drinks")) {
		const drinksSelect = clone.querySelector(".drinks-select");
		if (drinksSelect) {
			drinksSelect.addEventListener("change", handleDrinksChange);
			// Reinitialize options
			fillDrinksOptions(drinksSelect);
		}
	}
}

// Total Amount Calculation
function calculateTotal() {
	let total = 0;
	
	// Calculate fastFood total
	document.querySelectorAll(".fastFood").forEach((item) => {
		const priceSelect = item.querySelector(".price-select");
		const quantityInput = item.querySelector('input[type="number"]');
		
		const price = parseInt(priceSelect?.value || 0);
		const qty = parseInt(quantityInput?.value || 0);
		
		if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
			total += price * qty;
		}
	});
	
	// Calculate roasted total
	document.querySelectorAll(".roasted").forEach((item) => {
		const priceSelect = item.querySelector(".roasted-price");
		const quantityInput = item.querySelector('input[type="number"]');
		
		const price = parseInt(priceSelect?.value || 0);
		const qty = parseInt(quantityInput?.value || 0);
		
		if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
			total += price * qty;
		}
	});
	
	// Calculate drinks total
	document.querySelectorAll(".drinks").forEach((item) => {
		const priceSelect = item.querySelector(".drinks-price");
		const quantityInput = item.querySelector('input[type="number"]');
		
		const price = parseInt(priceSelect?.value || 0);
		const qty = parseInt(quantityInput?.value || 0);
		
		if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
			total += price * qty;
		}
	});
	
	if (elements.totalAmount) {
		elements.totalAmount.textContent = total.toLocaleString();
	}
	
	return total;
}

// Filling Select Options from Menu Data
function fillFastFoodOptions(selectElement = null) {
	const select = selectElement || document.querySelector(".food-select");
	if (!select) return;
	
	clearSelect(select, "Fast food tanlang");
	menuData.fastFood.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}

// Filling Roasted Options
function fillRoastedOptions(selectElement = null) {
	const select = selectElement || document.querySelector(".roasted-select");
	if (!select) return;
	
	clearSelect(select, "Qovurilgan tanlang");
	menuData.roasted.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}

// Filling Drinks Options
function fillDrinksOptions(selectElement = null) {
	const select = selectElement || document.querySelector(".drinks-select");
	if (!select) return;
	
	clearSelect(select, "Ichimlik tanlang");
	menuData.drinks.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}

// Fast Food Change Handler
function handleFastFoodChange(e) {
	const selectedId = e.target.value;
	const item = menuData.fastFood.find((i) => i.id === selectedId);
	const priceSelect = e.target.closest(".fastFood").querySelector(".price-select");
	
	clearSelect(priceSelect, "Narx tanlang");

	if (item && item.prices) {
		const sizeLabels = ["Kichik", "O'rta", "Katta", "XL", "XXL"];
		item.prices.forEach((price, idx) => {
			const size = sizeLabels[idx] || `Variant ${idx + 1}`;
			addOption(priceSelect, price, `${size} - ${price.toLocaleString()} so'm`);
		});
	}
	calculateTotal();
}

// Roasted Change Handler
function handleRoastedChange(e) {
	const selectedId = e.target.value;
	const item = menuData.roasted.find((i) => i.id === selectedId);
	const priceSelect = e.target.closest(".roasted").querySelector(".roasted-price");
	
	clearSelect(priceSelect, "Narx tanlang");
	
	if (item && item.price) {
		addOption(priceSelect, item.price, `${item.price.toLocaleString()} so'm`);
		priceSelect.value = item.price;
	}
	calculateTotal();
}

// Drinks Change Handler
function handleDrinksChange(e) {
	const selectedId = e.target.value;
	const item = menuData.drinks.find((i) => i.id === selectedId);
	const sizeSelect = e.target.closest(".drinks").querySelector(".size-select");
	const priceSelect = e.target.closest(".drinks").querySelector(".drinks-price");
	
	if (sizeSelect) clearSelect(sizeSelect, "Hajm tanlang");
	clearSelect(priceSelect, "Narx tanlang");

	if (!item) return;

	if (Array.isArray(item.prices) && item.sizes) {
		// Multi-size drinks
		item.sizes.forEach((size, idx) => {
			if (sizeSelect) {
				addOption(sizeSelect, idx, `${size} - ${item.prices[idx].toLocaleString()} so'm`);
			}
		});

		if (sizeSelect) {
			sizeSelect.onchange = function () {
				const selectedIndex = parseInt(this.value);
				const price = item.prices[selectedIndex];
				clearSelect(priceSelect, "Narx tanlang");
				addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
				priceSelect.value = price;
				calculateTotal();
			};
		}
	} else {
		// Single price drinks
		const price = item.prices;
		if (sizeSelect) {
			addOption(sizeSelect, 0, `Standard`);
		}
		addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
		priceSelect.value = price;
		calculateTotal();
	}
}

// Sending to Server
async function sendOrder(e) {
	e.preventDefault();

	// Get form data
	const nameInput = document.querySelector('input[name="name"]');
	const phoneInput = document.querySelector('input[name="phone"]');
	const addressInput = document.querySelector('input[name="address"]');

	const name = nameInput?.value?.trim();
	const phone = phoneInput?.value?.trim();
	const address = addressInput?.value?.trim();

	// Validate data
	if (!name || !phone || !address) {
		showToast("Iltimos, shaxsiy ma'lumotlarni to'ldiring", "error");
		return;
	}

	// Collect ordered items
	const orderItems = [];
	let totalAmount = 0;

	// Check each section
	document.querySelectorAll(".fastFood, .roasted, .drinks").forEach((item) => {
		const select = item.querySelector("select");
		const quantity = item.querySelector('input[type="number"]');
		const priceSelect = item.querySelector(".price-select, .roasted-price, .drinks-price");

		if (select?.selectedIndex > 0 && quantity?.value > 0 && priceSelect?.value) {
			const itemTotal = parseInt(priceSelect.value) * parseInt(quantity.value);
			totalAmount += itemTotal;
			orderItems.push({
				name: select.selectedOptions[0].text,
				quantity: quantity.value,
				price: priceSelect.value,
				total: itemTotal,
			});
		}
	});

	if (orderItems.length === 0) {
		showToast("Kamida bitta maxsulot tanlang", "error");
		return;
	}

	// Form message for Telegram
	const cardNumberElement = document.querySelector("#cardNumber");
	const cardNumber = cardNumberElement ? cardNumberElement.textContent : "";
	
	const message = `
🛍 Yangi buyurtma!

👤 Mijoz ma'lumotlari:
    Ismi: ${name}
    Tel: ${phone}
    Manzil: ${address}

🍽 Buyurtma tarkibi:
${orderItems
	.map((item) => `- ${item.name} x ${item.quantity} = ${parseInt(item.total).toLocaleString()} so'm`)
	.join("\n")}

💰 Jami: ${totalAmount.toLocaleString()} so'm

💳 To'lov turi: ${elements.cardRadio?.checked ? "Karta" : "Naqd"}
${elements.cardRadio?.checked && cardNumber ? `\nKarta raqami: ${cardNumber}` : ""}

📅 Vaqt: ${new Date().toLocaleString("uz-UZ")}
`;

	// Send to Telegram
	const BOT_TOKEN = "7990511752:AAF__F5OZigqQCG9LNuUA9Kv_yjH7zTgIko";
	const CHAT_IDS = ["7496952374", "587788509"];
	const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

	try {
		// Send to each recipient separately
		for (const chatId of CHAT_IDS) {
			const response = await fetch(TELEGRAM_API, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					chat_id: chatId,
					text: message,
					parse_mode: "HTML",
				}),
			});

			const data = await response.json();

			if (!data.ok) {
				console.error(`Sending error for ID ${chatId}:`, data);
				throw new Error(`Telegram error for ${chatId}: ${data.description}`);
			}
		}

		// If we get here - all messages sent successfully
		showToast("Buyurtmangiz qabul qilindi!");

		// Reset form
		if (elements.form) {
			elements.form.reset();
		}
		if (elements.totalAmount) {
			elements.totalAmount.textContent = "0";
		}
		handlePaymentMethodChange();

		// Reset selects
		document.querySelectorAll("select").forEach((select) => {
			select.selectedIndex = 0;
		});

		// Reset quantities
		document.querySelectorAll('input[type="number"]').forEach((input) => {
			input.value = 1;
		});

	} catch (error) {
		console.error("Telegram error:", error);
		showToast("Buyurtmani yuborishda xatolik yuz berdi", "error");
	}
}

// Adding Event Listeners
function addEventListeners() {
	// Fast food
	if (elements.fastFoodSelect) {
		elements.fastFoodSelect.addEventListener("change", (e) => {
			handleFastFoodChange(e);
		});
	}

	// Roasted
	if (elements.roastedSelect) {
		elements.roastedSelect.addEventListener("change", (e) => {
			handleRoastedChange(e);
		});
	}

	// Drinks
	if (elements.drinksSelect) {
		elements.drinksSelect.addEventListener("change", (e) => {
			handleDrinksChange(e);
		});
	}

	// All price selects
	document.querySelectorAll(".price-select, .roasted-price, .drinks-price").forEach((select) => {
		select.addEventListener("change", calculateTotal);
	});

	// All quantity inputs
	document.querySelectorAll('input[type="number"]').forEach((input) => {
		input.addEventListener("input", calculateTotal);
	});

	// Add more buttons
	const fastFoodAddBtn = document.querySelector(".fastFoodAddMore i");
	if (fastFoodAddBtn) {
		fastFoodAddBtn.addEventListener("click", () => {
			addMoreSection(".fastFood", "fastFoodContainer");
		});
	}

	const roastedAddBtn = document.querySelector(".roastedAddMore i");
	if (roastedAddBtn) {
		roastedAddBtn.addEventListener("click", () => {
			addMoreSection(".roasted", "roastedContainer");
		});
	}

	const drinksAddBtn = document.querySelector(".drinksAddMore i");
	if (drinksAddBtn) {
		drinksAddBtn.addEventListener("click", () => {
			addMoreSection(".drinks", "drinksContainer");
		});
	}

	// Payment methods
	if (elements.cashRadio) {
		elements.cashRadio.addEventListener("change", handlePaymentMethodChange);
	}
	if (elements.cardRadio) {
		elements.cardRadio.addEventListener("change", handlePaymentMethodChange);
	}

	// Order button
	if (elements.orderButton) {
		elements.orderButton.addEventListener("click", sendOrder);
	}

	// Card number copy functionality
	const cardNumberElement = document.querySelector("#cardNumber");
	const copyIcon = document.querySelector(".fa-copy");
	
	if (cardNumberElement) {
		cardNumberElement.addEventListener("click", copyCardNumber);
	}
	if (copyIcon) {
		copyIcon.addEventListener("click", copyCardNumber);
	}
}

// Initial Setup
function init() {
	try {
		console.log("Initializing food ordering system...");
		
		// Fill options for all selects
		fillFastFoodOptions();
		fillRoastedOptions();
		fillDrinksOptions();

		// Setup payment method display
		handlePaymentMethodChange();

		// Add all event listeners
		addEventListeners();

		// Calculate initial total
		calculateTotal();
		
		console.log("Food ordering system initialized successfully!");
		
	} catch (error) {
		console.error("Initialization error:", error);
		showToast("Ilovani ishga tushirishda xatolik", "error");
	}
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
