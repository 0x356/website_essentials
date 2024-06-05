if (!customElements.get("quick-add-modal")) {
	customElements.define(
		"quick-add-modal",
		class QuickAddModal extends ModalDialog {
			constructor() {
				super();
				this.modalContent = this.querySelector('[id^="QuickAddInfo-"]');
			}

			hide(preventFocus = false) {
				const cartDrawer = document.querySelector("cart-drawer");
				if (cartDrawer) cartDrawer.setActiveElement(this.openedBy);
				this.modalContent.innerHTML = "";

				if (preventFocus) this.openedBy = null;
				super.hide();
			}

			dropdowncolor() {
				$(".list-choice-before").click(function () {
					$(".list-choice").removeClass("expanded");
				});
				$(".list-choice-btn").click(function (e) {
					$(this).addClass("expanded");
					$(".first_label").each(function (index, item) {
						$(this).removeClass("active_label");
						$(item.children[0]).change(function () {
							if ($(this).is(":checked")) {
								$(".list-choice").removeClass("expanded");
							}
						});
					});

					const first_label_input = document.querySelectorAll(
						'.first_label input[type="radio"]:checked'
					);

					first_label_input.forEach(function (item, index) {
						item.parentNode.classList.add("active_label");
					});

					if ($(this).hasClass("expanded")) {
						e.stopPropagation();
						$(document).click(function () {
							$(".list-choice").removeClass("expanded");
						});
					}
				});
			}

			show(opener) {
				opener.setAttribute("aria-disabled", true);
				opener.classList.add("loading");

				if (opener.querySelector(".loading-overlay__spinner")) {
					opener
						.querySelector(".loading-overlay__spinner")
						.classList.remove("hidden");
				}

				fetch(opener.getAttribute("data-product-url"))
					.then((response) => response.text())
					.then((responseText) => {
						const responseHTML = new DOMParser().parseFromString(
							responseText,
							"text/html"
						);
						this.productElement = responseHTML.querySelector(
							'section[id^="MainProduct-"]'
						);
						this.preventDuplicatedIDs();
						this.removeDOMElements();
						this.setInnerHTML(
							this.modalContent,
							this.productElement.innerHTML,
							opener
						);

						if (window.Shopify && Shopify.PaymentButton) {
							Shopify.PaymentButton.init();
						}

						if (window.ProductModel) window.ProductModel.loadShopifyXR();

						this.removeGalleryListSemantic();
						this.updateImageSizes();
						this.preventVariantURLSwitching();
						super.show(opener);
						this.dropdowncolor();
					})
					.finally(() => {
						opener.removeAttribute("aria-disabled");
						opener.classList.remove("loading");

						if (opener.querySelector(".loading-overlay__spinner")) {
							opener
								.querySelector(".loading-overlay__spinner")
								.classList.add("hidden");
						}

						var slider = new Swiper(".quick-add-modal .js-media-list", {
							slidesPerView: 1,
							autoHeight: true,
							navigation: {
								nextEl: ".swiper-btn--next",
								prevEl: ".swiper-btn--prev",
							},
							pagination: {
								el: `.quick-add-modal .swiper-pagination`,
								clickable: "true",
								type: "bullets",
								renderBullet: function (activeIndex, className) {
									return (
										'<span class="' +
										className +
										'">' +
										"<em>" +
										activeIndex +
										"</em>" +
										"<i></i>" +
										"<b></b>" +
										"</span>"
									);
								},
							},
							on: {
								slideChange: function () {
									window.pauseAllMedia();
								},
							},
						});
					});
			}

			setInnerHTML(element, html, opener) {
				element.innerHTML = html;

				// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
				element.querySelectorAll("script").forEach((oldScriptTag) => {
					const newScriptTag = document.createElement("script");
					Array.from(oldScriptTag.attributes).forEach((attribute) => {
						newScriptTag.setAttribute(attribute.name, attribute.value);
					});
					newScriptTag.appendChild(
						document.createTextNode(oldScriptTag.innerHTML)
					);
					oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
				});

				// Read more button
				const moreBtn = document.createElement("a");
				moreBtn.innerHTML = `<span class="button-label">${theme.quickviewMore}</span>`;
				moreBtn.setAttribute("href", opener.getAttribute("data-product-url"));
				moreBtn.setAttribute(
					"class",
					"product__read-more button button--simple"
				);
				element.querySelector(".product__info-container").appendChild(moreBtn);
			}

			removeDOMElements() {
				const pickupAvailability = this.productElement.querySelector(
					"pickup-availability"
				);
				if (pickupAvailability) pickupAvailability.remove();

				const productModal = this.productElement.querySelector("product-modal");
				if (productModal) productModal.remove();

				const gift = this.productElement.querySelector(".customer");
				if (gift) gift.remove();
			}

			preventDuplicatedIDs() {
				const sectionId = this.productElement.dataset.section;
				this.productElement.innerHTML =
					this.productElement.innerHTML.replaceAll(
						sectionId,
						`quickadd-${sectionId}`
					);
				this.productElement
					.querySelectorAll("variant-selects, variant-radios")
					.forEach((variantSelect) => {
						variantSelect.dataset.originalSection = sectionId;
					});
			}

			preventVariantURLSwitching() {
				if (this.modalContent.querySelector("variant-radios,variant-selects")) {
					this.modalContent
						.querySelector("variant-radios,variant-selects")
						.setAttribute("data-update-url", "false");
				}
			}

			removeGalleryListSemantic() {
				const galleryList = this.modalContent.querySelector(
					'[id^="Slider-Gallery"]'
				);
				if (!galleryList) return;

				galleryList.setAttribute("role", "presentation");
				galleryList
					.querySelectorAll('[id^="Slide-"]')
					.forEach((li) => li.setAttribute("role", "presentation"));
			}

			updateImageSizes() {
				const product = this.modalContent.querySelector(".product");
				const desktopColumns = product.classList.contains("product--columns");
				if (!desktopColumns) return;

				const mediaImages = product.querySelectorAll(".product__media img");
				if (!mediaImages.length) return;

				let mediaImageSizes =
					"(min-width: 1000px) 715px, (min-width: 750px) calc((100vw - 11.5rem) / 2), calc(100vw - 4rem)";

				if (product.classList.contains("product--medium")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "605px");
				} else if (product.classList.contains("product--small")) {
					mediaImageSizes = mediaImageSizes.replace("715px", "495px");
				}

				mediaImages.forEach((img) =>
					img.setAttribute("sizes", mediaImageSizes)
				);
			}
		}
	);
}
