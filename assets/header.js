(function () {
	const header = () => {
		const body = document.querySelector("body");
		const header = document.querySelector(".shopify-section-header");
		const headerDetails = document.querySelector(".menu-drawer-container");
		const headerIsAlwaysSticky =
			header
				.querySelector(".header-wrapper")
				.getAttribute("data-sticky-type") === "always";

		headerDetails.addEventListener("toggle", function (e) {
			const colorScheme =
				this.querySelector("#menu-drawer").dataset.colorScheme;
			header.classList.toggle(colorScheme);
		});

		document.addEventListener("keyup", (e) => {
			if (e.key === "Escape") {
				header.classList.remove("shopify-section-header-sticky", "animate");
				body.classList.remove("overflow-hidden");
			}
		});

		document.addEventListener("scroll", () => {
			let scrollTop = window.scrollY;
			if (scrollTop > header.offsetHeight && headerIsAlwaysSticky) {
				header.classList.add("fixed", "animate");
			} else if (scrollTop <= header.offsetHeight && headerIsAlwaysSticky) {
				header.classList.remove("fixed", "animate");
			}
		});
		const headerAllDetails = document.querySelectorAll('.header details')
		headerAllDetails.forEach((details)=> {
		details.addEventListener('click',function (e) {
			if(window.matchMedia('(max-width: 1199px)').matches) return false;
			const disclosureList = document.querySelectorAll('.header .disclosure__list');
			disclosureList.forEach((list)=>{
					if (list.hasAttribute('hidden')) return;
					list.setAttribute('hidden','true');
					list.previousElementSibling.setAttribute('aria-expanded','false');
			})
		})
		})
	};
	document.addEventListener("shopify:section:load", header);
	header();
})();
