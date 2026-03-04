const openBtn = document.querySelector('.open-modal-btn');
  const closeBtn = document.querySelector('.close-modal');
  const modal = document.getElementById('modal');

  openBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Fecha clicando fora do modal
  modal.addEventListener('click', (e) => {
    console.log(e.target)
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });