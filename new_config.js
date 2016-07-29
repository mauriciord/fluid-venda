// Formulário
ajustaProponentes();
ajustaData();
ajustaPagamentoSinal();
ocultaCamposData();
reajustarIndice();

// EVENTOS
document.querySelector(".tc-btnAddProp").addEventListener("click", addProponente);
document.querySelector(".tc-btnCancelProp").addEventListener("click", cancelaProponente);
document.querySelector("#pagamentoSinal").addEventListener("change", ajustaPagamentoSinal);
document.querySelector("#indiceReajuste").addEventListener("change", reajustarIndice);

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
	} else if( elemento.tagName.toLowerCase() === "select" ) {
		return elemento.value = valor;
	}

}
// PROPONENTES
function ajustaProponentes() {
	var selCampoProponente = "#proponente";
	var campoProponente = document.querySelector(selCampoProponente);
	var valCampoProponente = getValor("#proponente");

	if( valCampoProponente == "" || valCampoProponente == "0" ) {
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

function reajustarIndice() {
	var campoIndice = getValor("#indiceReajuste").toLowerCase();
	var campoIndiceOutros = document.querySelector(".campoIndiceOutros");

	campoIndiceOutros.style.display = 'none';

	if(campoIndice === "outros") {
		campoIndiceOutros.style.position = 'relative';
		campoIndiceOutros.style.display = '';
	} else {
		campoIndiceOutros.style.display = 'none';
	}
}

function ocultaCamposData() {
	document.querySelector('#horas1Exp').style.display = 'none';
	document.querySelector('#horas2Exp').style.display = 'none';
	document.querySelector('#horasSinal').style.display = 'none';
}

// FUNÇÕES COM STRINGS #############################
function intToString(valor) {
    // retorna string valor com underlines (ex.valor: 1, retorno: ___1)

    var strValor = "____" + valor;
    strValor = strValor.substring(strValor.length - 4, strValor.length);

    return strValor;
}
// retorna inteiro da sequencia do campo (ex. idCampo: campo___1, retorno: 1)
function stringToInt(idCampo) {

	var retorno = 0;
	var aux = "";

	if (idCampo.length > 4) {
		aux = idCampo.substring(idCampo.length - 4, idCampo.length);
		aux = aux.replace(/_/g, ""); // substitui todos _ (underline)
		retorno = parseInt(aux);
		if (isNaN(retorno))
			retorno = 0;
	}

	return retorno;
}
// #################################################

// FUNÇÕES COM NÚMEROS
aTens = [ "Vinte", "Trinta", "Quarenta", "Cinquenta", "Sessenta", "Setenta", "oitenta", "Noventa"];
aOnes = [ "Zero", "Um", "Dois", "Três", "Quatro", "Cinco", "Seis", "Sete", "Oito", "Nove", "Dez", "Onze", "Doze", "Treze", "Quatorze", "Quinze", "Dezesseis", "Dezessete", "Dezoito", "Dezenove" ];
aCent = [ "Cem", "Duzentos", "Trezentos", "Quatrocentos", "Quinhentos", "Seissentos", "Setecentos", "Oitocentos", "Novecentos" ];

function ConvertToHundreds(num) {
	var cNum, nNum;
	var cWords = "";
	num %= 1000;
	if (num > 99) {
		/* centenas */
		cNum = String(num);
		nNum = Number(cNum.charAt(0));
		cWords = aCent[nNum-1];
		if (( (num > 101) || (num == 101) ) && cWords == "Cem")
			cWords = "Cento";
		num %= 100;
		if (num > 0)
			cWords += " e ";
	}
	if (num > 19) {
		/* Tens. */
		cNum = String(num);
		nNum = Number(cNum.charAt(0));
		cWords += aTens[nNum - 2];
		num %= 10;
		if (num > 0)
			cWords += " e ";
	}
	if (num > 0) {
		/* Ones and teens. */
		nNum = Math.floor(num);
		cWords += aOnes[nNum];
	}
	return cWords;
}

function ConvertToWords(num)
{
	var aUnits = [ "Mil", "Milhões", "Bilhões", "Trilhões", "Quatrilhões" ];
	var aUnists2 = [ "Mil", "Milhão", "Bilhão", "Trilhão", "Quatrilhão" ];
	var cWords = (num >= 1 && num < 2) ? "Real " : "Reais ";
	var nLeft = Math.floor(num);

	for (var i = 0; nLeft > 0; i++) {
		if (nLeft % 1000 > 0) {
			if (i != 0)
				cWords = ConvertToHundreds(nLeft) + " " + aUnits[i - 1] + " " + cWords;
			else
				cWords = ConvertToHundreds(nLeft) + " " + cWords;
		}
		nLeft = Math.floor(nLeft / 1000);
	}
	num = Math.round(num * 100) % 100;
	if (num > 0)
		cWords += " e " + ConvertToHundreds(num) + " Centavos";

	return cWords;
}

function FloatToMoeda(num) {
  x = 0;

  if (num < 0) {
      num = Math.abs(num);
      x = 1;
  }

  if (isNaN(num)) num = "0";
  cents = Math.floor((num * 100 + 0.5) % 100);

  num = Math.floor((num * 100 + 0.5) / 100).toString();

  if (cents < 10) cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + '.'
             + num.substring(num.length - (4 * i + 3));

  ret = num + ',' + cents;

  if (x == 1) ret = ' - ' + ret; return ret;

}
// #################################################

// FUNÇÕES DE ESCRITA ##############################
function MostrarExtensoCampo(seletor)	{

	var valorExtenso = getValor(seletor);
	var campo = seletor.replace("#","").replace(".","");

	if(seletor !== null && valorExtenso === "") {
		document.querySelector("."+campo+"_Extenso").textContent = "";
	}else if ( seletor !== null && valorExtenso !== "" && Number(valorExtenso.replace(",",".")) !== 0 ) {
		var valor = valorExtenso.replace(".","");
		document.querySelector("."+campo+"_Extenso").textContent = ConvertToWords(valor.replace(",","."));
	}

}
// #################################################