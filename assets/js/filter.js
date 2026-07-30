// ============================================================
// Esse arquivo controla três coisas do site:
// 1) Embaralhar a ordem dos trabalhos na grade (a cada carregamento)
// 2) O filtro por categoria e por tags
// 3) Abrir/fechar os painéis "Sobre" e "+ filtros", empurrando o
//    conteúdo da página pra baixo quando estão abertos
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // --------------------------------------------------------
  // Pega referências dos elementos da página que vamos manipular.
  // Se algum não existir naquela página (ex: página de projeto
  // não tem grade), a variável fica "null" e os "if" mais abaixo
  // simplesmente pulam aquele trecho sem dar erro.
  // --------------------------------------------------------
  const grid = document.getElementById("grid");
  const headerFixed = document.getElementById("header-fixed");
  const main = document.getElementById("main-content");


  // --------------------------------------------------------
  // FUNÇÃO: ajustarEspacoDoTopo
  //
  // Como o cabeçalho (título + nav + painéis) tem "position: fixed",
  // ele "flutua" por cima do resto da página. Isso significa que o
  // conteúdo abaixo dele (a grade de trabalhos, por exemplo) precisa
  // de um espaço em branco no topo pra não ficar escondido atrás do
  // cabeçalho.
  //
  // Só que a altura do cabeçalho muda: ele fica mais alto quando
  // "Sobre" ou "+ filtros" estão abertos, e mais baixo quando estão
  // fechados. Em vez de calcular esse número manualmente no CSS
  // toda vez, essa função mede a altura REAL do cabeçalho agora
  // mesmo (com offsetHeight) e aplica esse valor como o espaço
  // reservado no topo do conteúdo (padding-top).
  //
  // Ela é chamada: ao carregar a página, sempre que a janela muda
  // de tamanho, e sempre que um painel abre ou fecha.
  // --------------------------------------------------------
  function ajustarEspacoDoTopo() {
    if (headerFixed && main) {
      main.style.paddingTop = headerFixed.offsetHeight + "px";
    }
  }

  ajustarEspacoDoTopo(); // roda uma vez assim que a página carrega
  window.addEventListener("resize", ajustarEspacoDoTopo); // e de novo se a janela for redimensionada


  // --------------------------------------------------------
  // EMBARALHAR A ORDEM DOS TRABALHOS (algoritmo Fisher-Yates)
  //
  // "grid.children" pega todos os itens que estão dentro da grade.
  // O loop abaixo troca a posição de dois itens aleatórios, várias
  // vezes, até a ordem inteira ficar embaralhada.
  //
  // Isso só roda se existir uma #grid nessa página (ou seja, só na
  // home — a página de projeto individual não tem grade, então
  // esse "if" é ignorado nela).
  // --------------------------------------------------------
  if (grid) {
    const itensArray = Array.from(grid.children);

    for (let i = itensArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itensArray[i], itensArray[j]] = [itensArray[j], itensArray[i]];
    }

    // depois de embaralhado no array, reinsere os itens na página
    // nessa nova ordem
    itensArray.forEach(function (item) {
      grid.appendChild(item);
    });

    // adiciona a classe "pronta" — lembra que no CSS a grade nasce
    // invisível (visibility: hidden) até essa classe ser adicionada,
    // pra evitar o "flash" da ordem original antes de embaralhar
    grid.classList.add("pronta");
  }


  // --------------------------------------------------------
  // Referências dos botões de filtro e dos itens da grade,
  // usadas na seção de filtro logo abaixo.
  // --------------------------------------------------------
  const botoesCategoria = document.querySelectorAll(".filter-btn");
  const botoesTag = document.querySelectorAll(".tag-btn");
  const itens = document.querySelectorAll(".grid-item");

  // Referências dos elementos do painel "+ filtros"
  const toggleFiltros = document.getElementById("toggle-filtros");
  const painelTags = document.getElementById("filter-bar-tags");

  // Referências dos elementos do painel "Sobre"
  const toggleSobre = document.getElementById("toggle-sobre");
  const painelSobre = document.getElementById("sobre-panel");

  // Guarda o estado atual do filtro: qual categoria está selecionada,
  // e quais tags estão marcadas (pode ter várias tags ao mesmo tempo,
  // por isso é um "Set" — uma lista sem itens repetidos)
  let categoriaAtiva = "todos";
  let tagsAtivas = new Set();


  // --------------------------------------------------------
  // FUNÇÃO: aplicarFiltro
  //
  // Roda toda vez que o visitante clica em um botão de categoria
  // ou de tag. Ela passa por CADA item da grade e decide se ele
  // deve aparecer ou ficar escondido, comparando com o que está
  // selecionado no momento (categoriaAtiva e tagsAtivas).
  //
  // - passaCategoria: verdadeiro se a categoria ativa for "todos",
  //   OU se o item pertence à categoria selecionada
  // - passaTags: verdadeiro se nenhuma tag estiver selecionada,
  //   OU se o item tiver PELO MENOS UMA das tags selecionadas
  //   (esse "pelo menos uma" é o comportamento "OU" entre tags)
  //
  // O item só aparece se as duas condições forem verdadeiras ao
  // mesmo tempo (categoria E tags) — por isso o "&&".
  // --------------------------------------------------------
  function aplicarFiltro() {
    itens.forEach(function (item) {
      const categoria = item.dataset.categoria;
      const tagsItem = item.dataset.tags ? item.dataset.tags.split(",") : [];

      const passaCategoria = categoriaAtiva === "todos" || categoria === categoriaAtiva;
      const passaTags = tagsAtivas.size === 0 ||
        tagsItem.some(function (t) { return tagsAtivas.has(t); });

      item.style.display = (passaCategoria && passaTags) ? "" : "none";
    });
  }


  // --------------------------------------------------------
  // Clique em um botão de CATEGORIA:
  // troca qual categoria está ativa, atualiza o visual do botão
  // (classe "active"), e roda o filtro de novo.
  // --------------------------------------------------------
  botoesCategoria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      categoriaAtiva = botao.dataset.filter;

      // remove o destaque visual de todos os botões de categoria...
      botoesCategoria.forEach(function (b) { b.classList.remove("active"); });
      // ...e coloca só no que foi clicado agora
      botao.classList.add("active");

      aplicarFiltro();
    });
  });


  // --------------------------------------------------------
  // Clique em um botão de TAG:
  // diferente da categoria, aqui várias tags podem estar ativas
  // ao mesmo tempo — por isso, em vez de "trocar" a tag ativa,
  // o clique ADICIONA a tag no conjunto se ela ainda não estava,
  // ou REMOVE se ela já estava selecionada (efeito de "ligar/desligar").
  // --------------------------------------------------------
  botoesTag.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const tag = botao.dataset.tag;

      if (tagsAtivas.has(tag)) {
        tagsAtivas.delete(tag);
        botao.classList.remove("active");
      } else {
        tagsAtivas.add(tag);
        botao.classList.add("active");
      }

      aplicarFiltro();
    });
  });


  // --------------------------------------------------------
  // Clique no botão "+ filtros":
  // abre/fecha o painel de tags (classe "aberto" no CSS controla
  // se ele aparece ou não), e chama ajustarEspacoDoTopo() de novo
  // porque a altura do cabeçalho mudou (painel abriu ou fechou).
  // --------------------------------------------------------
  if (toggleFiltros && painelTags) {
    toggleFiltros.addEventListener("click", function () {
      painelTags.classList.toggle("aberto");
      toggleFiltros.classList.toggle("active");
      ajustarEspacoDoTopo();
    });
  }


  // --------------------------------------------------------
  // Clique no botão "Sobre":
  // mesmo princípio do "+ filtros" — abre/fecha o painel,
  // e recalcula o espaço no topo em seguida.
  // --------------------------------------------------------
  if (toggleSobre && painelSobre) {
    toggleSobre.addEventListener("click", function () {
      painelSobre.classList.toggle("aberto");
      toggleSobre.classList.toggle("active");
      ajustarEspacoDoTopo();
    });
  }

});