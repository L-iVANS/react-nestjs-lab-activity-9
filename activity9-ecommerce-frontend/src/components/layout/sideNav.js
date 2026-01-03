
import React, { useState } from "react";
import ArrowDown from "../../assets/icons/arrowDown.png";

const categories = [
	{
		name: "Components",
		products: ["Product 1", "Product 2", "Product 3", "Product 4", "Product 5"],
	},
	{
		name: "Peripherals",
		products: ["Product A", "Product B", "Product C"],
	},
	{
		name: "Accessories",
		products: ["Product X", "Product Y"],
	},
	{
		name: "Laptops",
		products: ["Laptop 1", "Laptop 2"],
	},
	{
		name: "Desktops",
		products: ["Desktop 1", "Desktop 2"],
	},
	{
		name: "Mobile Devices",
		products: ["Phone 1", "Phone 2"],
	},
];

const SideNav = () => {
	const [openIndex, setOpenIndex] = useState(null);
	let closeTimeout = null;
	const handleOpen = (idx) => {
		if (closeTimeout) clearTimeout(closeTimeout);
		setOpenIndex(idx);
	};
	const handleClose = () => {
		closeTimeout = setTimeout(() => {
			setOpenIndex(null);
		}, 400);
	};
	const handleProductMouseEnter = () => {
		if (closeTimeout) clearTimeout(closeTimeout);
	};
	const handleProductMouseLeave = () => {
		handleClose();
	};
	const handleCategoryClick = (idx) => {
		setOpenIndex(openIndex === idx ? null : idx);
	};

	return (
		<div className="w-64 h-screen bg-white border-r px-6 py-8">
			<h2 className="text-gray-400 font-bold text-lg mb-10">Available Products</h2>
			<ul className="space-y-3">
				{categories.map((cat, idx) => (
					<React.Fragment key={cat.name}>
						<li
							className="font-bold flex items-center gap-1 cursor-pointer ml-3"
							onClick={() => handleCategoryClick(idx)}
							onMouseEnter={() => handleOpen(idx)}
							onMouseLeave={handleClose}
						>
							{cat.name}
							<img
								src={ArrowDown}
								alt="Arrow Down"
								style={{ height: "0.8em", width: "0.8em", verticalAlign: "middle" }}
							/>
						</li>
						<ul
							className={`ml-8 overflow-hidden transition-all duration-600 ease-in-out ${openIndex === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
							style={{ maxHeight: openIndex === idx ? '400px' : '0', opacity: openIndex === idx ? 1 : 0 }}
							onMouseEnter={handleProductMouseEnter}
							onMouseLeave={handleProductMouseLeave}
						>
							{openIndex === idx && cat.products.map((prod) => (
								<li
									key={prod}
									className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
									onClick={() => alert(`Clicked on ${prod}`)}
								>
									{prod}
								</li>
							))}
						</ul>
					</React.Fragment>
				))}
			</ul>
		</div>
	);
};

export default SideNav;
