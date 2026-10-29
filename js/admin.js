/* =========================================================
   Cherry Kbeuty — PAINEL (admin.html)
   Edita preços, produtos, marcas e regras da loja e publica
   direto no GitHub (um commit só, o site se atualiza sozinho).
   A lógica dos dados fica em js/admin-core.js.
   ========================================================= */
(() => {
  'use strict';

  const Core = window.CherryAdminCore;
  const $ = (seletor, raiz = document) => raiz.querySelector(seletor);
  const $$ = (seletor, raiz = document) => [...raiz.querySelectorAll(seletor)];
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const brl = Core.moedaBR;
  const norm = (t) => Core.semAcento(t || '').toLowerCase();

  const CHAVES = { token: 'cherry-admin:token', repo: 'cherry-admin:repo', rascunho: 'cherry-admin:rascunho' };
  const REPO_PADRAO = 'Snoopyzin/cherrykbeuty';
  const ARQ_PRODUTOS = 'js/produtos.js';
  const ARQ_DESCRICOES = 'js/descricoes.js';
  const PASTA_FOTOS = 'images/produtos/';
  const LADO_FOTO = 800;

  const FORMAS = [['pote', 'Pote'], ['bisnaga', 'Bisnaga / tubo'], ['spray', 'Spray'], ['conta-gotas', 'Conta-gotas'], ['frasco', 'Frasco'], ['pump', 'Frasco com bomba'], ['caneta', 'Caneta'], ['caixa', 'Caixa / ampolas']];
  const ESTILOS = [['sans', 'Moderna em negrito'], ['sans-leve', 'Moderna leve'], ['espacado', 'Letras espaçadas'], ['script', 'Cursiva'], ['serif', 'Elegante com serifa'], ['coreano', 'Coreano']];
  const ARTE_PADRAO = { forma: 'frasco', corpo: '#f4d4da', tampa: '#fbfbfb', texto: '#8a5a64' };
  const ROTULOS = { preco: 'Preço', preco30: 'Atacado', precoAntigo: 'Preço antigo', nome: 'Nome', tipo: 'Texto curto', marca: 'Marca', categoria: 'Categoria', selo: 'Etiqueta', imagem: 'Foto', arte: 'Ilustração' };

  const S = {
    original: null,            // como está no site
    atual: null,               // como está no painel
    origPorId: new Map(),
    fotos: new Map(),          // caminho → { dataUrl, ext }  (esperando publicar)
    publicadas: new Map(),     // caminho → dataUrl           (só para a prévia nesta visita)
    filtro: { busca: '', marca: '', cat: 'todos' },
    token: null, repo: null,
    cambios: null, total: 0,
    publicando: false,
    dispensados: new Set(),
  };

  /* ---------- Armazenamento do navegador ---------- */

  const guarda = (armazem, chave, valor) => {
    try { if (valor == null) armazem.removeItem(chave); else armazem.setItem(chave, valor); return true; } catch { return false; }
  };
  const le = (armazem, chave) => { try { return armazem.getItem(chave); } catch { return null; } };

  function repoPadrao() {
    const m = location.hostname.match(/^([^.]+)\.github\.io$/);
    const pasta = location.pathname.split('/')[1];
    return m && pasta && !pasta.includes('.') ? `${m[1]}/${pasta}` : REPO_PADRAO;
  }

  /* ---------- Avisos rápidos ---------- */

  const toast = $('#toast');
  let toastTempo;
  function mostraToast(msg, acao) {
    toast.textContent = msg;
    if (acao) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = acao.texto;
      b.addEventListener('click', () => { toast.classList.remove('visivel'); acao.fn(); });
      toast.append(b);
    }
    toast.classList.add('visivel');
    clearTimeout(toastTempo);
    toastTempo = setTimeout(() => toast.classList.remove('visivel'), acao ? 8000 : 3500);
  }

  /* ---------- GitHub ---------- */

  class ErroApi extends Error {
    constructor(status, msg) { super(msg); this.status = status; }
  }

  async function api(caminho, { metodo = 'GET', corpo, texto = false } = {}) {
    let r;
    try {
      r = await fetch(`https://api.github.com${caminho}`, {
        method: metodo,
        headers: {
          Authorization: `Bearer ${S.token}`,
          Accept: texto ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
          ...(corpo ? { 'Content-Type': 'application/json' } : {}),
        },
        body: corpo ? JSON.stringify(corpo) : undefined,
        cache: 'no-store',
      });
    } catch {
      throw new ErroApi(0, 'Sem conexão com a internet (ou o GitHub está fora do ar).');
    }
    if (!r.ok) {
      let msg = '';
      try { msg = (await r.json()).message || ''; } catch { /* resposta sem corpo */ }
      throw new ErroApi(r.status, msg);
    }
    return texto ? r.text() : r.json();
  }

  function mensagemErro(e) {
    if (!(e instanceof ErroApi)) return e.message || String(e);
    if (e.status === 0) return e.message;
    if (e.status === 401) return 'A chave de acesso não está valendo (errada ou vencida). Conecte de novo com uma chave nova.';
    if (e.status === 403) {
      return /rate limit/i.test(e.message)
        ? 'O GitHub pediu para aguardar um pouco. Tente de novo em alguns minutos.'
        : 'A chave de acesso não tem permissão para alterar o site. Ela precisa de “Contents: Read and write” no repositório.';
    }
    if (e.status === 404) return 'Não encontrei o repositório. Confira o nome (dono/repositório) e se a chave tem acesso a ele.';
    if (e.status === 409 || e.status === 422) return 'Alguém publicou ao mesmo tempo. Tente publicar de novo.';
    return `O GitHub respondeu com erro ${e.status}. ${e.message}`;
  }

  const lerRepo = (arquivo, ref) => api(`/repos/${S.repo}/contents/${arquivo}${ref ? `?ref=${ref}` : ''}`, { texto: true });
  async function lerSite(arquivo) {
    const r = await fetch(`${arquivo}?t=${Date.now()}`, { cache: 'no-store' });
    if (!r.ok) throw new Error(`Não consegui abrir ${arquivo} (erro ${r.status}).`);
    return r.text();
  }

  /* ---------- Dados e rascunho ---------- */

  const produto = (id) => S.atual.produtos.find((p) => p.id === id);
  const marcaDe = (id) => S.atual.marcas.find((m) => m.id === id);
  const temPreco = (p) => typeof p.preco === 'number';
  const ehPromo = (p) => temPreco(p) && typeof p.precoAntigo === 'number' && p.precoAntigo > p.preco;
  const srcFoto = (caminho) => (S.fotos.get(caminho) || {}).dataUrl || S.publicadas.get(caminho) || caminho;
  const dataHora = (ms) => new Date(ms).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

  function reindexa() {
    S.origPorId = new Map(S.original.produtos.map((p) => [p.id, p]));
  }

  function lerRascunho() {
    try {
      const r = JSON.parse(le(localStorage, CHAVES.rascunho));
      if (r && r.v === 1 && r.original && r.atual && Array.isArray(r.atual.produtos) && Array.isArray(r.original.produtos)) return r;
    } catch { /* sem rascunho válido */ }
    return null;
  }

  async function carregar() {
    const rasc = lerRascunho();
    if (rasc) {
      S.original = rasc.original;
      S.atual = rasc.atual;
      for (const [caminho, dataUrl] of Object.entries(rasc.fotos || {})) S.fotos.set(caminho, { dataUrl, ext: caminho.split('.').pop() });
      S.rascunhoRecuperado = rasc.salvoEm;
      return;
    }
    let textos = null;
    if (S.token && S.repo) {
      try { textos = await Promise.all([lerRepo(ARQ_PRODUTOS), lerRepo(ARQ_DESCRICOES)]); } catch (e) { S.erroConexao = e; }
    }
    if (!textos) textos = await Promise.all([lerSite(ARQ_PRODUTOS), lerSite(ARQ_DESCRICOES)]);
    const dados = Core.avaliar(textos[0], textos[1]);
    S.original = Core.clonar(dados);
    S.atual = dados;
  }

  let tempoRascunho;
  function salvaRascunho() {
    clearTimeout(tempoRascunho);
    tempoRascunho = setTimeout(() => {
      let falhou = false;
      if (!S.total) {
        guarda(localStorage, CHAVES.rascunho, null);
      } else {
        const emUso = new Set(S.atual.produtos.map((p) => p.imagem));
        const fotos = {};
        for (const [caminho, f] of S.fotos) if (emUso.has(caminho)) fotos[caminho] = f.dataUrl;
        falhou = !guarda(localStorage, CHAVES.rascunho, JSON.stringify({ v: 1, salvoEm: Date.now(), original: S.original, atual: S.atual, fotos }));
      }
      if (falhou !== Boolean(S.rascunhoFalhou)) { S.rascunhoFalhou = falhou; desenhaAvisos(); }
    }, 400);
  }

  function mudou() {
    S.cambios = Core.calcularCambios(S.original, S.atual);
    S.total = Core.totalCambios(S.cambios);
    atualizaStatus();
    salvaRascunho();
  }

  function atualizaStatus() {
    const n = S.total;
    const contagem = $('#topo-contagem');
    contagem.hidden = !n;
    contagem.textContent = n;
    $('#barra-publicar').hidden = !n;
    document.body.classList.toggle('com-barra', n > 0);
    $('#barra-texto').innerHTML = `<strong>${n}</strong> ${n === 1 ? 'alteração ainda não está' : 'alterações ainda não estão'} no site.`;
  }

  /* ---------- Avisos no topo da página ---------- */

  function desenhaAvisos() {
    const h = [];
    if (S.rascunhoRecuperado && !S.dispensados.has('rascunho')) {
      h.push(`<div class="aviso aviso--info aviso--linha"><span>Recuperamos as alterações que você já tinha feito e ainda não publicou (salvas em ${esc(dataHora(S.rascunhoRecuperado))}).</span><span class="aviso__acoes"><button class="btn btn--sec btn--peq" type="button" data-aviso="dispensar:rascunho">Ok</button></span></div>`);
    }
    if (S.erroConexao && !S.dispensados.has('erro')) {
      h.push(`<div class="aviso aviso--erro aviso--linha"><span><strong>A conexão salva com o GitHub não funcionou.</strong> ${esc(mensagemErro(S.erroConexao))} Mostrando a versão pública do catálogo.</span><span class="aviso__acoes"><button class="btn btn--prim btn--peq" type="button" data-aviso="conectar">Conectar de novo</button></span></div>`);
    } else if (!S.token) {
      h.push('<div class="aviso aviso--linha"><span><strong>Falta conectar ao GitHub</strong> para poder publicar (só na primeira vez). Enquanto isso, pode editar à vontade: as alterações ficam guardadas neste aparelho.</span><span class="aviso__acoes"><button class="btn btn--prim btn--peq" type="button" data-aviso="conectar">Conectar</button></span></div>');
    }
    if (S.rascunhoFalhou) {
      h.push('<div class="aviso aviso--erro"><strong>Atenção:</strong> não consegui guardar suas alterações neste aparelho (pouco espaço, talvez por causa das fotos). Publique logo para não perdê-las.</div>');
    }
    $('#avisos').innerHTML = h.join('');
  }

  $('#avisos').addEventListener('click', (e) => {
    const b = e.target.closest('[data-aviso]');
    if (!b) return;
    const [acao, arg] = b.dataset.aviso.split(':');
    if (acao === 'conectar') abreConectar();
    if (acao === 'dispensar') { S.dispensados.add(arg); desenhaAvisos(); }
  });

  /* ---------- Lista de produtos ---------- */

  function estadoLinha(p) {
    const o = S.origPorId.get(p.id);
    if (!o) return 'novo';
    return Core.iguais(o, p) && Core.iguais(S.original.descricoes[p.id], S.atual.descricoes[p.id]) ? '' : 'mudou';
  }

  function etiquetas(p) {
    const e = estadoLinha(p);
    return [
      e === 'novo' && '<span class="etq etq--novo">Novo</span>',
      e === 'mudou' && '<span class="etq etq--mudou">Alterado</span>',
      ehPromo(p) && '<span class="etq etq--promo">Promoção</span>',
      !temPreco(p) && '<span class="etq etq--alerta">Sem preço</span>',
      !p.imagem && '<span class="etq">Sem foto</span>',
    ].filter(Boolean).join('');
  }

  function avisoLinha(p) {
    if (temPreco(p) && typeof p.preco30 === 'number' && p.preco30 > p.preco) return 'O preço de atacado está maior que o preço normal.';
    if (typeof p.precoAntigo === 'number' && !ehPromo(p)) return 'Para virar promoção, o preço antigo precisa ser maior que o preço atual.';
    return '';
  }

  const semFoto = '<span>sem foto</span>';
  const miniatura = (p) => (p.imagem ? `<img src="${esc(srcFoto(p.imagem))}" alt="" loading="lazy" decoding="async">` : semFoto);

  function campoPreco(p, campo, rotulo, placeholder) {
    const id = `i-${campo}-${p.id}`;
    return `<div class="campo">
        <label for="${esc(id)}">${rotulo}</label>
        <div class="campo-reais"><i>R$</i><input id="${esc(id)}" type="text" inputmode="decimal" autocomplete="off" data-campo="${campo}" placeholder="${placeholder}" value="${esc(Core.formatarReais(p[campo]))}"></div>
      </div>`;
  }

  function cartao(p) {
    const m = marcaDe(p.marca);
    const e = estadoLinha(p);
    return `<article class="item${e ? ` item--${e}` : ''}" data-id="${esc(p.id)}">
      <div class="item__foto">${miniatura(p)}</div>
      <div class="item__texto">
        <p class="item__marca">${esc(m ? m.nome : p.marca)}</p>
        <h3 class="item__nome">${esc(p.nome)}</h3>
        <div class="etiquetas">${etiquetas(p)}</div>
      </div>
      <div class="item__precos">
        ${campoPreco(p, 'preco', 'Normal', 'em breve')}
        ${campoPreco(p, 'preco30', `Atacado ${S.atual.config.pecasFaixa2}+`, 'igual')}
        ${campoPreco(p, 'precoAntigo', 'Antigo', 'sem')}
      </div>
      <p class="item__aviso">${esc(avisoLinha(p))}</p>
      <div class="item__acoes">
        <button class="btn btn--sec btn--peq" type="button" data-acao="editar">Editar tudo</button>
        <button class="link" type="button" data-acao="desfazer"${e ? '' : ' hidden'}>Desfazer</button>
      </div>
    </article>`;
  }

  function filtrados() {
    const termos = norm(S.filtro.busca).split(/\s+/).filter(Boolean);
    return S.atual.produtos.filter((p) => {
      if (S.filtro.cat !== 'todos' && p.categoria !== S.filtro.cat) return false;
      if (S.filtro.marca && p.marca !== S.filtro.marca) return false;
      if (!termos.length) return true;
      const m = marcaDe(p.marca);
      const alvo = norm(`${m ? m.nome : ''} ${p.nome} ${p.tipo || ''}`);
      return termos.every((t) => alvo.includes(t));
    });
  }

  function desenhaLista() {
    const itens = filtrados();
    $('#lista-produtos').innerHTML = itens.length
      ? itens.map(cartao).join('')
      : '<p class="vazio">Nenhum produto encontrado com esses filtros.</p>';
    const total = S.atual.produtos.length;
    $('#lista-contagem').textContent = itens.length === total ? `${total} produtos` : `${itens.length} de ${total} produtos`;
  }

  function desenhaFiltroMarcas() {
    const sel = $('#f-marca');
    const atual = S.filtro.marca;
    const marcas = [...S.atual.marcas].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
    sel.innerHTML = `<option value="">Todas as marcas</option>${marcas.map((m) => `<option value="${esc(m.id)}">${esc(m.nome)}</option>`).join('')}`;
    sel.value = marcas.some((m) => m.id === atual) ? atual : '';
    S.filtro.marca = sel.value;
  }

  // atualiza só a linha mexida (para não tirar o foco de quem está digitando)
  function atualizaLinha(id) {
    const el = $(`.item[data-id="${CSS.escape(id)}"]`);
    const p = produto(id);
    if (!el || !p) return;
    const e = estadoLinha(p);
    el.className = `item${e ? ` item--${e}` : ''}`;
    $('.etiquetas', el).innerHTML = etiquetas(p);
    $('.item__aviso', el).textContent = avisoLinha(p);
    $('[data-acao="desfazer"]', el).hidden = !e;
  }

  const lista = $('#lista-produtos');

  lista.addEventListener('input', (e) => {
    const campo = e.target.dataset.campo;
    if (!campo) return;
    const id = e.target.closest('.item').dataset.id;
    const p = produto(id);
    const n = Core.lerReais(e.target.value);
    if (Number.isNaN(n)) { e.target.setAttribute('aria-invalid', 'true'); return; }
    e.target.removeAttribute('aria-invalid');
    if (campo === 'preco') p.preco = n;
    else if (n === null) delete p[campo];
    else p[campo] = n;
    atualizaLinha(id);
    mudou();
  });

  lista.addEventListener('change', (e) => {
    const campo = e.target.dataset.campo;
    if (!campo) return;
    const p = produto(e.target.closest('.item').dataset.id);
    if (e.target.getAttribute('aria-invalid') === 'true') mostraToast('Esse valor não é um preço. Voltei para o que estava antes.');
    e.target.removeAttribute('aria-invalid');
    e.target.value = Core.formatarReais(p[campo]);
  });

  lista.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.dataset.campo) e.target.blur();
  });

  lista.addEventListener('click', (e) => {
    const b = e.target.closest('[data-acao]');
    if (!b) return;
    const id = b.closest('.item').dataset.id;
    if (b.dataset.acao === 'editar') abreProduto(id);
    if (b.dataset.acao === 'desfazer') desfazProduto(id);
  });

  // foto que não carregou: mostra o aviso em vez do ícone quebrado
  lista.addEventListener('error', (e) => {
    if (e.target.tagName === 'IMG') e.target.replaceWith(Object.assign(document.createElement('span'), { textContent: 'sem foto' }));
  }, true);

  function desfazProduto(id) {
    const i = S.atual.produtos.findIndex((p) => p.id === id);
    const o = S.origPorId.get(id);
    const foto = S.atual.produtos[i].imagem;
    if (!o) {
      S.atual.produtos.splice(i, 1);
      delete S.atual.descricoes[id];
    } else {
      S.atual.produtos[i] = Core.clonar(o);
      if (S.original.descricoes[id]) S.atual.descricoes[id] = Core.clonar(S.original.descricoes[id]);
      else delete S.atual.descricoes[id];
    }
    if (S.fotos.has(foto) && !S.atual.produtos.some((p) => p.imagem === foto)) S.fotos.delete(foto);
    desenhaLista();
    mudou();
    mostraToast(o ? 'Alterações do produto desfeitas.' : 'Produto novo descartado.');
  }

  /* ---------- Filtros ---------- */

  $('#f-busca').addEventListener('input', (e) => { S.filtro.busca = e.target.value; desenhaLista(); });
  $('#f-marca').addEventListener('change', (e) => { S.filtro.marca = e.target.value; desenhaLista(); });
  $$('.chips [data-cat]').forEach((b) => b.addEventListener('click', () => {
    S.filtro.cat = b.dataset.cat;
    $$('.chips [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    desenhaLista();
  }));

  /* ---------- Abas ---------- */

  function vaiParaAba(nome) {
    $$('.aba').forEach((b) => {
      const ativa = b.dataset.aba === nome;
      b.setAttribute('aria-selected', String(ativa));
      b.tabIndex = ativa ? 0 : -1;
      $(`#aba-${b.dataset.aba}`).hidden = !ativa;
    });
    if (nome === 'produtos') desenhaLista();
    if (nome === 'marcas') desenhaMarcas();
    if (nome === 'config') desenhaConfig();
  }
  $$('.aba').forEach((b) => {
    b.addEventListener('click', () => vaiParaAba(b.dataset.aba));
    b.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const abas = $$('.aba');
      const prox = abas[(abas.indexOf(b) + (e.key === 'ArrowRight' ? 1 : abas.length - 1)) % abas.length];
      vaiParaAba(prox.dataset.aba);
      prox.focus();
    });
  });

  /* ---------- Janelas: abrir/fechar ---------- */

  $$('dialog [data-fecha]').forEach((b) => b.addEventListener('click', () => b.closest('dialog').close()));
  $('#dlg-publicar').addEventListener('cancel', (e) => { if (S.publicando) e.preventDefault(); });

  /* ---------- Foto ---------- */

  const carregaImg = (arquivo) => new Promise((ok, falha) => {
    const url = URL.createObjectURL(arquivo);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); ok(img); };
    img.onerror = () => { URL.revokeObjectURL(url); falha(new Error('imagem')); };
    img.src = url;
  });
  const paraBlob = (canvas, tipo, qualidade) => new Promise((ok) => canvas.toBlob(ok, tipo, qualidade));
  const comoDataUrl = (blob) => new Promise((ok, falha) => {
    const r = new FileReader();
    r.onload = () => ok(r.result);
    r.onerror = () => falha(new Error('leitura'));
    r.readAsDataURL(blob);
  });

  // deixa a foto quadrada (fundo branco), até 800 px e leve, como as do catálogo
  async function processaFoto(arquivo) {
    let img;
    try { img = await createImageBitmap(arquivo); } catch { img = await carregaImg(arquivo); }
    const w = img.width;
    const h = img.height;
    const lado = Math.min(LADO_FOTO, Math.max(w, h));
    const cv = document.createElement('canvas');
    cv.width = lado;
    cv.height = lado;
    const cx = cv.getContext('2d');
    cx.fillStyle = '#ffffff';
    cx.fillRect(0, 0, lado, lado);
    cx.imageSmoothingQuality = 'high';
    const escala = lado / Math.max(w, h);
    cx.drawImage(img, (lado - w * escala) / 2, (lado - h * escala) / 2, w * escala, h * escala);
    let blob = await paraBlob(cv, 'image/webp', 0.86);
    if (!blob || blob.type !== 'image/webp') blob = await paraBlob(cv, 'image/jpeg', 0.9);
    return { dataUrl: await comoDataUrl(blob), ext: blob.type === 'image/webp' ? 'webp' : 'jpg', tamanho: blob.size };
  }

  /* ---------- Produto: janela de edição ---------- */

  const dp = {
    dlg: $('#dlg-produto'), form: $('#form-produto'),
    nome: $('#dp-nome'), tipo: $('#dp-tipo'), marca: $('#dp-marca'), categoria: $('#dp-categoria'), selo: $('#dp-selo'),
    preco: $('#dp-preco'), preco30: $('#dp-preco30'), antigo: $('#dp-antigo'),
    resumo: $('#dp-resumo'), serve: $('#dp-serve'), beneficios: $('#dp-beneficios'), ativos: $('#dp-ativos'), rotina: $('#dp-rotina'), importante: $('#dp-importante'),
    forma: $('#dp-forma'), corpo: $('#dp-cor-corpo'), tampa: $('#dp-cor-tampa'), texto: $('#dp-cor-texto'),
    erro: $('#dp-erro'), prev: $('#dp-foto-prev'), info: $('#dp-foto-info'),
  };
  dp.forma.innerHTML = FORMAS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  let ed = null;

  function previaFoto() {
    const src = ed.foto ? ed.foto.dataUrl : (!ed.removeFoto && ed.p.imagem ? srcFoto(ed.p.imagem) : '');
    dp.prev.innerHTML = src ? `<img src="${esc(src)}" alt="">` : '<span>sem foto</span>';
    $('#dp-foto-remover').hidden = !src;
  }

  function abreProduto(id) {
    if (!S.atual.marcas.length) { mostraToast('Cadastre uma marca primeiro (aba Marcas).'); return; }
    const existente = id ? produto(id) : null;
    const p = existente ? Core.clonar(existente) : {
      id: '', marca: S.filtro.marca || S.atual.marcas[0].id, categoria: S.filtro.cat === 'haircare' ? 'haircare' : 'skincare',
      nome: '', tipo: '', preco: null, imagem: '', arte: { ...ARTE_PADRAO },
    };
    ed = { novo: !existente, p, desc: existente ? Core.clonar(S.atual.descricoes[id]) || null : null, foto: null, removeFoto: false };

    $('#dp-titulo').textContent = existente ? 'Editar produto' : 'Novo produto';
    dp.nome.value = p.nome;
    dp.tipo.value = p.tipo || '';
    dp.marca.innerHTML = S.atual.marcas.map((m) => `<option value="${esc(m.id)}">${esc(m.nome)}</option>`).join('');
    dp.marca.value = p.marca;
    dp.categoria.value = p.categoria;
    dp.selo.value = p.selo || '';
    dp.preco.value = Core.formatarReais(p.preco);
    dp.preco30.value = Core.formatarReais(p.preco30);
    dp.antigo.value = Core.formatarReais(p.precoAntigo);
    $('#dp-preco30-rotulo').textContent = `Atacado (${S.atual.config.pecasFaixa2}+ peças)`;
    const d = ed.desc || {};
    dp.resumo.value = d.resumo || '';
    dp.serve.value = d.serve || '';
    dp.beneficios.value = Core.listaParaTexto(d.beneficios);
    dp.ativos.value = Core.ativosParaTexto(d.ativos);
    dp.rotina.value = Core.paragrafosParaTexto(d.rotina);
    dp.importante.value = d.importante || '';
    const guardados = [d.extra && `bloco “${d.extra.titulo}”`, d.tituloAtivos && 'título dos ativos'].filter(Boolean);
    const extra = $('#dp-extra-info');
    extra.hidden = !guardados.length;
    extra.textContent = guardados.length ? `Este produto também tem: ${guardados.join(' e ')}. O painel mantém isso como está.` : '';
    const arte = { ...ARTE_PADRAO, ...(p.arte || {}) };
    dp.forma.value = arte.forma;
    dp.corpo.value = arte.corpo;
    dp.tampa.value = arte.tampa;
    dp.texto.value = arte.texto;
    dp.erro.hidden = true;
    $('#dp-excluir').hidden = !existente;
    $('#dp-desc-det').open = false;
    $('#dp-foto').value = '';
    $('#dp-foto-info').textContent = 'A foto é ajustada sozinha (quadrada, fundo branco e leve). Sem foto, o site mostra uma ilustração da embalagem.';
    previaFoto();
    dp.dlg.showModal();
    if (!existente) dp.nome.focus();
  }

  $('#dp-foto').addEventListener('change', async (e) => {
    const arquivo = e.target.files[0];
    if (!arquivo) return;
    dp.info.textContent = 'Preparando a foto…';
    try {
      ed.foto = await processaFoto(arquivo);
      ed.removeFoto = false;
      dp.info.textContent = `Foto nova pronta (${Math.max(1, Math.round(ed.foto.tamanho / 1024))} KB). Ela vai para o site quando você publicar.`;
    } catch {
      dp.info.textContent = 'Não consegui abrir essa imagem. Use uma foto em JPG, PNG ou WebP.';
    }
    previaFoto();
  });

  $('#dp-foto-remover').addEventListener('click', () => {
    ed.foto = null;
    ed.removeFoto = true;
    $('#dp-foto').value = '';
    dp.info.textContent = 'Foto removida. O site vai mostrar a ilustração da embalagem.';
    previaFoto();
  });

  // mostra o erro dentro da janela e garante que ele fique à vista
  const mostraErro = (el, msg) => { el.textContent = msg; el.hidden = false; el.scrollIntoView({ block: 'nearest' }); };
  const erroProduto = (msg, campo) => { mostraErro(dp.erro, msg); if (campo) campo.focus(); };

  dp.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = dp.nome.value.trim();
    if (!nome) return erroProduto('Digite o nome do produto.', dp.nome);
    const preco = Core.lerReais(dp.preco.value);
    const preco30 = Core.lerReais(dp.preco30.value);
    const antigo = Core.lerReais(dp.antigo.value);
    if (Number.isNaN(preco)) return erroProduto('O preço normal não é um número válido.', dp.preco);
    if (Number.isNaN(preco30)) return erroProduto('O preço de atacado não é um número válido.', dp.preco30);
    if (Number.isNaN(antigo)) return erroProduto('O preço antigo não é um número válido.', dp.antigo);

    const p = ed.p;
    p.nome = nome;
    p.tipo = dp.tipo.value.trim();
    p.marca = dp.marca.value;
    p.categoria = dp.categoria.value;
    const selo = dp.selo.value.trim();
    if (selo) p.selo = selo; else delete p.selo;
    p.preco = preco;
    if (preco30 === null) delete p.preco30; else p.preco30 = preco30;
    if (antigo === null) delete p.precoAntigo; else p.precoAntigo = antigo;
    p.arte = { forma: dp.forma.value, corpo: dp.corpo.value, tampa: dp.tampa.value, texto: dp.texto.value };

    if (ed.novo) {
      const sl = Core.slug(nome);
      const base = sl.startsWith(p.marca) ? sl : `${p.marca}-${sl}`;
      p.id = Core.idUnico(base, new Set(S.atual.produtos.map((x) => x.id)));
    }
    const fotoAntiga = p.imagem;
    if (ed.foto) {
      const caminho = `${PASTA_FOTOS}${p.id}${fotoAntiga ? `-${Date.now().toString(36)}` : ''}.${ed.foto.ext}`;
      S.fotos.set(caminho, { dataUrl: ed.foto.dataUrl, ext: ed.foto.ext });
      p.imagem = caminho;
    } else if (ed.removeFoto) {
      p.imagem = '';
    }
    if (fotoAntiga && fotoAntiga !== p.imagem && S.fotos.has(fotoAntiga)) S.fotos.delete(fotoAntiga);

    const desc = Core.montarDescricao(ed.desc, {
      resumo: dp.resumo.value, serve: dp.serve.value, beneficios: dp.beneficios.value,
      ativos: dp.ativos.value, rotina: dp.rotina.value, importante: dp.importante.value,
    });
    if (desc) S.atual.descricoes[p.id] = desc; else delete S.atual.descricoes[p.id];

    const i = S.atual.produtos.findIndex((x) => x.id === p.id);
    if (i >= 0) S.atual.produtos[i] = p; else S.atual.produtos.push(p);

    dp.dlg.close();
    if (ed.novo) {
      S.filtro = { busca: '', marca: '', cat: 'todos' };
      $('#f-busca').value = '';
      desenhaFiltroMarcas();
      $$('.chips [data-cat]').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.cat === 'todos')));
    }
    desenhaLista();
    mudou();
    if (ed.novo) {
      const el = $(`.item[data-id="${CSS.escape(p.id)}"]`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    mostraToast(ed.novo ? 'Produto criado. Falta publicar para ele aparecer no site.' : 'Produto atualizado. Falta publicar.');
  });

  $('#dp-excluir').addEventListener('click', () => {
    const p = ed.p;
    if (!window.confirm(`Excluir “${p.nome}”?\n\nEle sai do site quando você publicar. Até lá, dá para desfazer.`)) return;
    const i = S.atual.produtos.findIndex((x) => x.id === p.id);
    const original = S.atual.produtos[i];
    const desc = S.atual.descricoes[p.id];
    S.atual.produtos.splice(i, 1);
    delete S.atual.descricoes[p.id];
    dp.dlg.close();
    desenhaLista();
    mudou();
    mostraToast(`“${p.nome}” foi excluído.`, {
      texto: 'Desfazer',
      fn: () => {
        S.atual.produtos.splice(i, 0, original);
        if (desc) S.atual.descricoes[p.id] = desc;
        desenhaLista();
        mudou();
      },
    });
  });

  $('#btn-novo-produto').addEventListener('click', () => abreProduto(null));

  /* ---------- Marcas ---------- */

  function desenhaMarcas() {
    const contagem = {};
    for (const p of S.atual.produtos) contagem[p.marca] = (contagem[p.marca] || 0) + 1;
    $('#lista-marcas').innerHTML = S.atual.marcas.map((m) => {
      const n = contagem[m.id] || 0;
      return `<article class="marca-card" data-id="${esc(m.id)}">
        <span class="logo logo--${esc(m.estilo)}" style="--cor:${esc(m.cor)};--fundo:${esc(m.fundo || '#fff')}" aria-hidden="true">${esc(m.logo)}</span>
        <div><h3>${esc(m.nome)}</h3><p>${n} ${n === 1 ? 'produto' : 'produtos'}${m.sub ? ` · ${esc(m.sub)}` : ''}</p></div>
        <div class="marca-card__acoes">
          <button class="btn btn--sec btn--peq" type="button" data-acao="editar-marca">Editar</button>
          <button class="link" type="button" data-acao="excluir-marca"${n ? ' disabled title="Só dá para excluir marcas sem produtos"' : ''}>Excluir</button>
        </div>
      </article>`;
    }).join('');
  }

  const dm = {
    dlg: $('#dlg-marca'), form: $('#form-marca'), nome: $('#dm-nome'), logo: $('#dm-logo'), estilo: $('#dm-estilo'),
    cor: $('#dm-cor'), fundoUsar: $('#dm-fundo-usar'), fundo: $('#dm-fundo'), sub: $('#dm-sub'), previa: $('#dm-previa'), erro: $('#dm-erro'),
  };
  dm.estilo.innerHTML = ESTILOS.map(([v, t]) => `<option value="${v}">${t}</option>`).join('');
  let marcaEmEdicao = null;

  function previaMarca() {
    dm.fundo.disabled = !dm.fundoUsar.checked;
    dm.previa.className = `logo logo--${dm.estilo.value}`;
    dm.previa.style.setProperty('--cor', dm.cor.value);
    dm.previa.style.setProperty('--fundo', dm.fundoUsar.checked ? dm.fundo.value : '#ffffff');
    dm.previa.textContent = dm.logo.value.trim() || dm.nome.value.trim() || 'Marca';
  }
  [dm.nome, dm.logo, dm.estilo, dm.cor, dm.fundoUsar, dm.fundo].forEach((el) => el.addEventListener('input', previaMarca));

  function abreMarca(id) {
    const m = id ? marcaDe(id) : null;
    marcaEmEdicao = m ? m.id : null;
    $('#dm-titulo').textContent = m ? 'Editar marca' : 'Nova marca';
    dm.nome.value = m ? m.nome : '';
    dm.logo.value = m && m.logo !== m.nome ? m.logo : '';
    dm.estilo.value = m ? m.estilo : 'sans';
    dm.cor.value = m ? m.cor : '#111111';
    dm.fundoUsar.checked = !!(m && m.fundo);
    dm.fundo.value = (m && m.fundo) || '#8b52c4';
    dm.sub.value = (m && m.sub) || '';
    dm.erro.hidden = true;
    previaMarca();
    dm.dlg.showModal();
    if (!m) dm.nome.focus();
  }

  dm.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nome = dm.nome.value.trim();
    if (!nome) { mostraErro(dm.erro, 'Digite o nome da marca.'); dm.nome.focus(); return; }
    const dados = { nome, logo: dm.logo.value.trim() || nome, estilo: dm.estilo.value, cor: dm.cor.value };
    if (dm.fundoUsar.checked) dados.fundo = dm.fundo.value;
    const sub = dm.sub.value.trim();
    if (sub) dados.sub = sub;
    if (marcaEmEdicao) {
      const m = marcaDe(marcaEmEdicao);
      for (const k of ['fundo', 'sub']) delete m[k];
      Object.assign(m, dados);
    } else {
      const id = Core.idUnico(Core.slug(nome) || 'marca', new Set(S.atual.marcas.map((x) => x.id)));
      S.atual.marcas.push({ id, ...dados });
    }
    dm.dlg.close();
    desenhaFiltroMarcas();
    desenhaMarcas();
    mudou();
    mostraToast(marcaEmEdicao ? 'Marca atualizada. Falta publicar.' : 'Marca criada. Agora você já pode cadastrar produtos dela.');
  });

  $('#btn-nova-marca').addEventListener('click', () => abreMarca(null));
  $('#lista-marcas').addEventListener('click', (e) => {
    const b = e.target.closest('[data-acao]');
    if (!b || b.disabled) return;
    const id = b.closest('.marca-card').dataset.id;
    if (b.dataset.acao === 'editar-marca') abreMarca(id);
    if (b.dataset.acao === 'excluir-marca') {
      const m = marcaDe(id);
      if (!window.confirm(`Excluir a marca “${m.nome}”? Ela sai do site quando você publicar.`)) return;
      S.atual.marcas.splice(S.atual.marcas.indexOf(m), 1);
      desenhaFiltroMarcas();
      desenhaMarcas();
      mudou();
    }
  });

  /* ---------- Regras e contato ---------- */

  const cfg = { faixa2: $('#cfg-faixa2'), express: $('#cfg-express'), whats: $('#cfg-whats'), msg: $('#cfg-msg'), zapAjuda: $('#cfg-whats-ajuda') };

  function formataZap(d) {
    d = String(d || '');
    if (d.length === 13) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 9)}-${d.slice(9)}`;
    if (d.length === 12) return `+${d.slice(0, 2)} (${d.slice(2, 4)}) ${d.slice(4, 8)}-${d.slice(8)}`;
    return d;
  }

  function ajudaZap() {
    const d = S.atual.config.whatsapp;
    const ok = /^\d{12,13}$/.test(String(d));
    cfg.zapAjuda.textContent = ok ? `Os pedidos e consultas vão para ${formataZap(d)}.` : 'Digite o DDD e o número (ex.: 62 98266-7385).';
    cfg.zapAjuda.style.color = ok ? '' : 'var(--erro)';
  }

  function desenhaConfig() {
    const c = S.atual.config;
    cfg.faixa2.value = c.pecasFaixa2;
    cfg.express.value = Core.formatarReais(c.expressMinimo);
    cfg.whats.value = formataZap(c.whatsapp);
    cfg.msg.value = c.mensagemConsulta || '';
    ajudaZap();
  }

  cfg.faixa2.addEventListener('input', () => {
    const n = parseInt(cfg.faixa2.value, 10);
    cfg.faixa2.setAttribute('aria-invalid', String(!(n >= 2)));
    if (n >= 2) { S.atual.config.pecasFaixa2 = n; mudou(); }
  });
  cfg.faixa2.addEventListener('change', () => { cfg.faixa2.removeAttribute('aria-invalid'); cfg.faixa2.value = S.atual.config.pecasFaixa2; });

  let expressAoFocar = null;
  cfg.express.addEventListener('focus', () => { expressAoFocar = S.atual.config.expressMinimo; });
  cfg.express.addEventListener('input', () => {
    const n = Core.lerReais(cfg.express.value);
    const invalido = n === null || Number.isNaN(n);
    cfg.express.setAttribute('aria-invalid', String(invalido));
    if (!invalido) { S.atual.config.expressMinimo = n; mudou(); }
  });
  cfg.express.addEventListener('change', () => {
    cfg.express.removeAttribute('aria-invalid');
    const c = S.atual.config;
    cfg.express.value = Core.formatarReais(c.expressMinimo);
    // o valor também aparece escrito na mensagem do botão; acompanha a mudança
    if (expressAoFocar !== null && expressAoFocar !== c.expressMinimo && c.mensagemConsulta.includes(brl(expressAoFocar))) {
      c.mensagemConsulta = c.mensagemConsulta.split(brl(expressAoFocar)).join(brl(c.expressMinimo));
      cfg.msg.value = c.mensagemConsulta;
      mostraToast('Também troquei o valor na mensagem do botão Atacado Express.');
      mudou();
    }
    expressAoFocar = c.expressMinimo;
  });

  cfg.whats.addEventListener('input', () => {
    let d = cfg.whats.value.replace(/\D/g, '');
    if (d.length === 10 || d.length === 11) d = `55${d}`;
    S.atual.config.whatsapp = d;
    ajudaZap();
    mudou();
  });
  cfg.whats.addEventListener('change', () => { cfg.whats.value = formataZap(S.atual.config.whatsapp); });
  cfg.msg.addEventListener('input', () => { S.atual.config.mensagemConsulta = cfg.msg.value; mudou(); });

  /* ---------- Conexão com o GitHub ---------- */

  const dc = {
    dlg: $('#dlg-conectar'), form: $('#form-conectar'), token: $('#dc-token'), repo: $('#dc-repo'), lembrar: $('#dc-lembrar'),
    erro: $('#dc-erro'), estado: $('#dc-estado'), sair: $('#dc-desconectar'), ok: $('#dc-conectar'),
  };
  let aposConectar = null;

  function abreConectar(motivo, depois) {
    aposConectar = depois || null;
    dc.token.value = '';
    dc.repo.value = S.repo || repoPadrao();
    dc.token.placeholder = S.token ? '(deixe vazio para manter a chave atual)' : 'github_pat_…';
    dc.erro.hidden = true;
    dc.estado.hidden = !(S.token || motivo);
    dc.estado.textContent = motivo || (S.token ? `Conectado a ${S.repo}.` : '');
    dc.sair.hidden = !S.token;
    dc.ok.textContent = S.token ? 'Salvar' : 'Conectar';
    dc.dlg.showModal();
    dc.token.focus();
  }

  dc.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const token = dc.token.value.trim() || S.token;
    const repo = dc.repo.value.trim().replace(/^https?:\/\/github\.com\//, '').replace(/\.git$/, '').replace(/\/+$/, '');
    const erro = (msg) => mostraErro(dc.erro, msg);
    if (!token) return erro('Cole a chave de acesso do GitHub.');
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) return erro('O repositório deve ficar assim: dono/nome (ex.: Snoopyzin/cherrykbeuty).');
    const anterior = S.token;
    S.token = token;
    dc.ok.disabled = true;
    dc.ok.textContent = 'Conectando…';
    try {
      const info = await api(`/repos/${repo}`);
      if (info.permissions && info.permissions.push === false) throw new Error('Essa chave só consegue ler o site. Crie uma com “Contents: Read and write”.');
      S.repo = info.full_name;
      guarda(localStorage, CHAVES.repo, S.repo);
      const lembrar = dc.lembrar.checked;
      guarda(localStorage, CHAVES.token, lembrar ? token : null);
      guarda(sessionStorage, CHAVES.token, lembrar ? null : token);
      S.erroConexao = null;
      dc.dlg.close();
      desenhaAvisos();
      mostraToast(`Conectado a ${S.repo}.`);
      if (aposConectar) { const f = aposConectar; aposConectar = null; f(); }
    } catch (err) {
      S.token = anterior;
      erro(err instanceof ErroApi ? mensagemErro(err) : err.message);
    } finally {
      dc.ok.disabled = false;
      dc.ok.textContent = S.token ? 'Salvar' : 'Conectar';
    }
  });

  dc.sair.addEventListener('click', () => {
    guarda(localStorage, CHAVES.token, null);
    guarda(sessionStorage, CHAVES.token, null);
    S.token = null;
    dc.dlg.close();
    desenhaAvisos();
    mostraToast('Desconectado. A chave foi apagada deste aparelho.');
  });

  /* ---------- Publicar ---------- */

  const nomeProduto = (id) => {
    const p = produto(id) || S.original.produtos.find((x) => x.id === id);
    return p ? p.nome : id;
  };
  const fmtValor = (k, v) => {
    if (v === undefined || v === null || v === '') return 'vazio';
    if (typeof v === 'number') return brl(v);
    if (k === 'imagem') return 'foto';
    if (k === 'arte') return 'novas cores/formato';
    return `“${v}”`;
  };

  function descreveCambios(c) {
    const itens = [];
    for (const p of c.produtos.adicionados) {
      itens.push({ titulo: `Produto novo: ${p.nome}`, detalhe: [marcaDe(p.marca) ? marcaDe(p.marca).nome : p.marca, temPreco(p) ? brl(p.preco) : 'sem preço', p.imagem ? 'com foto' : 'sem foto'].join(' · ') });
    }
    for (const [id, campos] of Object.entries(c.produtos.alterados)) {
      const o = S.origPorId.get(id);
      const partes = Object.entries(campos).map(([k, v]) => {
        if (k === 'imagem') return v ? (o.imagem ? 'foto trocada' : 'foto adicionada') : 'foto removida';
        if (k === 'arte') return 'ilustração';
        return `${ROTULOS[k] || k}: ${fmtValor(k, o[k])} → ${fmtValor(k, v)}`;
      });
      itens.push({ titulo: nomeProduto(id), detalhe: partes.join(' · ') });
    }
    for (const id of c.produtos.removidos) itens.push({ titulo: `Produto excluído: ${nomeProduto(id)}`, detalhe: 'sai do site' });
    const soDescricao = [...Object.keys(c.descricoes.alteradas), ...c.descricoes.removidas]
      .filter((id) => !(id in c.produtos.alterados) && !c.produtos.adicionados.some((p) => p.id === id) && !c.produtos.removidos.includes(id));
    for (const id of soDescricao) itens.push({ titulo: nomeProduto(id), detalhe: 'descrição completa alterada' });
    for (const m of c.marcas.adicionados) itens.push({ titulo: `Marca nova: ${m.nome}`, detalhe: '' });
    for (const id of Object.keys(c.marcas.alterados)) itens.push({ titulo: `Marca alterada: ${(marcaDe(id) || {}).nome || id}`, detalhe: '' });
    for (const id of c.marcas.removidos) itens.push({ titulo: `Marca excluída: ${id}`, detalhe: '' });
    const rotuloCfg = { pecasFaixa2: 'Atacado a partir de', expressMinimo: 'Atacado Express a partir de', whatsapp: 'WhatsApp', mensagemConsulta: 'Mensagem do botão Express' };
    for (const [k, v] of Object.entries(c.config)) {
      const antes = S.original.config[k];
      const fmt = (x) => (k === 'expressMinimo' ? brl(x) : k === 'pecasFaixa2' ? `${x} peças` : k === 'whatsapp' ? formataZap(x) : `“${x}”`);
      itens.push({ titulo: `Regras: ${rotuloCfg[k] || k}`, detalhe: k === 'mensagemConsulta' ? 'texto alterado' : `${fmt(antes)} → ${fmt(v)}` });
    }
    return itens;
  }

  function mensagemCommit(c) {
    const prodTocados = (n, um, varios) => (n ? `${n} ${n === 1 ? um : varios}` : '');
    let precos = 0;
    let outros = 0;
    for (const campos of Object.values(c.produtos.alterados)) {
      if (['preco', 'preco30', 'precoAntigo'].some((k) => k in campos)) precos++;
      if (Object.keys(campos).some((k) => !['preco', 'preco30', 'precoAntigo'].includes(k))) outros++;
    }
    const partes = [
      prodTocados(precos, 'preço alterado', 'preços alterados'),
      prodTocados(c.produtos.adicionados.length, 'produto novo', 'produtos novos'),
      prodTocados(c.produtos.removidos.length, 'produto excluído', 'produtos excluídos'),
      prodTocados(outros, 'produto editado', 'produtos editados'),
      prodTocados(c.marcas.adicionados.length + Object.keys(c.marcas.alterados).length + c.marcas.removidos.length, 'marca', 'marcas'),
      Object.keys(c.config).length ? 'regras da loja' : '',
    ].filter(Boolean);
    return `Painel da loja: ${partes.join(', ') || 'atualização do catálogo'}`;
  }

  const pub = $('#pb-conteudo');
  const cabecalhoPub = (titulo, fechar = true) => `<header class="dlg__topo"><h2 id="pb-titulo">${titulo}</h2>${fechar ? '<button class="fechar" type="button" data-pub-fecha aria-label="Fechar">×</button>' : ''}</header>`;
  const dlgPub = $('#dlg-publicar');

  function abrePublicar() {
    if (S.publicando) { if (!dlgPub.open) dlgPub.showModal(); return; }
    if (!S.total) { mostraToast('Não há nada novo para publicar.'); return; }
    if (!S.token) { abreConectar('Antes de publicar, conecte o painel ao GitHub. É só na primeira vez.', abrePublicar); return; }
    const { erros, avisos } = Core.validar(S.atual);
    if (erros.length) {
      pub.innerHTML = `${cabecalhoPub('Corrija antes de publicar')}
        <div class="dlg__corpo"><p class="pub-resumo">Encontrei <strong>${erros.length}</strong> ${erros.length === 1 ? 'problema' : 'problemas'} que impedem a publicação:</p>
        <ul class="pub-lista">${erros.map((x) => `<li>${esc(x.texto)}</li>`).join('')}</ul></div>
        <footer class="dlg__rodape"><span class="espaco"></span><button class="btn btn--prim" type="button" data-pub-fecha>Entendi</button></footer>`;
    } else {
      const itens = descreveCambios(S.cambios);
      pub.innerHTML = `${cabecalhoPub('Publicar no site?')}
        <div class="dlg__corpo">
          <p class="pub-resumo">Isto vai para o site de verdade. Confira o que mudou:</p>
          <ul class="pub-lista">${itens.map((i) => `<li><strong>${esc(i.titulo)}</strong>${i.detalhe ? `<span>${esc(i.detalhe)}</span>` : ''}</li>`).join('')}</ul>
          ${avisos.length ? `<div class="aviso" style="margin-top:14px"><strong>Vale conferir:</strong><ul>${avisos.map((x) => `<li>${esc(x.texto)}</li>`).join('')}</ul></div>` : ''}
        </div>
        <footer class="dlg__rodape"><span class="espaco"></span><button class="btn btn--sec" type="button" data-pub-fecha>Voltar</button><button class="btn btn--prim" type="button" id="pb-confirmar">Publicar agora</button></footer>`;
    }
    if (!dlgPub.open) dlgPub.showModal();
  }

  pub.addEventListener('click', (e) => {
    if (e.target.closest('[data-pub-fecha]')) dlgPub.close();
    if (e.target.closest('#pb-confirmar')) executaPublicacao();
    if (e.target.closest('#pb-de-novo')) abrePublicar();
    if (e.target.closest('#pb-reconectar')) {
      dlgPub.close();
      abreConectar('A chave anterior não funciona mais. Cole uma chave nova para continuar.', abrePublicar);
    }
  });

  const passoHtml = (texto) => `${cabecalhoPub('Publicando…', false)}<div class="dlg__corpo"><div class="pub-passo"><span class="rodando" aria-hidden="true"></span><span>${esc(texto)}</span></div><p class="campo__ajuda">Não feche esta janela até terminar.</p></div>`;

  async function executaPublicacao() {
    S.publicando = true;
    const etapa = (t) => { pub.innerHTML = passoHtml(t); };
    try {
      etapa('Conferindo o que está no ar…');
      const info = await api(`/repos/${S.repo}`);
      const ramo = info.default_branch;
      const ref = await api(`/repos/${S.repo}/git/ref/heads/${ramo}`);
      const cabeca = ref.object.sha;
      const commitBase = await api(`/repos/${S.repo}/git/commits/${cabeca}`);
      const [tp, td] = await Promise.all([lerRepo(ARQ_PRODUTOS, cabeca), lerRepo(ARQ_DESCRICOES, cabeca)]);

      // reaplica as minhas mudanças em cima do que está publicado agora
      const c = Core.calcularCambios(S.original, S.atual);
      const R0 = Core.avaliar(tp, td);
      const { dados: R1, avisos } = Core.aplicarCambios(R0, c);
      const v = Core.validar(R1);
      if (v.erros.length) throw new Error(`Ao juntar com o que já está no site, algo ficou inválido: ${v.erros[0].texto}`);
      const textos = Core.gerarTextos({ produtos: tp, descricoes: td }, R0, R1);

      const entradas = [];
      if (textos.produtos !== tp) entradas.push({ path: ARQ_PRODUTOS, mode: '100644', type: 'blob', content: textos.produtos });
      if (textos.descricoes !== td) entradas.push({ path: ARQ_DESCRICOES, mode: '100644', type: 'blob', content: textos.descricoes });

      const emUso = new Set(R1.produtos.map((p) => p.imagem));
      const novas = [...S.fotos].filter(([caminho]) => emUso.has(caminho));
      if (novas.length) etapa(`Enviando ${novas.length} ${novas.length === 1 ? 'foto' : 'fotos'}…`);
      const blobs = await Promise.all(novas.map(async ([caminho, f]) => {
        const b = await api(`/repos/${S.repo}/git/blobs`, { metodo: 'POST', corpo: { content: f.dataUrl.split(',')[1], encoding: 'base64' } });
        return { path: caminho, mode: '100644', type: 'blob', sha: b.sha };
      }));
      entradas.push(...blobs);

      // fotos de produtos excluídos ou trocados saem do repositório
      const orfas = [...new Set(R0.produtos.map((p) => p.imagem).filter((i) => i && i.startsWith(PASTA_FOTOS)))].filter((i) => !emUso.has(i));
      if (orfas.length) {
        const arvore = await api(`/repos/${S.repo}/git/trees/${commitBase.tree.sha}?recursive=1`);
        if (!arvore.truncated) {
          const existem = new Set(arvore.tree.map((t) => t.path));
          for (const caminho of orfas) if (existem.has(caminho)) entradas.push({ path: caminho, mode: '100644', type: 'blob', sha: null });
        }
      }

      if (!entradas.length) {
        pub.innerHTML = `${cabecalhoPub('Nada a publicar')}<div class="dlg__corpo"><p>O site já está exatamente igual ao painel.</p></div><footer class="dlg__rodape"><span class="espaco"></span><button class="btn btn--prim" type="button" data-pub-fecha>Ok</button></footer>`;
      } else {
        etapa('Publicando no site…');
        const arvoreNova = await api(`/repos/${S.repo}/git/trees`, { metodo: 'POST', corpo: { base_tree: commitBase.tree.sha, tree: entradas } });
        const commit = await api(`/repos/${S.repo}/git/commits`, { metodo: 'POST', corpo: { message: mensagemCommit(c), tree: arvoreNova.sha, parents: [cabeca] } });
        await api(`/repos/${S.repo}/git/refs/heads/${ramo}`, { metodo: 'PATCH', corpo: { sha: commit.sha, force: false } });
        pub.innerHTML = `${cabecalhoPub('Publicado!', false)}
          <div class="dlg__corpo"><div class="pub-ok">
            <div class="pub-ok__icone" aria-hidden="true">✓</div>
            <h3>Tudo enviado</h3>
            <p>O site se atualiza sozinho em cerca de <strong>1 a 2 minutos</strong>. Se não aparecer logo, atualize a página do site.</p>
            ${avisos.length ? `<div class="aviso" style="margin-top:14px;text-align:left"><ul>${avisos.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
          </div></div>
          <footer class="dlg__rodape"><span class="espaco"></span><a class="btn btn--sec" href="index.html" target="_blank" rel="noopener">Ver o site</a><button class="btn btn--prim" type="button" data-pub-fecha>Fechar</button></footer>`;
      }

      // o painel passa a mostrar exatamente o que ficou publicado
      for (const [caminho, f] of novas) S.publicadas.set(caminho, f.dataUrl);
      S.fotos.clear();
      S.original = Core.clonar(R1);
      S.atual = Core.clonar(R1);
      S.rascunhoRecuperado = null;
      reindexa();
      guarda(localStorage, CHAVES.rascunho, null);
      desenhaFiltroMarcas();
      desenhaLista();
      desenhaMarcas();
      desenhaConfig();
      desenhaAvisos();
      mudou();
    } catch (err) {
      if (err instanceof ErroApi && err.status === 401) { S.erroConexao = err; desenhaAvisos(); }
      pub.innerHTML = `${cabecalhoPub('Não deu certo', false)}
        <div class="dlg__corpo">
          <p class="aviso aviso--erro">${esc(mensagemErro(err))}</p>
          <p>Suas alterações continuam guardadas aqui no painel. Nada foi perdido.</p>
          <p class="tecnico">Detalhe técnico: ${esc(err.status ? `${err.status} ${err.message}` : err.message)}</p>
        </div>
        <footer class="dlg__rodape"><span class="espaco"></span><button class="btn btn--sec" type="button" data-pub-fecha>Fechar</button>${err instanceof ErroApi && err.status === 401
    ? '<button class="btn btn--prim" type="button" id="pb-reconectar">Conectar de novo</button>'
    : '<button class="btn btn--prim" type="button" id="pb-de-novo">Tentar de novo</button>'}</footer>`;
    } finally {
      S.publicando = false;
    }
  }

  $('#btn-publicar').addEventListener('click', abrePublicar);
  $('#btn-publicar-2').addEventListener('click', abrePublicar);

  $('#btn-descartar').addEventListener('click', () => {
    if (!window.confirm('Descartar todas as alterações que ainda não foram publicadas?\n\nO painel volta a ficar igual ao site.')) return;
    S.atual = Core.clonar(S.original);
    S.fotos.clear();
    S.rascunhoRecuperado = null;
    desenhaFiltroMarcas();
    desenhaLista();
    desenhaMarcas();
    desenhaConfig();
    desenhaAvisos();
    mudou();
    mostraToast('Alterações descartadas.');
  });

  /* ---------- Ferramentas avançadas ---------- */

  function baixa(nome, href) {
    const a = document.createElement('a');
    a.href = href;
    a.download = nome;
    document.body.append(a);
    a.click();
    a.remove();
  }

  $('#btn-baixar').addEventListener('click', async () => {
    try {
      const [tp, td] = await Promise.all([lerSite(ARQ_PRODUTOS), lerSite(ARQ_DESCRICOES)]);
      const R0 = Core.avaliar(tp, td);
      const { dados: R1 } = Core.aplicarCambios(R0, Core.calcularCambios(S.original, S.atual));
      const t = Core.gerarTextos({ produtos: tp, descricoes: td }, R0, R1);
      const url = (texto) => URL.createObjectURL(new Blob([texto], { type: 'text/javascript;charset=utf-8' }));
      baixa('produtos.js', url(t.produtos));
      baixa('descricoes.js', url(t.descricoes));
      const emUso = new Set(R1.produtos.map((p) => p.imagem));
      for (const [caminho, f] of S.fotos) if (emUso.has(caminho)) baixa(caminho.split('/').pop(), f.dataUrl);
      mostraToast('Arquivos baixados. Copie para js/ e images/produtos/ do projeto.');
    } catch (err) {
      mostraToast(`Não consegui gerar os arquivos: ${err.message}`);
    }
  });

  $('#btn-recarregar').addEventListener('click', () => {
    if (!window.confirm('Recarregar o catálogo que está no site e descartar o que ainda não foi publicado?')) return;
    guarda(localStorage, CHAVES.rascunho, null);
    location.reload();
  });
  $('#btn-conexao').addEventListener('click', () => abreConectar());

  /* ---------- Início ---------- */

  function mostraFalhaGeral(err) {
    const local = location.protocol === 'file:';
    lista.innerHTML = `<div class="aviso aviso--erro">
      <strong>Não consegui carregar o catálogo.</strong> ${esc(err.message)}
      ${local ? '<br>Você abriu o arquivo direto do computador. Abra o painel pelo endereço do site (ou pelo Live Server do VS Code).' : ''}
      <div class="botoes"><button class="btn btn--prim btn--peq" type="button" onclick="location.reload()">Tentar de novo</button></div>
    </div>`;
  }

  async function iniciar() {
    S.token = le(localStorage, CHAVES.token) || le(sessionStorage, CHAVES.token);
    S.repo = le(localStorage, CHAVES.repo) || repoPadrao();
    try {
      await carregar();
    } catch (err) {
      mostraFalhaGeral(err);
      return;
    }
    reindexa();
    desenhaFiltroMarcas();
    desenhaLista();
    desenhaAvisos();
    mudou();
  }

  iniciar();
})();
