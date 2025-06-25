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
//Menu items
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
	Toastify({
		text: message,
		duration: 3000,
		close: true,
		gravity: "top",
		position: "right",
		backgroundColor: type === "success" ? "#4CAF50" : "#F44336",
	}).showToast();
}
// Payment Method Change Handler
function handlePaymentMethodChange() {
	if (!elements.cardDetails) return;
	elements.cardDetails.classList.toggle("show", elements.cardRadio.checked);
}
// Copy Card Number Function
function copyCardNumber() {
	const cardNumber = document.querySelector("#cardNumber").textContent;

	// Создаем временный input
	const tempInput = document.createElement("input");
	tempInput.value = cardNumber.replace(/\s/g, ""); // Убираем пробелы
	document.body.appendChild(tempInput);

	// Выбираем и копируем
	tempInput.select();
	document.execCommand("copy");

	// Удаляем временный input
	document.body.removeChild(tempInput);

	// Показываем уведомление
	showToast("Karta raqami nusxalandi!");
}
// Add More
function addMoreSection(selector, containerId) {
	const original = document.querySelector(selector);
	const clone = original.cloneNode(true);

	// Очищаем значения
	clone.querySelectorAll("select, input").forEach((el) => {
		if (el.tagName === "SELECT") el.selectedIndex = 0;
		if (el.type === "number") el.value = 1;
	});

	// Удаляем плюс иконку если есть
	const plusIcon = clone.querySelector(".fa-plus");
	if (plusIcon) {
		plusIcon.parentElement.remove();
	}

	// Добавляем кнопку удаления
	const deleteBtn = document.createElement("button");
	deleteBtn.type = "button";
	deleteBtn.className = "delete-btn";
	deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
	deleteBtn.onclick = () => {
		clone.remove();
		calculateTotal();
	};
	clone.appendChild(deleteBtn);

	// Находим правильный контейнер для каждого типа
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

	// Добавляем в контейнер
	container.appendChild(clone);

	// Добавляем слушатели
	clone.querySelectorAll("select, input[type='number']").forEach((el) => {
		el.addEventListener("change", calculateTotal);
	});

	// Добавляем специфические обработчики
	if (selector.includes("fastFood")) {
		clone.querySelector(".food-select")?.addEventListener("change", handleFastFoodChange);
	} else if (selector.includes("roasted")) {
		clone.querySelector(".roasted-select")?.addEventListener("change", handleRoastedChange);
	} else if (selector.includes("drinks")) {
		clone.querySelector(".drinks-select")?.addEventListener("change", handleDrinksChange);
	}
}
// Copy Card Number Event Listener
// Adding event listeners for card number copy
document.querySelector("#cardNumber").addEventListener("click", copyCardNumber);
document.querySelector(".fa-copy").addEventListener("click", copyCardNumber);
// Total Amount Calculation
function calculateTotal() {
	let total = 0;
	document.querySelectorAll(".fastFood").forEach((item) => {
		const price = parseInt(item.querySelector(".price-select")?.value || 0);
		const qty = parseInt(item.querySelector('input[type="number"]')?.value || 0);
		if (!isNaN(price) && !isNaN(qty)) total += price * qty;
	});
	document.querySelectorAll(".roasted").forEach((item) => {
		const price = parseInt(item.querySelector(".roasted-price")?.value || 0);
		const qty = parseInt(item.querySelector('input[type="number"]')?.value || 0);
		if (!isNaN(price) && !isNaN(qty)) total += price * qty;
	});
	document.querySelectorAll(".drinks").forEach((item) => {
		const price = parseInt(item.querySelector(".drinks-price")?.value || 0);
		const qty = parseInt(item.querySelector('input[type="number"]')?.value || 0);
		if (!isNaN(price) && !isNaN(qty)) total += price * qty;
	});
	elements.totalAmount.textContent = total.toLocaleString();
	return total;
}
// Filling Select Options from Menu Data
function fillFastFoodOptions() {
	const select = document.querySelector(".food-select");
	clearSelect(select, "Fast food tanlang");
	menuData.fastFood.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}
// Filling Roasted Options
function fillRoastedOptions() {
	const select = document.querySelector(".roasted-select");
	clearSelect(select, "Qovurilgan tanlang");
	menuData.roasted.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}
// Filling Drinks Options
function fillDrinksOptions() {
	const select = document.querySelector(".drinks-select");
	clearSelect(select, "Ichimlik tanlang");
	menuData.drinks.forEach((item) => {
		addOption(select, item.id, item.name);
	});
}
// Fast Food
function handleFastFoodChange(e) {
	const item = menuData.fastFood.find((i) => i.id === e.target.value);
	const priceSelect = e.target.closest(".fastFood").querySelector(".price-select");
	clearSelect(priceSelect, "Narx tanlang");
	if (item) {
		item.prices.forEach((price, idx) => {
			const size = ["Kichik", "O'rta", "Katta"][idx];
			addOption(priceSelect, price, `${size} - ${price.toLocaleString()} so'm`);
		});
	}
	calculateTotal();
}
// Roasted
function handleRoastedChange(e) {
	const item = menuData.roasted.find((i) => i.id === e.target.value);
	const priceSelect = e.target.closest(".roasted").querySelector(".roasted-price");
	clearSelect(priceSelect, "Narx tanlang");
	if (item) {
		addOption(priceSelect, item.price, `${item.price.toLocaleString()} so'm`);
	}
	calculateTotal();
}
// Drinks
function handleDrinksChange(e) {
	const item = menuData.drinks.find((i) => i.id === e.target.value);
	const sizeSelect = e.target.closest(".drinks").querySelector(".size-select");
	const priceSelect = e.target.closest(".drinks").querySelector(".drinks-price");
	clearSelect(sizeSelect, "Hajm tanlang");
	clearSelect(priceSelect, "Narx tanlang");

	if (Array.isArray(item?.prices)) {
		item.sizes.forEach((size, idx) => {
			addOption(sizeSelect, idx, `${size} - ${item.prices[idx].toLocaleString()} so'm`);
		});

		sizeSelect.onchange = function () {
			const price = item.prices[this.value];
			clearSelect(priceSelect, "Narx tanlang");
			addOption(priceSelect, price, `${price.toLocaleString()} so'm`);
			priceSelect.value = price;
			calculateTotal();
		};
	} else {
		addOption(sizeSelect, 0, `Standard`);
		addOption(priceSelect, item.prices, `${item.prices.toLocaleString()} so'm`);
		priceSelect.value = item.prices;
		calculateTotal();
	}
}
// Sending to Server
function sendOrder(e) {
	e.preventDefault();

	// Получаем данные формы
	const name = document.querySelector('input[name="name"]')?.value?.trim();
	const phone = document.querySelector('input[name="phone"]')?.value?.trim();
	const address = document.querySelector('input[name="address"]')?.value?.trim();

	// Проверяем данные
	if (!name || !phone || !address) {
		showToast("Iltimos, shaxsiy ma'lumotlarni to'ldiring", "error");
		return;
	}

	// Собираем заказанные товары
	const orderItems = [];
	let totalAmount = 0;

	// Проверяем каждую секцию
	document.querySelectorAll(".fastFood, .roasted, .drinks").forEach((item) => {
		const select = item.querySelector("select");
		const quantity = item.querySelector('input[type="number"]');
		const price = item.querySelector(".price-select, .roasted-price, .drinks-price");

		if (select?.selectedIndex > 0 && quantity?.value > 0 && price?.value) {
			const itemTotal = parseInt(price.value) * parseInt(quantity.value);
			totalAmount += itemTotal;
			orderItems.push({
				name: select.selectedOptions[0].text,
				quantity: quantity.value,
				price: price.value,
				total: itemTotal,
			});
		}
	});

	if (orderItems.length === 0) {
		showToast("Kamida bitta maxsulot tanlang", "error");
		return;
	}

	// Формируем сообщение для Telegram
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

💳 To'lov turi: ${elements.cardRadio.checked ? "Karta" : "Naqd"}
${elements.cardRadio.checked ? `\nKarta raqami: ${document.querySelector("#cardNumber").textContent}` : ""}

📅 Vaqt: ${new Date().toLocaleString("uz-UZ")}
`;

	// Отправляем в Telegram
	const BOT_TOKEN = "7990511752:AAF__F5OZigqQCG9LNuUA9Kv_yjH7zTgIko";
	const CHAT_ID = "7496952374";
	const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

	fetch(TELEGRAM_API, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			chat_id: CHAT_ID,
			text: message,
			parse_mode: "HTML",
		}),
	})
		.then((response) => response.json())
		.then((data) => {
			if (data.ok) {
				showToast("Buyurtmangiz qabul qilindi!");
				// Сбрасываем форму
				elements.form.reset();
				elements.totalAmount.textContent = "0";
				handlePaymentMethodChange();

				// Сбрасываем селекты
				document.querySelectorAll("select").forEach((select) => {
					select.selectedIndex = 0;
					if (select.classList.contains("price-select")) {
						select.disabled = true;
					}
				});

				// Сбрасываем количества
				document.querySelectorAll('input[type="number"]').forEach((input) => {
					input.value = 1;
				});
			} else {
				throw new Error("Telegram API error");
			}
		})
		.catch((error) => {
			console.error("Error:", error);
			showToast("Buyurtmani yuborishda xatolik yuz berdi", "error");
		});
}

// Adding Event Listeners
function addEventListeners() {
	// Fast food
	elements.fastFoodSelect?.addEventListener("change", (e) => {
		handleFastFoodChange(e);
		calculateTotal();
	});

	// Roasted
	elements.roastedSelect?.addEventListener("change", (e) => {
		handleRoastedChange(e);
		calculateTotal();
	});

	// Drinks
	elements.drinksSelect?.addEventListener("change", (e) => {
		handleDrinksChange(e);
		calculateTotal();
	});

	// All select changes
	document.querySelectorAll(".price-select, .roasted-price, .drinks-price").forEach((select) => {
		select.addEventListener("change", calculateTotal);
	});

	// All quantity inputs
	document.querySelectorAll('input[type="number"]').forEach((input) => {
		input.addEventListener("input", calculateTotal);
	});
	// Fast Food ➕ button
	document.querySelector(".fastFoodAddMore i")?.addEventListener("click", () => {
		addMoreSection(".fastFood", "fastFoodContainer");
	});

	// Roasted ➕ button
	document.querySelector(".roastedAddMore i")?.addEventListener("click", () => {
		addMoreSection(".roasted", "roastedContainer");
	});

	// Drinks ➕ button
	document.querySelector(".drinksAddMore i")?.addEventListener("click", () => {
		addMoreSection(".drinks", "drinksContainer");
	});

	// Payment methods
	elements.cashRadio?.addEventListener("change", handlePaymentMethodChange);
	elements.cardRadio?.addEventListener("change", handlePaymentMethodChange);

	// Order button
	elements.orderButton?.addEventListener("click", sendOrder);
}
// Initial Setup
function init() {
	try {
		fillFastFoodOptions();
		fillRoastedOptions();
		fillDrinksOptions();

		handlePaymentMethodChange();

		addEventListeners();

		calculateTotal();
	} catch (error) {
		console.error("Initialization error:", error);
		showToast("Ilovani ishga tushirishda xatolik", "error");
	}
}

// Start app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
