// Inventário JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializeSearch();
    initializeFilters();
    initializeViewToggle();
    initializePagination();
    initializeItemInteractions();
    initializeSwiper();
    
    // Initialize first page of authors
    loadPageContent(1);
});

// Initialize Swiper for museum cards
function initializeSwiper() {
    const swiper = new Swiper('.museum-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: false,
        speed: 800,
        effect: 'slide',
        autoHeight: false,
        centeredSlides: false,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
            dynamicBullets: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '" aria-label="Ir para slide ' + (index + 1) + '"></span>';
            },
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        a11y: {
            prevSlideMessage: 'Slide anterior',
            nextSlideMessage: 'Próximo slide',
            firstSlideMessage: 'Este é o primeiro slide',
            lastSlideMessage: 'Este é o último slide',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 1,
                spaceBetween: 40,
            },
        },
    });
    
    // Add ARIA labels to navigation buttons
    const nextBtn = document.querySelector('.swiper-button-next');
    const prevBtn = document.querySelector('.swiper-button-prev');
    
    // Custom navigation buttons
    const customPrevBtn = document.querySelector('.custom-prev');
    const customNextBtn = document.querySelector('.custom-next');
    
    if (customPrevBtn && customNextBtn) {
        // Add event listeners for custom buttons
        customPrevBtn.addEventListener('click', () => {
            swiper.slidePrev();
        });
        
        customNextBtn.addEventListener('click', () => {
            swiper.slideNext();
        });
        
        // Update button states
        function updateButtonStates() {
            customPrevBtn.disabled = swiper.isBeginning;
            customNextBtn.disabled = swiper.isEnd;
        }
        
        // Listen to swiper events
        swiper.on('slideChange', updateButtonStates);
        swiper.on('reachBeginning', () => {
            customPrevBtn.disabled = true;
        });
        swiper.on('reachEnd', () => {
            customNextBtn.disabled = true;
        });
        swiper.on('fromEdge', updateButtonStates);
        
        // Initial state
        updateButtonStates();
        
        // Accessibility attributes
        customPrevBtn.setAttribute('aria-label', 'Slide anterior de museus');
        customPrevBtn.setAttribute('title', 'Slide anterior');
        customNextBtn.setAttribute('aria-label', 'Próximo slide de museus');
        customNextBtn.setAttribute('title', 'Próximo slide');
    }
    
    // Add smooth scroll animation and loading states
    swiper.on('slideChangeTransitionStart', () => {
        const swiperContainer = document.querySelector('.museum-swiper');
        swiperContainer.classList.add('loading');
        
        // Remove loading state after transition
        setTimeout(() => {
            swiperContainer.classList.remove('loading');
        }, 400);
    });
    
    // Add keyboard navigation hints
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && !customPrevBtn.disabled) {
            swiper.slidePrev();
            customPrevBtn.focus();
        } else if (e.key === 'ArrowRight' && !customNextBtn.disabled) {
            swiper.slideNext();
            customNextBtn.focus();
        }
    });
    
    // Add touch feedback for mobile
    let touchStartX = 0;
    const swiperEl = document.querySelector('.museum-swiper');
    
    swiperEl.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    });
    
    swiperEl.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0 && !customNextBtn.disabled) {
                // Swipe left - next slide
                customNextBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    customNextBtn.style.transform = 'scale(1)';
                }, 200);
            } else if (diff < 0 && !customPrevBtn.disabled) {
                // Swipe right - previous slide
                customPrevBtn.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    customPrevBtn.style.transform = 'scale(1)';
                }, 200);
            }
        }
    });
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
        
        // Real-time search with debounce
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (searchInput.value.length > 2 || searchInput.value.length === 0) {
                    performSearch();
                }
            }, 300);
        });
    }
}

function performSearch() {
    const searchInput = document.querySelector('.search-input');
    const query = searchInput.value.toLowerCase().trim();
    const authors = document.querySelectorAll('.author-card');
    
    authors.forEach(author => {
        const name = author.querySelector('h4').textContent.toLowerCase();
        const specialty = author.querySelector('.author-specialty').textContent.toLowerCase();
        const period = author.querySelector('.author-period').textContent.toLowerCase();
        const tags = Array.from(author.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = `${name} ${specialty} ${period} ${tags.join(' ')}`;
        
        if (query === '' || searchText.includes(query)) {
            author.style.display = 'block';
            author.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            author.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

// Filter functionality
function initializeFilters() {
    const museumCards = document.querySelectorAll('.museum-card');
    
    // Category cards are now non-interactive (display only)
    // Only museum cards remain clickable for filtering
    
    museumCards.forEach(card => {
        card.addEventListener('click', function() {
            const museum = this.dataset.museum;
            filterByMuseum(museum);
            updateActiveFilter(museumCards, this);
        });
    });
}

function filterByCategory(category) {
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        if (category === 'todos' || tags.some(tag => tag.includes(category))) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

function filterByMuseum(museum) {
    const authors = document.querySelectorAll('.author-card');
    
    authors.forEach(author => {
        // For authors, we can filter by specialty or tags
        const specialty = author.querySelector('.author-specialty').textContent.toLowerCase();
        const tags = Array.from(author.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = `${specialty} ${tags.join(' ')}`;
        
        if (museum === 'todos' || searchText.includes(museum.replace('-', ' '))) {
            author.style.display = 'block';
            author.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            author.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

function updateActiveFilter(cards, activeCard) {
    cards.forEach(card => card.classList.remove('active'));
    activeCard.classList.add('active');
}

// View toggle functionality
function initializeViewToggle() {
    const viewBtns = document.querySelectorAll('.view-btn');
    const itemsGrid = document.getElementById('itemsGrid');
    
    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;
            
            viewBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            if (view === 'list') {
                itemsGrid.classList.add('list-view');
                itemsGrid.style.gridTemplateColumns = '1fr';
            } else {
                itemsGrid.classList.remove('list-view');
                itemsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
            }
        });
    });
}

// Pagination functionality
function initializePagination() {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    
    pageButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                pageButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Change page without scrolling
                loadPageContent(parseInt(this.textContent));
            }
        });
    });
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-btn.active');
            const currentPageNum = parseInt(currentPage.textContent);
            if (currentPageNum > 1) {
                navigateToPage(currentPageNum - 1);
            }
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const currentPage = document.querySelector('.page-btn.active');
            const currentPageNum = parseInt(currentPage.textContent);
            const maxPage = Math.max(...Array.from(pageButtons).map(btn => parseInt(btn.textContent)));
            if (currentPageNum < maxPage) {
                navigateToPage(currentPageNum + 1);
            }
        });
    }
}

function navigateToPage(pageNum) {
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.textContent) === pageNum) {
            btn.classList.add('active');
        }
    });
    
    loadPageContent(pageNum);
}

function loadPageContent(pageNum) {
    const authors = document.querySelectorAll('.author-card');
    const authorsPerPage = 6;
    const startIndex = (pageNum - 1) * authorsPerPage;
    const endIndex = startIndex + authorsPerPage;
    
    // First fade out all visible authors
    authors.forEach(author => {
        if (author.style.display !== 'none') {
            author.style.opacity = '0';
            author.style.transform = 'translateY(20px)';
        }
    });
    
    // After fade out, hide all and show new ones
    setTimeout(() => {
        authors.forEach((author, index) => {
            author.style.display = 'none';
            author.style.opacity = '0';
            author.style.transform = 'translateY(20px)';
            
            if (index >= startIndex && index < endIndex) {
                author.style.display = 'block';
                
                // Staggered animation for each visible author
                setTimeout(() => {
                    author.style.opacity = '1';
                    author.style.transform = 'translateY(0)';
                    author.style.transition = 'all 0.4s ease';
                }, (index - startIndex) * 80);
            }
        });
        
        // Update pagination buttons state
        updatePaginationButtons(pageNum);
    }, 200);
}

function updatePaginationButtons(currentPage) {
    const prevBtn = document.querySelector('.page-btn.prev');
    const nextBtn = document.querySelector('.page-btn.next');
    const totalPages = 3;
    
    // Update prev button
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
        if (currentPage === 1) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
    }
    
    // Update next button
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
        if (currentPage === totalPages) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }
}

// Author interactions
function initializeItemInteractions() {
    const authorCards = document.querySelectorAll('.author-card');
    
    authorCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('h4').textContent;
            openAuthorModal(name, this);
        });
        
        // Add keyboard navigation
        card.setAttribute('tabindex', '0');
        card.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

function openAuthorModal(name, authorElement) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'author-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeAuthorModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeAuthorModal()">&times;</button>
            <div class="modal-header">
                <h2>${name}</h2>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <div class="author-image-large" style="${authorElement.querySelector('.author-image').style.cssText}">
                        ${authorElement.querySelector('.author-image').innerHTML}
                    </div>
                </div>
                <div class="modal-info">
                    <p><strong>Especialidade:</strong> ${authorElement.querySelector('.author-specialty').textContent}</p>
                    <p><strong>Período:</strong> ${authorElement.querySelector('.author-period').textContent}</p>
                    <p><strong>Obras no Acervo:</strong> ${authorElement.querySelector('.author-works').textContent}</p>
                    <div class="modal-tags">
                        ${authorElement.querySelector('.author-tags').innerHTML}
                    </div>
                    <div class="modal-description">
                        <h4>Biografia</h4>
                        <p>Este artista/criador contribuiu significativamente para o patrimônio cultural preservado nos museus da UFPB. Suas obras representam importantes aspectos da arte e cultura regional, demonstrando técnicas e estilos característicos de seu período de atuação.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles (same as item modal)
    const modalStyles = `
        .author-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        }
        
        .author-modal .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            cursor: pointer;
        }
        
        .author-modal .modal-content {
            background: white;
            border-radius: 15px;
            max-width: 800px;
            width: 90%;
            max-height: 90vh;
            position: relative;
            overflow-y: auto;
            animation: slideUp 0.3s ease;
        }
        
        .author-modal .modal-close {
            position: absolute;
            top: 15px;
            right: 20px;
            background: none;
            border: none;
            font-size: 2rem;
            cursor: pointer;
            color: #666;
            z-index: 1001;
        }
        
        .author-modal .modal-header {
            padding: 2rem 2rem 1rem;
            border-bottom: 1px solid #e9ecef;
        }
        
        .author-modal .modal-header h2 {
            margin: 0;
            color: #2a5298;
        }
        
        .author-modal .modal-body {
            padding: 2rem;
        }
        
        .author-modal .author-image-large {
            height: 200px;
            border-radius: 10px;
            margin-bottom: 1.5rem;
        }
        
        .author-modal .modal-info p {
            margin-bottom: 0.8rem;
            line-height: 1.6;
        }
        
        .author-modal .modal-tags {
            margin: 1rem 0;
        }
        
        .author-modal .modal-description {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 1px solid #e9ecef;
        }
        
        .author-modal .modal-description h4 {
            color: #2a5298;
            margin-bottom: 1rem;
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = modalStyles;
    modal.appendChild(styleSheet);
    
    // Add modal to document
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeAuthorModal() {
    const modal = document.querySelector('.author-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

function openItemModal(title, itemElement) {
    // Create modal overlay
    const modal = document.createElement('div');
    modal.className = 'item-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeItemModal()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="closeItemModal()">&times;</button>
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div class="modal-body">
                <div class="modal-image">
                    <div class="item-image-large" style="${itemElement.querySelector('.item-image').style.cssText}">
                        ${itemElement.querySelector('.item-image').innerHTML}
                    </div>
                </div>
                <div class="modal-info">
                    <p><strong>Autor:</strong> ${itemElement.querySelector('.item-author').textContent}</p>
                    <p><strong>Data:</strong> ${itemElement.querySelector('.item-date').textContent}</p>
                    <p><strong>Museu:</strong> ${itemElement.querySelector('.item-museum').textContent}</p>
                    <div class="modal-tags">
                        ${itemElement.querySelector('.item-tags').innerHTML}
                    </div>
                    <div class="modal-description">
                        <h4>Descrição</h4>
                        <p>Esta é uma peça importante do acervo, representando um exemplo significativo da arte e cultura preservada nos museus da UFPB. A obra demonstra técnicas e estilos característicos de seu período histórico.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal styles
    const modalStyles = `
        <style>
            .item-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                cursor: pointer;
            }
            
            .modal-content {
                position: relative;
                background: white;
                border-radius: 15px;
                max-width: 800px;
                max-height: 90vh;
                width: 90%;
                overflow-y: auto;
                animation: slideUp 0.3s ease;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                z-index: 1001;
            }
            
            .modal-header {
                padding: 2rem 2rem 1rem;
                border-bottom: 1px solid #e9ecef;
            }
            
            .modal-header h2 {
                margin: 0;
                color: #2a5298;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .item-image-large {
                height: 300px;
                border-radius: 10px;
                margin-bottom: 1.5rem;
            }
            
            .modal-info p {
                margin-bottom: 0.8rem;
                line-height: 1.6;
            }
            
            .modal-tags {
                margin: 1rem 0;
            }
            
            .modal-description {
                margin-top: 1.5rem;
                padding-top: 1.5rem;
                border-top: 1px solid #e9ecef;
            }
            
            .modal-description h4 {
                color: #2a5298;
                margin-bottom: 1rem;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideUp {
                from { transform: translateY(50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeItemModal() {
    const modal = document.querySelector('.item-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Utility functions
function updateResultsCount() {
    const visibleAuthors = document.querySelectorAll('.author-card[style*="display: block"], .author-card:not([style*="display: none"])');
    const resultsHeader = document.querySelector('.results-header h3');
    
    if (resultsHeader) {
        resultsHeader.textContent = `Resultados da Busca (${visibleAuthors.length} autores)`;
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Sort functionality
function initializeSort() {
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortBy = this.value;
            sortItems(sortBy);
        });
    }
}

function sortItems(sortBy) {
    const itemsGrid = document.getElementById('itemsGrid');
    const items = Array.from(itemsGrid.querySelectorAll('.item-card'));
    
    items.sort((a, b) => {
        switch (sortBy) {
            case 'title':
                return a.querySelector('h4').textContent.localeCompare(b.querySelector('h4').textContent);
            case 'author':
                return a.querySelector('.item-author').textContent.localeCompare(b.querySelector('.item-author').textContent);
            case 'date':
                return a.querySelector('.item-date').textContent.localeCompare(b.querySelector('.item-date').textContent);
            default:
                return 0;
        }
    });
    
    // Re-append sorted items
    items.forEach(item => itemsGrid.appendChild(item));
}

// Initialize sort on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSort();
});

// Add escape key listener for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeItemModal();
    }
});

// Add loading states
function showLoading() {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.style.opacity = '0.5';
    itemsGrid.style.pointerEvents = 'none';
}

function hideLoading() {
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.style.opacity = '1';
    itemsGrid.style.pointerEvents = 'auto';
}

// Export functions for global access
window.closeItemModal = closeItemModal;
window.performSearch = performSearch;