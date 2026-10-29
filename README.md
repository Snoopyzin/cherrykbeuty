# Cherry Kbeuty

Site estático (HTML/CSS/JS) publicado no GitHub Pages. O catálogo fica em `js/produtos.js` e `js/descricoes.js`.

## Painel de edição (`admin.html`)

Página para editar preços, produtos, fotos, marcas e as regras do atacado sem mexer em código.
Acesso: `https://<site>/admin.html` (não tem link no site e está marcada como `noindex`).

O que ela faz:

- Preços direto na lista (normal, atacado, preço antigo para promoções). Cada produto tem um botão **+ Promoção** (liga/desliga na própria linha, e também uma caixa "Colocar este produto em promoção" ao criar ou editar): ao ligar, o preço de hoje vira o "antigo" riscado e ela digita o novo preço ou um desconto como "10%"; ao desligar, volta ao preço antigo.
- Criar, editar e excluir produtos, com foto (convertida para WebP quadrado de até 800 px) e descrição completa.
- Criar, editar e excluir marcas. Ao cadastrar um produto, o campo **Marca** tem a opção "+ Criar nova marca…". Nomes de marca compridos (ex.: "Victoria's Secret") quebram em linhas e encolhem para caber no círculo da seção Marcas.
- **Vitrine:** escolher o que fica em **Promoções!** (seção no topo da página inicial, logo abaixo da faixa rolante; é só escolher o produto e digitar o novo preço ou um desconto como "10%", e o preço de hoje vira o "antigo" riscado), marcar **Lançamentos** (etiqueta `selo: 'Lançamento'`) e criar as próprias seções.
- **Suas próprias seções:** ela cria quantas seções quiser (ex.: "Mais vendidos", "Kits"), escolhe os produtos de cada uma e a ordem. Ficam em `CHERRY_CONFIG.secoes` (`id`, `titulo`, `texto` opcional e `produtos`) e aparecem na página inicial logo abaixo das Promoções; seção sem produto não aparece.
- Regras: peças para o atacado, valor do Atacado Express, WhatsApp e o **desconto por seguir no Instagram** (`descontoSeguir` e `perfisInstagram` em `CHERRY_CONFIG`; 0% esconde o aviso da página inicial).
- Nada vai para o ar até clicar em **Publicar**. As edições ficam guardadas no aparelho (rascunho).
- **Publicar** faz um único commit no GitHub (`js/produtos.js`, `js/descricoes.js` e as fotos) e o workflow de Pages atualiza o site em 1 a 2 minutos.
- Antes de commitar, o painel relê o que está no repositório e reaplica só as alterações feitas nele, então mudanças feitas por outra pessoa no meio tempo não são perdidas.
- Só os trechos alterados dos arquivos são reescritos: comentários e o resto ficam como estão.

### Configuração (uma vez, no aparelho de quem vai editar)

O painel publica usando uma chave de acesso do GitHub guardada no navegador de quem o usa.

1. Na conta dona do repositório: <https://github.com/settings/personal-access-tokens/new>
2. **Repository access** → *Only select repositories* → `cherrykbeuty`.
3. **Repository permissions** → **Contents: Read and write** (nenhuma outra).
4. **Expiration**: o maior prazo. Quando vencer, é só gerar outra e reconectar no painel.
5. Em `admin.html`, clique em **Conectar** e cole a chave (`github_pat_…`).

A chave só vale para este repositório. Para revogar: GitHub → Settings → Developer settings → Personal access tokens.

### Para quem mexe no código

- O painel lê o catálogo do **GitHub**, não da sua pasta local. Faça `git push` do que estiver pendente antes de passar o painel para uso e dê `git pull` antes de editar `js/produtos.js` na mão, senão o próximo push vai conflitar com o que foi publicado pelo painel.
- Convenções que o painel segue ao reescrever `js/produtos.js`: cada produto é um bloco separado por linha em branco; cada marca e cada opção de `CHERRY_CONFIG` fica em uma linha. Se mudar esse formato, o painel ainda funciona (ele confere o resultado e, se não bater, reescreve o arquivo inteiro), mas deixa de preservar os comentários.
- `js/admin-core.js` tem a lógica de dados (sem tela) e roda no Node: `require('./js/admin-core.js')`.
- O texto de `<meta name="description">` no `index.html` é fixo e não acompanha as regras alteradas pelo painel.
