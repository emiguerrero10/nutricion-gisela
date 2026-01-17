(function(){
  const slides = Array.from(document.querySelectorAll('#aboutSlides .slide'));
  const prev = document.getElementById('aboutPrev');
  const next = document.getElementById('aboutNext');
  const dotsWrap = document.getElementById('aboutDots');
  if(!slides.length) return;

  let i = 0;
  let timer = null;

  function renderDots(){
    dotsWrap.innerHTML = slides.map((_, idx) =>
      `<button class="dot ${idx===i?'is-active':''}" aria-label="Ir a imagen ${idx+1}" data-idx="${idx}"></button>`
    ).join('');
  }

  function go(idx){
    slides[i].classList.remove('is-active');
    i = (idx + slides.length) % slides.length;
    slides[i].classList.add('is-active');
    renderDots();
  }

  function start(){
    stop();
    timer = setInterval(()=> go(i+1), 5000);
  }

  function stop(){
    if(timer) clearInterval(timer);
  }

  prev?.addEventListener('click', ()=> { go(i-1); start(); });
  next?.addEventListener('click', ()=> { go(i+1); start(); });

  dotsWrap?.addEventListener('click', (e)=>{
    const b = e.target.closest('.dot');
    if(!b) return;
    go(parseInt(b.dataset.idx,10));
    start();
  });

  renderDots();
  start();
})();
