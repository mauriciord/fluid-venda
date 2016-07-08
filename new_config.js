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
	}
}

function addProponente() {
	var maxProp = 4;
	var campoProponente = "#proponente";
	var proponente = parseInt(getValor(campoProponente) + 1);

	if( parseInt(getValor(campoProponente)) < maxProp ) {
		setValor(campoProponente, proponente);
		document.querySelector('.tc-div-proponente').style.display = "none";
		Array.prototype.forEach.call(document.querySelectorAll('.tc-div-proponente'), function(el, i) {
			el.style.display = '';
			if((index+1) == proponente)
				return false;
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

// EVENTOS
document.querySelector(".tc-btnAddProp").addEventListener("click", addProponente);