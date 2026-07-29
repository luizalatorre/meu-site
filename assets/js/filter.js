document.addEventListener("DOMContentLoaded", function () {
  const grid = document.getElementById("grid");

  if (grid) {
    const itensArray = Array.from(grid.children);

    // embaralha o array (Fisher-Yates)
    for (let i = itensArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [itensArray[i], itensArray[j]] = [itensArray[j], itensArray[i]];
    }

    // reinsere na nova ordem
    itensArray.forEach(function (item) {
      grid.appendChild(item);
    });

    grid.classList.add("pronta"); // só agora ela aparece
  }

  const botoesCategoria = document.querySelectorAll(".filter-btn");
  const botoesTag = document.querySelectorAll(".tag-btn");
  const itens = document.querySelectorAll(".grid-item");

  let categoriaAtiva = "todos";
  let tagsAtivas = new Set();

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

  botoesCategoria.forEach(function (botao) {
    botao.addEventListener("click", function () {
      categoriaAtiva = botao.dataset.filter;
      botoesCategoria.forEach(function (b) { b.classList.remove("active"); });
      botao.classList.add("active");
      aplicarFiltro();
    });
  });

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
});