import { menuData } from "./menu.js";

export class MenuService {
	constructor() {
		this.menu = menuData;
	}

	getItems(category) {
		return this.menu[category] || [];
	}

	getPrices(category, itemId) {
		const item = this.getItems(category).find((i) => i.id === itemId);
		return item?.prices || [item?.price] || [];
	}

	getSizes(itemId) {
		const item = this.getItems("drinks").find((i) => i.id === itemId);
		return item?.sizes || [];
	}
}
