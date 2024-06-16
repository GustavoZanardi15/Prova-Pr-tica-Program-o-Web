const urlSearchParams = new URLSearchParams(location.search);

if (urlSearchParams.get("de") == "" || urlSearchParams.get("ate") == "" || urlSearchParams.get("busca") == "") {
    if (urlSearchParams.get("de") == "") urlSearchParams.delete("de");
    if (urlSearchParams.get("ate") == "") urlSearchParams.delete("ate");
    if (urlSearchParams.get("busca") == "") urlSearchParams.delete("busca");
    window.location.href = window.location.pathname + '?' + urlSearchParams;
}

const paginaAtual = parseInt(urlSearchParams.get("page")) || 1;

let qtd = parseInt(urlSearchParams.get("qtd")) || 10;
let busca = urlSearchParams.get("busca");
let tipo = urlSearchParams.get("tipo");
let de = urlSearchParams.get("de");
let ate = urlSearchParams.get("ate");

insereNoticiasNaPagina(qtd, busca, tipo, de, ate, paginaAtual).then(count => {
    const quantidadeBotoes = Math.ceil(count / qtd);
    console.log(count + " noticias");
    console.log(quantidadeBotoes + " botoes");
    const listaPaginacao = document.getElementById("paginacao");
    if (paginaAtual == 1 || (paginaAtual > 1 && paginaAtual < 6)) {
        for (let i = 0; i < (quantidadeBotoes > 9 ? 10 : quantidadeBotoes); i++) {
            listaPaginacao.appendChild(criaBotaoPaginacao(i + 1));
        }
    } else if (quantidadeBotoes > 10) {
        for (let i = (quantidadeBotoes - paginaAtual < 5 ? quantidadeBotoes - 9 : paginaAtual - 4); i < (paginaAtual + 6 < quantidadeBotoes + 1 ? paginaAtual + 6 : quantidadeBotoes + 1); i++) {
            listaPaginacao.appendChild(criaBotaoPaginacao(i));
        }
    }

    if (count < 11) {
        if (qtd == 5 && paginaAtual == 2) {
            listaPaginacao.appendChild(criaBotaoPaginacao("2"));
        }
    }
    if (paginaAtual == 1 && !busca && !tipo) {
        history.pushState(null, null, window.location.pathname + "?qtd=10");
        document.getElementById("1").disabled = true;
    } else {
        document.getElementById(paginaAtual.toString()).disabled = true;
    }
});

async function insereNoticiasNaPagina(qtd, busca, tipo, de, ate, paginaAtual) {
    const urlIBGE = new URL("https://servicodados.ibge.gov.br/api/v3/noticias/");
    const params = new URLSearchParams();
    params.set("qtd", qtd);
    params.set("page", paginaAtual);
    if (busca) params.set("busca", busca);
    if (tipo) params.set("tipo", tipo);
    if (de) params.set("de", de);
    if (ate) params.set("ate", ate);

    urlIBGE.search = params.toString();
    const urlDecodificada = urlIBGE.toString();
    console.log(urlDecodificada);
    const fetchData = await fetch(urlDecodificada);
    const jsonData = await fetchData.json();

    jsonData.items.forEach(element => {
        if(element.imagens)
        gerarConteudo(
            element.titulo,
            "https://agenciadenoticias.ibge.gov.br/" + JSON.parse(element.imagens).image_intro,
            element.introducao,
            element.data_publicacao,
            element.editorias,
            element.link
        );
    });

    return parseInt(jsonData.count);
}


    function gerarConteudo(titulo, imagem, introducao, data, editoria, link) {
        const ul = document.getElementById("lista-noticias")
        const li = document.createElement("li")
        const imagemNoticia = document.createElement("div")
        imagemNoticia.classList.add("div-imagem-noticia")
        const conteudoNoticia = document.createElement("div")
        conteudoNoticia.classList.add("div-conteudo-noticia")
        const editoriaData = document.createElement("div")
        editoriaData.classList.add("div-informacao-noticia")
        const leiaMaisEditoriaData = document.createElement("div")
        leiaMaisEditoriaData.classList.add("div-informacao-noticia2")
        const img = document.createElement("img")
        const h2 = document.createElement("h2")
        const p = document.createElement("p")
        const p2 = document.createElement("p")
        const p3 = document.createElement("p")
        const a = document.createElement("a")
        const button = document.createElement("button")
        button.id = "button-leia-mais"
        a.href = link
        button.textContent = "Leia mais"
        a.appendChild(button)
        img.src = imagem
        h2.textContent = titulo
        p.textContent = introducao
        p2.textContent = "#" + editoria
        p3.textContent = retornaDiferencaData(data)
        editoriaData.appendChild(p2)
        editoriaData.appendChild(p3)
        leiaMaisEditoriaData.appendChild(editoriaData)
        leiaMaisEditoriaData.appendChild(a)
        imagemNoticia.appendChild(img)
        conteudoNoticia.appendChild(h2)
        conteudoNoticia.appendChild(p)
        conteudoNoticia.appendChild(leiaMaisEditoriaData)
        imagemNoticia.appendChild(conteudoNoticia)
        li.appendChild(imagemNoticia)
        ul.appendChild(li)
    }

function retornaDiferencaData(data) {
    const dataAtual = new Date().toLocaleString('pt-BR', { timezone: 'UTC' }).replace(",", "")
    const dataPublicada = moment(data).format("DD/MM/YYYY HH:mm:ss")

    var diferenca = moment(dataAtual, "DD/MM/YYYY HH:mm:ss").diff(moment(dataPublicada, "DD/MM/YYYY HH:mm:ss"))
    diferencaTempo = Math.floor(moment.duration(diferenca).asDays())

    if (diferencaTempo == 1)
        return "Publicado ontem"
    else if (diferencaTempo > 1) {
        if (diferencaTempo < 30)
            diferencaTipo = "dias"
        else {
            diferencaTempo = Math.floor(moment.duration(diferenca).asMonths())
            diferencaTipo = (diferencaTempo == 1 ? "mes" : "meses")
        }
    } else {
        return "Publicado hoje"
    }
    return "Publicado "+ diferencaTempo + " " + diferencaTipo + " atrás"
}

function atualizaPage(pagina) {
    const urlSearchParams = new URLSearchParams(location.search)
    urlSearchParams.set("page",pagina)
    window.location.href = window.location.pathname +'?'+ urlSearchParams
}

function criaBotaoPaginacao(id) {
    const li = document.createElement("li")
    const botao = document.createElement("button")
    botao.id = id
    botao.textContent = id
    botao.onclick = function () { atualizaPage(id); };
    li.appendChild(botao)
    return li
}

function buscarNoticia(event) {
    event.preventDefault()
    const form = document.querySelector('#busca-noticia')
    const formData = new FormData(form)
    const busca = formData.get("busca")
    const urlSearchParams = new URLSearchParams(location.search)
    urlSearchParams.set("busca",busca)
    urlSearchParams.delete('page')
    window.location.href = window.location.pathname +'?'+ urlSearchParams
}

function abrirDialog() {
    const dialog = document.getElementById("dialog")
    dialog.showModal()
}

function fecharDialog() {
    const dialog = document.getElementById("dialog")
    dialog.close()
}

/*
function filtroSvg(event){
    //event.preventDefault()
    const form = document.querySelector('#filtro-svg')
    const formData = new FormData(form)
    const urlSearchParams = new URLSearchParams(location.search)
    console.log(formData.get("de"))
    if(formData.get("de"))
        urlSearchParams.set("de",formData.get("de"))

    if(formData.get("ate"))
        urlSearchParams.set("ate",formData.get("ate"))

    window.location.href = window.location.pathname +'?'+ urlSearchParams
}
*/