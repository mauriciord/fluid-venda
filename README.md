# FLUIG - TOTVS | Ficha para venda de lote
## Formulário de Pessoa Física

O Formulário de **Pessoa Jurídica** pode ser encontrado neste repositório aqui(BREVE).

Este repositório apresenta um formulário do qual é possível efetuar venda de lotes na ferramenta da TOTVS® | Fluig, constando um arquivo `.html` do qual é jogado em um fichário como Anexo principal.

### Arquivos principais:

* `Venda.html` - Arquivo que contém o formulário de proposta(Pode ser qualquer nomenclatura, desde que seja anexado como **Principal**).
* `new_config.js` - _Scripts_ para formatações, validações e processos.
* `venda.css` - Folha de estilos para o formulário

### Proponentes adicionais
Encontra-se atualmente com quantidade máxima de até **4** proponentes para uma venda.
Há uma barra com botões para adicionar proponente e para diminuir proponente.
#### -> Funções diferenciais de Pessoa Física
```js
function addProponente() {
	var maxProp = 4;
	var proponente = parseInt(getValor("#proponente"));
	var propAtual = proponente + 1;

	if( proponente < maxProp ) {
		setValor("#proponente", propAtual);
		Array.prototype.forEach.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = "none";
		});		
		Array.prototype.some.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = '';
			return i+1 === propAtual;			
		});
	}

	if(propAtual == 1) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = true;
	}
	if(propAtual >= maxProp) {
		document.querySelector('#btn_adicionaProp').disabled = true;
		document.querySelector('#btn_deletaProp').disabled = false;
	}
	if(propAtual > 1 && propAtual < maxProp) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = false;
	}
}

function cancelaProponente() {
	var proponente = parseInt(getValor("#proponente"));
	var propAtual = proponente - 1;

	if(proponente > 1) {
		setValor("#proponente", propAtual);
		Array.prototype.forEach.call(document.querySelectorAll('.tc-div-proponente'), function(el, i){
			el.style.display = "none";
		});
		Array.prototype.some.call(document.querySelectorAll('.tc-div-proponente'), function(el, i){
			el.style.display = "";
			return (i+1 === propAtual);
		});
	}
	if(propAtual <= 1) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = true;
	}
	if(propAtual >= 4) {
		document.querySelector('#btn_adicionaProp').disabled = true;
		document.querySelector('#btn_deletaProp').disabled = false;
	}
	if(propAtual > 1 && propAtual < 4) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = false;
	}
}
```