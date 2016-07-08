function getValor(el) {

	var elemento = document.querySelector(el);

	if( elemento.tagName.toLowerCase() == "input" ) {
		return elemento.value;
	} else if( elemento.tagName.toLowerCase == "span" ) {
		return elemento.textContent;
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
			console.log("div " + i);
			console.log(proponente);
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

ajustaProponentes();

// EVENTOS
document.querySelector(".tc-btnAddProp").addEventListener("click", addProponente);