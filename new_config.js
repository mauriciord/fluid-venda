// Formulário
ajustaProponentes();
ajustaData();
ajustaPagamentoSinal();

// EVENTOS
document.querySelector(".tc-btnAddProp").addEventListener("click", addProponente);
document.querySelector(".tc-btnCancelProp").addEventListener("click", cancelaProponente);
document.querySelector("#pagamentoSinal").addEventListener("change", ajustaPagamentoSinal);

function getValor(el) {

	var elemento = document.querySelector(el);

	if( elemento.tagName.toLowerCase() === "input" ) {
		return elemento.value;
	} else if( elemento.tagName.toLowerCase() === "span" ) {
		return elemento.textContent;
	} else if( elemento.tagName.toLowerCase() === "select" ) {
		return elemento.options[elemento.selectedIndex].value;
	}

}

function setValor(el, valor) {

	var elemento = document.querySelector(el);

	if( elemento.tagName.toLowerCase() == "input" ) {
		elemento.value = valor;
	} else if( elemento.tagName.toLowerCase == "span" ) {
		elemento.textContent = valor;
	}

}
// PROPONENTES
function ajustaProponentes() {
	var selCampoProponente = "#proponente";
	var campoProponente = document.querySelector(selCampoProponente);
	var valCampoProponente = getValor("#proponente");

	if( valCampoProponente == "" ) {
		setValor(selCampoProponente, 0);
		addProponente();
	}

	if(parseInt(getValor("#proponente")) > 0) {
		var proponente = parseInt(getValor("#proponente"));
		setValor("#proponente", proponente);
		Array.prototype.forEach.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = "none";
		});		
		Array.prototype.some.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = '';
			return i+1 == proponente;
		});
	}

}

function addProponente() {
	var maxProp = 4;
	var campoProponente = "#proponente";
	var proponente = parseInt(getValor(campoProponente)) + 1;

	if( parseInt(getValor(campoProponente)) < maxProp ) {
		setValor(campoProponente, proponente);
		Array.prototype.forEach.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = "none";
		});		
		Array.prototype.some.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = '';
			return i+1 === proponente;			
		});
	}

	if(parseInt(getValor(campoProponente)) == 1) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = true;
	}
	if(parseInt(getValor(campoProponente)) >= maxProp) {
		document.querySelector('#btn_adicionaProp').disabled = true;
		document.querySelector('#btn_deletaProp').disabled = false;
	}
	if(parseInt(getValor(campoProponente)) > 1 && parseInt(getValor(campoProponente)) < maxProp) {
		document.querySelector('#btn_adicionaProp').disabled = false;
		document.querySelector('#btn_deletaProp').disabled = true;
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

function ajustaData() {
	if(getValor('#data') === '')
		setValor('#data', RetornarDataAtual());
}

function RetornarDataAtual() {
	hoje = new Date();
	dia = hoje.getDate();
	mes = hoje.getMonth() + 1; // comeca em zero
	ano = hoje.getFullYear();

	if (dia < 10)
			dia = "0" + dia;

	if (mes < 10)
			mes = "0" + mes;

	if (ano < 2000)
			ano = "19" + ano;

	return dia + "/" + mes + "/" + ano;
}

function ajustaPagamentoSinal() {
	var valPagamentoSinal = getValor('#pagamentoSinal');
	valPagamentoSinal = valPagamentoSinal.toLowerCase();

	switch(valPagamentoSinal) {
		case 'cheque':
			document.querySelector('#divCheque').style.position = 'relative';
			document.querySelector('#divCheque').style.display = '';
			document.querySelector('#divBoleto').style.display = 'none';
			document.querySelector('#divOutros').style.display = 'none';
			break;
		case 'outros':
			document.querySelector('#divOutros').style.position = 'relative';
			document.querySelector('#divOutros').style.display = '';
			document.querySelector('#divBoleto').style.display = 'none';
			document.querySelector('#divCheque').style.display = 'none';
			break;
		default:
			document.querySelector('#divBoleto').style.position = 'relative';
			document.querySelector('#divBoleto').style.display = '';
			document.querySelector('#divCheque').style.display = 'none';
			document.querySelector('#divOutros').style.display = 'none';
	}
}