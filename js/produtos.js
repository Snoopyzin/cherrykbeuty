/* =========================================================
   Cherry Kbeuty — CATÁLOGO
   Edite aqui preços, nomes, marcas e fotos. O site se atualiza sozinho.
   As descrições completas ficam em js/descricoes.js (mesmo "id").

   preco        preço normal por unidade (pedidos com menos de 10 peças)
                null = "Preço em breve" (o produto aparece, mas ainda não entra no pedido)
   preco30      preço de ATACADO por unidade (pedido com 10 peças ou mais, mix livre).
                Igual ao preco = "mesmo preço em qualquer volume"
   precoAntigo  opcional — se preenchido, o produto aparece em "Promoções" com o preço riscado
   selo         opcional — etiqueta no card (ex.: 'Lançamento')
   categoria    'skincare' ou 'haircare'
   imagem       caminho da foto. Deixe '' para usar a ilustração automática da embalagem.
   arte         ilustração usada enquanto não há foto:
                forma = spray | pote | bisnaga | conta-gotas | frasco | pump | caneta | caixa
   ========================================================= */

window.CHERRY_CONFIG = {
  pecasMinimas: 1,   // pedido mínimo (1 = sem mínimo)
  pecasFaixa2: 10,   // a partir daqui (mix livre) o pedido inteiro passa para o preço de atacado
  valorMinimo: 0,    // opcional: valor mínimo em reais além das peças (0 = desligado)
  // Número que recebe os pedidos e as consultas do catálogo, só dígitos com DDI + DDD (ex.: '5562999998888').
  whatsapp: '5562982667385',
  // Atacado Express: pedido a partir deste valor em reais (não depende do número de peças).
  // Só o Atacado Express tem entrega em até 3 dias úteis.
  expressMinimo: 2300,
  // Mensagem que já vem escrita quando o cliente toca no botão "Atacado Express" do início da página
  mensagemConsulta: 'Olá! Gostaria de saber como funciona o Atacado Express da Cherry Kbeuty (compras a partir de R$ 2.300).',
};

window.CHERRY_MARCAS = [
  { id: 'celimax',          nome: 'Celimax',          logo: 'celimax',   estilo: 'sans',      cor: '#1b1b1b' },
  { id: 'numbuzin',         nome: 'Numbuzin',         logo: 'numbuzin',  estilo: 'sans-leve', cor: '#ffffff', fundo: '#8b52c4' },
  { id: 'medicube',         nome: 'Medicube',         logo: 'medicube',  estilo: 'sans',      cor: '#111111' },
  { id: 'dr-althea',        nome: 'Dr. Althea',       logo: 'Dr.Althea', estilo: 'script',    cor: '#333333' },
  { id: 'lilyeve',          nome: 'Lilyeve',          logo: 'lilyeve',   estilo: 'sans-leve', cor: '#f26b21' },
  { id: 'skin1004',         nome: 'SKIN1004',         logo: 'SKIN1004',  estilo: 'espacado',  cor: '#222222', sub: 'Centella' },
  { id: 'beauty-of-joseon', nome: 'Beauty of Joseon', logo: '조선미녀',   estilo: 'coreano',   cor: '#111111' },
  { id: 'fino',             nome: 'Fino',             logo: 'fino',      estilo: 'serif',     cor: '#d31f4c' },
  { id: 'k-secret',         nome: 'K-Secret',         logo: 'K-SECRET',  estilo: 'espacado',  cor: '#1d1d1d' },
  { id: 'biore',            nome: 'Bioré',            logo: 'Bioré',     estilo: 'serif',     cor: '#1f3f9a' },
  { id: 'rhode',            nome: 'rhode',            logo: 'rhode',     estilo: 'sans',      cor: '#7a1f3d' },
  { id: 'cosrx', nome: 'COSRX', logo: 'COSRX', estilo: 'espacado', cor: '#1d1d1d' },
  { id: 'etude', nome: 'Etude', logo: 'ETUDE', estilo: 'espacado', cor: '#e0457b' },
  { id: 'eucerin', nome: 'Eucerin', logo: 'Eucerin', estilo: 'sans', cor: '#0b3a7a' },
  { id: 'axis-y', nome: 'Axis-Y', logo: 'AXIS-Y', estilo: 'espacado', cor: '#1f7a3c' },
];

const FOTO = (id) => `images/produtos/${id}.webp`;

window.CHERRY_PRODUTOS = [
  /* ============ CATÁLOGO EXPRESS (preços do PowerPoint) ============ */

  // ---------- Medicube ----------
  { id: 'medicube-kojic-pad-turmeric', marca: 'medicube', categoria: 'skincare',
    nome: 'Kojic A.T Pad Turmeric – 70 discos (160g)', tipo: 'Pads clareadores',
    preco: 200, preco30: 170, imagem: FOTO('medicube-kojic-pad-turmeric'),
    arte: { forma: 'pote', corpo: '#f3ecd9', tampa: '#f4c542', texto: '#6b5a2a' } },

  { id: 'medicube-zero-pore-pad', marca: 'medicube', categoria: 'skincare',
    nome: 'Zero Pore Pad 2.0 – 70 discos (155g)', tipo: 'Pads esfoliantes',
    preco: 200, preco30: 170, imagem: FOTO('medicube-zero-pore-pad'),
    arte: { forma: 'pote', corpo: '#cfe0f5', tampa: '#2f6fe0', texto: '#2d3a55' } },

  { id: 'medicube-pdrn-pink-capsule-cream', marca: 'medicube', categoria: 'skincare',
    nome: 'PDRN Pink Collagen Capsule Cream – 55g', tipo: 'Creme hidratante',
    preco: 189, preco30: 169, imagem: FOTO('medicube-pdrn-pink-capsule-cream'),
    arte: { forma: 'pote', corpo: '#f6a5b9', tampa: '#f28fa9', texto: '#ffffff' } },

  { id: 'medicube-deep-vita-c-cream', marca: 'medicube', categoria: 'skincare',
    nome: 'Deep Vita C Capsule Cream – 55g', tipo: 'Creme iluminador',
    preco: 199, preco30: 169, imagem: FOTO('medicube-deep-vita-c-cream'),
    arte: { forma: 'pote', corpo: '#8a4b12', tampa: '#3a2412', texto: '#f3d9a6' } },

  { id: 'medicube-deep-vita-a-retinol', marca: 'medicube', categoria: 'skincare',
    nome: 'Deep Vita A Retinol Serum – 30ml', tipo: 'Sérum antissinais',
    preco: 229, preco30: 199, imagem: FOTO('medicube-deep-vita-a-retinol'),
    arte: { forma: 'bisnaga', corpo: '#4b2c21', tampa: '#c9a45c', texto: '#e9d3a6' } },

  { id: 'medicube-age-r-glutathione-cream', marca: 'medicube', categoria: 'skincare',
    nome: 'AGE-R Glutathione Glow Cream – 50ml', tipo: 'Creme em cápsulas',
    preco: 189, preco30: 169, imagem: FOTO('medicube-age-r-glutathione-cream'),
    arte: { forma: 'pote', corpo: '#2b2b2b', tampa: '#1a1a1a', texto: '#ffffff' } },

  { id: 'medicube-rosemary-pdrn-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'Rosemary PDRN Mask – 200ml', tipo: 'Máscara facial', selo: 'Lançamento',
    preco: 179, preco30: 159, imagem: FOTO('medicube-rosemary-pdrn-mask'),
    arte: { forma: 'bisnaga', corpo: '#f8f8f8', tampa: '#f2a2bd', texto: '#333333' } },

  { id: 'medicube-txa-niacinamide-cream', marca: 'medicube', categoria: 'skincare',
    nome: 'TXA + Niacinamide Capsule Cream – 55g', tipo: 'Creme clareador',
    preco: 219, preco30: 199, imagem: FOTO('medicube-txa-niacinamide-cream'),
    arte: { forma: 'pote', corpo: '#c4122f', tampa: '#a80f28', texto: '#ffffff' } },

  { id: 'medicube-hyaluronic-capsule-cream', marca: 'medicube', categoria: 'skincare',
    nome: 'Hyaluronic Moist Capsule Cream – 55g', tipo: 'Creme hidratante',
    preco: 189, preco30: 169, imagem: FOTO('medicube-hyaluronic-capsule-cream'),
    arte: { forma: 'pote', corpo: '#7fa8e6', tampa: '#5d8fdc', texto: '#ffffff' } },

  { id: 'medicube-kojic-eye-gel', marca: 'medicube', categoria: 'skincare',
    nome: 'Kojic Acid Turmeric Vita Eye Gel Serum – 30ml', tipo: 'Sérum para olhos',
    preco: 219, preco30: 189, imagem: FOTO('medicube-kojic-eye-gel'),
    arte: { forma: 'bisnaga', corpo: '#f3b532', tampa: '#fbfbf8', texto: '#ffffff' } },

  { id: 'medicube-pdrn-pink-one-day-serum', marca: 'medicube', categoria: 'skincare',
    nome: 'PDRN Pink One Day Serum – 1,5ml × 10 ampolas', tipo: 'Sérum em ampolas',
    preco: 129, preco30: 119, imagem: FOTO('medicube-pdrn-pink-one-day-serum'),
    arte: { forma: 'caixa', corpo: '#f7b6c6', tampa: '#fde3ea', texto: '#ffffff' } },

  { id: 'medicube-red-foam-cleanser', marca: 'medicube', categoria: 'skincare',
    nome: 'Red Foam Cleanser – 230ml', tipo: 'Espuma de limpeza',
    preco: 169, preco30: 159, imagem: FOTO('medicube-red-foam-cleanser'),
    arte: { forma: 'bisnaga', corpo: '#f6f6f6', tampa: '#e3e3e3', texto: '#c8102e' } },

  { id: 'medicube-hypochlorous-spray', marca: 'medicube', categoria: 'skincare',
    nome: 'Hypochlorous Acid Daily Facial Spray – 125ml', tipo: 'Spray facial',
    preco: 129, preco30: 119, imagem: FOTO('medicube-hypochlorous-spray'),
    arte: { forma: 'spray', corpo: '#c8102e', tampa: '#eceef0', texto: '#ffffff' } },

  // ---------- Celimax ----------
  { id: 'celimax-retinal-shot', marca: 'celimax', categoria: 'skincare',
    nome: 'Retinal Shot Tightening Booster – 15ml', tipo: 'Booster antissinais',
    preco: 130, preco30: 130, precoAntigo: 159, imagem: FOTO('celimax-retinal-shot'),
    arte: { forma: 'bisnaga', corpo: '#f5d36b', tampa: '#e0a826', texto: '#7a4a00' } },

  { id: 'celimax-pore-dark-spot-cream', marca: 'celimax', categoria: 'skincare',
    nome: 'Pore + Dark Spot Cream – 35ml', tipo: 'Creme clareador',
    preco: 149, preco30: 139, imagem: FOTO('celimax-pore-dark-spot-cream'),
    arte: { forma: 'bisnaga', corpo: '#fbfbf8', tampa: '#f6a623', texto: '#b36b00' } },

  { id: 'celimax-pore-dark-spot-pads', marca: 'celimax', categoria: 'skincare',
    nome: 'Pore + Dark Spot Brightening Pads – 40 discos', tipo: 'Pads clareadores',
    preco: 149, preco30: 139, imagem: FOTO('celimax-pore-dark-spot-pads'),
    arte: { forma: 'pote', corpo: '#f6a623', tampa: '#f7f7f5', texto: '#ffffff' } },

  // ---------- SKIN1004 ----------
  { id: 'skin1004-matrixyl', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Matrixyl 10% Boosting Shot Ampoule – 30ml', tipo: 'Ampola antissinais',
    preco: 219, preco30: 199, imagem: FOTO('skin1004-matrixyl'),
    arte: { forma: 'conta-gotas', corpo: '#e9e9ea', tampa: '#f7f7f7', texto: '#666666' } },

  { id: 'skin1004-probio-cica-glow-sun', marca: 'skin1004', categoria: 'skincare',
    nome: 'Probio-Cica Glow Sun Ampoule SPF50+ PA++++ – 50ml', tipo: 'Protetor solar',
    preco: 199, preco30: 179, imagem: FOTO('skin1004-probio-cica-glow-sun'),
    arte: { forma: 'bisnaga', corpo: '#3a2a22', tampa: '#d8c8b0', texto: '#f3e6d0' } },

  { id: 'skin1004-probio-cica-intensive', marca: 'skin1004', categoria: 'skincare',
    nome: 'Probio-Cica Intensive Ampoule – 50ml', tipo: 'Ampola calmante',
    preco: 189, preco30: 179, imagem: FOTO('skin1004-probio-cica-intensive'),
    arte: { forma: 'conta-gotas', corpo: '#8a4b1c', tampa: '#1f1f1f', texto: '#f3e6d0' } },

  // ---------- K-Secret ----------
  { id: 'k-secret-seoul-1988-sun', marca: 'k-secret', categoria: 'skincare',
    nome: 'Seoul 1988 Sun Pine Tree + Ceramide SPF50+ PA++++ – 50ml', tipo: 'Protetor solar',
    preco: 139, preco30: 129, imagem: FOTO('k-secret-seoul-1988-sun'),
    arte: { forma: 'bisnaga', corpo: '#dfe8dc', tampa: '#2f5d3a', texto: '#2f5d3a' } },

  // ---------- Dr. Althea ----------
  { id: 'dr-althea-345-cream', marca: 'dr-althea', categoria: 'skincare',
    nome: '345 Relief Cream Intense – 50ml', tipo: 'Creme reparador',
    preco: 236, preco30: 229, precoAntigo: 259, imagem: FOTO('dr-althea-345-cream'),
    arte: { forma: 'bisnaga', corpo: '#fbfbfb', tampa: '#ececec', texto: '#444444' } },

  // ---------- Fino (haircare) ----------
  { id: 'fino-kit-mascara-oleo', marca: 'fino', categoria: 'haircare',
    nome: 'Kit Premium Touch – Hair Mask 230g + Hair Oil 70ml', tipo: 'Kit capilar',
    preco: 150, preco30: 150, imagem: FOTO('fino-kit-mascara-oleo'),
    arte: { forma: 'pote', corpo: '#dcdde0', tampa: '#b3121f', texto: '#b3121f' } },

  /* ============ LINHA COMPLETA ============ */

  { id: 'celimax-noni-acne-cleanser', marca: 'celimax', categoria: 'skincare',
    nome: 'Noni The Real Acne Cleanser – 155ml', tipo: 'Espuma de limpeza',
    preco: 139, preco30: 129, imagem: FOTO('celimax-noni-acne-cleanser'),
    arte: { forma: 'pump', corpo: '#86a94f', tampa: '#f4f4f2', texto: '#ffffff' } },

  { id: 'celimax-vita-a-retinal-duo', marca: 'celimax', categoria: 'skincare',
    nome: 'Vita A Retinal Shot Duo – 50ml', tipo: 'Tratamento antissinais',
    preco: 169, preco30: 159, imagem: FOTO('celimax-vita-a-retinal-duo'),
    arte: { forma: 'pump', corpo: '#f4c95d', tampa: '#fbfaf6', texto: '#7a4a00' } },

  { id: 'numbuzin-no5-glutathione', marca: 'numbuzin', categoria: 'skincare',
    nome: 'No.5 Glutathione TXA Ampoule – 10g', tipo: 'Ampola clareadora',
    preco: 179, preco30: 169, imagem: FOTO('numbuzin-no5-glutathione'),
    arte: { forma: 'frasco', corpo: '#d7d9dc', tampa: '#f4e04d', texto: '#4a4a4a' } },

  { id: 'numbuzin-no9-nad-sun', marca: 'numbuzin', categoria: 'skincare',
    nome: 'No.9 NAD Peptides Dewy Sun Essence – 50ml', tipo: 'Protetor solar',
    preco: 159, preco30: 149, imagem: FOTO('numbuzin-no9-nad-sun'),
    arte: { forma: 'bisnaga', corpo: '#9b6bd3', tampa: '#7d4fbf', texto: '#ffffff' } },

  { id: 'medicube-collagen-glow-booster', marca: 'medicube', categoria: 'skincare',
    nome: 'Collagen Glow Booster Serum – 15ml', tipo: 'Sérum',
    preco: 169, preco30: 159, imagem: FOTO('medicube-collagen-glow-booster'),
    arte: { forma: 'caneta', corpo: '#eaa9a0', tampa: '#f3c7c0', texto: '#ffffff' } },

  { id: 'medicube-collagen-milk-wrapping-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'Collagen Milk Toning Wrapping Mask – 75ml', tipo: 'Máscara facial',
    preco: 169, preco30: 159, imagem: FOTO('medicube-collagen-milk-wrapping-mask'),
    arte: { forma: 'bisnaga', corpo: '#e7b3a6', tampa: '#f5f1ee', texto: '#ffffff' } },

  { id: 'medicube-pdrn-volume-balm', marca: 'medicube', categoria: 'skincare',
    nome: 'PDRN Pink Collagen Volume Balm – 55g', tipo: 'Balm antissinais',
    preco: 189, preco30: 169, imagem: '',
    arte: { forma: 'pote', corpo: '#f4a7bb', tampa: '#fbe2e9', texto: '#ffffff' } },

  { id: 'lilyeve-grow-exosome', marca: 'lilyeve', categoria: 'skincare',
    nome: 'Grow Exosome Dual Serum – 8ml', tipo: 'Sérum para sobrancelhas',
    preco: 149, preco30: 139, imagem: FOTO('lilyeve-grow-exosome'),
    arte: { forma: 'caneta', corpo: '#ffffff', tampa: '#f26b21', texto: '#f26b21' } },

  { id: 'skin1004-light-cleansing-oil', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Light Cleansing Oil – 200ml', tipo: 'Óleo de limpeza',
    preco: 137, preco30: 137, precoAntigo: 149, imagem: FOTO('skin1004-light-cleansing-oil'),
    arte: { forma: 'pump', corpo: '#ecd08f', tampa: '#efeae0', texto: '#6b5a3a' } },

  { id: 'skin1004-tone-brightening-gel-foam', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Tone Brightening Cleansing Gel Foam – 125ml', tipo: 'Gel de limpeza',
    preco: 109, preco30: 99, imagem: FOTO('skin1004-tone-brightening-gel-foam'),
    arte: { forma: 'bisnaga', corpo: '#f7f7f7', tampa: '#ececec', texto: '#555555' } },

  { id: 'skin1004-poremizing', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Poremizing Fresh Ampoule – 100ml', tipo: 'Ampola para poros',
    preco: 169, preco30: 159, imagem: FOTO('skin1004-poremizing'),
    arte: { forma: 'conta-gotas', corpo: '#f4d4da', tampa: '#fbfbfb', texto: '#8a5a64' } },

  { id: 'skin1004-retinol', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Retinol 0,2% Boosting Shot – 30ml', tipo: 'Tratamento antissinais',
    preco: 189, preco30: 169, imagem: FOTO('skin1004-retinol'),
    arte: { forma: 'conta-gotas', corpo: '#efe2bd', tampa: '#fbfbf7', texto: '#6b5a3a' } },

  { id: 'skin1004-tea-trica-toner', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Tea-Trica Purifying Toner – 210ml', tipo: 'Tônico',
    preco: 139, preco30: 129, imagem: FOTO('skin1004-tea-trica-toner'),
    arte: { forma: 'frasco', corpo: '#6cc5b6', tampa: '#f6f6f4', texto: '#ffffff' } },

  { id: 'skin1004-tone-brightening-cream', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Tone Brightening Capsule Cream', tipo: 'Creme clareador',
    preco: 169, preco30: 159, imagem: FOTO('skin1004-tone-brightening-cream'),
    arte: { forma: 'bisnaga', corpo: '#f7f7f7', tampa: '#ececec', texto: '#555555' } },

  { id: 'boj-relief-sun', marca: 'beauty-of-joseon', categoria: 'skincare',
    nome: 'Relief Sun: Rice + Probiotics SPF50+', tipo: 'Protetor solar',
    preco: 169, preco30: 159, imagem: FOTO('boj-relief-sun'),
    arte: { forma: 'bisnaga', corpo: '#f6f1e7', tampa: '#e9dcc4', texto: '#5a4a32' } },

  /* ============ NOVIDADES ============ */

  { id: 'medicube-zero-pore-pad-mild', marca: 'medicube', categoria: 'skincare',
    nome: 'Zero Pore Pad Mild – 70 discos (155g)', tipo: 'Pads esfoliantes suaves',
    preco: 200, preco30: 170, imagem: FOTO('medicube-zero-pore-pad-mild'),
    arte: { forma: 'pote', corpo: '#eef3f8', tampa: '#6ec3f0', texto: '#2d3a55' } },

  { id: 'medicube-red-succinic-peeling-pad', marca: 'medicube', categoria: 'skincare',
    nome: 'Red Succinic Acid Peeling Pad – 70 discos (155g)', tipo: 'Pads esfoliantes',
    preco: 200, preco30: 170, imagem: FOTO('medicube-red-succinic-peeling-pad'),
    arte: { forma: 'pote', corpo: '#f3d9d9', tampa: '#c8102e', texto: '#c8102e' } },

  { id: 'medicube-pdrn-pink-toner-pad', marca: 'medicube', categoria: 'skincare',
    nome: 'PDRN Pink Collagen Toning Gel Toner Pad – 70 discos (120ml)', tipo: 'Pads tonificantes',
    preco: 200, preco30: 170, imagem: FOTO('medicube-pdrn-pink-toner-pad'),
    arte: { forma: 'pote', corpo: '#f7b6c6', tampa: '#f28fa9', texto: '#ffffff' } },

  { id: 'medicube-pdrn-pink-gel-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'PDRN Pink Collagen Gel Mask – 28g', tipo: 'Máscara em gel',
    preco: 62, preco30: 56, imagem: FOTO('medicube-pdrn-pink-gel-mask'),
    arte: { forma: 'caixa', corpo: '#fbe2e9', tampa: '#f7b6c6', texto: '#333333' } },

  { id: 'medicube-collagen-lifting-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'Collagen Lifting Mask – 27g', tipo: 'Máscara facial',
    preco: 62, preco30: 56, imagem: FOTO('medicube-collagen-lifting-mask'),
    arte: { forma: 'caixa', corpo: '#f7f7f7', tampa: '#f4a7a0', texto: '#333333' } },

  { id: 'medicube-vita-c-glutathione-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'Deep Vita C Glutathione Brightening Mask – 27ml', tipo: 'Máscara iluminadora',
    preco: 62, preco30: 56, imagem: FOTO('medicube-vita-c-glutathione-mask'),
    arte: { forma: 'caixa', corpo: '#f7e34a', tampa: '#f2a623', texto: '#ffffff' } },

  { id: 'medicube-zero-pore-cooling-mask', marca: 'medicube', categoria: 'skincare',
    nome: 'Zero Pore Cooling Mask', tipo: 'Máscara refrescante',
    preco: 62, preco30: 56, imagem: FOTO('medicube-zero-pore-cooling-mask'),
    arte: { forma: 'caixa', corpo: '#e6f1fa', tampa: '#6ec3f0', texto: '#2d3a55' } },

  { id: 'medicube-scalp-brush', marca: 'medicube', categoria: 'haircare',
    nome: 'Scalp Shampoo Brush', tipo: 'Escova massageadora para couro cabeludo',
    preco: 400, preco30: 360, imagem: FOTO('medicube-scalp-brush'),
    arte: { forma: 'pote', corpo: '#f28fa9', tampa: '#f7b6c6', texto: '#ffffff' } },

  { id: 'celimax-retinol-shot-serum', marca: 'celimax', categoria: 'skincare',
    nome: 'Retinol Shot Tightening Serum', tipo: 'Sérum antissinais',
    preco: 169, preco30: 149, imagem: FOTO('celimax-retinol-shot-serum'),
    arte: { forma: 'pump', corpo: '#d9dbde', tampa: '#c6dc3c', texto: '#4a4a4a' } },

  { id: 'skin1004-centella-ampoule', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Ampoule – 55ml', tipo: 'Ampola calmante',
    preco: 179, preco30: 159, imagem: FOTO('skin1004-centella-ampoule'),
    arte: { forma: 'conta-gotas', corpo: '#e8c77a', tampa: '#fbfbf7', texto: '#6b5a3a' } },

  { id: 'skin1004-centella-ampoule-kit', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Ampoule Kit – 4 ampolas', tipo: 'Kit de ampolas',
    preco: 229, preco30: 199, imagem: FOTO('skin1004-centella-ampoule-kit'),
    arte: { forma: 'caixa', corpo: '#f7f7f5', tampa: '#e8c77a', texto: '#555555' } },

  { id: 'skin1004-centella-travel-kit', marca: 'skin1004', categoria: 'skincare',
    nome: 'Madagascar Centella Travel Kit', tipo: 'Kit de viagem',
    preco: 219, preco30: 189, imagem: FOTO('skin1004-centella-travel-kit'),
    arte: { forma: 'caixa', corpo: '#efe6d6', tampa: '#b98a52', texto: '#555555' } },

  { id: 'biore-uv-aqua-rich', marca: 'biore', categoria: 'skincare',
    nome: 'UV Aqua Rich Watery Essence SPF50+ PA++++', tipo: 'Protetor solar',
    preco: 79, preco30: 69, imagem: FOTO('biore-uv-aqua-rich'),
    arte: { forma: 'bisnaga', corpo: '#3fc6d8', tampa: '#f4f4f4', texto: '#ffffff' } },

  { id: 'biore-facial-wash-moisture', marca: 'biore', categoria: 'skincare',
    nome: 'Skin Care Facial Wash Moisture', tipo: 'Espuma de limpeza',
    preco: 49, preco30: 45, imagem: FOTO('biore-facial-wash-moisture'),
    arte: { forma: 'bisnaga', corpo: '#ffffff', tampa: '#f4f4f4', texto: '#1f3f9a' } },

  { id: 'rhode-peptide-lip-tint', marca: 'rhode', categoria: 'skincare',
    nome: 'Peptide Lip Tint – 10ml', tipo: 'Hidratante labial com cor',
    preco: 65, preco30: 65, imagem: FOTO('rhode-peptide-lip-tint'),
    arte: { forma: 'bisnaga', corpo: '#8a1f45', tampa: '#8a1f45', texto: '#ffffff' } },

  { id: 'fino-shampoo-condicionador', marca: 'fino', categoria: 'haircare',
    nome: 'Premium Touch Shampoo + Condicionador', tipo: 'Kit capilar',
    preco: 189, preco30: 169, imagem: FOTO('fino-shampoo-condicionador'),
    arte: { forma: 'pump', corpo: '#f4f4f4', tampa: '#ffffff', texto: '#b3121f' } },

  { id: 'boj-green-plum-cleanser', marca: 'beauty-of-joseon', categoria: 'skincare',
    nome: 'Green Plum Refreshing Cleanser', tipo: 'Limpador facial',
    preco: null, imagem: FOTO('boj-green-plum-cleanser'),
    arte: { forma: 'pump', corpo: '#bfe3d4', tampa: '#f4f4f2', texto: '#2f5d4a' } },

  { id: 'cosrx-oil-free-lotion', marca: 'cosrx', categoria: 'skincare',
    nome: 'Oil-Free Ultra-Moisturizing Lotion – 100ml', tipo: 'Loção hidratante',
    preco: 219.24, imagem: FOTO('cosrx-oil-free-lotion'),
    arte: { forma: 'pump', corpo: '#f4f6f8', tampa: '#1f1f1f', texto: '#2d5a8a' } },

  { id: 'etude-soon-jung-whip-cleanser', marca: 'etude', categoria: 'skincare',
    nome: 'Soon Jung pH 6.5 Whip Cleanser – 150ml', tipo: 'Espuma de limpeza',
    preco: null, imagem: FOTO('etude-soon-jung-whip-cleanser'),
    arte: { forma: 'pump', corpo: '#ffffff', tampa: '#f2f2f2', texto: '#2f6fe0' } },

  { id: 'eucerin-dermopure-triple-serum', marca: 'eucerin', categoria: 'skincare',
    nome: 'Dermopure Facial Efeito Triplo Sérum – 40ml', tipo: 'Sérum facial',
    preco: 160, imagem: FOTO('eucerin-dermopure-triple-serum'),
    arte: { forma: 'pump', corpo: '#f6fbfa', tampa: '#e9f2f0', texto: '#0b7a6e' } },

  { id: 'cosrx-snail-92-cream', marca: 'cosrx', categoria: 'skincare',
    nome: 'Advanced Snail 92 All in One Cream – 100g', tipo: 'Creme hidratante',
    preco: null, imagem: FOTO('cosrx-snail-92-cream'),
    arte: { forma: 'pote', corpo: '#f1ede0', tampa: '#1f1f1f', texto: '#6b5a2a' } },

  { id: 'eucerin-aquaphor-pomada-kit', marca: 'eucerin', categoria: 'skincare',
    nome: 'Aquaphor Pomada Reparadora – kit com 2 bisnagas de 9g', tipo: 'Pomada reparadora',
    preco: 65, imagem: FOTO('eucerin-aquaphor-pomada-kit'),
    arte: { forma: 'bisnaga', corpo: '#fbfbfb', tampa: '#1f3b78', texto: '#c8102e' } },

  { id: 'boj-relief-sun-aqua-fresh', marca: 'beauty-of-joseon', categoria: 'skincare',
    nome: 'Relief Sun Aqua-Fresh: Rice + B5 SPF50+ PA++++', tipo: 'Protetor solar',
    preco: null, imagem: FOTO('boj-relief-sun-aqua-fresh'),
    arte: { forma: 'bisnaga', corpo: '#f6f1e7', tampa: '#9db7e0', texto: '#5a4a32' } },

  { id: 'axis-y-dark-spot-serum', marca: 'axis-y', categoria: 'skincare',
    nome: 'Dark Spot Correcting Glow Serum – 50ml', tipo: 'Sérum para manchas',
    preco: null, imagem: FOTO('axis-y-dark-spot-serum'),
    arte: { forma: 'bisnaga', corpo: '#f4f7f2', tampa: '#1f7a3c', texto: '#1f7a3c' } },
];
