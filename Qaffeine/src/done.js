function done() {
  const hero = document.querySelector('.hero-img');
  if (hero) {
    hero.src = 'images/done.png';
    console.log('%c🎉 Gratulujeme! Projekt dokončen!', 'color:#6B8F71;font-size:20px;font-weight:bold');
  }
}
