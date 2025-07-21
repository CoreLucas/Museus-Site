// Funcionalidades avançadas da página individual do museu

// Elementos DOM
const heroSlider = document.querySelector('.hero-slider');
const slides = document.querySelectorAll('.slide');
const prevBtn = document.querySelector('.prev-slide');
const nextBtn = document.querySelector('.next-slide');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const bookingModal = document.getElementById('bookingModal');
const viewer3D = document.getElementById('viewer3D');
const stars = document.querySelectorAll('.star');

// Variáveis globais
let currentSlide = 0;
let slideInterval;
let userRating = 0;

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar o Swiper imediatamente
    initializeObrasSwiper();
    console.log('Swiper inicializado');
    
    // Forçar a atualização do Swiper após a inicialização
    setTimeout(function() {
        if (window.obrasSwiper) {
            window.obrasSwiper.update();
            console.log('Swiper atualizado após inicialização');
            
            // Garantir que os botões de navegação estejam visíveis
            const nextButton = document.querySelector('.swiper-container.obras-swiper .swiper-button-next');
            const prevButton = document.querySelector('.swiper-container.obras-swiper .swiper-button-prev');
            const swiperWrapper = document.querySelector('.swiper-container.obras-swiper .swiper-wrapper');
            const swiperSlides = document.querySelectorAll('.swiper-container.obras-swiper .swiper-slide');
            
            // Garantir que o wrapper e os slides estejam visíveis
            if (swiperWrapper) {
                swiperWrapper.style.display = 'flex';
                swiperWrapper.style.opacity = '1';
                swiperWrapper.style.visibility = 'visible';
                console.log('Swiper wrapper configurado manualmente');
            }
            
            // Garantir que todos os slides estejam visíveis
            swiperSlides.forEach(slide => {
                slide.style.opacity = '1';
                slide.style.visibility = 'visible';
            });
            
            if (nextButton && prevButton) {
                nextButton.style.display = 'flex';
                prevButton.style.display = 'flex';
                nextButton.style.opacity = '1';
                prevButton.style.opacity = '1';
                nextButton.style.visibility = 'visible';
                prevButton.style.visibility = 'visible';
                console.log('Botões de navegação configurados manualmente');
            }
        }
    }, 300);
});

// Reinicializar o Swiper quando a janela for redimensionada
window.addEventListener('resize', function() {
    // Usar debounce para evitar múltiplas chamadas durante o redimensionamento
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(() => {
        console.log('Janela redimensionada, reinicializando Swiper...');
        initializeObrasSwiper();
    }, 250);
});

// Inicializar o Swiper para o carrossel de obras
function initializeObrasSwiper() {
    // Verificar se o elemento Swiper existe na página
    const swiperElement = document.querySelector('.obras-swiper');
    if (!swiperElement) {
        console.error('Elemento Swiper não encontrado');
        return;
    }
    
    // Garantir que o wrapper e os slides estejam visíveis antes da inicialização
    const swiperWrapper = document.querySelector('.swiper-container.obras-swiper .swiper-wrapper');
    const swiperSlides = document.querySelectorAll('.swiper-container.obras-swiper .swiper-slide');
    
    if (swiperWrapper) {
        swiperWrapper.style.display = 'flex';
        swiperWrapper.style.opacity = '1';
        swiperWrapper.style.visibility = 'visible';
    }
    
    swiperSlides.forEach(slide => {
        slide.style.opacity = '1';
        slide.style.visibility = 'visible';
    });
    
    // Destruir qualquer instância anterior do Swiper
    if (window.obrasSwiper) {
        window.obrasSwiper.destroy(true, true);
    }
    
    // Inicializar o Swiper com configurações para mostrar apenas um slide por vez
    window.obrasSwiper = new Swiper('.swiper-container.obras-swiper', {
        // Configurações básicas
        slidesPerView: 1,  // Mostra apenas um slide por vez (cada slide contém 3 obras)
        spaceBetween: 30,
        loop: true,
        speed: 600,  // Velocidade da transição em ms
        effect: 'slide',  // Alterado para efeito slide para melhor compatibilidade
        
        // Melhorar a visibilidade dos slides
        watchSlidesProgress: true,
        watchSlidesVisibility: true,
        observer: true,       // Observar mudanças nos elementos filhos
        observeParents: true, // Observar mudanças nos elementos pais
        
        // Adicionar paginação
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        
        // Adicionar navegação
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            init: function() {
                console.log('Swiper inicializado com sucesso');
                // Forçar a visibilidade após a inicialização
                setTimeout(() => {
                    const wrapper = document.querySelector('.swiper-container.obras-swiper .swiper-wrapper');
                    if (wrapper) {
                        wrapper.style.display = 'flex';
                        wrapper.style.opacity = '1';
                        wrapper.style.visibility = 'visible';
                    }
                }, 100);
            }
        }
    });
    
    console.log('Swiper inicializado com configurações para mostrar apenas um slide por vez');
}

// Slider do Hero
function initializeSlider() {
    if (slides.length === 0) return;
    
    // Auto-play
    slideInterval = setInterval(nextSlide, 5000);
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Pause on hover
    heroSlider.addEventListener('mouseenter', () => clearInterval(slideInterval));
    heroSlider.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });
}

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

function prevSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    slides[currentSlide].classList.add('active');
}

// Sistema de Abas
function initializeTabs() {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            
            // Remove active class from all tabs and panels
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding panel
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// Filtros da Galeria
function initializeFilters() {
    const periodFilter = document.getElementById('periodFilter');
    const typeFilter = document.getElementById('typeFilter');
    const artistFilter = document.getElementById('artistFilter');
    const artworkCards = document.querySelectorAll('.artwork-card');
    
    function applyFilters() {
        const periodValue = periodFilter.value;
        const typeValue = typeFilter.value;
        const artistValue = artistFilter.value.toLowerCase();
        
        artworkCards.forEach(card => {
            const cardPeriod = card.getAttribute('data-period');
            const cardType = card.getAttribute('data-type');
            const cardHighlight = card.getAttribute('data-highlight');
            
            const periodMatch = periodValue === 'all' || cardPeriod === periodValue;
            const typeMatch = typeValue === 'all' || cardType === typeValue;
            const highlightMatch = highlightValue === 'all' || cardHighlight === highlightValue;
            
            if (periodMatch && typeMatch && highlightMatch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Mostrar mensagem se não há resultados
        if (visibleCount === 0) {
            worksGrid.innerHTML += '<div class="no-works">Nenhuma obra encontrada com os filtros selecionados.</div>';
        } else {
            const noWorksMsg = worksGrid.querySelector('.no-works');
            if (noWorksMsg) noWorksMsg.remove();
        }
    }
    
    periodFilter.addEventListener('change', applyFilters);
    typeFilter.addEventListener('change', applyFilters);
    highlightFilter.addEventListener('change', applyFilters);
}

// Mapa e Localização
function initializeMap() {
    const mapOptions = {
        center: { lat: -7.1195, lng: -34.8450 }, // João Pessoa coordinates
        zoom: 15,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            }
        ]
    };
    
    const map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);
    
    // Marcador do museu
    const museumMarker = new google.maps.Marker({
        position: { lat: -7.1195, lng: -34.8450 },
        map: map,
        title: 'Museu UFPB',
        icon: {
            url: 'museum-icon.png',
            scaledSize: new google.maps.Size(40, 40)
        }
    });
}

// Gráfico do Acervo
function initializeChart() {
    const ctx = document.getElementById('acervoChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pinturas', 'Esculturas', 'Fotografias', 'Instalações'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#003366', '#ffd700', '#ff6b6b', '#4ecdc4']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Sistema de Avaliação
function initializeRating() {
    const stars = document.querySelectorAll('.star-rating i');
    
    stars.forEach((star, index) => {
        star.addEventListener('click', () => {
            userRating = index + 1;
            updateStarDisplay();
        });
        
        star.addEventListener('mouseenter', () => {
            highlightStars(index + 1);
        });
    });
    
    document.querySelector('.star-rating').addEventListener('mouseleave', updateStarDisplay);
}

function updateStarDisplay() {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        star.classList.toggle('active', index < userRating);
    });
}

function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating i');
    stars.forEach((star, index) => {
        star.classList.toggle('hover', index < rating);
    });
}

// Busca de Obras
function initializeSearch() {
    const searchInput = document.getElementById('searchWorks');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const workCards = document.querySelectorAll('.work-card');
        
        workCards.forEach(card => {
            const title = card.querySelector('h4').textContent.toLowerCase();
            const artist = card.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || artist.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Modais e Interações
function openBookingModal() {
    const modal = document.getElementById('bookingModal');
    modal.style.display = 'block';
    
    // Prevenir scroll no body quando modal estiver aberta
    document.body.style.overflow = 'hidden';
    
    // Prevenir scroll com eventos adicionais
    document.addEventListener('wheel', preventScroll, { passive: false });
    document.addEventListener('touchmove', preventScroll, { passive: false });
    document.addEventListener('keydown', preventScrollKeys, { passive: false });
    
    // Inicializar os campos condicionais quando o modal for aberto
    initConditionalFields();
}

// Função para prevenir scroll
function preventScroll(e) {
    const modal = document.getElementById('bookingModal');
    if (modal && modal.style.display === 'block') {
        // Permitir scroll apenas dentro da modal
        const modalBody = document.querySelector('.modal-body');
        if (modalBody && modalBody.contains(e.target)) {
            return; // Permitir scroll dentro da modal
        }
        e.preventDefault();
    }
}

// Função para prevenir scroll com teclas
function preventScrollKeys(e) {
    const modal = document.getElementById('bookingModal');
    if (modal && modal.style.display === 'block') {
        const scrollKeys = [32, 33, 34, 35, 36, 37, 38, 39, 40]; // Space, Page Up/Down, End, Home, Arrow keys
        const modalBody = document.querySelector('.modal-body');
        
        // Permitir navegação por teclado apenas dentro da modal
        if (modalBody && modalBody.contains(document.activeElement)) {
            return; // Permitir navegação dentro da modal
        }
        
        if (scrollKeys.includes(e.keyCode)) {
            e.preventDefault();
        }
    }
}

// Inicializar campos condicionais do formulário de agendamento
function initConditionalFields() {
    const groupTypeSelect = document.getElementById('groupType');
    const disabilityTypeSelect = document.getElementById('disabilityType');
    
    // Campos condicionais para tipo de grupo
    const institutionField = document.getElementById('institutionField');
    const cityField = document.getElementById('cityField');
    const neighborhoodField = document.getElementById('neighborhoodField');
    
    // Campo condicional para acessibilidade
    const accessibilityField = document.getElementById('accessibilityField');
    
    // Armazenar valores dos campos para preservá-los quando ocultos
    const fieldValues = {
        institution: '',
        originCity: '',
        neighborhood: '',
        accessibilityNotes: ''
    };
    
    // Função para mostrar/ocultar campos com base no tipo de grupo
    function updateGroupFields() {
        const groupType = groupTypeSelect.value;
        
        // Resetar todos os campos para ocultos
        institutionField.classList.remove('visible');
        institutionField.classList.add('hidden');
        institutionField.setAttribute('aria-hidden', 'true');
        
        cityField.classList.remove('visible');
        cityField.classList.add('hidden');
        cityField.setAttribute('aria-hidden', 'true');
        
        neighborhoodField.classList.remove('visible');
        neighborhoodField.classList.add('hidden');
        neighborhoodField.setAttribute('aria-hidden', 'true');
        
        // Salvar valores atuais
        if (document.getElementById('institution').value) {
            fieldValues.institution = document.getElementById('institution').value;
        }
        if (document.getElementById('originCity').value) {
            fieldValues.originCity = document.getElementById('originCity').value;
        }
        if (document.getElementById('neighborhood').value) {
            fieldValues.neighborhood = document.getElementById('neighborhood').value;
        }
        
        // Mostrar campos apropriados com base no tipo de grupo
        switch(groupType) {
            case 'academico':
                // Mostrar apenas instituição e cidade (sem bairro)
                institutionField.classList.remove('hidden');
                institutionField.classList.add('visible');
                institutionField.setAttribute('aria-hidden', 'false');
                
                cityField.classList.remove('hidden');
                cityField.classList.add('visible');
                cityField.setAttribute('aria-hidden', 'false');
                break;
                
            case 'escolar':
                // Mostrar instituição, cidade e bairro
                institutionField.classList.remove('hidden');
                institutionField.classList.add('visible');
                institutionField.setAttribute('aria-hidden', 'false');
                
                cityField.classList.remove('hidden');
                cityField.classList.add('visible');
                cityField.setAttribute('aria-hidden', 'false');
                
                neighborhoodField.classList.remove('hidden');
                neighborhoodField.classList.add('visible');
                neighborhoodField.setAttribute('aria-hidden', 'false');
                break;
                
            case 'familiar':
                // Mostrar cidade e bairro
                cityField.classList.remove('hidden');
                cityField.classList.add('visible');
                cityField.setAttribute('aria-hidden', 'false');
                
                neighborhoodField.classList.remove('hidden');
                neighborhoodField.classList.add('visible');
                neighborhoodField.setAttribute('aria-hidden', 'false');
                break;
                
            case 'turistico':
                // Mostrar apenas cidade
                cityField.classList.remove('hidden');
                cityField.classList.add('visible');
                cityField.setAttribute('aria-hidden', 'false');
                break;
        }
        
        // Restaurar valores salvos
        document.getElementById('institution').value = fieldValues.institution;
        document.getElementById('originCity').value = fieldValues.originCity;
        document.getElementById('neighborhood').value = fieldValues.neighborhood;
        
        // Atualizar validação
        updateFieldValidation();
        
        // Anunciar mudanças para leitores de tela
        const conditionalGroupFields = document.getElementById('conditionalGroupFields');
        conditionalGroupFields.setAttribute('aria-live', 'polite');
        setTimeout(() => {
            conditionalGroupFields.setAttribute('aria-live', 'off');
        }, 1000);
    }
    
    // Função para mostrar/ocultar campo de acessibilidade
    function updateAccessibilityField() {
        const disabilityType = disabilityTypeSelect.value;
        const accessibilityNotes = document.getElementById('accessibilityNotes');
        
        // Salvar valor atual
        if (accessibilityNotes.value) {
            fieldValues.accessibilityNotes = accessibilityNotes.value;
        }
        
        // Mostrar campo de observação apenas se 'Outra' for selecionada
        if (disabilityType === 'outra') {
            accessibilityField.classList.remove('hidden');
            accessibilityField.classList.add('visible');
            accessibilityField.setAttribute('aria-hidden', 'false');
            // Campo de acessibilidade é opcional mesmo quando visível
            accessibilityNotes.removeAttribute('required');
            accessibilityNotes.setAttribute('aria-required', 'false');
        } else {
            accessibilityField.classList.remove('visible');
            accessibilityField.classList.add('hidden');
            accessibilityField.setAttribute('aria-hidden', 'true');
            accessibilityNotes.removeAttribute('required');
            accessibilityNotes.setAttribute('aria-required', 'false');
        }
        
        // Restaurar valor salvo
        accessibilityNotes.value = fieldValues.accessibilityNotes;
        
        // Anunciar mudanças para leitores de tela
        accessibilityField.setAttribute('aria-live', 'polite');
        setTimeout(() => {
            accessibilityField.setAttribute('aria-live', 'off');
        }, 1000);
    }
    
    // Função para atualizar a validação dos campos condicionais
    function updateFieldValidation() {
        // Instituição
        const institutionInput = document.getElementById('institution');
        if (!institutionField.classList.contains('hidden')) {
            institutionInput.setAttribute('required', 'required');
            institutionInput.setAttribute('aria-required', 'true');
        } else {
            institutionInput.removeAttribute('required');
            institutionInput.setAttribute('aria-required', 'false');
        }
        
        // Cidade
        const originCityInput = document.getElementById('originCity');
        if (!cityField.classList.contains('hidden')) {
            originCityInput.setAttribute('required', 'required');
            originCityInput.setAttribute('aria-required', 'true');
        } else {
            originCityInput.removeAttribute('required');
            originCityInput.setAttribute('aria-required', 'false');
        }
        
        // Bairro
        const neighborhoodInput = document.getElementById('neighborhood');
        if (!neighborhoodField.classList.contains('hidden')) {
            neighborhoodInput.setAttribute('required', 'required');
            neighborhoodInput.setAttribute('aria-required', 'true');
        } else {
            neighborhoodInput.removeAttribute('required');
            neighborhoodInput.setAttribute('aria-required', 'false');
        }
    }
    
    // Adicionar event listeners
    groupTypeSelect.addEventListener('change', updateGroupFields);
    disabilityTypeSelect.addEventListener('change', updateAccessibilityField);
    
    // Inicializar campos na abertura do modal
    updateGroupFields();
    updateAccessibilityField();
    
    // Adicionar validação ao formulário
    const form = document.getElementById('visitRequestForm');
    
    // Remover mensagens de erro quando o usuário começa a digitar
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.classList.remove('invalid');
            const errorMsg = this.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
    });
    
    form.addEventListener('submit', function(event) {
        // Remover todas as mensagens de erro existentes
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
        
        // Remover classe 'invalid' de todos os campos
        allInputs.forEach(input => input.classList.remove('invalid'));
        
        // Verificar se todos os campos visíveis e obrigatórios estão preenchidos
        let isValid = true;
        
        // Função para adicionar mensagem de erro
        function addErrorMessage(element, message) {
            element.classList.add('invalid');
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = message;
            element.parentNode.insertBefore(errorMsg, element.nextSibling);
        }
        
        // Verificar campos condicionais do tipo de grupo
        if (!institutionField.classList.contains('hidden') && !document.getElementById('institution').value) {
            isValid = false;
            addErrorMessage(document.getElementById('institution'), 'Este campo é obrigatório');
        }
        
        if (!cityField.classList.contains('hidden') && !document.getElementById('originCity').value) {
            isValid = false;
            addErrorMessage(document.getElementById('originCity'), 'Este campo é obrigatório');
        }
        
        if (!neighborhoodField.classList.contains('hidden') && !document.getElementById('neighborhood').value) {
            isValid = false;
            addErrorMessage(document.getElementById('neighborhood'), 'Este campo é obrigatório');
        }
        
        // Campo de acessibilidade é opcional mesmo quando visível
        // Removido a validação obrigatória
        
        // Verificar campos obrigatórios padrão
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                addErrorMessage(field, 'Este campo é obrigatório');
            }
        });
        
        // Validação específica para e-mail
        const emailField = document.getElementById('responsibleEmail');
        if (emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
            isValid = false;
            addErrorMessage(emailField, 'Por favor, insira um e-mail válido');
        }
        
        // Validação específica para telefone
        const phoneField = document.getElementById('responsiblePhone');
        if (phoneField.value && !/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(phoneField.value)) {
            // Não bloquear o envio por formato de telefone, apenas sugerir
            addErrorMessage(phoneField, 'Formato sugerido: (00) 00000-0000');
        }
        
        if (!isValid) {
            event.preventDefault();
            // Rolar até o primeiro campo com erro
            const firstError = form.querySelector('.invalid');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });
    
    // Formatar telefone automaticamente
    const phoneInput = document.getElementById('responsiblePhone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 0) {
            value = '(' + value;
            if (value.length > 3) {
                value = value.substring(0, 3) + ') ' + value.substring(3);
            }
            if (value.length > 10) {
                value = value.substring(0, 10) + '-' + value.substring(10);
            }
            if (value.length > 15) {
                value = value.substring(0, 15);
            }
        }
        e.target.value = value;
    });
}

function startVirtualTour() {
    // Integração com tour 360°
    window.open('virtual-tour.html', '_blank');
}

function view3D(workId) {
    const modal = document.getElementById('viewer3D');
    modal.style.display = 'block';
    
    // Inicializar Three.js viewer
    init3DViewer(workId);
}

function init3DViewer(workId) {
    const container = document.getElementById('threejs-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);
    
    // Adicionar modelo 3D baseado no workId
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
    
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();
}

// Compartilhamento Social
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Visitei este incrível museu da UFPB!');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
}

function shareOnWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Confira este museu da UFPB!');
    window.open(`https://wa.me/?text=${text} ${url}`, '_blank');
}

// Quiz Educativo
function startQuiz() {
    // Implementar quiz interativo
    alert('Quiz em desenvolvimento!');
}

// Funcionalidades melhoradas do modal
function initModalEnhancements() {
    const modal = document.getElementById('bookingModal');
    const modalBody = document.querySelector('.modal-body');
    const modalClose = document.querySelector('.modal-close');
    const cancelBtn = document.getElementById('cancelBooking');
    const form = document.getElementById('visitRequestForm');
    
    if (!modal || !form) return;
    
    // Contador de progresso
    function updateProgressCounter() {
        const requiredFields = form.querySelectorAll('[required]');
        const conditionalRequiredFields = getConditionalRequiredFields();
        
        // Criar um Set para evitar duplicatas
        const allRequiredFieldsSet = new Set();
        
        // Adicionar campos obrigatórios padrão
        requiredFields.forEach(field => {
            allRequiredFieldsSet.add(field);
        });
        
        // Adicionar campos condicionais obrigatórios (evitando duplicatas)
        conditionalRequiredFields.forEach(field => {
            allRequiredFieldsSet.add(field);
        });
        
        // Converter Set de volta para array
        const allRequiredFields = Array.from(allRequiredFieldsSet);
        
        let filledCount = 0;
        allRequiredFields.forEach(field => {
            if (field && field.value && field.value.trim() !== '') {
                filledCount++;
            }
        });
        
        const filledElement = document.getElementById('filledFields');
        const totalElement = document.getElementById('totalFields');
        if (filledElement && totalElement) {
            filledElement.textContent = filledCount;
            totalElement.textContent = allRequiredFields.length;
        }
    }
    
    // Obter campos condicionais obrigatórios
    function getConditionalRequiredFields() {
        const conditionalFields = [];
        
        // Campos do tipo de grupo
        const institutionField = document.getElementById('institutionField');
        const cityField = document.getElementById('cityField');
        const neighborhoodField = document.getElementById('neighborhoodField');
        
        if (institutionField && !institutionField.classList.contains('hidden')) {
            conditionalFields.push(document.getElementById('institution'));
        }
        if (cityField && !cityField.classList.contains('hidden')) {
            conditionalFields.push(document.getElementById('originCity'));
        }
        if (neighborhoodField && !neighborhoodField.classList.contains('hidden')) {
            conditionalFields.push(document.getElementById('neighborhood'));
        }
        
        return conditionalFields.filter(field => field !== null);
    }
    
    // Marcar campos obrigatórios visualmente
    function markRequiredFields() {
        const requiredFields = form.querySelectorAll('[required]');
        const conditionalRequiredFields = getConditionalRequiredFields();
        
        // Limpar marcações anteriores
        form.querySelectorAll('label').forEach(label => {
            label.removeAttribute('data-required');
        });
        
        // Marcar campos obrigatórios
        [...requiredFields, ...conditionalRequiredFields].forEach(field => {
            const label = form.querySelector(`label[for="${field.id}"]`);
            if (label) {
                label.setAttribute('data-required', 'true');
            }
        });
    }
    
    // Função removida - indicadores de scroll foram removidos para corrigir barras cinzas indesejadas
    
    // Event listeners para o contador de progresso
    form.addEventListener('input', updateProgressCounter);
    form.addEventListener('change', () => {
        updateProgressCounter();
        markRequiredFields();
    });
    
    // Event listeners para detecção de scroll removidos
    
    // Fechar modal
    function closeModal() {
        modal.style.display = 'none';
        
        // Restaurar scroll no body
        document.body.style.overflow = '';
        
        // Remover event listeners de prevenção de scroll
        document.removeEventListener('wheel', preventScroll);
        document.removeEventListener('touchmove', preventScroll);
        document.removeEventListener('keydown', preventScrollKeys);
        
        form.reset();
        // Limpar campos condicionais
        document.querySelectorAll('.conditional-fields .form-group').forEach(group => {
            group.classList.add('hidden');
            group.classList.remove('visible');
            group.setAttribute('aria-hidden', 'true');
        });
        updateProgressCounter();
        markRequiredFields();
    }
    
    // Event listeners para fechar modal
    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
    }
    
    // Fechar modal clicando fora
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Atualizar contador inicial
    setTimeout(() => {
        updateProgressCounter();
        markRequiredFields();
    }, 100);
}

// Inicializar melhorias do modal quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initModalEnhancements();
});

// Fechar modais (mantendo compatibilidade)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('close') || e.target.classList.contains('modal-close')) {
        e.target.closest('.modal').style.display = 'none';
    }
});