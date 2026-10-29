/* =========================================================
   Cherry Kbeuty — PAINEL: lógica dos dados (sem tela)

   Lê js/produtos.js e js/descricoes.js, calcula o que mudou e
   reescreve só os trechos alterados (comentários e o resto do
   arquivo ficam como estão). A tela fica em js/admin.js.

   Também roda no Node: require('./admin-core.js')
   ========================================================= */
(function (raiz) {
  'use strict';

  const clonar = (v) => (v === undefined ? undefined : JSON.parse(JSON.stringify(v)));

  // igualdade profunda que ignora a ordem das chaves e chaves undefined
  function iguais(a, b) {
    if (a === b) return true;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a) !== Array.isArray(b)) return false;
    const ka = Object.keys(a).filter((k) => a[k] !== undefined);
    const kb = Object.keys(b).filter((k) => b[k] !== undefined);
    return ka.length === kb.length && ka.every((k) => iguais(a[k], b[k]));
  }

  const semAcento = (t) => String(t).normalize('NFD').replace(/[̀-ͯ]/g, '');
  const slug = (t) => semAcento(t).toLowerCase().replace(/['’‘`´]/g, '').replace(/&/g, ' e ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const escRe = (t) => String(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function idUnico(base, existentes) {
    const limpo = (base || 'item').slice(0, 64).replace(/-+$/, '');
    let id = limpo;
    for (let n = 2; existentes.has(id); n++) id = `${limpo}-${n}`;
    return id;
  }

  /* ---------- Dinheiro ---------- */

  // "149,90" · "149.90" · "1.234,56" · "R$ 2.300" → número; vazio → null; inválido → NaN
  function lerReais(texto) {
    let t = String(texto ?? '').replace(/[R$\s ]/g, '');
    if (!t) return null;
    if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
    else if (/^\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
    if (!/^\d+(\.\d+)?$/.test(t)) return NaN;
    return Math.round(Number(t) * 100) / 100;
  }

  // 200 → "200" · 95.5 → "95,50"
  const formatarReais = (n) => (typeof n !== 'number' || Number.isNaN(n) ? '' : Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','));

  // 2300 → "R$ 2.300" (espaço normal, igual ao que está nos textos do site)
  function moedaBR(n) {
    const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 });
    return fmt.format(n).replace(/ /g, ' ');
  }

  /* ---------- Leitura dos arquivos do site ---------- */

  function executa(texto) {
    const w = {};
    new Function('window', `${texto}\n`)(w);
    return w;
  }

  function avaliar(textoProdutos, textoDescricoes) {
    const a = executa(textoProdutos);
    const b = executa(textoDescricoes);
    return clonar({
      config: a.CHERRY_CONFIG || {},
      marcas: a.CHERRY_MARCAS || [],
      produtos: a.CHERRY_PRODUTOS || [],
      descricoes: b.CHERRY_DESCRICOES || {},
    });
  }

  /* ---------- O que mudou ---------- */

  function diffLista(antes, depois) {
    const A = new Map(antes.map((x) => [x.id, x]));
    const B = new Set(depois.map((x) => x.id));
    const alterados = {};
    for (const x of depois) {
      const a = A.get(x.id);
      if (!a) continue;
      const campos = {};
      for (const k of new Set([...Object.keys(a), ...Object.keys(x)])) {
        if (!iguais(a[k], x[k])) campos[k] = x[k]; // undefined = campo apagado
      }
      if (Object.keys(campos).length) alterados[x.id] = campos;
    }
    return {
      adicionados: depois.filter((x) => !A.has(x.id)),
      removidos: antes.filter((x) => !B.has(x.id)).map((x) => x.id),
      alterados,
    };
  }

  function calcularCambios(antes, depois) {
    const config = {};
    for (const k of new Set([...Object.keys(antes.config), ...Object.keys(depois.config)])) {
      if (!iguais(antes.config[k], depois.config[k])) config[k] = depois.config[k];
    }
    const descricoes = { alteradas: {}, removidas: [] };
    for (const id of Object.keys(depois.descricoes)) {
      if (!iguais(antes.descricoes[id], depois.descricoes[id])) descricoes.alteradas[id] = depois.descricoes[id];
    }
    for (const id of Object.keys(antes.descricoes)) {
      if (!(id in depois.descricoes)) descricoes.removidas.push(id);
    }
    return { config, marcas: diffLista(antes.marcas, depois.marcas), produtos: diffLista(antes.produtos, depois.produtos), descricoes };
  }

  // produtos mexidos de qualquer forma (preço, foto, descrição, novo, removido)
  function idsTocados(c) {
    return new Set([
      ...Object.keys(c.produtos.alterados),
      ...c.produtos.adicionados.map((p) => p.id),
      ...c.produtos.removidos,
      ...Object.keys(c.descricoes.alteradas),
      ...c.descricoes.removidas,
    ]);
  }

  function totalCambios(c) {
    return idsTocados(c).size
      + c.marcas.adicionados.length + Object.keys(c.marcas.alterados).length + c.marcas.removidos.length
      + Object.keys(c.config).length;
  }

  // Reaplica as minhas mudanças em cima do que está publicado agora.
  // Assim, mesmo que alguém tenha mexido no catálogo no meio tempo, nada se perde.
  function aplicarCambios(base, c) {
    const d = clonar(base);
    const avisos = [];
    Object.assign(d.config, clonar(c.config));

    const aplicaLista = (lista, ch, rotulo) => {
      for (const id of ch.removidos) {
        const i = lista.findIndex((x) => x.id === id);
        if (i >= 0) lista.splice(i, 1);
      }
      for (const [id, campos] of Object.entries(ch.alterados)) {
        const x = lista.find((y) => y.id === id);
        if (!x) { avisos.push(`${rotulo} “${id}” não existe mais no site; a alteração dele foi ignorada.`); continue; }
        for (const [k, v] of Object.entries(campos)) {
          if (v === undefined) delete x[k]; else x[k] = clonar(v);
        }
      }
      for (const n of ch.adicionados) {
        const i = lista.findIndex((y) => y.id === n.id);
        if (i >= 0) lista[i] = clonar(n); else lista.push(clonar(n));
      }
    };
    aplicaLista(d.marcas, c.marcas, 'A marca');
    aplicaLista(d.produtos, c.produtos, 'O produto');
    for (const id of c.descricoes.removidas) delete d.descricoes[id];
    for (const [id, v] of Object.entries(c.descricoes.alteradas)) d.descricoes[id] = clonar(v);
    return { dados: d, avisos };
  }

  /* ---------- Escrita em JavaScript ---------- */

  // U+2028/U+2029 quebram linha em strings JS antigas
  const SEPARADORES = new RegExp(`[${String.fromCharCode(0x2028, 0x2029)}]`, "g");
  const aspas = (s) => `'${String(s)
    .replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    .replace(/\r/g, '\\r').replace(/\n/g, '\\n')
    .replace(SEPARADORES, (c) => String.fromCharCode(92) + 'u' + c.charCodeAt(0).toString(16))}'`;
  const chave = (k) => (/^[A-Za-z_$][\w$]*$/.test(k) ? k : aspas(k));

  function valorInline(v) {
    if (v === null) return 'null';
    if (typeof v === 'string') return aspas(v);
    if (typeof v === 'number' || typeof v === 'boolean') return String(v);
    if (Array.isArray(v)) return `[${v.map(valorInline).join(', ')}]`;
    const itens = Object.entries(v).filter(([, x]) => x !== undefined).map(([k, x]) => `${chave(k)}: ${valorInline(x)}`);
    return itens.length ? `{ ${itens.join(', ')} }` : '{}';
  }

  // mesmo desenho dos blocos de js/produtos.js: 3 linhas de dados + a ilustração
  function blocoProduto(p, { foto = false } = {}) {
    const usados = new Set();
    const tem = (k) => p[k] !== undefined;
    const par = (k) => {
      usados.add(k);
      const m = k === 'imagem' && foto && typeof p.imagem === 'string' && p.imagem.match(/^images\/produtos\/(.+)\.webp$/);
      return m && m[1] === p.id ? `imagem: FOTO(${aspas(p.id)})` : `${chave(k)}: ${valorInline(p[k])}`;
    };
    const l1 = ['id', 'marca', 'categoria'].filter(tem).map(par);
    const l2 = ['nome', 'tipo', 'selo', 'destaque'].filter(tem).map(par);
    const l3 = ['preco', 'preco30', 'precoAntigo', 'imagem'].filter(tem).map(par);
    const l4 = ['arte'].filter(tem).map(par);
    const resto = Object.keys(p).filter((k) => !usados.has(k) && tem(k)).map(par);
    const linhas = [l1, l2, [...l3, ...resto], l4].filter((l) => l.length).map((l) => l.join(', '));
    return `  { ${linhas.join(',\n    ')} },`.split('\n');
  }

  function linhaMarca(m) {
    const ordem = ['id', 'nome', 'logo', 'estilo', 'cor', 'fundo', 'sub'];
    const ks = [...ordem, ...Object.keys(m).filter((k) => !ordem.includes(k))].filter((k) => m[k] !== undefined);
    return `  { ${ks.map((k) => `${chave(k)}: ${valorInline(m[k])}`).join(', ')} },`;
  }

  function blocoDescricao(id, d) {
    const l = [`  ${aspas(id)}: {`];
    for (const [k, v] of Object.entries(d)) {
      if (v === undefined) continue;
      if (Array.isArray(v)) {
        l.push(`    ${chave(k)}: [`);
        for (const item of v) l.push(`      ${valorInline(item)},`);
        l.push('    ],');
      } else {
        l.push(`    ${chave(k)}: ${valorInline(v)},`);
      }
    }
    l.push('  },');
    return l;
  }

  /* ---------- Reescrita só dos trechos alterados ---------- */

  const quebra = (t) => ({ eol: t.includes('\r\n') ? '\r\n' : '\n', L: t.split(/\r?\n/) });

  function remendaProdutos(texto, A, B) {
    const { eol, L } = quebra(texto);
    const foto = /\bconst\s+FOTO\s*=/.test(texto);
    const FIM = /^\];?\s*$/;
    const falha = (o) => { throw new Error(`trecho não encontrado: ${o}`); };
    const achaIni = (re, o) => { const i = L.findIndex((l) => re.test(l)); return i < 0 ? falha(o) : i; };
    const achaFim = (ini, re, o) => { for (let i = ini + 1; i < L.length; i++) if (re.test(L[i])) return i; return falha(o); };

    // 1. configurações (uma por linha: troca só o valor e mantém o comentário da linha)
    for (const k of Object.keys(B.config)) {
      if (iguais(A.config[k], B.config[k])) continue;
      const ini = achaIni(/^window\.CHERRY_CONFIG\s*=\s*\{/, 'config');
      const fim = achaFim(ini, /^\};?\s*$/, 'config');
      const re = new RegExp(`^(\\s*${escRe(k)}:\\s*)(.*?),(\\s*\\/\\/.*)?$`);
      let achou = false;
      for (let i = ini + 1; i < fim; i++) {
        if (!re.test(L[i])) continue;
        L[i] = L[i].replace(re, (_, a, _v, cm) => `${a}${valorInline(B.config[k])},${cm || ''}`);
        achou = true;
        break;
      }
      if (!achou) L.splice(fim, 0, `  ${chave(k)}: ${valorInline(B.config[k])},`);
    }

    // 2. marcas (uma por linha)
    const dm = diffLista(A.marcas, B.marcas);
    const linhaDaMarca = (id) => {
      const ini = achaIni(/^window\.CHERRY_MARCAS\s*=\s*\[/, 'marcas');
      const fim = achaFim(ini, FIM, 'marcas');
      const re = new RegExp(`^\\s*\\{\\s*id:\\s*'${escRe(id)}'`);
      for (let i = ini + 1; i < fim; i++) if (re.test(L[i])) return i;
      return falha(`marca ${id}`);
    };
    for (const id of dm.removidos) L.splice(linhaDaMarca(id), 1);
    for (const id of Object.keys(dm.alterados)) L[linhaDaMarca(id)] = linhaMarca(B.marcas.find((m) => m.id === id));
    for (const m of dm.adicionados) {
      const ini = achaIni(/^window\.CHERRY_MARCAS\s*=\s*\[/, 'marcas');
      L.splice(achaFim(ini, FIM, 'marcas'), 0, linhaMarca(m));
    }

    // 3. produtos (blocos separados por linha em branco)
    const dp = diffLista(A.produtos, B.produtos);
    const blocoDe = (id) => {
      const ini = achaIni(/^window\.CHERRY_PRODUTOS\s*=\s*\[/, 'produtos');
      const fim = achaFim(ini, FIM, 'produtos');
      const re = new RegExp(`^\\s*\\{\\s*id:\\s*'${escRe(id)}'`);
      for (let s = ini + 1; s < fim; s++) {
        if (!re.test(L[s])) continue;
        let e = s;
        while (e + 1 < fim && L[e + 1].trim() !== '') e++;
        return [s, e, fim];
      }
      return falha(`produto ${id}`);
    };
    for (const id of dp.removidos) {
      const [s, e, fim] = blocoDe(id);
      const branco = e + 1 < fim && L[e + 1].trim() === '' ? 1 : 0;
      L.splice(s, e - s + 1 + branco);
    }
    for (const id of Object.keys(dp.alterados)) {
      const [s, e] = blocoDe(id);
      L.splice(s, e - s + 1, ...blocoProduto(B.produtos.find((p) => p.id === id), { foto }));
    }
    for (const p of dp.adicionados) {
      const ini = achaIni(/^window\.CHERRY_PRODUTOS\s*=\s*\[/, 'produtos');
      const fim = achaFim(ini, FIM, 'produtos');
      const novo = blocoProduto(p, { foto });
      L.splice(fim, 0, ...(L[fim - 1].trim() === '' ? [] : ['']), ...novo);
    }
    return L.join(eol);
  }

  function remendaDescricoes(texto, A, B) {
    const { eol, L } = quebra(texto);
    const falha = (o) => { throw new Error(`trecho não encontrado: ${o}`); };
    const blocoDe = (id) => {
      const re = new RegExp(`^\\s{2}['"]?${escRe(id)}['"]?:\\s*\\{\\s*$`);
      const s = L.findIndex((l) => re.test(l));
      if (s < 0) return falha(`descrição ${id}`);
      let e = s + 1;
      while (e < L.length && !/^ {2}\},?\s*$/.test(L[e])) e++;
      if (e >= L.length) return falha(`fim da descrição ${id}`);
      return [s, e];
    };
    const ids = (d) => Object.keys(d);
    for (const id of ids(A.descricoes).filter((x) => !(x in B.descricoes))) {
      const [s, e] = blocoDe(id);
      L.splice(s, e - s + 1 + (L[e + 1] !== undefined && L[e + 1].trim() === '' ? 1 : 0));
    }
    for (const id of ids(B.descricoes)) {
      if (!(id in A.descricoes) || iguais(A.descricoes[id], B.descricoes[id])) continue;
      const [s, e] = blocoDe(id);
      L.splice(s, e - s + 1, ...blocoDescricao(id, B.descricoes[id]));
    }
    for (const id of ids(B.descricoes).filter((x) => !(x in A.descricoes))) {
      let fim = L.length - 1;
      while (fim >= 0 && !/^\};?\s*$/.test(L[fim])) fim--;
      if (fim < 0) return falha('fim do arquivo de descrições');
      L.splice(fim, 0, ...(L[fim - 1].trim() === '' ? [] : ['']), ...blocoDescricao(id, B.descricoes[id]));
    }
    return L.join(eol);
  }

  // Plano B: reescreve o arquivo inteiro (só se o remendo não ficar idêntico ao esperado)
  function regeneraProdutos(texto, B) {
    const { eol, L } = quebra(texto);
    const i = L.findIndex((l) => /^window\.CHERRY_CONFIG\s*=/.test(l));
    const saida = [
      ...(i > 0 ? L.slice(0, i) : []),
      'window.CHERRY_CONFIG = {',
      ...Object.entries(B.config).map(([k, v]) => `  ${chave(k)}: ${valorInline(v)},`),
      '};', '',
      'window.CHERRY_MARCAS = [', ...B.marcas.map(linhaMarca), '];', '',
      'window.CHERRY_PRODUTOS = [',
      ...B.produtos.flatMap((p, n) => [...(n ? [''] : []), ...blocoProduto(p)]),
      '];', '',
    ];
    return saida.join(eol);
  }

  function regeneraDescricoes(texto, B) {
    const { eol, L } = quebra(texto);
    const i = L.findIndex((l) => /^window\.CHERRY_DESCRICOES\s*=/.test(l));
    const saida = [
      ...(i > 0 ? L.slice(0, i) : []),
      'window.CHERRY_DESCRICOES = {', '',
      ...Object.entries(B.descricoes).flatMap(([id, d]) => [...blocoDescricao(id, d), '']),
      '};', '',
    ];
    return saida.join(eol);
  }

  const confereProdutos = (t, B) => {
    try {
      const w = executa(t);
      return iguais(clonar(w.CHERRY_CONFIG), B.config) && iguais(clonar(w.CHERRY_MARCAS), B.marcas) && iguais(clonar(w.CHERRY_PRODUTOS), B.produtos);
    } catch { return false; }
  };
  const confereDescricoes = (t, B) => {
    try { return iguais(clonar(executa(t).CHERRY_DESCRICOES), B.descricoes); } catch { return false; }
  };

  // textos = { produtos, descricoes } como estão no site agora; A = dados desses textos; B = como devem ficar
  function gerarTextos(textos, A, B) {
    const saida = { produtos: textos.produtos, descricoes: textos.descricoes, plano: 'remendo' };
    if (!iguais(A.config, B.config) || !iguais(A.marcas, B.marcas) || !iguais(A.produtos, B.produtos)) {
      let t = null;
      try { t = remendaProdutos(textos.produtos, A, B); } catch { t = null; }
      if (t === null || !confereProdutos(t, B)) { t = regeneraProdutos(textos.produtos, B); saida.plano = 'completo'; }
      if (!confereProdutos(t, B)) throw new Error('Não consegui gerar o arquivo de produtos com segurança.');
      saida.produtos = t;
    }
    if (!iguais(A.descricoes, B.descricoes)) {
      let t = null;
      try { t = remendaDescricoes(textos.descricoes, A, B); } catch { t = null; }
      if (t === null || !confereDescricoes(t, B)) { t = regeneraDescricoes(textos.descricoes, B); saida.plano = 'completo'; }
      if (!confereDescricoes(t, B)) throw new Error('Não consegui gerar o arquivo de descrições com segurança.');
      saida.descricoes = t;
    }
    return saida;
  }

  /* ---------- Descrição completa: formulário ⇄ dados ---------- */

  const listaParaTexto = (l = []) => l.join('\n');
  const textoParaLista = (t) => String(t || '').split(/\n/).map((s) => s.trim()).filter(Boolean);
  const paragrafosParaTexto = (l = []) => l.join('\n\n');
  const textoParaParagrafos = (t) => String(t || '').split(/\n\s*\n/).map((s) => s.replace(/\s*\n\s*/g, ' ').trim()).filter(Boolean);
  const ativosParaTexto = (l = []) => l.map(([n, t]) => `${n}: ${t}`).join('\n');
  function textoParaAtivos(t) {
    return textoParaLista(t).map((linha) => {
      const i = linha.indexOf(':');
      return i < 0 ? [linha, ''] : [linha.slice(0, i).trim(), linha.slice(i + 1).trim()];
    });
  }

  // Aplica os campos do formulário em cima da descrição que já existe,
  // sem perder o que o formulário não mostra (extra, tituloAtivos…). Sem nada → null (apaga).
  function montarDescricao(existente, c) {
    const d = existente ? clonar(existente) : {};
    const campos = [
      ['resumo', String(c.resumo || '').trim()],
      ['serve', String(c.serve || '').trim()],
      ['beneficios', textoParaLista(c.beneficios)],
      ['ativos', textoParaAtivos(c.ativos)],
      ['rotina', textoParaParagrafos(c.rotina)],
      ['importante', String(c.importante || '').trim()],
    ];
    for (const [k, v] of campos) {
      if (Array.isArray(v) ? !v.length : !v) delete d[k]; else d[k] = v;
    }
    return Object.keys(d).length ? d : null;
  }

  /* ---------- Conferência antes de publicar ---------- */

  function validar(d) {
    const erros = [];
    const avisos = [];
    const marcas = new Set();
    for (const m of d.marcas) {
      if (marcas.has(m.id)) erros.push({ texto: `Marca repetida: ${m.id}` });
      marcas.add(m.id);
      if (!String(m.nome || '').trim()) erros.push({ texto: `Uma marca está sem nome (${m.id})` });
    }
    const vistos = new Set();
    for (const p of d.produtos) {
      const nome = p.nome || p.id;
      if (vistos.has(p.id)) erros.push({ id: p.id, texto: `Código de produto repetido: ${p.id}` });
      vistos.add(p.id);
      if (!String(p.nome || '').trim()) erros.push({ id: p.id, texto: `Há um produto sem nome (${p.id})` });
      if (!marcas.has(p.marca)) erros.push({ id: p.id, texto: `“${nome}” está sem uma marca válida` });
      if (!['skincare', 'haircare'].includes(p.categoria)) erros.push({ id: p.id, texto: `“${nome}” está sem categoria` });
      for (const k of ['preco', 'preco30', 'precoAntigo']) {
        const v = p[k];
        if (v !== undefined && v !== null && !(typeof v === 'number' && Number.isFinite(v) && v >= 0)) erros.push({ id: p.id, texto: `“${nome}” tem um preço inválido` });
      }
      if (typeof p.preco === 'number' && typeof p.preco30 === 'number' && p.preco30 > p.preco) {
        avisos.push({ id: p.id, texto: `“${nome}”: o preço de atacado (${moedaBR(p.preco30)}) está maior que o preço normal (${moedaBR(p.preco)}).` });
      }
      if (typeof p.precoAntigo === 'number' && (typeof p.preco !== 'number' || p.precoAntigo <= p.preco)) {
        avisos.push({ id: p.id, texto: `“${nome}”: para entrar em Promoções, o preço antigo precisa ser maior que o preço atual.` });
      }
    }
    const c = d.config;
    if (!Number.isInteger(c.pecasFaixa2) || c.pecasFaixa2 < 2) erros.push({ texto: 'O atacado precisa começar em 2 peças ou mais.' });
    if (typeof c.expressMinimo !== 'number' || !(c.expressMinimo >= 0)) erros.push({ texto: 'O valor do Atacado Express é inválido.' });
    if (!/^\d{12,13}$/.test(String(c.whatsapp || ''))) erros.push({ texto: 'O WhatsApp precisa ter DDI + DDD + número (ex.: 5562999998888).' });
    if (c.descontoSeguir !== undefined) {
      if (!Number.isInteger(c.descontoSeguir) || c.descontoSeguir < 0 || c.descontoSeguir > 100) erros.push({ texto: 'O desconto por seguir no Instagram precisa estar entre 0% e 100%.' });
      const perfis = Array.isArray(c.perfisInstagram) ? c.perfisInstagram : [];
      if (c.descontoSeguir > 0 && !perfis.length) erros.push({ texto: 'Informe ao menos um perfil do Instagram para o desconto (ou coloque 0% para esconder o aviso).' });
      if (perfis.some((p) => !/^[A-Za-z0-9._]{1,30}$/.test(p))) erros.push({ texto: 'Há um perfil do Instagram com nome inválido (use só letras, números, ponto e sublinhado).' });
    }
    if (c.secoes !== undefined) {
      if (!Array.isArray(c.secoes)) {
        erros.push({ texto: 'As seções da página inicial estão num formato inválido.' });
      } else {
        const vistas = new Set();
        for (const s of c.secoes) {
          if (!String(s.titulo || '').trim()) erros.push({ texto: 'Há uma seção da página inicial sem título.' });
          if (!s.id || vistas.has(s.id)) erros.push({ texto: `Seção repetida ou sem código: ${s.titulo || s.id}` });
          vistas.add(s.id);
          const sumiram = (s.produtos || []).filter((id) => !d.produtos.some((p) => p.id === id));
          if (sumiram.length) avisos.push({ texto: `A seção “${s.titulo}” tem produtos que não existem mais: ${sumiram.join(', ')}.` });
        }
      }
    }
    return { erros, avisos };
  }

  // "@abiacamps, https://www.instagram.com/cherrykbeauty_/" → ['abiacamps', 'cherrykbeauty_']
  function lerPerfis(texto) {
    const lista = [];
    for (const parte of String(texto || '').split(/[\s,;]+/)) {
      const p = parte.replace(/^https?:\/\/(www\.)?instagram\.com\//i, '').replace(/[/?#].*$/, '').replace(/^@+/, '');
      if (p && !lista.some((x) => x.toLowerCase() === p.toLowerCase())) lista.push(p);
    }
    return lista;
  }

  const api = {
    clonar, iguais, semAcento, slug, idUnico, lerReais, formatarReais, moedaBR,
    avaliar, calcularCambios, idsTocados, totalCambios, aplicarCambios, gerarTextos, validar,
    listaParaTexto, textoParaLista, paragrafosParaTexto, textoParaParagrafos, ativosParaTexto, textoParaAtivos, montarDescricao, lerPerfis,
    _interno: { blocoProduto, blocoDescricao, linhaMarca, remendaProdutos, remendaDescricoes, regeneraProdutos, regeneraDescricoes, valorInline },
  };
  raiz.CherryAdminCore = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis);
