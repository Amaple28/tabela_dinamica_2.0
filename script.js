// função para trocar classe das linhas de uma tabela de 5 em 5 segundos
const page = 0;
const table = document.getElementById("tableBody");
let pageNumber = 0;

function listAnimation() {
    return new Promise((resolve, reject) => {
        const linhas = document.getElementsByClassName("linhaProduto");
        let i = 0;
        
        const animation = ()=>{
            if(i == 0){
                linhas[i].classList.add("linha");
                linhas[linhas.length-1].classList.remove("linha");
                i++;
            }else if(i<linhas.length){
                linhas[i].classList.add("linha");
                linhas[i-1].classList.remove("linha");
                i++;
            }else{
                clearInterval(interval)
                listAnimation()
                resolve();
            }
        }
    
        const interval = setInterval(animation, 2000);
    });
}

// ler arquivo txt
function readTxt() { 
    return fetch('itens.txt').then(response => response.text()).then(text => {
        const linhas = text.split(/\r?\n/);
        return linhas;
    });
}


//Função para gerar páginas
async function generatePages(itemsPerPage) {
    const linhas = await readTxt();
    let pages = [];
    let page = [];	
    let i = 0;
    linhas.forEach((item, index) => {
        if(i < itemsPerPage){
            page.push(item.trim());
            i++;
        }else{
            pages.push(page);
            page = [];
            page.push(item.trim());
            i = 1;
        }
    });
    pages.push(page);
    if(pages[pages.length-1][pages[pages.length-1].length-1] === ''){
        pages[pages.length-1].pop();
    }

    return pages;
}

async function showProducts() {
    const pages = await generatePages(6);

    pages[pageNumber].forEach((linha, index) => {
        let nome = linha.substring(20,50);
        
        const preco = nome.includes("KG") ? "R$ "+ linha.substring(13,17).slice(0,2) + "," + linha.substring(13,17).slice(2,4) + " Kg" : "R$ "+linha.substring(13,17).slice(0,2) + "," + linha.substring(13,17).slice(2,4);
        nome = linha.substring(20,50).includes("KG") ? linha.substring(20,50).replace("KG", "").trim() : linha.substring(20,50).trim();
    
        const tr = document.createElement("tr");
        tr.classList.add("linhaProduto");
            
        const tdNome = document.createElement("td");
        tdNome.classList.add("tdNome");
        const tdPreco = document.createElement("td");
    
        tdNome.innerHTML = nome;
        tdPreco.innerHTML = preco;
    
    
        tr.appendChild(tdNome);
        tr.appendChild(tdPreco);
    
        table.appendChild(tr);
    });
    pageNumber++;

    listAnimation().then(() => {
        table.innerHTML = "";
        if(pageNumber == pages.length){
            pageNumber = 0;
        }
        showProducts();
    });       
}
 
 //Triggers
 window.onload = function() {
    showProducts();
};
