document.addEventListener("DOMContentLoaded", function () {
  const botoes = document.querySelectorAll(".filter-btn");
  const itens = document.querySelectorAll(".grid-item");

  if (!botoes.length) return;

  botoes.forEach(function (botao) {
    botao.addEventListener("click", function () {
      const filtro = botao.dataset.filter;

      // marca visualmente qual botão está ativo
      botoes.forEach(function (b) { b.classList.remove("active"); });
      botao.classList.add("active");

      // mostra/esconde cada item da grade
      itens.forEach(function (item) {
        const categoria = item.dataset.categoria;
        const mostrar = filtro === "todos" || categoria === filtro;
        item.style.display = mostrar ? "" : "none";
      });
    });
  });
});
