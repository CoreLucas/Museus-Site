// Roteiros Page JavaScript

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    initializeAccordion();
    initializeAnimations();
    initializeScrollEffects();
});

// Inicializa o accordion
function initializeAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const content = item.querySelector('.accordion-content');
        const icon = item.querySelector('.accordion-icon');
        
        header.addEventListener('click', () => {
            toggleAccordionItem(item, content, icon);
        });
        
        // Adiciona efeito de hover
        header.addEventListener('mouseenter', () => {
            if (!item.classList.contains('active')) {
                header.style.background = '#f8f9fa';
            }
        });
        
        header.addEventListener('mouseleave', () => {
            if (!item.classList.contains('active')) {
                header.style.background = 'white';
            }
        });
    });
}

// Função para alternar item do accordion
function toggleAccordionItem(item, content, icon) {
    const isActive = item.classList.contains('active');
    
    // Fecha todos os outros itens
    document.querySelectorAll('.accordion-item').forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
            closeAccordionItem(otherItem);
        }
    });
    
    // Alterna o item atual
    if (isActive) {
        closeAccordionItem(item);
    } else {
        openAccordionItem(item);
    }
}

// Abre item do accordion
function openAccordionItem(item) {
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    const header = item.querySelector('.accordion-header h3');
    
    // Salva a posição atual da página
    const currentScrollPosition = window.pageYOffset;
    
    item.classList.add('active');
    
    // Calcula a altura do conteúdo
    const contentHeight = content.scrollHeight;
    content.style.maxHeight = contentHeight + 'px';
    
    // Anima o ícone
    icon.style.transform = 'rotate(180deg)';
    
    // Mantém a cor do título
    header.style.color = '#9f643d';
    
    // Adiciona animação suave ao conteúdo
    setTimeout(() => {
        content.style.maxHeight = 'none';
        // Restaura a posição da página para evitar movimento
        window.scrollTo(0, currentScrollPosition);
    }, 400);
}

// Fecha item do accordion
function closeAccordionItem(item) {
    const content = item.querySelector('.accordion-content');
    const icon = item.querySelector('.accordion-icon');
    const header = item.querySelector('.accordion-header h3');
    
    // Salva a posição atual da página
    const currentScrollPosition = window.pageYOffset;
    
    // Define altura atual antes de fechar
    content.style.maxHeight = content.scrollHeight + 'px';
    
    // Força reflow
    content.offsetHeight;
    
    // Fecha o conteúdo
    content.style.maxHeight = '0px';
    
    // Remove classe active após animação
    setTimeout(() => {
        item.classList.remove('active');
        // Restaura a posição da página para evitar movimento
        window.scrollTo(0, currentScrollPosition);
    }, 100);
    
    // Anima o ícone
    icon.style.transform = 'rotate(0deg)';
    
    // Mantém a cor do título
    header.style.color = '#9f643d';
}

// Inicializa animações de entrada
function initializeAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observa elementos para animação
    const animatedElements = document.querySelectorAll('.accordion-item, .link-card, .roteiros-intro');
    animatedElements.forEach(el => observer.observe(el));
}

// Efeitos de scroll
function initializeScrollEffects() {
    // Parallax suave no header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.page-header');
        
        if (header) {
            const speed = 0.5;
            header.style.transform = `translateY(${scrolled * speed}px)`;
        }
    });
    
    // Destaque do item ativo durante scroll
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    window.addEventListener('scroll', () => {
        accordionItems.forEach(item => {
            const rect = item.getBoundingClientRect();
            const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;
            
            if (isVisible && item.classList.contains('active')) {
                item.style.boxShadow = '0 15px 40px rgba(0, 102, 204, 0.3)';
            } else if (item.classList.contains('active')) {
                item.style.boxShadow = '0 10px 30px rgba(0, 51, 102, 0.2)';
            }
        });
    });
}

// Função para abrir item específico (útil para links diretos)
function openAccordionByIndex(index) {
    const items = document.querySelectorAll('.accordion-item');
    if (items[index]) {
        const item = items[index];
        if (!item.classList.contains('active')) {
            const content = item.querySelector('.accordion-content');
            const icon = item.querySelector('.accordion-icon');
            toggleAccordionItem(item, content, icon);
        }
        
        // Scroll para o item
        setTimeout(() => {
            item.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 500);
    }
}

// Função para fechar todos os itens
function closeAllAccordionItems() {
    document.querySelectorAll('.accordion-item.active').forEach(item => {
        closeAccordionItem(item);
    });
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const activeItem = document.querySelector('.accordion-item.active');
    const allItems = Array.from(document.querySelectorAll('.accordion-item'));
    
    if (e.key === 'Escape' && activeItem) {
        closeAccordionItem(activeItem);
    }
    
    if (e.key === 'ArrowDown' && activeItem) {
        e.preventDefault();
        const currentIndex = allItems.indexOf(activeItem);
        const nextIndex = (currentIndex + 1) % allItems.length;
        
        closeAccordionItem(activeItem);
        setTimeout(() => {
            openAccordionByIndex(nextIndex);
        }, 300);
    }
    
    if (e.key === 'ArrowUp' && activeItem) {
        e.preventDefault();
        const currentIndex = allItems.indexOf(activeItem);
        const prevIndex = currentIndex === 0 ? allItems.length - 1 : currentIndex - 1;
        
        closeAccordionItem(activeItem);
        setTimeout(() => {
            openAccordionByIndex(prevIndex);
        }, 300);
    }
});

// Adiciona indicadores visuais para acessibilidade
function addAccessibilityFeatures() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach((header, index) => {
        // Adiciona atributos ARIA
        header.setAttribute('role', 'button');
        header.setAttribute('aria-expanded', 'false');
        header.setAttribute('aria-controls', `accordion-content-${index}`);
        header.setAttribute('tabindex', '0');
        
        const content = header.nextElementSibling;
        content.setAttribute('id', `accordion-content-${index}`);
        content.setAttribute('role', 'region');
        
        // Navegação por teclado
        header.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                header.click();
            }
        });
        
        // Atualiza aria-expanded quando item é aberto/fechado
        const observer = new MutationObserver(() => {
            const isActive = header.parentElement.classList.contains('active');
            header.setAttribute('aria-expanded', isActive.toString());
        });
        
        observer.observe(header.parentElement, {
            attributes: true,
            attributeFilter: ['class']
        });
    });
}

// Função para compartilhar conteúdo
function shareContent(platform, itemIndex) {
    const items = [
        {
            title: "O que é o Mapas Culturais?",
            text: "Descubra o que é o Mapas Culturais - uma plataforma colaborativa para mapeamento cultural."
        },
        {
            title: "O que é um Agente Cultural?",
            text: "Entenda o papel dos agentes culturais no ecossistema da cultura."
        },
        {
            title: "Canal de Suporte",
            text: "Conheça os canais de suporte disponíveis para usuários do Mapas Culturais."
        },
        {
            title: "Como se inscrever em editais",
            text: "Aprenda o passo a passo para se inscrever em editais culturais."
        }
    ];
    
    const item = items[itemIndex];
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch(platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(item.text)}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title + ' - ' + item.text)}&url=${encodeURIComponent(url)}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${encodeURIComponent(item.title + ' - ' + item.text + ' ' + url)}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Inicializa recursos de acessibilidade
addAccessibilityFeatures();

// Função para buscar conteúdo (se necessário no futuro)
function searchContent(query) {
    const items = document.querySelectorAll('.accordion-item');
    const searchTerm = query.toLowerCase();
    
    items.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const content = item.querySelector('.content-wrapper').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            item.style.display = 'block';
            
            // Destaca o termo encontrado
            if (title.includes(searchTerm)) {
                item.classList.add('search-highlight');
            }
        } else {
            item.style.display = 'none';
        }
    });
}

// Adiciona estilos para busca (se implementada)
const searchStyles = `
    .search-highlight {
        border-left: 4px solid #0066cc !important;
    }
    
    .search-highlight .accordion-header {
        background: #f0f8ff !important;
    }
`;

// Adiciona os estilos de busca
const styleSheet = document.createElement('style');
styleSheet.textContent = searchStyles;
document.head.appendChild(styleSheet);

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Função para imprimir conteúdo específico
function printAccordionContent(index) {
    const item = document.querySelectorAll('.accordion-item')[index];
    if (item) {
        const title = item.querySelector('h3').textContent;
        const content = item.querySelector('.content-wrapper').innerHTML;
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>${title}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #003366; }
                        p { line-height: 1.6; }
                    </style>
                </head>
                <body>
                    <h1>${title}</h1>
                    ${content}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

// Adiciona tooltips informativos
function addTooltips() {
    const headers = document.querySelectorAll('.accordion-header');
    
    headers.forEach(header => {
        header.setAttribute('title', 'Clique para expandir/recolher o conteúdo');
    });
}

// Inicializa tooltips
addTooltips();

console.log('Roteiros page initialized successfully');