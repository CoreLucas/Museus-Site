// Funcionalidades da página de museus

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const museusGrid = document.getElementById('museusGrid');
const noResults = document.getElementById('noResults');
const museuCards = document.querySelectorAll('.museu-card');

// Função para extrair dados dos museus diretamente do DOM
function getMuseumDataFromDOM() {
    const cards = document.querySelectorAll('.museu-card');
    return Array.from(cards).map(card => {
        const title = card.querySelector('.museu-title').textContent.trim();
        const description = card.querySelector('.museu-description').textContent.trim();
        const category = card.getAttribute('data-category');
        const location = card.getAttribute('data-location');
        
        return {
            element: card,
            name: title,
            category: category,
            location: location,
            description: description
        };
    });
}



// Função combinada de busca e filtro
function applySearchAndFilter() {
    const searchTerm = searchInput.value.toLowerCase();
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const museumData = getMuseumDataFromDOM();
    let visibleCount = 0;
    
    if (!activeFilterBtn) {
        // Se não há filtro ativo, mostrar todos
        museumData.forEach(museum => {
            // Buscar apenas no título do museu
            const matchesSearch = !searchTerm || 
                museum.name.toLowerCase().includes(searchTerm);
            
            if (matchesSearch) {
                museum.element.style.display = 'block';
                visibleCount++;
            } else {
                museum.element.style.display = 'none';
            }
        });
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
        return;
    }
    
    const activeFilter = activeFilterBtn.getAttribute('data-filter');
    
    museumData.forEach(museum => {
        // Buscar apenas no título do museu
        const matchesSearch = !searchTerm || 
            museum.name.toLowerCase().includes(searchTerm);
        
        let matchesFilter = false;
        
        if (activeFilter === 'todos') {
            // Se "Todos" está selecionado, mostrar todos os museus
            matchesFilter = true;
        } else {
            // Obter as tags visuais do museu para comparação
            const tagElements = museum.element.querySelectorAll('.tag');
            const museumTags = Array.from(tagElements).map(tag => tag.textContent.trim().toLowerCase());
            
            // Mapear filtros para as tags correspondentes
            const filterToTagMap = {
                'artes': 'artes',
                'ciencia': 'ciência',
                'patrimonio-cultural': 'patrimônio cultural',
                'audiovisual': 'audiovisual',
                'historia': 'história'
            };
            
            const expectedTag = filterToTagMap[activeFilter.toLowerCase()];
            if (expectedTag) {
                matchesFilter = museumTags.includes(expectedTag);
            }
        }
        
        if (matchesSearch && matchesFilter) {
            museum.element.style.display = 'block';
            visibleCount++;
        } else {
            museum.element.style.display = 'none';
        }
    });
    
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Função de ordenação
function sortMuseums(criteria) {
    const museumData = getMuseumDataFromDOM();
    
    museumData.sort((a, b) => {
        switch(criteria) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'type':
                return a.category.localeCompare(b.category);
            case 'location':
                return a.location.localeCompare(b.location);
            default:
                return 0;
        }
    });
    
    // Reorganizar os cards no DOM
    museumData.forEach(museum => {
        museusGrid.appendChild(museum.element);
    });
    
    // Reaplicar filtros após ordenação
    applySearchAndFilter();
}

// Event Listeners

// Busca em tempo real
searchInput.addEventListener('input', applySearchAndFilter);

// Filtros por categoria
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Aplicar filtro combinado
        applySearchAndFilter();
    });
});

// Ordenação
sortSelect.addEventListener('change', (e) => {
    sortMuseums(e.target.value);
});



// Animação de entrada dos cards
function animateCards() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    museuCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Inicializar animações quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    animateCards();
    
    // Mostrar todos os museus inicialmente
    const museumData = getMuseumDataFromDOM();
    museumData.forEach(museum => {
        museum.element.style.display = 'block';
    });
    noResults.style.display = 'none';
});

