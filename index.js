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

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    const applyButton = document.querySelector('.modal-button');
    applyButton.addEventListener('click', () => {
        modal.style.display = 'none';
        aplicarFiltros();
    });

    function aplicarFiltros() {
        const tipoSelecionado = document.getElementById('tipoSelecionado').value;
        const quantidadeSelecionada = document.getElementById('quantidadeSelecionada').value;
        const dataDe = document.getElementById('dataDe').value;
        const dataAte = document.getElementById('dataAte').value;

        if (dataDe && !isValidDate(dataDe)) {
            alert('A data de início fornecida não é válida. Por favor, insira uma data válida.');
            return;
        }
        if (dataAte && !isValidDate(dataAte)) {
            alert('A data final fornecida não é válida. Por favor, insira uma data válida.');
            return;
        }

        const urlParams = new URLSearchParams(window.location.search);
        if (tipoSelecionado !== 'selecione') {
            urlParams.set('tipo', tipoSelecionado);
        } else {
            urlParams.delete('tipo');
        }
        urlParams.set('quantidade', quantidadeSelecionada);
        if (dataDe) {
            urlParams.set('dataDe', dataDe);
        } else {
            urlParams.delete('dataDe');
        }
        if (dataAte) {
            urlParams.set('dataAte', dataAte);
        } else {
            urlParams.delete('dataAte');
        }

        window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);

        buscarNoticias();
        exibirFiltrosAtivos();
    }

    function isValidDate(dateString) {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        return regex.test(dateString);
    }

    function exibirFiltrosAtivos() {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const filtrosAtivos = {};

  
        urlParams.forEach((value, key) => {
            filtrosAtivos[key] = value;
        });


        const numeroFiltrosAtivos = Object.keys(filtrosAtivos).length;

        filtroAtivo.textContent = `${numeroFiltrosAtivos}`;

        filtroAtivo.style.display = 'block';
    }

    function buscarNoticias() {
        const urlParams = new URLSearchParams(window.location.search);
        let apiUrl = 'http://servicodados.ibge.gov.br/api/v3/noticias?';
        apiUrl += 'limite=10&'; 

        urlParams.forEach((value, key) => {
            apiUrl += `${key}=${value}&`;
        });

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar as notícias');
                }
                return response.json();
            })
            .then(noticias => {
                exibirNoticias(noticias.items);
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao buscar as notícias. Por favor, tente novamente mais tarde.');
            });
    }

    function exibirNoticias(noticias) {
        const main = document.getElementById('main');
        main.innerHTML = ''; 

        const ul = document.createElement('ul');
        ul.classList.add('noticias');

        noticias.forEach(noticia => {
            const li = document.createElement('li');

            if (noticia.imagens && noticia.imagens.length > 0) {
                const img = document.createElement('img');
                img.src = `https://agenciadenoticias.ibge.gov.br/${noticia.imagens[0].link}`;
                img.alt = noticia.imagens[0].legenda;
                li.appendChild(img);
            }

            const titulo = document.createElement('h2');
            titulo.textContent = noticia.titulo;
            li.appendChild(titulo);

            const resumo = document.createElement('p');
            resumo.textContent = noticia.introducao;
            li.appendChild(resumo);

            if (Array.isArray(noticia.editorias)) {
                const editorias = document.createElement('p');
                editorias.classList.add('editorias');
                editorias.textContent = noticia.editorias.map(editoria => `#${editoria}`).join(' ');
                li.appendChild(editorias);
            }

            const dataPublicacao = new Date(noticia.data_publicacao);
            const publicado = calcularDiferencaData(dataPublicacao);

            const publicacao = document.createElement('p');
            publicacao.classList.add('publicacao');
            publicacao.textContent = publicado;
            li.appendChild(publicacao);

            const leiaMais = document.createElement('a');
            leiaMais.href = noticia.link;
            leiaMais.target = '_blank';
            leiaMais.classList.add('leia-mais');
            leiaMais.textContent = 'Leia Mais';
            li.appendChild(leiaMais);

            ul.appendChild(li);
        });

        main.appendChild(ul);
    }

    function calcularDiferencaData(dataPublicacao) {
        const hoje = new Date();
        const diferenca = Math.floor((hoje - dataPublicacao) / (1000 * 60 * 60 * 24));

        if (diferenca === 0) {
            return 'Publicado hoje';
        } else if (diferenca === 1) {
            return 'Publicado ontem';
        } else {
            return `Publicado há ${diferenca} dias`;
        }
    }

    buscarNoticias(); 
    exibirFiltrosAtivos(); 
});
