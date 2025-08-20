/* ====== Busca simples no index ======
   - Filtra cards pelo texto digitado
   - Atualiza a seção "Últimas atualizações" opcionalmente
*/
(function(){
  const input = document.querySelector('#q');
  const btn   = document.querySelector('#btnSearch');
  const cards = Array.from(document.querySelectorAll('.grid .card'));
  const updatesList = document.querySelector('#updatesList');

  if(!input || !btn || cards.length === 0) return;

  function normaliza(s){ return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu,''); }

  function filtrar(){
    const q = normaliza(input.value);
    let visiveis = 0;

    cards.forEach(card => {
      const texto = normaliza(card.innerText);
      const show = !q || texto.includes(q);
      card.style.display = show ? '' : 'none';
      if(show) visiveis++;
    });

    // Atualiza "Últimas atualizações" como feedback
    if(updatesList){
      if(q && visiveis === 0){
        updatesList.innerHTML = `<li>Nenhum resultado para <strong>${input.value}</strong>.</li>`;
      }else if(!q){
        // deixa como estava (idealmente você gerencia via JSON/markdown)
        updatesList.innerHTML = `
          <li>Criação da página do Void</li>
          <li>Primeiro rascunho de Itens</li>
          <li>Introdução de Lore</li>
        `;
      }
    }
  }

  input.addEventListener('input', filtrar);
  btn.addEventListener('click', filtrar);
})();

/* ====== Utilitário: alternar tema claro/escuro (opcional)
   - Para usar, crie um botão e chame toggleTheme()
*/
window.toggleTheme = function(){
  const html = document.documentElement;
  const isLight = html.getAttribute('data-theme') === 'light';
  html.setAttribute('data-theme', isLight ? '' : 'light');
  localStorage.setItem('wiki-theme', isLight ? 'dark' : 'light');
};

// aplica preferência salva
(function(){
  const saved = localStorage.getItem('wiki-theme');
  if(saved === 'light') document.documentElement.setAttribute('data-theme','light');
})();
