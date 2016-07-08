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

function ajustaProponentes() {
	var selCampoProponente = "#proponente";
	var campoProponente = document.querySelector(selCampoProponente);
	var valCampoProponente = getValor("#proponente");

	if( valCampoProponente == "" ) {
		setValor(selCampoProponente, 0);
	}
}