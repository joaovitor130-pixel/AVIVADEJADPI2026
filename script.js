document.addEventListener('DOMContentLoaded', function() {
    const WHATSAPP_NUMBER = '5584991425698'; // Seu número
    let selectedProduct = '';
    let selectedPrice = '';

    // CARROSSEL (mantido igual)
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoSlide;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        slides[index].classList.add('active');
        indicators[index].classList.add('active');
        currentSlide = index;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
    }
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });

    const carousel = document.querySelector('.hero-carousel');
    if (carousel) {
        function startAutoSlide() { autoSlide = setInterval(nextSlide, 5000); }
        function stopAutoSlide() { if (autoSlide) clearInterval(autoSlide); }
        carousel.addEventListener('mouseenter', stopAutoSlide);
        carousel.addEventListener('mouseleave', startAutoSlide);
        showSlide(0);
        startAutoSlide();
    }

    // LÓGICA DOS BOTÕES DE COMPRA
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            selectedProduct = this.dataset.product;
            selectedPrice = parseFloat(this.dataset.price).toFixed(2);
            
            console.log('Produto:', selectedProduct, 'Preço:', selectedPrice);
            
            // Atualiza campos hidden
            document.getElementById('selectedProduct').value = selectedProduct;
            document.getElementById('selectedPrice').value = selectedPrice;
            
            // ATUALIZA RESUMO VISUAL
            const productSummary = document.getElementById('productSummary');
            productSummary.innerHTML = `✅ ${selectedProduct}<br><strong>R$ ${selectedPrice}</strong>`;
            productSummary.classList.add('active');
            
            // Scroll suave
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
            
            // ✅ FEEDBACK VISUAL SEM ALTERAR BOTÃO (apenas escala e sombra)
            btn.style.transform = 'scale(0.95)';
            btn.style.boxShadow = '0 8px 25px rgba(0, 255, 136, 0.4)';
            
            setTimeout(() => {
                btn.style.transform = '';
                btn.style.boxShadow = '';
            }, 200); // Rápido e sutil
        });
    });

    // FORMULÁRIO - Lógica de Redirecionamento (WhatsApp ou Mercado Pago)
    const form = document.getElementById('orderForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Captura os valores no momento do envio
            const fullName = document.getElementById('fullName').value;
            const size = document.getElementById('size').value;
            const phone = document.getElementById('phone').value;
            const paymentMethod = document.getElementById('paymentMethod').value; // Captura o método selecionado
            
            // Validação básica
            if (!fullName || !size || !phone || !selectedProduct) {
                alert('❌ Selecione uma oferta e preencha todos os campos!');
                return;
            }

            // MAPEAMENTO DOS SEUS LINKS DO MERCADO PAGO
            const paymentLinks = {
                'Camisa Simples': 'https://mpago.la/33AT6rH',
                'Combo Camisa + Copo': 'https://mpago.la/2jyouei',
                'Combo Completo': 'https://mpago.la/2ue3BST'
            };

            // LOGICA DE REDIRECIONAMENTO
            if (paymentMethod === 'Cartão de Crédito') {
                const mpUrl = paymentLinks[selectedProduct.trim()]; // .trim() remove espaços extras
                
                if (mpUrl) {
                    window.open(mpUrl, '_blank');
                } else {
                    alert('Erro: Link de pagamento não encontrado para: ' + selectedProduct);
                }
            } else {
                // Mensagem formatada para WhatsApp (Pix, Débito ou Espécie)
                const message = `🚀 *NOVO PEDIDO - AVIVA DEJADPI 2026*\n\n` +
                    `👤 *Nome:* ${fullName}\n` +
                    `📦 *Produto:* ${selectedProduct}\n` +
                    `👕 *Tamanho:* ${size}\n` +
                    `💰 *Valor:* R$ ${selectedPrice}\n` +
                    `💳 *Pagamento:* ${paymentMethod}\n` +
                    `📱 *Telefone:* ${phone}\n\n` +
                    `✅ *Confirmação do pedido!*`;

                const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            }
            
            // Limpa o formulário após o envio
            form.reset();
            const productSummary = document.getElementById('productSummary');
            productSummary.innerHTML = '👆 Clique em uma oferta acima para selecionar';
            productSummary.classList.remove('active');
        });
    }
});