// Funcionalidades da página de museus

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortSelect = document.getElementById('sortSelect');
const museusGrid = document.getElementById('museusGrid');
const noResults = document.getElementById('noResults');
const museuCards = document.querySelectorAll('.museu-card');

// Dados dos museus para facilitar busca e ordenação
const museusData = [
    {
        id: 1,
        name: 'Museu de Arte Contemporânea',
        category: 'arte',
        location: 'campus1',
        description: 'Exposições de arte moderna e contemporânea'
    },
    {
        id: 2,
        name: 'Museu de História Natural',
        category: 'historia',
        location: 'campus1',
        description: 'Acervo dedicado à fauna, flora e história natural'
    },
    {
        id: 3,
        name: 'Museu de Ciências Exatas',
        category: 'ciencia',
        location: 'campus2',
        description: 'Exposições interativas sobre matemática, física e química'
    },
    {
        id: 4,
        name: 'Museu de Tecnologia e Inovação',
        category: 'tecnologia',
        location: 'campus1',
        description: 'História da tecnologia e inovações desenvolvidas na UFPB'
    },
    {
        id: 5,
        name: 'Pinacoteca UFPB',
        category: 'arte',
        location: 'campus1',
        description: 'Coleção permanente de pinturas e esculturas'
    },
    {
        id: 6,
        name: 'Museu Casa Hermano José',
        category: 'historia',
        location: 'campus3',
        description: 'Casa histórica preservada com mobiliário e objetos pessoais'
    }
];

// Função de busca
function searchMuseums() {
    const searchTerm = searchInput.value.toLowerCase();
    let visibleCount = 0;
    
    museuCards.forEach((card, index) => {
        const museuData = museusData[index];
        const matchesSearch = museuData.name.toLowerCase().includes(searchTerm) ||
                            museuData.description.toLowerCase().includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Mostrar mensagem se não há resultados
    noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

// Função de filtro por categoria
function filterByCategory(category) {
    let visibleCount = 0;
    
    museuCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        
        if (category === 'all' || cardCategory === category) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    // Aplicar busca após filtro
    if (searchInput.value) {
        searchMuseums();
    } else {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

// Função de ordenação
function sortMuseums(criteria) {
    const cardsArray = Array.from(museuCards);
    
    cardsArray.sort((a, b) => {
        const indexA = Array.from(museuCards).indexOf(a);
        const indexB = Array.from(museuCards).indexOf(b);
        const dataA = museusData[indexA];
        const dataB = museusData[indexB];
        
        switch(criteria) {
            case 'name':
                return dataA.name.localeCompare(dataB.name);
            case 'type':
                return dataA.category.localeCompare(dataB.category);
            case 'location':
                return dataA.location.localeCompare(dataB.location);
            default:
                return 0;
        }
    });
    
    // Reorganizar os cards no DOM
    cardsArray.forEach(card => {
        museusGrid.appendChild(card);
    });
}

// Event Listeners

// Busca em tempo real
searchInput.addEventListener('input', searchMuseums);

// Filtros por categoria
filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remover classe active de todos os botões
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Adicionar classe active ao botão clicado
        button.classList.add('active');
        
        // Aplicar filtro
        const category = button.getAttribute('data-filter');
        filterByCategory(category);
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
});

// // Função para limpar filtros
// function clearFilters() {
//     searchInput.value = '';
//     filterButtons.forEach(btn => btn.classList.remove('active'));
//     filterButtons[0].classList.add('active'); // Ativar "Todos"
//     sortSelect.value = 'name';
    
//     museuCards.forEach(card => {
//         card.style.display = 'block';
//     });
    
//     noResults.style.display = 'none';
// }

// // Adicionar botão de limpar filtros (opcional)
// const clearButton = document.createElement('button');
// clearButton.textContent = 'Limpar Filtros';
// clearButton.className = 'filter-btn';
// clearButton.style.background = '#dc3545';
// clearButton.style.borderColor = '#dc3545';
// clearButton.style.color = 'white';

// clearButton.addEventListener('click', clearFilters);

// // Adicionar o botão após os filtros existentes
// const filterContainer = document.querySelector('.filter-buttons');
// filterContainer.appendChild(clearButton);