document.addEventListener('DOMContentLoaded', function() {
    const filtroIcone = document.getElementById('filtro-icone');
    const modal = document.getElementById('modal');

    filtroIcone.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const applyButton  = document.querySelector('.modal-button');
    applyButton.addEventListener('click',() => {
         modal.style.display = 'none';
    });
});
  