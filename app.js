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

	// Сбрасываем значения
	clone.querySelectorAll("select, input").forEach((el) => {
		if (el.tagName === "SELECT") el.selectedIndex = 0;
		if (el.type === "number") el.value = 1;
	});

	// Удаляем плюс иконку
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

	// Добавляем в контейнер
	const container = document.getElementById(containerId);
	container.appendChild(clone);

	// Добавляем слушатели
	clone.querySelectorAll("select, input[type='number']").forEach((el) => {
		el.addEventListener("change", calculateTotal);
	});
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
// Sending to Telegram Bot
function sendOrderToTelegram() {
	const form = elements.form;
	const isValid = [...form.querySelectorAll("[required]")].every((f) => f.value.trim() !== "");
	if (!isValid) {
		showToast("Barcha maydonlarni to‘ldiring", "error");
		return;
	}

	const name = form.querySelector('input[name="name"]').value;
	const phone = form.querySelector('input[name="phone"]').value;
	const address = form.querySelector('input[name="address"]').value;
	const paymentMethod = elements.cardRadio.checked ? "Karta" : "Naqd";

	// Mahsulotlar ro'yxati
	let orderDetails = "";

	document.querySelectorAll(".order-item").forEach((item, idx) => {
		const foodName = item.querySelector(".food-select").selectedOptions[0]?.textContent || "-";
		const price = item.querySelector(".price-select, .roasted-price, .drinks-price").value || 0;
		const quantity = item.querySelector('input[type="number"]').value || 0;
		if (quantity > 0) {
			orderDetails += `${idx + 1}. ${foodName} - ${quantity} ta - ${parseInt(price).toLocaleString()} so'm\n`;
		}
	});

	const message = `
	Yangi buyurtma:
	Ism: ${name}
	Telefon: ${phone}
	Manzil: ${address}
	To'lov: ${paymentMethod}
	Buyurtma:
	${orderDetails}
	Jami summa: ${elements.totalAmount.textContent} so'm
	`;

	const botToken = "TOKEN_HERE"; // o'zgartiring
	const chatId = "CHAT_ID_HERE"; // o'zgartiring
	const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

	fetch(url, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ chat_id: chatId, text: message }),
	})
		.then((res) => res.json())
		.then((data) => {
			if (data.ok) {
				showToast("Buyurtma muvaffaqiyatli yuborildi!");
				form.reset();
				elements.totalAmount.textContent = "0";
				handlePaymentMethodChange();
			} else {
				showToast("Yuborishda xatolik yuz berdi", "error");
			}
		})
		.catch(() => {
			showToast("Tarmoqda muammo bor", "error");
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
	document.querySelector(".fastFoodAddMore i").addEventListener("click", () => {
		addMoreSection(".fastFood", "fastFoodContainer");
	});

	// Roasted ➕ button
	document.querySelector(".roastedAddMore i").addEventListener("click", () => {
		addMoreSection(".roasted", "orderForm");
	});

	// Drinks ➕ button
	document.querySelector(".drinksAddMore i").addEventListener("click", () => {
		addMoreSection(".drinks", "orderForm");
	});

	// Payment methods
	elements.cashRadio?.addEventListener("change", handlePaymentMethodChange);
	elements.cardRadio?.addEventListener("change", handlePaymentMethodChange);

	// Order button
	elements.orderButton?.addEventListener("click", (e) => {
		e.preventDefault();
		sendOrderToTelegram();
	});
}
// Initial Setup
function init() {
	try {
		// Select opsiyalarni to‘ldirish
		fillFastFoodOptions();
		fillRoastedOptions();
		fillDrinksOptions();

		// To‘lov turini boshlang‘ich holatda sozlash
		handlePaymentMethodChange();

		// Event listener'lar
		addEventListeners();

		// Dastlabki umumiy summani hisoblash
		calculateTotal();
	} catch (error) {
		console.error("Initialization error:", error);
		showToast("Ilovani ishga tushirishda xatolik", "error");
	}
}

// Start app when DOM is ready
document.addEventListener("DOMContentLoaded", init);
