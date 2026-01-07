
import React, { useState } from "react";
import ArrowDown from "../../assets/icons/arrowDown.png";

const categories = [
	{
		name: "Components",
		products: ["Graphics Card", "Memory", "Hard Disk", "Mother Board", "Power Supply"],
	},
	{
		name: "Peripherals",
		products: ["Mouse", "Keyboard", "Monitor"],
	},
	{
		name: "Accessories",
		products: ["Headphones", "Chargers"],
	},
	{
		name: "Laptops",
		products: ["Chromebook", "Gaming Laptop"],
	},
	{
		name: "Desktops",
		products: ["AMD Base", "Intel Base"],
	},
	{
		name: "Mobile Devices",
		products: ["Android", "iOS"],
	},
];


const SideNav = ({ selectedCategory, setSelectedCategory, selectedProduct, setSelectedProduct, onArchiveClick, isAdmin }) => {
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
	const handleProductClick = (catName, prod) => {
		setSelectedCategory(catName);
		setSelectedProduct(prod);
	};

	return (
		<div className="w-64 h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-100 border-r border-indigo-100 px-6 py-8 flex flex-col shadow-sm">
			<div className="flex-1">
				   <h2 className="text-indigo-400 font-bold text-lg mb-10 tracking-wide">Available Products</h2>
				<ul className="space-y-3">
					{categories.map((cat, idx) => (
						<React.Fragment key={cat.name}>
							<li
								className={`font-bold flex items-center gap-1 cursor-pointer ml-3 ${selectedCategory === cat.name ? 'text-blue-700' : ''}`}
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
										   className={`px-4 py-2 text-gray-700 hover:bg-indigo-50 cursor-pointer rounded-lg transition ${selectedCategory === cat.name && selectedProduct === prod ? 'bg-indigo-100 font-bold' : ''}`}
										onClick={() => handleProductClick(cat.name, prod)}
									>
										{prod}
									</li>
								))}
							</ul>
						</React.Fragment>
					))}
				</ul>
			</div>

			{/* Archive Section at Bottom Left - only for admin */}
			{isAdmin && (
				<div className="border-t pt-4 mt-4">
					<button 
						onClick={() => onArchiveClick && onArchiveClick()}
						className="w-full flex items-center gap-3 px-4 py-3 rounded hover:bg-gray-100 transition text-gray-700 font-semibold">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
								<path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5h-.625V4.5A2.25 2.25 0 0017.625 2.25h-11.25A2.25 2.25 0 004.125 4.5v3h-.625A2.625 2.625 0 001.5 10.125v7.125A2.625 2.625 0 004.125 20.25h15.75A2.625 2.625 0 0022.5 17.25V10.125A2.625 2.625 0 0020.25 7.5zM6.375 4.5h11.25v3h-11.25V4.5zM9.75 13.5a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0v-3.75zm4.5 0a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0v-3.75z" />
							</svg>
							Archive
						</button>
				</div>
			)}
		</div>
	);
};

export default SideNav;
