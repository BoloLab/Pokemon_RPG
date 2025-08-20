// include.js — carrega parciais HTML em elementos com [data-include]
(async function(){
  // Util: resolve caminho relativo da parcial em relação à página atual
  function resolvePath(base, relative){
    const a = document.createElement('a');
    a.href = base; // página atual
    const url = new URL(relative, a.href);
    return url.href;
  }

  // Carrega e injeta uma parcial
  async function include(el){
    const src = el.getAttribute('data-include');
    if(!src) return;

    // resolve URL absoluta a partir da página atual
    const full = resolvePath(location.pathname, src);
    const res = await fetch(full);
    if(!res.ok) { el.innerHTML = `<!-- Falha ao carregar ${src} -->`; return; }

    const html = await res.text();
    el.innerHTML = html;

    // após injetar, se for o header, marque nav ativa
    if(el.matches('[data-include*="header.html"]')){
      marcaNavAtiva(el);
      ajustaLinksRelativos(el);
    }
  }

  // Marca item de navegação ativo comparando path atual
  function marcaNavAtiva(scope){
    const links = scope.querySelectorAll('nav a[href]');
    const here = location.pathname.split('/').pop(); // ex.: 'personagens.html' ou 'void.html'
    links.forEach(a => {
      const target = a.getAttribute('href');
      const file = (target || '').split('/').pop();
      if(file && here === file){
        a.setAttribute('aria-current', 'page');
        a.style.background = 'rgba(255,255,255,.08)';
        a.style.color = 'var(--text)';
      }
    });
  }

  // Ajusta links e imagens do header quando a página está em subpastas
  function ajustaLinksRelativos(scope){
    // Ex.: se estou em /pages/personagens/void.html, um href="./index.html"
    // precisa virar "../index.html". A solução mais robusta é usar paths relativos a /pages/.
    // Se você preferir, pode usar caminhos absolutos a partir de /src/pages/ e servir com um server.
  }

  // Inclui todos
  const targets = document.querySelectorAll('[data-include]');
  await Promise.all(Array.from(targets).map(include));
})();
