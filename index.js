// JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const filtroIcone = document.getElementById('filtro-icone');
    const modal = document.getElementById('modal');
    const filtroAtivo = document.getElementById('filtro-ativo');

    filtroIcone.addEventListener('click', () => {
        modal.style.display = 'block';
    });

    const closeButton = document.querySelector('.close');
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const applyButton = document.querySelector('.modal-button');
    applyButton.addEventListener('click', () => {
        modal.style.display = 'none';
        exibirFiltrosAtivos();
    });

    function exibirFiltrosAtivos() {
        const tipoSelecionado = document.getElementById('tipoSelecionado').value;
        const quantidadeSelecionada = document.getElementById('quantidadeSelecionada').value;
        const dataDe = document.getElementById('dataDe').value;
        const dataAte = document.getElementById('dataAte').value;

        let filtrosAtivos = 0;

        if (tipoSelecionado !== 'selecione') {
            filtrosAtivos++;
        }

        if (quantidadeSelecionada !== '10') {
            filtrosAtivos++;
        }

        if (dataDe !== '') {
            filtrosAtivos++;
        }

        if (dataAte !== '') {
            filtrosAtivos++;
        }

        if (filtrosAtivos > 0) {
            filtroAtivo.textContent = filtrosAtivos;
            filtroAtivo.style.display = 'inline';
        } else {
            filtroAtivo.style.display = 'none';
        }
    }
});
