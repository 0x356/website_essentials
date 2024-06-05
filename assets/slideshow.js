(function () {
	const slideshow = () => {
		$(".slideshow-section").each(function () {
			if ($(this).hasClass("slider_started")) {
				return "";
			}
			$(this).addClass("slider_started");
			const id = $(this).attr("id");
			const box = $(this).find(".slideshow");
			const autoplay = box.data("autoplay");
			const stopAutoplay = box.data("stop-autoplay");
			const delay = box.data("delay") * 1000;
			const slideshowType = box.data("slideshow-type");
			const slideCount = box.data("count");
			//const loop = slideCount == 1 ? false : true;
			const loop = false;
			let autoplayParam;
			if (autoplay) {
				autoplayParam = {
					autoplay: {
						delay: delay,
						pauseOnMouseEnter: stopAutoplay,
						disableOnInteraction: false,
					},
				};
			} else {
				autoplayParam = { autoplay: false };
			}
			// fashion slider functoins

			let navigationLocked = false;
			let transitionDisabled = false;
			let frameId;

			// eslint-disable-next-line
			const disableTransitions = (el) => {
				el.classList.add("fashion-slider-no-transition");
				transitionDisabled = true;
				cancelAnimationFrame(frameId);
				frameId = requestAnimationFrame(() => {
					el.classList.remove("fashion-slider-no-transition");
					transitionDisabled = false;
					navigationLocked = false;
				});
			};

			let fashionSlider = {};
			if (box.hasClass("fashion-slider")) {
				fashionSlider = {
					loop: false,
					on: {
						transitionStart(swiper) {
							const { slides, previousIndex, activeIndex, navigation , pagination } = swiper;
							if (!transitionDisabled) navigationLocked = true;
							const activeSlide = slides[activeIndex];
							const previousSlide = slides[previousIndex];

							const previousContent = previousSlide.querySelector(
								".slideshow-slide__content"
							);
							const activeContent = activeSlide.querySelector(
								".slideshow-slide__content"
							);
							const previousImageScale = previousSlide.querySelector(
								".fashion-slider-scale"
							);
							
							const previousImage = previousSlide.querySelector(
								".slideshow-slide__img"
							);
							const activeImage = activeSlide.querySelector(
								".slideshow-slide__img"
							);

							const nextArrow = navigation.nextEl;
							const prevArrow = navigation.prevEl;
							const paginationEl = pagination.el;
							if (nextArrow) {
								nextArrow.classList.remove('fadeIn');
								nextArrow.classList.add('fadeOut');
							}
							if (prevArrow) {
								prevArrow.classList.remove('fadeIn');
								prevArrow.classList.add('fadeOut');
							}
							if (paginationEl) {
								paginationEl.classList.remove('fadeIn');
								paginationEl.classList.add('fadeOut');
							}

							const previousAnimation = previousContent.querySelectorAll('.slideshow-slide__animation');
							const activeAnimation = activeContent.querySelectorAll('.slideshow-slide__animation');

							const previousAnimationFade = previousContent.querySelectorAll('.slideshow-slide__animation-fade');
							const activeAnimationFade = activeContent.querySelectorAll('.slideshow-slide__animation-fade');
							
							previousAnimation.forEach((item)=> {
								item.classList.add('animation-hidden-top');
								item.classList.remove('animation-show-bottum');
							});
							
							activeAnimation.forEach((item)=> {
								item.classList.remove('animation-hidden-top');
								item.classList.add('animation-show-bottum');
							});

							previousAnimationFade.forEach((item)=> {
								item.classList.remove('fadeIn');
								item.classList.add('fadeOut');
							});

							activeAnimationFade.forEach((item)=> {
								item.classList.remove('fadeOut');
								item.classList.add('fadeIn');
							});

							previousImageScale.style.transform = "scale(0.6)";

							const onTransitionEnd = (e) => {
								if (e.target !== previousImage) return;
							};
							previousImage.addEventListener("transitionend", onTransitionEnd);
						},
						transitionEnd(swiper) {
							const { slides, activeIndex, navigation , pagination } = swiper;
							const activeSlide = slides[activeIndex];
							const activeImage = activeSlide.querySelector(
								".slideshow-slide__img"
							);
							const activeContent = activeSlide.querySelector(
								".slideshow-slide__content"
							);
							const nextArrow = navigation.nextEl;
							const prevArrow = navigation.prevEl;
							const paginationEl = pagination.el;
							const showItems = ()=> {
								if (nextArrow) {
									nextArrow.classList.remove('fadeOut');
									nextArrow.classList.add('fadeIn');
								}
								if (prevArrow) {
									prevArrow.classList.remove('fadeOut');
									prevArrow.classList.add('fadeIn');
								}
								if (paginationEl) {
									paginationEl.classList.remove('fadeOut');
									paginationEl.classList.add('fadeIn');
								}
								//activeContent.style.opacity = 1;
							}
							if(activeContent.classList.contains('content-left')){
								setTimeout(showItems,400);
							} else {
								showItems();
							}
							setTimeout(()=> {
								activeSlide.querySelector(
									".fashion-slider-scale"
								).style.transform = "scale(1)";
							})
							const onTransitionEnd = (e) => {
								if (e.target !== activeImage) return;
								activeImage.removeEventListener(
									"transitionend",
									onTransitionEnd
								);
								navigationLocked = false;
							};
							activeImage.addEventListener("transitionend", onTransitionEnd);
						},
						init(swiper) {
							const { el } = swiper;
							disableTransitions(el);
							swiper.emit("transitionEnd");
						},
						resize(swiper) {
							disableTransitions(swiper.el);
						},
					},
				};
			}
			// fashion slider functions end

			const commonParams = {
				speed: box.data("speed") * 1000,
				effect: box.data("effect"),
				loop: loop,
				autoHeight: false,
				calculateHeight: false,
				keyboard: true,
				...autoplayParam,
			};

			const swiperOverlayParams = {
				centeredSlides: false,
				creativeEffect: {
					prev: {
						shadow: true,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: true,
				},
				...fashionSlider,
				navigation: {
					nextEl: `#${id} .swiper-button-next`,
					prevEl: `#${id} .swiper-button-prev`,
				},
				pagination: {
					el: `#${id} .swiper-pagination`,
					clickable: true,
				},
			};

			const swiperStandardParams = {
				creativeEffect: {
					prev: {
						shadow: false,
						translate: [0, 0, -400],
					},
					next: {
						translate: ["100%", 0, 0],
					},
				},
				coverflowEffect: {
					rotate: 50,
					stretch: 0,
					depth: 100,
					modifier: 1,
					slideShadows: false,
				},
				flipEffect: {
					slideShadows: false,
				},
			};

			const changeColorScheme = (context) => {
				const activeIndex = context.activeIndex;
				const activeSlide = context.slides[activeIndex];
				const changeItems = [
					context.navigation.nextEl,
					context.navigation.prevEl,
					context.pagination.el,
				];

				const colorScheme = activeSlide.dataset.colorScheme;

				changeItems.forEach((item) => {
					if (!item) return;
					let classNames = item.getAttribute("class");
					classNames = classNames.replace(/color-background-\d+/g, "");
					item.setAttribute("class", classNames);
					item.classList.add(colorScheme);
				});
			};

			if (slideshowType === "overlay") {
				let dubleOptions = {};
				if (!box.hasClass("fashion-slider")) {
					dubleOptions = {
						centeredSlides: false,
						creativeEffect: {
							prev: {
								shadow: true,
								translate: [0, 0, -400],
							},
							next: {
								translate: ["100%", 0, 0],
							},
						},
						coverflowEffect: {
							rotate: 50,
							stretch: 0,
							depth: 100,
							modifier: 1,
							slideShadows: true,
						},
						on: {
							transitionStart(swiper) {
								const { slides, previousIndex, activeIndex, navigation , pagination } = swiper;
								if (!transitionDisabled) navigationLocked = true;
								const activeSlide = slides[activeIndex];
								const previousSlide = slides[previousIndex];
	
								const previousContent = previousSlide.querySelector(
									".slideshow-slide__content"
								);
								const activeContent = activeSlide.querySelector(
									".slideshow-slide__content"
								);
								const nextArrow = navigation.nextEl;
								const prevArrow = navigation.prevEl;
								const paginationEl = pagination.el;
								if (nextArrow) {
									nextArrow.classList.remove('fadeIn');
									nextArrow.classList.add('fadeOut');
								}
								if (prevArrow) {
									prevArrow.classList.remove('fadeIn');
									prevArrow.classList.add('fadeOut');
								}
								if (paginationEl) {
									paginationEl.classList.remove('fadeIn');
									paginationEl.classList.add('fadeOut');
								}
	
								const previousAnimation = previousContent.querySelectorAll('.slideshow-slide__animation');
								const activeAnimation = activeContent.querySelectorAll('.slideshow-slide__animation');
	
								const previousAnimationFade = previousContent.querySelectorAll('.slideshow-slide__animation-fade');
								const activeAnimationFade = activeContent.querySelectorAll('.slideshow-slide__animation-fade');
								
								previousAnimation.forEach((item)=> {
									item.classList.add('animation-hidden-top');
									item.classList.remove('animation-show-bottum');
								});
								
								activeAnimation.forEach((item)=> {
									item.classList.remove('animation-hidden-top');
									item.classList.add('animation-show-bottum');
								});
	
								previousAnimationFade.forEach((item)=> {
									item.classList.remove('fadeIn');
									item.classList.add('fadeOut');
								});
	
								activeAnimationFade.forEach((item)=> {
									item.classList.remove('fadeOut');
									item.classList.add('fadeIn');
								});
	
							},
							transitionEnd(swiper) {
								const { slides, activeIndex, navigation , pagination } = swiper;
								const activeSlide = slides[activeIndex];
								const activeContent = activeSlide.querySelector(
									".slideshow-slide__content"
								);
								const nextArrow = navigation.nextEl;
								const prevArrow = navigation.prevEl;
								const paginationEl = pagination.el;
								const showItems = ()=> {
									if (nextArrow) {
										nextArrow.classList.remove('fadeOut');
										nextArrow.classList.add('fadeIn');
									}
									if (prevArrow) {
										prevArrow.classList.remove('fadeOut');
										prevArrow.classList.add('fadeIn');
									}
									if (paginationEl) {
										paginationEl.classList.remove('fadeOut');
										paginationEl.classList.add('fadeIn');
									}
									//activeContent.style.opacity = 1;
								}
								if(activeContent.classList.contains('content-left')){
									setTimeout(showItems,400);
								} else {
									showItems();
								}
							},
							init(swiper) {
								const { el } = swiper;
								disableTransitions(el);
								swiper.emit("transitionEnd");
							},
							resize(swiper) {
								disableTransitions(swiper.el);
							},
						},
					}
				}
				const swiperOverlay = new Swiper(`#${id} .slideshow__swiper`, {
					...commonParams,
					...swiperOverlayParams,
					...dubleOptions,
				});
				changeColorScheme(swiperOverlay);
				let doubleSlider, doubleMainSlider;
				if (box.hasClass("double-slider")) {
					doubleSlider = new Swiper(`#${id} .slideshow-double__swiper`, {
						...commonParams,
						...swiperOverlayParams,
						navigation: {},
						pagination: {},
						autoplay: false,
					});
					doubleMainSlider = new Swiper(
						`#${id} .slideshow-double-main__swiper`,
						{
							...commonParams,
							...swiperOverlayParams,
							navigation: {},
							pagination: {},
							autoplay: false,
						}
					);
					swiperOverlay.on("beforeTransitionStart", beforeChange);
				} else {
					swiperOverlay.on("beforeTransitionStart", function () {
						changeColorScheme(this);
					});
				}

				function beforeChange(slider) {
					changeColorScheme(slider);

					const { activeIndex } = this;
					doubleMainSlider.slideTo(activeIndex);
					doubleSlider.slideTo(activeIndex);
				}
			}

			if (slideshowType === "standard") {

				const swiperContent = new Swiper(
					`#${id} .split-screen-slideshow__content-swiper`,
					{
						...commonParams,
						...swiperStandardParams,
						autoplay: false,
						allowTouchMove: false,
						effect: "fade",
					}
				);

				const swiperImage = new Swiper(
					`#${id} .split-screen-slideshow__image-swiper`,
					{
						...commonParams,
						...swiperStandardParams,
						navigation: {
							nextEl: `#${id} .swiper-button-next`,
							prevEl: `#${id} .swiper-button-prev`,
						},
						pagination: {
							el: `#${id} .swiper-pagination`,
							clickable: true,
						},
					}
				);
				swiperContent.controller.control = swiperImage;
				swiperImage.controller.control = swiperContent;
			}
		});
	};

	document.addEventListener("DOMContentLoaded", function () {
		slideshow();
		document.addEventListener("shopify:section:load", function () {
			slideshow();
		});
	});
})();
