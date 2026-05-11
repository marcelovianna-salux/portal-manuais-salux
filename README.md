# Central de Manuais - Salux

Site estático para hospedagem da documentação dos módulos e funcionalidades do sistema Salux SX Sigma. Funciona em pasta de rede compartilhada, sem necessidade de servidor web ou banco de dados.

## Estrutura de pastas

```
manuais_salux/
├── index.html                     ← Hub principal (com busca e filtros)
├── manuais.js                   ← Catálogo central (editar para adicionar manuais)
├── README.md                      ← Este arquivo
│
├── assets/                        ← Recursos COMPARTILHADOS por todos os manuais
│   ├── css/
│   │   ├── bootstrap*.css
│   │   ├── estilo.css            ← Estilo Salux original
│   │   ├── hub.css               ← Estilo do hub
│   │   └── font-awesome*.css
│   ├── js/
│   │   ├── jquery.js / popper.js / bootstrap.js
│   │   ├── smoothscroll.js
│   │   └── hub.js                ← Lógica do hub
│   ├── fonts/                    ← Roboto, Lane Narrow, FontAwesome, etc.
│   └── img/                      ← Logos institucionais (logo_sx.png, favicon.png)
│
└── modulos/                      ← Cada módulo é uma pasta
    ├── gestao-glosas/
    │   ├── index.html            ← Manual completo
    │   ├── img/                  ← Prints das telas (locais ao manual)
    │   └── videos/               ← Vídeos do tutorial
    │
    └── gerador-documentos/
        └── prescricoes-documentos-obrigatorios/
            ├── index.html
            ├── img/
            └── videos/
```

---

## Como abrir o site

### Em pasta de rede compartilhada (recomendado para o caso de uso atual)

1. Copie a pasta `manuais_salux/` inteira para o servidor de arquivos do hospital
2. Os usuários acessam via `\\servidor\compartilhamento\manuais_salux\index.html`
3. Tudo funciona sem internet (exceto fontes do Google e ícones FontAwesome do CDN — ver seção de operação offline abaixo)

### Abertura por duplo clique (`file://`)

O hub é totalmente compatível com abertura direta do disco (duplo clique no `index.html`). Não há dependência de servidor web ou de requisições assíncronas: o catálogo é carregado como JavaScript embutido, contornando as restrições de CORS local dos navegadores modernos.

---

## Como adicionar um novo manual

### Passo 1 — Criar a pasta do manual

Dentro de `modulos/`, crie a pasta seguindo a convenção `modulos/<modulo>/<nome-do-manual>/`. Use `kebab-case` (palavras separadas por hífen, sem acentos):

```
modulos/cadastros-gerais/relatorio-acomodacao/
├── index.html
├── img/
│   ├── CGCA114_P.png             ← Use o código da tela como nome
│   └── CGCA114_R.png
└── videos/
    └── CGCA114_T.mp4
```

### Passo 2 — Criar o `index.html` do manual

Use um manual existente como template. Os caminhos dos recursos compartilhados devem usar `../../../assets/` (3 níveis acima — ajustar conforme profundidade da pasta).

Inclua o botão "Voltar ao Índice" logo após `<div class="container">`:

```html
<a href="../../../index.html" class="btn btn-outline-info btn-sm mb-3">
    <i class='fas fa-arrow-left'></i> Voltar ao Índice de Manuais
</a>
```

### Passo 3 — Adicionar ao catálogo `manuais.js`

Abra `manuais.js` e adicione um novo objeto no array `manuais` (não esqueça da vírgula entre os itens):

```javascript
{
  "id": "relatorio-acomodacao",
  "titulo": "Relatório de Acomodação Sala Ambulatório",
  "descricao": "Consulta e impressão das acomodações vinculadas às salas de ambulatório, com filtros por Unidade, Sala, Situação e Condição.",
  "modulo": "Cadastros Gerais",
  "categoria": "Relatório",
  "telas": ["CGCA114_P", "CGCA114_R"],
  "tags": ["acomodação", "sala", "ambulatório", "relatório"],
  "url": "modulos/cadastros-gerais/relatorio-acomodacao/index.html",
  "data_publicacao": "2026-05-08",
  "versao": "1.0",
  "autor": "Nome do autor",
  "tem_video": false,
  "icone": "fas fa-bed"
}
```

> **Nota técnica:** o arquivo `manuais.js` segue sintaxe JavaScript, mas o conteúdo é praticamente idêntico ao JSON. As únicas atenções são (1) cuidar das vírgulas entre os itens do array e (2) não remover o `window.MANUAIS_CATALOG = { ... };` que envolve a estrutura.

### Campos do catálogo

| Campo | Obrigatório | Descrição |
|-------|-------------|-----------|
| `id` | Sim | Identificador único (kebab-case). Não use acentos ou espaços. |
| `titulo` | Sim | Título do manual exibido no card e na busca. |
| `descricao` | Sim | Resumo de 1-2 frases (aparece no card). |
| `modulo` | Sim | Nome do módulo Salux (ex: "Gerador de Documentos"). Usado no agrupamento e filtro lateral. |
| `categoria` | Sim | Categoria funcional (Cadastro, Movimentação, Relatório, Vínculo, Configuração, etc.). |
| `telas` | Recomendado | Códigos das telas que aparecem no manual (ex: "EDOV014_T"). Aparecem na busca. |
| `tags` | Recomendado | Palavras-chave para busca (até 4 são exibidas no card). |
| `url` | Sim | Caminho relativo para o `index.html` do manual. |
| `data_publicacao` | Sim | Data ISO `AAAA-MM-DD`. Aparece no card formatada como `DD/MM/AAAA`. |
| `versao` | Sim | Versão do manual (`1.0`, `1.1`, `2.0`). |
| `autor` | Recomendado | Nome do autor responsável. |
| `tem_video` | Sim | `true` se o manual contém vídeo embed. Usado no filtro "Com vídeo". |
| `icone` | Recomendado | Classe FontAwesome (ex: `fas fa-bed`, `fas fa-coins`). Padrão: `fas fa-file-alt`. |

### Passo 4 — Validar

Abra `index.html` no navegador. O novo manual deve aparecer:
- Na contagem total
- Nos filtros laterais (Módulos e Categorias) com a contagem atualizada
- No grid agrupado por módulo
- Na busca por título, descrição, módulo, código de tela ou tag

---

## Manutenção do catálogo

### Atualizando o cabeçalho do catálogo

Sempre que fizer mudanças significativas no catálogo, atualize:

```json
"_versao_catalogo": "1.1",
"_atualizado_em": "DD/MM/AAAA"
```

Esses valores aparecem no rodapé do hub.

### Recomendações de governança (perspectiva QA)

- **Versionamento** — versione esta pasta em Git para rastrear o histórico de edições, autoria e revisões dos manuais
- **Padronização** — mantenha um único responsável (ou pequeno grupo) com permissão para editar `manuais.js`, evitando conflitos
- **Code review** — antes de publicar um novo manual em produção, faça revisão técnica E revisão editorial (linguagem, ortografia, prints atualizados)
- **Deprecação** — manuais que descrevem funcionalidades descontinuadas não devem ser apagados, mas marcados (sugestão: criar campo `deprecado: true` no catálogo e filtrá-los no `hub.js`)
- **Acessibilidade** — sempre preencha o atributo `alt` das imagens dos manuais; ajuda usuários com leitores de tela e também a busca interna do navegador
- **Auditoria** — registre num arquivo `CHANGELOG.md` da pasta as alterações feitas em cada manual (data, autor, versão, mudança)

---

## Operação offline (sem internet)

O HTML referencia algumas fontes/ícones em CDNs externos:
- Google Fonts (`fonts.googleapis.com`) — Raleway
- FontAwesome 5 (`use.fontawesome.com`) — ícones modernos

Em ambiente sem internet, estes recursos não carregam. Comportamento:
- O texto continua legível (cai para a fonte do sistema)
- Alguns ícones podem aparecer como quadradinhos vazios (os ícones do FontAwesome 4.x local em `assets/css/font-awesome.min.css` continuam funcionando)

**Para 100% offline**, baixe localmente os arquivos do CDN e atualize as referências no `<head>` para apontarem para `assets/css/`.

---

## Suporte e contato

Para dúvidas sobre o funcionamento do hub ou sobre como criar novos manuais, contate o responsável pela documentação técnica do produto Salux.
