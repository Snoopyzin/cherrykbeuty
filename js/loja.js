/* =========================================================
   Cherry Kbeuty — catálogo, detalhes, filtros, busca e pedido
   Os dados ficam em js/produtos.js e js/descricoes.js
   ========================================================= */
(() => {
  const { pecasMinimas = 20, pecasFaixa2 = 30, valorMinimo = 0, expressMinimo = 0, mensagemConsulta = '' } = window.CHERRY_CONFIG;
  // aceita o número com ou sem máscara; sem DDI, assume Brasil (55)
  const digitos = String(window.CHERRY_CONFIG.whatsapp || '').replace(/\D/g, '');
  const whatsapp = digitos.length === 10 || digitos.length === 11 ? `55${digitos}` : digitos;
  const MARCAS = window.CHERRY_MARCAS;
  const PRODUTOS = window.CHERRY_PRODUTOS;
  const DESCRICOES = window.CHERRY_DESCRICOES || {};
  const marcaPorId = Object.fromEntries(MARCAS.map((m) => [m.id, m]));
  const produtoPorId = Object.fromEntries(PRODUTOS.map((p) => [p.id, p]));

  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const brlInteiro = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 });
  const esc = (t) => String(t).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normaliza = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const temPreco = (p) => typeof p.preco === 'number';
  // valores redondos sem centavos (R$ 209), quebrados com centavos (R$ 95,50)
  const moeda = (v) => (Number.isInteger(v) ? brlInteiro : brl).format(v);
  const pecas = (n) => `${n} ${n === 1 ? 'peça' : 'peças'}`;

  // regra do pedido mínimo em todos os textos da página
  $$('[data-minimo]').forEach((el) => {
    el.textContent = valorMinimo > 0 ? `${pecas(pecasMinimas)} e ${moeda(valorMinimo)}` : pecas(pecasMinimas);
  });
  $$('[data-faixa2]').forEach((el) => { el.textContent = pecas(pecasFaixa2); });
  $$('[data-faixa1-max]').forEach((el) => { el.textContent = pecasFaixa2 - 1; });
  $$('[data-express-minimo]').forEach((el) => { el.textContent = moeda(expressMinimo); });

  // aviso "siga no Instagram e ganhe desconto" (some se o desconto for 0 ou se não houver perfis)
  const ICONE_INSTA = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".9"/></svg>';
  const blocoInsta = $('#desconto');
  if (blocoInsta && window.CHERRY_CONFIG.descontoSeguir !== undefined) {
    const desconto = Number(window.CHERRY_CONFIG.descontoSeguir) || 0;
    const perfis = (window.CHERRY_CONFIG.perfisInstagram || []).filter(Boolean);
    blocoInsta.hidden = !(desconto > 0 && perfis.length);
    $$('[data-desconto-seguir]').forEach((el) => { el.textContent = `${desconto}%`; });
    $('#insta-perfis').innerHTML = perfis.map((u) => `<li><a class="btn btn--primario btn--insta" href="https://www.instagram.com/${encodeURIComponent(u)}/" target="_blank" rel="noopener">${ICONE_INSTA}@${esc(u)}</a></li>`).join('');
  }

  // botão "Atacado Express": abre o WhatsApp com a mensagem pronta
  if (whatsapp) {
    $$('[data-whatsapp]').forEach((el) => {
      el.href = `https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagemConsulta)}`;
    });
  }

  /* ---------- Ilustração da embalagem (enquanto não há foto) ---------- */

  const FONTES = {
    sans: 'font-family="Montserrat, sans-serif" font-weight="700"',
    'sans-leve': 'font-family="Montserrat, sans-serif" font-weight="500"',
    espacado: 'font-family="Montserrat, sans-serif" font-weight="600" letter-spacing="1.5"',
    script: 'font-family="\'Cormorant Garamond\', serif" font-style="italic" font-weight="600"',
    serif: 'font-family="\'Cormorant Garamond\', serif" font-style="italic" font-weight="700"',
    coreano: 'font-family="\'Noto Serif KR\', serif" font-weight="500"',
  };

  // texto da marca na embalagem; encolhe para caber na largura disponível
  function rotulo(p, x, y, tamanho, largura, girar = false) {
    const m = marcaPorId[p.marca];
    const fator = m.estilo === 'espacado' ? 0.78 : m.estilo === 'coreano' ? 1.05 : 0.6;
    const t = Math.min(tamanho, largura / (m.logo.length * fator)).toFixed(1);
    const giro = girar ? ` transform="rotate(-90 ${x} ${y})"` : '';
    return `<text x="${x}" y="${y}"${giro} text-anchor="middle" dominant-baseline="central" font-size="${t}" fill="${p.arte.texto}" ${FONTES[m.estilo] || FONTES.sans}>${esc(m.logo)}</text>`;
  }

  // corpo + reflexo (gradiente #brilho definido no index.html)
  const peca = (d, cor) => `<path d="${d}" fill="${cor}"/><path d="${d}" fill="url(#brilho)"/>`;
  const caixa = (x, y, w, h, r, cor) => peca(`M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`, cor);

  const FORMAS = {
    spray: (p, c) =>
      caixa(82, 26, 36, 26, 7, c.tampa) + caixa(116, 32, 15, 7, 2, c.tampa) + caixa(88, 49, 24, 18, 3, c.tampa) +
      peca('M72 84Q72 66 90 64H110Q128 66 128 84V192Q128 204 116 204H84Q72 204 72 192Z', c.corpo) +
      rotulo(p, 100, 138, 15, 110, true),
    pote: (p, c) =>
      peca('M52 128H148V192Q148 204 136 204H64Q52 204 52 192Z', c.corpo) +
      peca('M46 104Q46 96 54 96H146Q154 96 154 104V126Q154 132 148 132H52Q46 132 46 126Z', c.tampa) +
      rotulo(p, 100, 167, 17, 80),
    bisnaga: (p, c) =>
      caixa(62, 24, 76, 16, 2, c.corpo) + '<rect x="62" y="24" width="76" height="16" rx="2" fill="#000" opacity=".06"/>' +
      peca('M64 38H136L126 172Q125 178 118 178H82Q75 178 74 172Z', c.corpo) +
      peca('M80 176H120V198Q120 204 114 204H86Q80 204 80 198Z', c.tampa) +
      rotulo(p, 100, 100, 13, 58),
    'conta-gotas': (p, c) =>
      peca('M88 76V56Q88 36 100 36Q112 36 112 56V76Z', c.tampa) + caixa(82, 70, 36, 28, 4, c.tampa) +
      peca('M60 112Q60 96 76 96H124Q140 96 140 112V190Q140 204 126 204H74Q60 204 60 190Z', c.corpo) +
      rotulo(p, 100, 150, 14, 66),
    frasco: (p, c) =>
      caixa(84, 32, 32, 40, 5, c.tampa) +
      peca('M70 90Q70 72 88 70H112Q130 72 130 90V192Q130 204 118 204H82Q70 204 70 192Z', c.corpo) +
      rotulo(p, 100, 140, 14, 100, true),
    pump: (p, c) =>
      caixa(84, 30, 36, 12, 4, c.tampa) + caixa(116, 32, 24, 6, 3, c.tampa) + caixa(96, 40, 8, 24, 2, c.tampa) + caixa(86, 60, 28, 20, 3, c.tampa) +
      peca('M64 100Q64 80 84 78H116Q136 80 136 100V190Q136 204 122 204H78Q64 204 64 190Z', c.corpo) +
      rotulo(p, 100, 146, 15, 60),
    caneta: (p, c) =>
      peca('M88 66H112V194Q112 204 102 204H98Q88 204 88 194Z', c.corpo) + caixa(87, 20, 26, 52, 11, c.tampa) +
      rotulo(p, 100, 138, 11, 100, true),
    caixa: (p, c) =>
      [0, 1, 2, 3, 4, 5].map((i) => caixa(50 + i * 17, 66, 12, 50, 5, c.tampa) + caixa(51.5 + i * 17, 58, 9, 10, 2, c.corpo)).join('') +
      caixa(40, 104, 120, 100, 6, c.corpo) +
      rotulo(p, 100, 158, 16, 96),
  };

  function midia(p, comAlt = true) {
    if (p.imagem) return `<img src="${esc(p.imagem)}" alt="${comAlt ? esc(`${marcaPorId[p.marca].nome} ${p.nome}`) : ''}" loading="lazy" decoding="async">`;
    const forma = FORMAS[p.arte?.forma] || FORMAS.frasco;
    return `<svg class="arte" viewBox="0 0 200 220" aria-hidden="true" focusable="false"><ellipse cx="100" cy="206" rx="50" ry="6" fill="#7a1426" opacity=".12"/>${forma(p, p.arte)}</svg>`;
  }

  function selo(p) {
    const desconto = temPreco(p) && p.precoAntigo ? Math.round((1 - p.preco / p.precoAntigo) * 100) : 0;
    if (desconto > 0) return `<span class="produto__selo">-${desconto}%</span>`;
    if (p.selo) return `<span class="produto__selo produto__selo--novo">${esc(p.selo)}</span>`;
    return '';
  }

  const precoFaixa2 = (p) => p.preco30 ?? p.preco;

  function preco(p) {
    if (!temPreco(p)) return '<p class="produto__preco produto__preco--breve">Preço em breve</p>';
    const f2 = precoFaixa2(p);
    return `<p class="produto__preco">
        <strong>${moeda(p.preco)}</strong>
        ${p.precoAntigo ? `<s><span class="sr-only">preço anterior </span>${moeda(p.precoAntigo)}</s>` : ''}
        <span class="produto__un">/ un.</span>
      </p>
      <p class="produto__faixa2${f2 < p.preco ? '' : ' produto__faixa2--igual'}">${f2 < p.preco
        ? `<strong>${moeda(f2)}</strong> a partir de ${pecas(pecasFaixa2)} no mix`
        : 'mesmo preço em qualquer volume'}</p>`;
  }

  /* ---------- Pedido (carrinho) ---------- */

  const CHAVE = 'cherry-kbeuty:pedido';
  let pedido = {};
  try { pedido = JSON.parse(localStorage.getItem(CHAVE)) || {}; } catch { pedido = {}; }
  for (const id of Object.keys(pedido)) {
    if (!produtoPorId[id] || !temPreco(produtoPorId[id]) || !(pedido[id] > 0)) delete pedido[id];
  }
  const salva = () => { try { localStorage.setItem(CHAVE, JSON.stringify(pedido)); } catch { /* sem armazenamento: segue só na sessão */ } };

  // preço normal: até pecasFaixa2-1 peças · atacado (faixa 2): pecasFaixa2+ (vale para o pedido inteiro)
  const unidades = () => Object.values(pedido).reduce((s, q) => s + q, 0);
  const naFaixa2 = (un = unidades()) => un >= pecasFaixa2;
  const precoAtual = (p, un) => (naFaixa2(un) ? precoFaixa2(p) : p.preco);
  const total = (un = unidades()) => Object.entries(pedido).reduce((s, [id, q]) => s + precoAtual(produtoPorId[id], un) * q, 0);
  const totalFaixa1 = () => Object.entries(pedido).reduce((s, [id, q]) => s + produtoPorId[id].preco * q, 0);
  const economiaFaixa2 = () => Object.entries(pedido).reduce((s, [id, q]) => s + (produtoPorId[id].preco - precoFaixa2(produtoPorId[id])) * q, 0);
  const minimoAtingido = () => unidades() >= pecasMinimas && total() >= valorMinimo;
  const temMinimo = pecasMinimas > 1 || valorMinimo > 0;

  function seletorQtd(p, q, extra = '') {
    return `<div class="qtd ${extra}">
        <button type="button" data-f="menos" aria-label="Diminuir quantidade de ${esc(p.nome)}">−</button>
        <input type="number" inputmode="numeric" min="0" max="999" value="${q}" data-f="qtd" aria-label="Quantidade de ${esc(p.nome)}">
        <button type="button" data-f="mais" aria-label="Aumentar quantidade de ${esc(p.nome)}">+</button>
      </div>`;
  }

  function acao(p) {
    if (!temPreco(p)) return '<button class="btn-add" type="button" disabled>Em breve</button>';
    if (pedido[p.id]) return seletorQtd(p, pedido[p.id]);
    return `<button class="btn-add" type="button" data-f="add">Adicionar<span class="sr-only"> ${esc(p.nome)} ao pedido</span></button>`;
  }

  function cartao(p) {
    const m = marcaPorId[p.marca];
    const link = `href="#produto=${p.id}" data-ver="${p.id}"`;
    return `<article class="produto" data-id="${p.id}">
      <a class="produto__midia" ${link} tabindex="-1" aria-hidden="true">${midia(p, false)}${selo(p)}</a>
      <div class="produto__info">
        <p class="produto__marca">${esc(m.nome)}</p>
        <h3 class="produto__nome"><a ${link}>${esc(p.nome)}</a></h3>
        <p class="produto__tipo">${esc(p.tipo)}</p>
        <a class="produto__detalhes" ${link} tabindex="-1" aria-hidden="true">Ver detalhes</a>
        ${preco(p)}
        <div class="produto__acao" data-id="${p.id}">${acao(p)}</div>
      </div>
    </article>`;
  }

  // recoloca o foco no controle equivalente depois de redesenhar
  const FOCO_ALTERNATIVO = { add: 'mais', mais: 'menos', menos: 'add', qtd: 'add', remover: null };
  function comFoco(raiz, desenha) {
    const ativo = document.activeElement;
    const papel = ativo && raiz.contains(ativo) ? ativo.dataset.f : null;
    const id = papel ? ativo.closest('[data-id]')?.dataset.id : null;
    desenha();
    if (!papel || !id) return;
    const alvo = $(`[data-id="${id}"] [data-f="${papel}"]`, raiz) || $(`[data-id="${id}"] [data-f="${FOCO_ALTERNATIVO[papel]}"]`, raiz);
    (alvo || $('[data-foco]', raiz.closest('.painel') || document) || raiz).focus?.();
  }

  // atualiza os botões do produto em todos os lugares (cards e detalhes)
  function atualizaAcoes(id) {
    const p = produtoPorId[id];
    $$(`.produto__acao[data-id="${id}"]`).forEach((el) => comFoco(el, () => { el.innerHTML = acao(p); }));
  }

  const toast = $('#toast');
  let toastTempo;
  function mostraToast(msg) {
    toast.textContent = msg;
    toast.classList.add('visivel');
    clearTimeout(toastTempo);
    toastTempo = setTimeout(() => toast.classList.remove('visivel'), 3000);
  }

  function defineQtd(id, qtd) {
    if (!temPreco(produtoPorId[id])) return;
    const antes = pedido[id] || 0;
    const unAntes = unidades();
    const minimoAntes = minimoAtingido();
    qtd = Math.max(0, Math.min(999, Math.floor(Number(qtd)) || 0));
    if (qtd === antes) { atualizaAcoes(id); atualizaCarrinho(); return; }
    if (qtd) pedido[id] = qtd; else delete pedido[id];
    salva();
    atualizaAcoes(id);
    atualizaCarrinho();

    const un = unidades();
    const faltaMinimo = Math.max(0, pecasMinimas - un);
    const faltaFaixa2 = Math.max(0, pecasFaixa2 - un);
    if (!naFaixa2(unAntes) && naFaixa2(un)) mostraToast(`Preço de atacado liberado! Todo o pedido ficou ${moeda(economiaFaixa2())} mais barato.`);
    else if (naFaixa2(unAntes) && !naFaixa2(un)) mostraToast(`O pedido voltou para o preço normal (menos de ${pecas(pecasFaixa2)}).`);
    else if (temMinimo && !minimoAntes && minimoAtingido()) mostraToast(`Pedido mínimo atingido! Com mais ${pecas(faltaFaixa2)} você entra no preço de atacado.`);
    else if (!antes && qtd) {
      mostraToast(faltaMinimo ? `Adicionado! Faltam ${pecas(faltaMinimo)} para o pedido mínimo.`
        : faltaFaixa2 ? `Adicionado! Faltam ${pecas(faltaFaixa2)} para o preço de atacado.`
          : 'Adicionado ao pedido.');
    }
  }

  /* ---------- Painel do pedido ---------- */

  const botaoCarrinho = $('.topo__carrinho');
  const contador = $('.topo__contador');
  const lista = $('#carrinho-lista');
  const vazio = $('#carrinho-vazio');
  const barra = $('#carrinho-barra');
  const textoProgresso = $('#carrinho-progresso');
  const subtotal = $('#carrinho-subtotal');
  const finalizar = $('#carrinho-finalizar');
  const esvaziar = $('#carrinho-esvaziar');

  const pecasTexto = $('#carrinho-pecas');
  const linhaEconomia = $('#carrinho-economia-linha');
  const economia = $('#carrinho-economia');

  function itemCarrinho(id, q, un) {
    const p = produtoPorId[id];
    const unitario = precoAtual(p, un);
    const antigo = unitario < p.preco ? `<s>${moeda(p.preco)}</s> ` : '';
    return `<li class="item" data-id="${id}">
      <div class="item__midia">${midia(p, false)}</div>
      <div class="item__info">
        <p class="item__marca">${esc(marcaPorId[p.marca].nome)}</p>
        <p class="item__nome">${esc(p.nome)}</p>
        <p class="item__un">${antigo}${moeda(unitario)} / un.</p>
        <div class="item__linha">${seletorQtd(p, q, 'qtd--mini')}<strong>${moeda(unitario * q)}</strong></div>
      </div>
      <button class="item__remover" type="button" data-f="remover" aria-label="Remover ${esc(p.nome)} do pedido">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
    </li>`;
  }

  function atualizaCarrinho() {
    const itens = Object.entries(pedido);
    const un = unidades();
    const t = total(un);
    const faixa2 = naFaixa2(un);
    const faltaPecas = Math.max(0, pecasMinimas - un);
    const faltaValor = Math.max(0, valorMinimo - t);
    const faltaFaixa2 = Math.max(0, pecasFaixa2 - un);
    const ok = minimoAtingido();

    contador.hidden = !un;
    contador.textContent = un > 99 ? '99+' : un;
    botaoCarrinho.setAttribute('aria-label', un ? `Abrir pedido (${pecas(un)})` : 'Abrir pedido');
    document.body.classList.toggle('faixa2-ativa', faixa2);

    // barra vai até o atacado; a marca no meio é o pedido mínimo (some quando não há mínimo)
    const trilho = barra.parentElement;
    trilho.style.setProperty('--marca', temMinimo ? `${(pecasMinimas / pecasFaixa2) * 100}%` : '-4px');
    barra.style.width = `${Math.min(100, (un / pecasFaixa2) * 100)}%`;
    trilho.classList.toggle('minimo', ok && !faixa2);
    trilho.classList.toggle('completa', faixa2);

    if (!ok) {
      const partes = [faltaPecas && `<strong>${pecas(faltaPecas)}</strong>`, faltaValor && `<strong>${moeda(faltaValor)}</strong>`].filter(Boolean).join(' e ');
      textoProgresso.innerHTML = `Faltam ${partes} para o pedido mínimo de ${pecas(pecasMinimas)} (mix livre).`;
    } else if (!faixa2) {
      textoProgresso.innerHTML = `${temMinimo ? '<strong>Pedido mínimo atingido!</strong> ' : ''}Com mais <strong>${pecas(faltaFaixa2)}</strong> (mix livre) o pedido inteiro passa para o preço de atacado e fica <strong>${moeda(economiaFaixa2())}</strong> mais barato.`;
    } else {
      textoProgresso.innerHTML = `<strong>Preço de atacado aplicado!</strong> Todo o pedido está com o preço de ${pecas(pecasFaixa2)} ou mais.`;
    }

    comFoco(lista, () => { lista.innerHTML = itens.map(([id, q]) => itemCarrinho(id, q, un)).join(''); });
    vazio.hidden = itens.length > 0;
    pecasTexto.textContent = pecas(un);
    const eco = faixa2 ? totalFaixa1() - t : 0;
    linhaEconomia.hidden = !eco;
    economia.textContent = `− ${moeda(eco)}`;
    subtotal.textContent = moeda(t);
    finalizar.disabled = !ok;
    finalizar.textContent = ok || !itens.length ? 'Finalizar pedido'
      : faltaPecas ? `Faltam ${pecas(faltaPecas)}` : `Faltam ${moeda(faltaValor)}`;
    esvaziar.hidden = !itens.length;
  }

  finalizar.addEventListener('click', () => {
    const itens = Object.entries(pedido);
    if (!itens.length || !minimoAtingido()) return;
    const un = unidades();
    const t = total(un);
    const linhas = itens.map(([id, q]) => {
      const p = produtoPorId[id];
      const unitario = precoAtual(p, un);
      return `• ${q}x ${marcaPorId[p.marca].nome} ${p.nome}\n   ${moeda(unitario)} un. = *${moeda(unitario * q)}*`;
    });
    const faixa = naFaixa2(un) ? `preço de atacado, ${pecas(pecasFaixa2)} ou mais` : `preço normal, menos de ${pecas(pecasFaixa2)}`;
    const eco = naFaixa2(un) ? totalFaixa1() - t : 0;
    // checkout em texto (o *negrito* é formatação do WhatsApp)
    const mensagem = [
      '*Checkout — Cherry Kbeuty*',
      'Olá! Montei meu pedido no site e quero finalizar:',
      '',
      ...linhas,
      '',
      `Peças: *${un}* (${faixa})`,
      eco > 0 && `Economia do atacado: ${moeda(eco)}`,
      `*Total: ${moeda(t)}*`,
      expressMinimo > 0 && t >= expressMinimo && `Pedido a partir de ${moeda(expressMinimo)}: Atacado Express (entrega em até 3 dias úteis)`,
      '',
      'Pagamento: Pix ou cartão em até 3x (taxas do parcelamento por minha conta).',
      'Taxa de entrega: a combinar.',
      'Aguardo a confirmação da disponibilidade para combinarmos o pagamento.',
    ].filter((l) => l !== false).join('\n');
    if (!whatsapp) {
      console.warn('Cherry Kbeuty: defina CHERRY_CONFIG.whatsapp em js/produtos.js para receber os pedidos.');
      mostraToast('O envio de pedidos ainda está sendo configurado.');
      return;
    }
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');
  });

  esvaziar.addEventListener('click', () => {
    if (!window.confirm('Remover todos os produtos do pedido?')) return;
    const ids = Object.keys(pedido);
    pedido = {};
    salva();
    ids.forEach(atualizaAcoes);
    atualizaCarrinho();
    $('[data-foco]', $('#carrinho'))?.focus();
  });

  // cliques e digitação em qualquer seletor de quantidade (cards, detalhes e pedido)
  document.addEventListener('click', (e) => {
    const alvo = e.target.closest('[data-f]');
    const id = alvo?.closest('[data-id]')?.dataset.id;
    if (!id || !produtoPorId[id]) return;
    const q = pedido[id] || 0;
    switch (alvo.dataset.f) {
      case 'add': defineQtd(id, 1); break;
      case 'mais': defineQtd(id, q + 1); break;
      case 'menos': defineQtd(id, q - 1); break;
      case 'remover': defineQtd(id, 0); break;
      default:
    }
  });
  document.addEventListener('change', (e) => {
    if (e.target.dataset?.f !== 'qtd') return;
    const id = e.target.closest('[data-id]')?.dataset.id;
    if (id) defineQtd(id, e.target.value);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset?.f === 'qtd') e.target.blur();
  });

  /* ---------- Detalhes do produto ---------- */

  const detalhe = $('#detalhe');
  const conteudoDetalhe = $('#detalhe-conteudo');

  function textoDetalhe(d) {
    if (!d) return '<p class="detalhe__resumo detalhe__resumo--breve">Descrição completa em breve.</p>';
    const secao = (titulo, corpo) => `<section class="detalhe__secao"><h3>${esc(titulo)}</h3>${corpo}</section>`;
    return [
      d.resumo && `<p class="detalhe__resumo">${esc(d.resumo)}</p>`,
      d.serve && secao('Para que serve?', `<p>${esc(d.serve)}</p>`),
      d.beneficios?.length && secao('Principais benefícios', `<ul class="detalhe__beneficios">${d.beneficios.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>`),
      d.ativos?.length && secao(d.tituloAtivos || 'Principais ativos', `<dl class="detalhe__ativos">${d.ativos.map(([nome, texto]) => `<div><dt>${esc(nome)}</dt><dd>${esc(texto)}</dd></div>`).join('')}</dl>`),
      d.extra && secao(d.extra.titulo, `<p>${esc(d.extra.texto)}</p>`),
      d.rotina?.length && secao('Por que incluir na rotina?', d.rotina.map((t) => `<p>${esc(t)}</p>`).join('')),
      d.importante && `<p class="detalhe__importante"><strong>Importante:</strong> ${esc(d.importante)}</p>`,
    ].filter(Boolean).join('');
  }

  function abreDetalhe(id, gatilho) {
    const p = produtoPorId[id];
    if (!p) return;
    const m = marcaPorId[p.marca];
    conteudoDetalhe.innerHTML = `
      <div class="detalhe__midia">${midia(p)}${selo(p)}</div>
      <div class="detalhe__info">
        <p class="detalhe__marca">${esc(m.nome)}</p>
        <h2 class="detalhe__nome" id="detalhe-nome">${esc(p.nome)}</h2>
        <p class="detalhe__tipo">${esc(p.tipo)}</p>
        <div class="detalhe__compra">
          ${preco(p)}
          <div class="produto__acao" data-id="${p.id}">${acao(p)}</div>
        </div>
        <div class="detalhe__texto">${textoDetalhe(DESCRICOES[p.id])}</div>
      </div>`;
    conteudoDetalhe.scrollTop = 0;
    window.CherryPaineis.abrir('detalhe', gatilho);
    history.replaceState(null, '', `#produto=${id}`);
  }

  detalhe.addEventListener('painelfechado', () => {
    if (location.hash.startsWith('#produto=')) history.replaceState(null, '', location.pathname + location.search);
  });

  // link direto para um produto (ex.: index.html#produto=medicube-zero-pore-pad)
  document.addEventListener('DOMContentLoaded', () => {
    const achado = location.hash.match(/^#produto=([\w-]+)$/);
    if (achado && produtoPorId[achado[1]]) abreDetalhe(achado[1]);
  });

  /* ---------- Marcas, promoções e catálogo ---------- */

  const estado = { categoria: 'todos', marca: null, busca: '' };
  const catalogo = $('#catalogo');
  const grade = $('#grade-catalogo');
  const contagem = $('#catalogo-contagem');
  const ativos = $('#filtros-ativos');

  $('#lista-marcas').innerHTML = MARCAS.map((m) => `
    <li>
      <button class="marca-item" type="button" data-marca="${m.id}" aria-pressed="false">
        <span class="marca-item__logo marca-item__logo--${m.estilo}" style="--cor:${m.cor};--fundo:${m.fundo || '#fff'}" aria-hidden="true">${esc(m.logo)}</span>
        <span class="marca-item__nome">${esc(m.nome)}${m.sub ? `<small>${esc(m.sub)}</small>` : ''}</span>
      </button>
    </li>`).join('');

  const promocoes = PRODUTOS.filter((p) => temPreco(p) && p.precoAntigo);
  $('#grade-promocoes').innerHTML = promocoes.map(cartao).join('');
  $('#promocoes').closest('.faixa-branca').hidden = !promocoes.length;

  // destaques: produtos marcados com destaque: true (escolhidos no painel)
  const destaques = PRODUTOS.filter((p) => p.destaque);
  $('#grade-destaques').innerHTML = destaques.map(cartao).join('');
  $('#destaques').hidden = !destaques.length;

  // busca: nome, marca, tipo e ativos pesam mais; resumo e benefícios entram como complemento
  const indice = Object.fromEntries(PRODUTOS.map((p) => {
    const d = DESCRICOES[p.id] || {};
    return [p.id, {
      principal: normaliza([marcaPorId[p.marca].nome, p.nome, p.tipo, ...(d.ativos || []).map((a) => a[0])].join(' ')),
      extra: normaliza([d.resumo, d.serve, ...(d.beneficios || [])].filter(Boolean).join(' ')),
    }];
  }));

  function filtrados() {
    const termos = normaliza(estado.busca).split(/\s+/).filter(Boolean);
    return PRODUTOS
      .filter((p) => (estado.categoria === 'todos' || p.categoria === estado.categoria) && (!estado.marca || p.marca === estado.marca))
      .map((p) => {
        if (!termos.length) return { p, nota: 1 };
        const { principal, extra } = indice[p.id];
        if (termos.every((t) => principal.includes(t))) return { p, nota: 2 };
        if (termos.every((t) => principal.includes(t) || extra.includes(t))) return { p, nota: 1 };
        return { p, nota: 0 };
      })
      .filter((r) => r.nota > 0)
      .sort((a, b) => b.nota - a.nota)
      .map((r) => r.p);
  }

  function desenhaCatalogo() {
    const itens = filtrados();
    grade.innerHTML = itens.length
      ? itens.map(cartao).join('')
      : `<div class="vazio">
          <p>${estado.marca && !estado.busca
            ? `Os produtos da ${esc(marcaPorId[estado.marca].nome)} estão chegando em breve.`
            : 'Nenhum produto encontrado com esses filtros.'}</p>
          <button class="chip" type="button" data-limpar>Ver todos os produtos</button>
        </div>`;
    contagem.textContent = `${itens.length} ${itens.length === 1 ? 'produto' : 'produtos'}`;

    $$('[data-categoria]', catalogo).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.categoria === estado.categoria)));
    $$('.marca-item').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.marca === estado.marca)));

    const chips = [];
    if (estado.marca) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="marca">${esc(marcaPorId[estado.marca].nome)}<span aria-hidden="true">×</span><span class="sr-only"> — remover filtro</span></button>`);
    if (estado.busca) chips.push(`<button class="chip chip--ativo" type="button" data-tirar="busca">“${esc(estado.busca)}”<span aria-hidden="true">×</span><span class="sr-only"> — limpar busca</span></button>`);
    ativos.innerHTML = chips.join('');
  }

  const irParaCatalogo = () => catalogo.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  document.addEventListener('click', (e) => {
    const ver = e.target.closest('[data-ver]');
    const categoria = e.target.closest('[data-categoria]');
    const marca = e.target.closest('[data-marca]');
    const tirar = e.target.closest('[data-tirar]');
    if (ver) {
      e.preventDefault();
      abreDetalhe(ver.dataset.ver, ver.closest('.produto')?.querySelector('.produto__nome a') || ver);
    } else if (categoria) {
      estado.categoria = categoria.dataset.categoria;
      // links do menu (Skincare/Haircare) começam uma navegação limpa
      if (!catalogo.contains(categoria)) { estado.marca = null; estado.busca = ''; }
      desenhaCatalogo();
    } else if (marca) {
      e.preventDefault();
      const id = marca.dataset.marca;
      estado.marca = estado.marca === id && marca.classList.contains('marca-item') ? null : id;
      estado.categoria = 'todos';
      estado.busca = '';
      desenhaCatalogo();
      irParaCatalogo();
    } else if (tirar) {
      estado[tirar.dataset.tirar] = tirar.dataset.tirar === 'marca' ? null : '';
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    } else if (e.target.closest('[data-limpar]')) {
      Object.assign(estado, { categoria: 'todos', marca: null, busca: '' });
      desenhaCatalogo();
      $('[data-categoria="todos"]', catalogo).focus();
    }
  });

  // usado pela busca do cabeçalho (js/script.js)
  window.CherryLoja = {
    buscar(termo) {
      Object.assign(estado, { categoria: 'todos', marca: null, busca: termo.trim() });
      desenhaCatalogo();
      irParaCatalogo();
    },
  };

  desenhaCatalogo();
  atualizaCarrinho();
})();
