/* SKIN NOTÍCIA ES — carrega só as matérias manuais do manifesto. */
(function () {
  var lista = Array.isArray(window.SKIN_MATERIAS) ? window.SKIN_MATERIAS : [];
  var origem = document.currentScript && document.currentScript.src
    ? document.currentScript.src.replace(/loader\.js(?:\?.*)?$/i, "")
    : "skin/";
  lista.forEach(function (arquivo) {
    if (!arquivo) return;
    var nome = String(arquivo).replace(/^materias\//, "");
    var src = /^https?:\/\//i.test(nome) || nome.charAt(0) === "/"
      ? nome
      : origem + "materias/" + nome;
    document.write("<script src=\"" + src + "\"><\/script>");
  });
})();
