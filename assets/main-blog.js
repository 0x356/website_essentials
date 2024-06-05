(function () {
	const mainBlogSlider = () => {
		const imgSliderWrapper = document.querySelector(".blog-slider__img");
		const textSliderWrapper = document.querySelector(".blog-slider__text");

		const imgSlider = new Swiper(imgSliderWrapper, {
			slidesPerView: 1,
			//navigation: {
			//	nextEl: ".blog-slider__next",
			//	prevEl: ".blog-slider__prev",
			//},
		});
		const textSlider = new Swiper(textSliderWrapper, {
			slidesPerView: 1,
			effect: "fade",
			navigation: {
				nextEl: ".blog-slider__next",
				prevEl: ".blog-slider__prev",
			},
		});

		textSlider.controller.control = imgSlider;
		imgSlider.controller.control = textSlider;
	};

	document.addEventListener("shopify:section:load", function () {
		mainBlogSlider();
	});

	mainBlogSlider();
})();
