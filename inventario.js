// Inventário JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize page functionality
    initializeSearch();
    initializeFilters();
    initializeViewToggle();
    initializePagination();
    initializeItemInteractions();
});

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
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        const title = item.querySelector('h4').textContent.toLowerCase();
        const author = item.querySelector('.item-author').textContent.toLowerCase();
        const museum = item.querySelector('.item-museum').textContent.toLowerCase();
        const tags = Array.from(item.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
        
        const searchText = `${title} ${author} ${museum} ${tags.join(' ')}`;
        
        if (query === '' || searchText.includes(query)) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            item.style.display = 'none';
        }
    });
    
    updateResultsCount();
}

// Filter functionality
function initializeFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    const museumCards = document.querySelectorAll('.museum-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            filterByCategory(category);
            updateActiveFilter(categoryCards, this);
        });
    });
    
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
    const items = document.querySelectorAll('.item-card');
    
    items.forEach(item => {
        const itemMuseum = item.querySelector('.item-museum').textContent.toLowerCase();
        
        if (museum === 'todos' || itemMuseum.includes(museum.replace('-', ' '))) {
            item.style.display = 'block';
            item.style.animation = 'fadeInUp 0.6s ease forwards';
        } else {
            item.style.display = 'none';
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
                
                // Simulate page change
                scrollToTop();
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
    
    scrollToTop();
    loadPageContent(pageNum);
}

function loadPageContent(pageNum) {
    // Simulate loading new content
    const itemsGrid = document.getElementById('itemsGrid');
    itemsGrid.style.opacity = '0.5';
    
    setTimeout(() => {
        itemsGrid.style.opacity = '1';
        // Here you would typically load new items from an API
        console.log(`Loading page ${pageNum} content...`);
    }, 300);
}

// Item interactions
function initializeItemInteractions() {
    const itemCards = document.querySelectorAll('.item-card');
    
    itemCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h4').textContent;
            openItemModal(title, this);
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
    const visibleItems = document.querySelectorAll('.item-card[style*="display: block"], .item-card:not([style*="display: none"])');
    const resultsHeader = document.querySelector('.results-header h3');
    
    if (resultsHeader) {
        resultsHeader.textContent = `Resultados da Busca (${visibleItems.length} itens)`;
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