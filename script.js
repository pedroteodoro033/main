// Navigation helpers: open detail pages when card has `data-page`
document.addEventListener('DOMContentLoaded', () => {
	const pageCards = document.querySelectorAll('.card[data-page]');
	pageCards.forEach(card => {
		const target = card.dataset.page;
		// click -> navigate
		card.addEventListener('click', () => {
			if (target) window.location.href = target;
		});
		// keyboard accessibility (Enter / Space)
		card.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				if (target) window.location.href = target;
			}
		});
	});

	// Modal de ampliação de imagens. Cria o elemento se ainda não existir
	let modal = document.getElementById("imageModal");
	if (!modal) {
		modal = document.createElement('div');
		modal.id = 'imageModal';
		modal.className = 'modal';
		modal.innerHTML = '<span class="close">&times;</span>' +
			'<img class="modal-content" id="imgExpanded" alt="Imagem ampliada">' +
			'<div id="caption"></div>';
		document.body.appendChild(modal);
	}
	if (modal) {
		const modalImg = document.getElementById("imgExpanded");
		const captionText = document.getElementById("caption");
		const closeBtn = document.querySelector(".close");

		// Seleciona todas as mídias que podem ser ampliadas (imagens e iframes).
		// Suporte para classes anteriores e também para todos os <img>/<iframe>
		// em páginas que não são o index (identificadas por terem uma
		// classe no body). Imagens dentro de <header> são ignoradas.
		let mediaEls;
		if (document.body.classList.length === 0) {
			// index.html ou página sem classe de corpo: mantenha seleção específica
			mediaEls = document.querySelectorAll('.animais-illustration, .hero-img, .zoomable');
		} else {
			const allMedia = document.querySelectorAll('img, iframe');
			mediaEls = Array.from(allMedia).filter(el => !el.closest('.header'));
		}

		mediaEls.forEach(el => {
			// Adicionar overlay com ícones de zoom
			if (!el.classList.contains('zoomable-image')) {
				el.classList.add('zoomable-image');
				el.style.position = 'relative';
				
				// Criar overlay com ícones
				const overlay = document.createElement('div');
				overlay.className = 'zoom-overlay';
				
				// Ícone de zoom-in (ampliar)
				const zoomInIcon = document.createElement('div');
				zoomInIcon.className = 'zoom-icon';
				zoomInIcon.innerHTML = `
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<circle cx="10" cy="10" r="8"></circle>
						<line x1="14" y1="14" x2="20" y2="20"></line>
						<line x1="10" y1="6" x2="10" y2="14"></line>
						<line x1="6" y1="10" x2="14" y2="10"></line>
					</svg>
				`;
				zoomInIcon.title = 'Ampliar';
				zoomInIcon.addEventListener('click', (e) => {
					e.stopPropagation();
					// Dispara o evento de click que abre o modal
					el.click();
				});
				
				// Ícone de zoom-out (diminuir/fechar)
				const zoomOutIcon = document.createElement('div');
				zoomOutIcon.className = 'zoom-icon';
				zoomOutIcon.innerHTML = `
					<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
						<circle cx="10" cy="10" r="8"></circle>
						<line x1="14" y1="14" x2="20" y2="20"></line>
						<line x1="6" y1="10" x2="14" y2="10"></line>
					</svg>
				`;
				zoomOutIcon.title = 'Diminuir';
				zoomOutIcon.addEventListener('click', (e) => {
					e.stopPropagation();
					// Fecha o modal se estiver aberto, caso contrário apenas marca que não quer ampliar
					if (modal.style.display === 'block') {
						modal.style.display = 'none';
						modalImg.style.display = 'block';
					}
				});
				
				overlay.appendChild(zoomInIcon);
				overlay.appendChild(zoomOutIcon);
				
				// Adicionar texto "Clique para ampliar a imagem"
				const zoomText = document.createElement('div');
				zoomText.className = 'zoom-text';
				zoomText.textContent = 'Clique para ampliar a imagem';
				overlay.appendChild(zoomText);
				el.appendChild(overlay);
			}

			// não ampliar iframes do YouTube; permite tocar/pausar normalmente
			if (el.tagName === 'IFRAME' && el.src && el.src.includes('youtube.com')) {
				return; // skip adding click handler
			}
			el.onclick = function() {
				// abre modal
				modal.style.display = "block";
				// remove iframe antigo se existir
				const oldIframe = document.getElementById('imgExpandedIframe');
				if (oldIframe) oldIframe.remove();

				if (this.tagName === 'IFRAME') {
					// esconder a tag img e criar um iframe dentro do modal
					modalImg.style.display = 'none';
					const iframe = document.createElement('iframe');
					iframe.id = 'imgExpandedIframe';
					iframe.className = 'modal-content';
					iframe.src = this.src;
					iframe.width = this.width || '800';
					iframe.height = this.height || '450';
					iframe.frameBorder = '0';
					iframe.allow = this.getAttribute('allow') || 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
					iframe.allowFullscreen = true;
					modal.appendChild(iframe);
					captionText.innerHTML = this.title || '';
				} else {
					// image
					modalImg.style.display = 'block';
					modalImg.src = this.src;
					captionText.innerHTML = this.alt || '';
				}
			}
		});

		// Fecha o modal ao clicar no 'X'
		if (closeBtn) {
			closeBtn.onclick = function() {
				// remove iframe if exists
				const oldIframe = document.getElementById('imgExpandedIframe');
				if (oldIframe) oldIframe.remove();
				modal.style.display = "none";
				modalImg.style.display = 'block';
			}
		}

		// Fecha o modal ao clicar em qualquer lugar fora da imagem
		modal.onclick = function(event) {
			if (event.target !== modalImg) {
				const oldIframe = document.getElementById('imgExpandedIframe');
				if (oldIframe) oldIframe.remove();
				modal.style.display = "none";
				modalImg.style.display = 'block';
			}
		}

		// Fecha o modal ao pressionar ESC
		document.onkeydown = function(event) {
			if (event.key === "Escape") {
				const oldIframe = document.getElementById('imgExpandedIframe');
				if (oldIframe) oldIframe.remove();
				modal.style.display = "none";
				modalImg.style.display = 'block';
			}
		}
	}
});






