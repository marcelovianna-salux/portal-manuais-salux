(function () {
  var css = `
    #salux-back-top {
      position: fixed;
      bottom: 32px;
      right: 32px;
      z-index: 9999;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: none;
      cursor: pointer;
      outline: none;
      background: #3B9FE8;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(59,159,232,0.40);
      opacity: 0;
      transform: translateY(14px) scale(0.85);
      pointer-events: none;
      transition: opacity .28s ease, transform .28s ease, background .18s ease;
    }
    #salux-back-top.visible {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }
    #salux-back-top:hover {
      background: #1E7AC8;
      box-shadow: 0 6px 24px rgba(59,159,232,0.55);
      transform: translateY(-2px) scale(1.06);
    }
    #salux-back-top:active { transform: scale(0.96); }
    #salux-back-top::after {
      content: 'Voltar ao início';
      position: absolute;
      right: calc(100% + 10px);
      top: 50%;
      transform: translateY(-50%);
      background: #1A2D3D;
      color: #fff;
      font-size: 12px;
      font-family: 'Segoe UI', system-ui, sans-serif;
      font-weight: 500;
      white-space: nowrap;
      padding: 5px 10px;
      border-radius: 6px;
      pointer-events: none;
      opacity: 0;
      transition: opacity .18s ease;
    }
    #salux-back-top.visible:hover::after { opacity: 1; }
  `;
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var btn = document.createElement('button');
  btn.id = 'salux-back-top';
  btn.title = 'Voltar ao início';
  btn.setAttribute('aria-label', 'Voltar ao início da página');
  btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 15V5M10 5L5 10M10 5L15 10" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
