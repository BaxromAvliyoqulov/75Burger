// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
	// Elements
	const form = document.querySelector("form");
	const totalAmountDisplay = document.getElementById("totalAmount");
	const addMoreBtn = document.getElementById("addMoreBtn");
	const orderBtn = document.getElementById("orderBtn");
	const fastFoodContainer = document.getElementById("fastFoodContainer");

	// Initialize total amount
	let totalAmount = 0;

	// Update total when any selection or quantity changes
	form.addEventListener("change", calculateTotal);

	// Add more food items
	addMoreBtn.addEventListener("click", function () {
		const newFastFood = document.querySelector(".fastFood").cloneNode(true);

		// Reset selections in the cloned element
		const selects = newFastFood.querySelectorAll("select");
		selects.forEach((select) => {
			select.selectedIndex = 0;
		});

		// Reset quantity to 1
		newFastFood.querySelector('input[type="number"]').value = 1;

		// Add a remove button to the new food item
		const removeBtn = document.createElement("button");
		removeBtn.textContent = "❌";
		removeBtn.className = "remove-item";
		removeBtn.type = "button";
		removeBtn.style.marginLeft = "10px";
		removeBtn.addEventListener("click", function () {
			newFastFood.remove();
			calculateTotal();
		});

		newFastFood.appendChild(removeBtn);
		fastFoodContainer.appendChild(newFastFood);
	});

	// Calculate total amount
	function calculateTotal() {
		totalAmount = 0;

		// Calculate food items total
		const foodItems = document.querySelectorAll(".fastFood");
		foodItems.forEach((item) => {
			const priceSelect = item.querySelector(".price-select");
			const quantity = item.querySelector('input[type="number"]').value;

			if (priceSelect.selectedIndex > 0) {
				const price = parseInt(priceSelect.value);
				totalAmount += price * quantity;
			}
		});

		// Calculate drinks total
		const drinksPrice = document.querySelector(".drinks-price");
		const drinksQuantity = document.querySelector(".drinks .quantity input").value;

		if (drinksPrice.selectedIndex > 0) {
			const price = parseInt(drinksPrice.value);
			totalAmount += price * drinksQuantity;
		}

		// Calculate roasted items total
		const roastedPrice = document.querySelector(".roasted-price");
		const roastedQuantity = document.querySelector(".roasted .quantity input").value;

		if (roastedPrice.selectedIndex > 0) {
			const price = parseInt(roastedPrice.value);
			totalAmount += price * roastedQuantity;
		}

		// Format and display total
		totalAmountDisplay.textContent = formatNumber(totalAmount);
	}

	// Format number with commas
	function formatNumber(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	}

	// Link food and price selections
	linkFoodAndPriceSelections();

	function linkFoodAndPriceSelections() {
		const foodPriceMap = {
			hotdog: "15000",
			nondog: "22000",
			pitta: "25000",
			lavash: "28000",
			burger: "35000",
		};

		document.addEventListener("change", function (e) {
			if (e.target.classList.contains("food-select")) {
				const priceSelect = e.target.parentElement.querySelector(".price-select");
				const selectedFood = e.target.value;

				if (selectedFood in foodPriceMap) {
					// Find the option with matching value
					for (let i = 0; i < priceSelect.options.length; i++) {
						if (priceSelect.options[i].value === foodPriceMap[selectedFood]) {
							priceSelect.selectedIndex = i;
							break;
						}
					}
					calculateTotal();
				}
			}
		});
	}

	// Link drink and size selections with prices
	linkDrinkAndSizeSelections();

	function linkDrinkAndSizeSelections() {
		const drinkSizePriceMap = {
			cola: {
				0.5: "5000",
				"1.0": "8000",
				1.5: "12000",
				"2.0": "15000",
				2.5: "18000",
			},
			pepsi: {
				0.5: "5000",
				"1.0": "8000",
				1.5: "12000",
				"2.0": "15000",
				2.5: "18000",
			},
			fanta: {
				0.5: "5000",
				"1.0": "8000",
				1.5: "12000",
				"2.0": "15000",
				2.5: "18000",
			},
			sprite: {
				0.5: "5000",
				"1.0": "8000",
				1.5: "12000",
				"2.0": "15000",
				2.5: "18000",
			},
			redbull: {
				0.5: "12000",
				"1.0": "15000",
				1.5: "18000",
			},
			water: {
				0.5: "5000",
				"1.0": "8000",
				1.5: "12000",
			},
			ayran: {
				0.5: "8000",
				"1.0": "12000",
			},
		};

		const drinkSelect = document.querySelector(".drinks-select");
		const sizeSelect = document.querySelector(".size-select");
		const priceSelect = document.querySelector(".drinks-price");

		drinkSelect.addEventListener("change", updateSizeOptions);
		sizeSelect.addEventListener("change", updatePriceBasedOnSize);

		function updateSizeOptions() {
			const selectedDrink = drinkSelect.value;

			// Reset size select
			sizeSelect.selectedIndex = 0;

			// Hide all size options first
			for (let i = 1; i < sizeSelect.options.length; i++) {
				sizeSelect.options[i].style.display = "none";
			}

			// Show only available sizes for the selected drink
			if (selectedDrink in drinkSizePriceMap) {
				const availableSizes = Object.keys(drinkSizePriceMap[selectedDrink]);

				for (let i = 1; i < sizeSelect.options.length; i++) {
					if (availableSizes.includes(sizeSelect.options[i].value)) {
						sizeSelect.options[i].style.display = "";
					}
				}
			}
		}

		function updatePriceBasedOnSize() {
			const selectedDrink = drinkSelect.value;
			const selectedSize = sizeSelect.value;

			if (selectedDrink in drinkSizePriceMap && selectedSize in drinkSizePriceMap[selectedDrink]) {
				const price = drinkSizePriceMap[selectedDrink][selectedSize];

				// Find and select the matching price option
				for (let i = 0; i < priceSelect.options.length; i++) {
					if (priceSelect.options[i].value === price) {
						priceSelect.selectedIndex = i;
						break;
					}
				}
				calculateTotal();
			}
		}
	}

	// Link roasted item selections with prices
	linkRoastedSelections();

	function linkRoastedSelections() {
		const roastedPriceMap = {
			kfs: "45000",
			fish: "55000",
			wings: "40000",
			fries: "15000",
		};

		const roastedSelect = document.querySelector(".roasted-select");
		const roastedPriceSelect = document.querySelector(".roasted-price");

		roastedSelect.addEventListener("change", function () {
			const selectedRoasted = roastedSelect.value;

			if (selectedRoasted in roastedPriceMap) {
				const price = roastedPriceMap[selectedRoasted];

				// Find and select the matching price option
				for (let i = 0; i < roastedPriceSelect.options.length; i++) {
					if (roastedPriceSelect.options[i].value === price) {
						roastedPriceSelect.selectedIndex = i;
						break;
					}
				}
				calculateTotal();
			}
		});
	}

	// Order button functionality
	orderBtn.addEventListener("click", function () {
		// Validate required fields
		const name = form.querySelector('input[type="text"]').value.trim();
		const phone = form.querySelector('input[type="tel"]').value.trim();
		const address = form.querySelectorAll('input[type="text"]')[1].value.trim();

		if (!name || !phone || !address) {
			showNotification("Iltimos, barcha majburiy maydonlarni to'ldiring", "error");
			return;
		}

		// Validate phone number format
		const phoneRegex = /^\+998[0-9]{9}$/;
		if (!phoneRegex.test(phone)) {
			showNotification("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak", "error");
			return;
		}

		// Check if at least one food item is selected
		let hasOrder = false;

		// Check fast food items
		document.querySelectorAll(".fastFood").forEach((item) => {
			if (item.querySelector(".food-select").selectedIndex > 0) {
				hasOrder = true;
			}
		});

		// Check drinks
		if (document.querySelector(".drinks-select").selectedIndex > 0) {
			hasOrder = true;
		}

		// Check roasted items
		if (document.querySelector(".roasted-select").selectedIndex > 0) {
			hasOrder = true;
		}

		if (!hasOrder) {
			showNotification("Iltimos, kamida bitta taom tanlang", "error");
			return;
		}

		// If everything is valid, show order summary
		showOrderSummary();
	});

	// Show notifications using Toastify
	function showNotification(message, type) {
		Toastify({
			text: message,
			duration: 3000,
			gravity: "top",
			position: "center",
			backgroundColor: type === "error" ? "#ff6b6b" : "#51cf66",
			stopOnFocus: true,
		}).showToast();
	}

	// Send order summary to Telegram
	async function sendToTelegram(orderSummary) {
		const botToken = "YOUR_BOT_TOKEN";
		const chatId = "YOUR_CHAT_ID";

		try {
			showLoadingState();

			if (!orderSummary) {
				throw new Error("Buyurtma ma'lumotlari topilmadi");
			}

			const text = encodeURIComponent(orderSummary);
			const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}&parse_mode=HTML`;

			const response = await fetch(url);
			const data = await response.json();

			if (!data.ok) {
				throw new Error(data.description || "Telegram API xatosi");
			}

			showNotification("✅ Buyurtma muvaffaqiyatli yuborildi!", "success");
			return data;
		} catch (error) {
			console.error("Telegram xatosi:", error);
			showNotification(`❌ Xatolik: ${error.message}`, "error");
			throw error;
		} finally {
			hideLoadingState();
		}
	}

	// Show order summary
	function showOrderSummary() {
		const name = form.querySelector('input[type="text"]').value.trim();
		const phone = form.querySelector('input[type="tel"]').value.trim();
		const address = form.querySelectorAll('input[type="text"]')[1].value.trim();

		// Create summary message
		let summary = `📋 <b>${name}</b>, sizning buyurtmangiz:\n\n`;

		// Food items
		document.querySelectorAll(".fastFood").forEach((item, index) => {
			const foodSelect = item.querySelector(".food-select");
			const priceSelect = item.querySelector(".price-select");
			const quantity = item.querySelector('input[type="number"]').value;

			if (foodSelect.selectedIndex > 0) {
				const foodName = foodSelect.options[foodSelect.selectedIndex].text;
				const price = parseInt(priceSelect.value);
				summary += `🍔 <b>${index + 1}. ${foodName}</b> - ${quantity} dona, ${formatNumber(
					price * quantity
				)} so'm\n`;
			}
		});

		// Drinks
		const drinkSelect = document.querySelector(".drinks-select");
		const sizeSelect = document.querySelector(".size-select");
		const drinkPriceSelect = document.querySelector(".drinks-price");
		const drinkQuantity = document.querySelector(".drinks .quantity input").value;

		if (drinkSelect.selectedIndex > 0) {
			const drinkName = drinkSelect.options[drinkSelect.selectedIndex].text;
			const size = sizeSelect.options[sizeSelect.selectedIndex].text;
			const price = parseInt(drinkPriceSelect.value);
			summary += `\n🥤 <b>Ichimlik:</b> ${drinkName} (${size}) - ${drinkQuantity} dona, ${formatNumber(
				price * drinkQuantity
			)} so'm\n`;
		}

		// Roasted items
		const roastedSelect = document.querySelector(".roasted-select");
		const roastedPriceSelect = document.querySelector(".roasted-price");
		const roastedQuantity = document.querySelector(".roasted .quantity input").value;

		if (roastedSelect.selectedIndex > 0) {
			const roastedName = roastedSelect.options[roastedSelect.selectedIndex].text;
			const price = parseInt(roastedPriceSelect.value);
			summary += `🍗 <b>Qovurilgan:</b> ${roastedName} - ${roastedQuantity} kg, ${formatNumber(
				price * roastedQuantity
			)} so'm\n`;
		}

		// Total amount
		summary += `\n💰 <b>Umumiy summa:</b> ${formatNumber(totalAmount)} so'm`;

		// Contact info
		summary += `\n\n📍 <b>Yetkazib berish manzili:</b> ${address}`;
		summary += `\n📞 <b>Telefon:</b> ${phone}`;

		// Send summary to Telegram
		sendToTelegram(summary)
			.then(() => {
				// Show success notification
				showNotification("✅ Buyurtmangiz muvaffaqiyatli qabul qilindi! 🎉", "success");
				// Reset form
				resetForm();
			})
			.catch((error) => {
				console.error("Order processing error:", error);
				showNotification("❌ Buyurtma yuborishda xatolik yuz berdi ❌", "error");
			});
	}

	// Reset form after successful order
	function resetForm() {
		try {
			const nameInput = form.querySelector('input[type="text"]');
			const phoneInput = form.querySelector('input[type="tel"]');
			const addressInput = form.querySelectorAll('input[type="text"]')[1];

			if (nameInput) nameInput.value = "";
			if (phoneInput) phoneInput.value = "";
			if (addressInput) addressInput.value = "";

			// Keep only first food item and reset it
			const foodItems = document.querySelectorAll(".fastFood");

			// Remove additional food items
			for (let i = 1; i < foodItems.length; i++) {
				foodItems[i].remove();
			}

			// Reset first food item
			const firstFoodItem = document.querySelector(".fastFood");
			firstFoodItem.querySelector(".food-select").selectedIndex = 0;
			firstFoodItem.querySelector(".price-select").selectedIndex = 0;
			firstFoodItem.querySelector('input[type="number"]').value = 1;

			// Reset drinks
			document.querySelector(".drinks-select").selectedIndex = 0;
			document.querySelector(".size-select").selectedIndex = 0;
			document.querySelector(".drinks-price").selectedIndex = 0;
			document.querySelector(".drinks .quantity input").value = 1;

			// Reset roasted items
			document.querySelector(".roasted-select").selectedIndex = 0;
			document.querySelector(".roasted-price").selectedIndex = 0;
			document.querySelector(".roasted .quantity input").value = 1;

			// Reset total
			totalAmount = 0;
			totalAmountDisplay.textContent = "0";
		} catch (error) {
			console.error("Reset form error:", error);
			showNotification("Formani tiklashda xatolik", "error");
		}
	}

	function showLoadingState() {
		orderBtn.disabled = true;
		orderBtn.textContent = "Yuborilmoqda...";
	}

	function hideLoadingState() {
		orderBtn.disabled = false;
		orderBtn.textContent = "Buyurtma berish";
	}
});

window.addEventListener("load", function () {
	calculateTotal(); // Пересчитать сумму при загрузке
	hideLoadingState(); // Сбросить состояние кнопки
});
