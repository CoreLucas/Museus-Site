// Configuração corrigida do Swiper
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando Swipers...');
    
    // Aguardar um pouco para garantir que tudo esteja carregado
    setTimeout(() => {
        initializeAllSwipers();
    }, 1000);
});

function initializeAllSwipers() {
    // Destruir instâncias anteriores
    if (window.obrasSwiper) {
        window.obrasSwiper.destroy(true, true);
    }
    if (window.equipeSwiper) {
        window.equipeSwiper.destroy(true, true);
    }
    
    // Configurar Swiper para Acervo em Destaque
    const obrasContainer = document.querySelector('.swiper-container.obras-swiper');
    if (obrasContainer) {
        console.log('✅ Inicializando Swiper de Obras...');
        
        window.obrasSwiper = new Swiper('.swiper-container.obras-swiper', {
            // Configurações básicas
            slidesPerView: 2,  // Alterado de 3 para 2 cards
            spaceBetween: 30,
            loop: false,
            speed: 600,
            slidesPerGroup: 1, // Usar 1 para evitar bugs, customizar depois
            
            // SEM AUTOPLAY - removido conforme solicitado
            
            // Navegação customizada será adicionada depois
            navigation: false, // Desabilitar navegação padrão
            
            // Paginação
            pagination: {
                el: '.swiper-container.obras-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Responsividade
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesPerGroup: 1,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 2,  // Mantém 2 cards em desktop
                    spaceBetween: 30,
                    slidesPerGroup: 1,
                }
            },
            
            // Callbacks
            on: {
                init: function() {
                    console.log('✅ Swiper de Obras inicializado!');
                    console.log('Total de slides:', this.slides.length);
                    console.log('Slides visíveis:', this.params.slidesPerView);
                    console.log('Navegação customizada: 2 cards por vez');
                },
                slideChange: function() {
                    console.log('📍 Slide atual:', this.activeIndex);
                },
                reachEnd: function() {
                    console.log('🔚 Chegou ao final do swiper');
                }
            }
        });
        
        // Verificar se foi inicializado corretamente
        if (window.obrasSwiper) {
            console.log('✅ Swiper de Obras criado com sucesso');
        } else {
            console.error('❌ Falha ao criar Swiper de Obras');
        }
    } else {
        console.error('❌ Container .swiper-container.obras-swiper não encontrado');
    }
    
    // Configurar Swiper para Equipe Técnica
    const equipeContainer = document.querySelector('.swiper-container.equipe-swiper');
    if (equipeContainer) {
        console.log('✅ Inicializando Swiper de Equipe...');
        
        window.equipeSwiper = new Swiper('.swiper-container.equipe-swiper', {
            // Configurações básicas
            slidesPerView: 2,  // Alterado de 3 para 2 cards
            spaceBetween: 30,
            loop: false,
            speed: 600,
            slidesPerGroup: 1, // Usar 1 para evitar bugs, customizar depois
            
            // SEM AUTOPLAY - removido conforme solicitado
            
            // Navegação customizada será adicionada depois
            navigation: false, // Desabilitar navegação padrão
            
            // Paginação
            pagination: {
                el: '.swiper-container.equipe-swiper .swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            
            // Responsividade
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                    slidesPerGroup: 1,
                },
                768: {
                    slidesPerView: 2,
                    spaceBetween: 25,
                    slidesPerGroup: 1,
                },
                1024: {
                    slidesPerView: 2,  // Mantém 2 cards em desktop
                    spaceBetween: 30,
                    slidesPerGroup: 1,
                }
            },
            
            // Callbacks
            on: {
                init: function() {
                    console.log('✅ Swiper de Equipe inicializado!');
                    console.log('Total de slides:', this.slides.length);
                    console.log('Slides visíveis:', this.params.slidesPerView);
                    console.log('Navegação customizada: 2 cards por vez');
                },
                slideChange: function() {
                    console.log('👥 Slide atual da equipe:', this.activeIndex);
                },
                reachEnd: function() {
                    console.log('🔚 Chegou ao final do swiper de equipe');
                }
            }
        });
        
        // Verificar se foi inicializado corretamente
        if (window.equipeSwiper) {
            console.log('✅ Swiper de Equipe criado com sucesso');
        } else {
            console.error('❌ Falha ao criar Swiper de Equipe');
        }
    } else {
        console.error('❌ Container .swiper-container.equipe-swiper não encontrado');
    }
    
    // Adicionar navegação customizada
    setupCustomNavigation();
    
    // Log final
    setTimeout(() => {
        console.log('=== STATUS FINAL ===');
        console.log('Obras Swiper:', window.obrasSwiper ? '✅ Ativo' : '❌ Inativo');
        console.log('Equipe Swiper:', window.equipeSwiper ? '✅ Ativo' : '❌ Inativo');
        
        // Testar botões manualmente
        testNavigationButtons();
    }, 500);
}

// Função para configurar navegação customizada
function setupCustomNavigation() {
    // Navegação customizada para Obras
    const obrasNext = document.querySelector('.swiper-container.obras-swiper .swiper-button-next');
    const obrasPrev = document.querySelector('.swiper-container.obras-swiper .swiper-button-prev');
    
    if (obrasNext && obrasPrev && window.obrasSwiper) {
        obrasNext.addEventListener('click', function() {
            console.log('🔄 Next customizado - Obras');
            const currentIndex = window.obrasSwiper.activeIndex;
            const slidesPerView = window.obrasSwiper.params.slidesPerView;
            const totalSlides = window.obrasSwiper.slides.length;
            
            // Calcular próximo índice (mover 1 posição para mostrar 2 novos cards)
            let nextIndex = currentIndex + 1; // Mover 1 posição para mostrar 2 novos
            
            // Verificar se não ultrapassa o final
            if (nextIndex >= totalSlides) {
                nextIndex = totalSlides - slidesPerView;
            }
            
            console.log(`Movendo de ${currentIndex} para ${nextIndex} (mostrando 2 novos cards)`);
            window.obrasSwiper.slideTo(nextIndex);
        });
        
        obrasPrev.addEventListener('click', function() {
            console.log('🔄 Prev customizado - Obras');
            const currentIndex = window.obrasSwiper.activeIndex;
            
            // Calcular índice anterior (mover 1 posição para trás)
            let prevIndex = currentIndex - 1; // Mover 1 posição para trás
            
            // Verificar se não vai antes do início
            if (prevIndex < 0) {
                prevIndex = 0;
            }
            
            console.log(`Movendo de ${currentIndex} para ${prevIndex} (mostrando 2 novos cards)`);
            window.obrasSwiper.slideTo(prevIndex);
        });
    }
    
    // Navegação customizada para Equipe
    const equipeNext = document.querySelector('.swiper-container.equipe-swiper .swiper-button-next');
    const equipePrev = document.querySelector('.swiper-container.equipe-swiper .swiper-button-prev');
    
    if (equipeNext && equipePrev && window.equipeSwiper) {
        equipeNext.addEventListener('click', function() {
            console.log('🔄 Next customizado - Equipe');
            const currentIndex = window.equipeSwiper.activeIndex;
            const slidesPerView = window.equipeSwiper.params.slidesPerView;
            const totalSlides = window.equipeSwiper.slides.length;
            
            // Calcular próximo índice (mover 1 posição para mostrar 2 novos cards)
            let nextIndex = currentIndex + 1; // Mover 1 posição para mostrar 2 novos
            
            // Verificar se não ultrapassa o final
            if (nextIndex >= totalSlides) {
                nextIndex = totalSlides - slidesPerView;
            }
            
            console.log(`Movendo de ${currentIndex} para ${nextIndex} (mostrando 2 novos cards)`);
            window.equipeSwiper.slideTo(nextIndex);
        });
        
        equipePrev.addEventListener('click', function() {
            console.log('🔄 Prev customizado - Equipe');
            const currentIndex = window.equipeSwiper.activeIndex;
            
            // Calcular índice anterior (mover 1 posição para trás)
            let prevIndex = currentIndex - 1; // Mover 1 posição para trás
            
            // Verificar se não vai antes do início
            if (prevIndex < 0) {
                prevIndex = 0;
            }
            
            console.log(`Movendo de ${currentIndex} para ${prevIndex} (mostrando 2 novos cards)`);
            window.equipeSwiper.slideTo(prevIndex);
        });
    }
}

function testNavigationButtons() {
    console.log('🧪 Testando botões de navegação...');
    
    // Testar botões do Swiper de Obras
    const obrasNext = document.querySelector('.swiper-container.obras-swiper .swiper-button-next');
    const obrasPrev = document.querySelector('.swiper-container.obras-swiper .swiper-button-prev');
    
    if (obrasNext && obrasPrev) {
        console.log('✅ Botões de obras encontrados');
        
        // Adicionar event listeners manuais como backup
        obrasNext.addEventListener('click', function() {
            console.log('🔄 Clique manual no botão Next de Obras');
            if (window.obrasSwiper) {
                window.obrasSwiper.slideNext();
            }
        });
        
        obrasPrev.addEventListener('click', function() {
            console.log('🔄 Clique manual no botão Prev de Obras');
            if (window.obrasSwiper) {
                window.obrasSwiper.slidePrev();
            }
        });
    } else {
        console.error('❌ Botões de obras não encontrados');
    }
    
    // Testar botões do Swiper de Equipe
    const equipeNext = document.querySelector('.swiper-container.equipe-swiper .swiper-button-next');
    const equipePrev = document.querySelector('.swiper-container.equipe-swiper .swiper-button-prev');
    
    if (equipeNext && equipePrev) {
        console.log('✅ Botões de equipe encontrados');
        
        // Adicionar event listeners manuais como backup
        equipeNext.addEventListener('click', function() {
            console.log('🔄 Clique manual no botão Next de Equipe');
            if (window.equipeSwiper) {
                window.equipeSwiper.slideNext();
            }
        });
        
        equipePrev.addEventListener('click', function() {
            console.log('🔄 Clique manual no botão Prev de Equipe');
            if (window.equipeSwiper) {
                window.equipeSwiper.slidePrev();
            }
        });
    } else {
        console.error('❌ Botões de equipe não encontrados');
    }
}

// Função para reinicializar em caso de problemas
window.reinitSwipers = function() {
    console.log('🔄 Reinicializando Swipers...');
    initializeAllSwipers();
};

// Função para debug
window.debugSwipers = function() {
    console.log('=== DEBUG SWIPERS ===');
    console.log('Obras Swiper:', window.obrasSwiper);
    console.log('Equipe Swiper:', window.equipeSwiper);
    
    if (window.obrasSwiper) {
        console.log('Obras - Slide atual:', window.obrasSwiper.activeIndex);
        console.log('Obras - Total slides:', window.obrasSwiper.slides.length);
    }
    
    if (window.equipeSwiper) {
        console.log('Equipe - Slide atual:', window.equipeSwiper.activeIndex);
        console.log('Equipe - Total slides:', window.equipeSwiper.slides.length);
    }
    
    console.log('Containers encontrados:');
    console.log('- Obras:', document.querySelector('.swiper-container.obras-swiper'));
    console.log('- Equipe:', document.querySelector('.swiper-container.equipe-swiper'));
    
    console.log('Botões encontrados:');
    console.log('- Obras Next:', document.querySelector('.swiper-container.obras-swiper .swiper-button-next'));
    console.log('- Obras Prev:', document.querySelector('.swiper-container.obras-swiper .swiper-button-prev'));
    console.log('- Equipe Next:', document.querySelector('.swiper-container.equipe-swiper .swiper-button-next'));
    console.log('- Equipe Prev:', document.querySelector('.swiper-container.equipe-swiper .swiper-button-prev'));
};

// Reinicializar no resize
window.addEventListener('resize', function() {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        console.log('📱 Redimensionamento detectado, reinicializando...');
        initializeAllSwipers();
    }, 300);
});