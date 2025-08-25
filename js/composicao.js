// Sobre Page JavaScript

// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeBannerInteractions();
    initializeTextAnimations();
});

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
    const animatedElements = document.querySelectorAll('.sobre-text, .historia-text, .valores-text, .sobre-banner, .historia-banner, .valores-banner');
    animatedElements.forEach(el => observer.observe(el));
}

// Efeitos de scroll suave
function initializeScrollEffects() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.banner-placeholder');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Interações com banners
function initializeBannerInteractions() {
    const banners = document.querySelectorAll('.banner-image, .banner-placeholder');
    
    banners.forEach((banner, index) => {
        banner.addEventListener('click', () => {
            showBannerModal(index + 1);
        });
        
        // Adiciona efeito de hover suave para imagens SVG
        if (banner.classList.contains('banner-image')) {
            banner.addEventListener('mouseenter', () => {
                banner.style.filter = 'brightness(1.1)';
            });
            
            banner.addEventListener('mouseleave', () => {
                banner.style.filter = 'brightness(1)';
            });
        } else {
            // Mantém o comportamento original para placeholders
            banner.addEventListener('mouseenter', () => {
                banner.style.transform = 'scale(1.05) translateY(-10px)';
                banner.style.boxShadow = '0 20px 40px rgba(0, 51, 102, 0.3)';
            });
            
            banner.addEventListener('mouseleave', () => {
                banner.style.transform = 'scale(1) translateY(0)';
                banner.style.boxShadow = '0 10px 30px rgba(0, 51, 102, 0.2)';
            });
        }
    });
}

// Modal para banners
function showBannerModal(bannerNumber) {
    const modal = document.createElement('div');
    modal.className = 'banner-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h3>Banner ${bannerNumber}</h3>
            <p>Aqui você pode adicionar mais informações sobre este banner ou uma imagem maior.</p>
            <div class="modal-image-placeholder">
                <span>IMAGEM AMPLIADA ${bannerNumber}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fecha modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Animações de texto
function initializeTextAnimations() {
    const textElements = document.querySelectorAll('.sobre-text p, .historia-text p, .valores-text p');
    
    textElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.1}s`;
        
        element.addEventListener('mouseenter', () => {
            element.style.color = '#003366';
            element.style.transform = 'translateX(10px)';
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.color = '#555';
            element.style.transform = 'translateX(0)';
        });
    });
}

// Contador animado (se necessário)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Smooth scroll para links internos
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
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
}

// Adiciona estilos CSS dinâmicos para o modal
const modalStyles = `
    .banner-modal {
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
    
    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 10px;
        max-width: 600px;
        width: 90%;
        position: relative;
        animation: slideUp 0.3s ease;
    }
    
    .close-modal {
        position: absolute;
        top: 10px;
        right: 15px;
        font-size: 2rem;
        cursor: pointer;
        color: #999;
        transition: color 0.3s ease;
    }
    
    .close-modal:hover {
        color: #333;
    }
    
    .modal-image-placeholder {
        background: linear-gradient(135deg, #003366 0%, #0066cc 100%);
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        margin-top: 1rem;
        color: white;
        font-weight: bold;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    .animate-in {
        animation-play-state: running !important;
    }
`;

// Adiciona os estilos ao documento
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);

// Inicializa smooth scroll
initializeSmoothScroll();

// Efeito de typing para títulos (opcional)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Aplicar efeito de typing aos títulos principais
window.addEventListener('load', () => {
    const mainTitle = document.querySelector('.page-title');
    if (mainTitle) {
        const originalText = mainTitle.textContent;
        typeWriter(mainTitle, originalText, 150);
    }
});