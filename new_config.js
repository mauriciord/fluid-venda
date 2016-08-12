// Formulário
ajustaProponentes();
ajustaData();
ajustaPagamentoSinal();
ocultaCamposData();
reajustarIndice();
//setInterval(calculaPreencheValores, 10000);
calculaPreencheValores();
escreveParcelas();

// EVENTOS
document.querySelector(".tc-btnAddProp").addEventListener("click", addProponente);
document.querySelector(".tc-btnCancelProp").addEventListener("click", cancelaProponente);
document.querySelector("#pagamentoSinal").addEventListener("change", ajustaPagamentoSinal);
document.querySelector("#indiceReajuste").addEventListener("change", reajustarIndice);
document.querySelectorAll(".valorParcela").forEach(function(el, i) {
	el.addEventListener("blur", function(evt) { 
		blurValorParcela(el, i, evt);
		FormatarValor(el,'.',',',evt,14);
	});
});

var imaxPS = 1; // qtde de registros de pagamento do sinal

function blurValorParcela(elemento, indice, evento) {
	console.log("blur na " + elemento.id + " -> " + elemento.name);
  MostrarExtensoCampoParcela(elemento.name);
}

function FormatarValor(campo, separadorMilhar, separadorDecimal, evento, tamanhoMax) {

	if (!handleEnter(campo, evento))
		return;

    if (campo.readOnly)
        return false;

    var sep = 0;
    var key = '';
    var i = j = 0;
    var len = len2 = 0;
    var strCheck = '0123456789';
    var aux = aux2 = '';
    var whichCode = (window.Event) ? evento.which : evento.keyCode;

    if (whichCode == 13)
        return true;

    key = String.fromCharCode(whichCode);  // Valor para o c?igo da Chave
    if (strCheck.indexOf(key) == -1)
        return false;  // Chave inv?ida

    len = campo.value.length;
    if (len >= tamanhoMax)
        return false;

    for (i = 0; i < len; i++)
        if ((campo.value.charAt(i) != '0') && (campo.value.charAt(i) != separadorDecimal))
            break;
    aux = '';
    for (; i < len; i++)
        if (strCheck.indexOf(campo.value.charAt(i)) != -1)
            aux += campo.value.charAt(i);

    aux += key;
    len = aux.length;
    if (len == 0)
        campo.value = '';
    if (len == 1)
        campo.value = '0' + separadorDecimal + '0' + aux;
    if (len == 2)
        campo.value = '0' + separadorDecimal + aux;
    if (len > 2) {
        aux2 = '';
        for (j = 0, i = len - 3; i >= 0; i--) {
            if (j == 3) {
                aux2 += separadorMilhar;
                j = 0;
            }
            aux2 += aux.charAt(i);
            j++;
        }
        campo.value = '';
        len2 = aux2.length;
        for (i = len2 - 1; i >= 0; i--)
            campo.value += aux2.charAt(i);
        campo.value += separadorDecimal + aux.substr(len - 2, len);
    }
    return false;
}

function handleEnter (field, event) {

	var code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (code == 13) {

		/*if ( !ValidarCampo(field, event) )
			return true;*/

		var i;
		for (i = 0; i < field.form.elements.length; i++)
			if (field == field.form.elements[i])
				break;

		i = (i + 1) % field.form.elements.length;
		field.form.elements[i].focus();
	}
	else
		return true;
}

function getValor(el) {

	var elemento = el.tagName ? el : document.querySelector(el);
	var elementoTag = elemento !== null ? elemento.tagName.toLowerCase() : "";

	switch(elementoTag) {
		case "input": return elemento.value;
		case "span": return elemento.textContent;
		case "select": return elemento.options[elemento.selectedIndex].value;
		default: return "";
	}

}

function setValor(el, valor) {

	var elemento = document.querySelector(el);
	var elementoTag = elemento !== null ? elemento.tagName.toLowerCase() : "";

	switch(elementoTag) {
		case "input":
			elemento.value = valor;
			break;
		case "span":
			elemento.textContent = valor;
			break;
		case "select":
			elemento.value = valor;
			break;
		default:
			elemento.value = valor;
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
	var horas1Exp = document.querySelector('#horas1Exp');
	var exe1Exp = document.querySelector('#exe1Exp');
	var horas2Exp = document.querySelector('#horas2Exp');
	var exe2Exp = document.querySelector('#exe2Exp');
	var horasSinal = document.querySelector('#horasSinal');
	var exeSinal = document.querySelector('#exeSinal');
	
	if(exe1Exp.value !== "true") {
		horas1Exp.style.display = 'none';
	}

	if(exe2Exp.value !== "true") {
		horas2Exp.style.display = 'none';
	}

	if(exeSinal.value !== "true") {
		horasSinal.style.display = 'none';
	}
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

	var campo = seletor.replace("#","").replace(".","");
	var elemento = document.querySelector("#"+campo);
	var valorExtenso = getValor("#"+campo);

	if(elemento !== null && valorExtenso === "") {
		setValor("."+campo+"_Extenso", "");
	}else if ( elemento !== null && valorExtenso !== "" && Number(valorExtenso.replace(".","").replace(",",".")) !== 0 ) {
		var valor = valorExtenso.replace(".","").replace(",",".");
		setValor("."+campo+"_Extenso", ConvertToWords(valor));
	}

}

function MostrarExtensoCampoParcela(seletor)	{

	var campo = seletor.replace("#","").replace(".","");
	var elemento = document.querySelector("#"+campo);
	var valorExtenso = getValor("#"+campo);

	if(elemento !== null && valorExtenso === "") {
		document.querySelector("#Extenso_"+campo).textContent = "";
	}else if ( elemento !== null && valorExtenso !== "" && Number(valorExtenso.replace(".","").replace(",",".")) !== 0 ) {
		var valor = valorExtenso.replace(".","").replace(",",".");
		document.querySelector("#Extenso_"+campo).textContent = ConvertToWords(valor.replace(",","."));
	}

}

function escreveParcelas() {

	var campoVlParcela = document.querySelectorAll('.valorParcela');
	campoVlParcela.forEach(function(el, i) {
		var vlExtenso = getValor(el);
		var valorExt = vlExtenso.replace(".","");

		var campoTr = closest(el, function(proximo) {
			return proximo.tagName.toLowerCase() === "tr"
		});

		campoTr.querySelector('.Extenso_valorParcela').textContent = ConvertToWords(valorExt.replace(",","."));
	});

}
// #################################################

// CALCULA E PREENCHE OS VALORES DA NEGOCIAÇÃO #####
function calculaPreencheValores() {
	
	var somaValorSinal = function() {
		var seletores = "";
		var _seletores = "";
		var valPagamentoSinal = getValor("#pagamentoSinal").toLowerCase();

		switch(valPagamentoSinal) {
			case "cheque":
				seletores = "[id^=valorCheque___]";
				_seletores = "[id^=_valorCheque___]";
				break;
			case "outros":
				seletores = "[id^=valorOutros___]";
				_seletores = "[id^=_valorOutros___]";
				break;
			default:
				seletores = "[id^=valorBoleto___]";
				_seletores = "[id^=_valorBoleto___]";
		}

		var _camposVlSinal = document.querySelectorAll(_seletores);
		var camposVlSinal = document.querySelectorAll(seletores);
		var resultadoVlSinal = 0;

		if( _camposVlSinal.length ) {
			_camposVlSinal.forEach(function(el, i) { 
				var campoValorSinal = el.value;
				if( campoValorSinal == "" || campoValorSinal == "&nbsp;" ) {
					resultadoVlSinal += 0; 
				} else {
					var subCampoValorSinal = campoValorSinal.replace(".", "").replace(",", ".");
					resultadoVlSinal += Number(subCampoValorSinal);
				}
			});
		}

		if( camposVlSinal.length ) {
			camposVlSinal.forEach(function(el, i) {
				var campoValorRef = getValor(el.id);
				if( campoValorRef == "" || campoValorRef == "&nbsp;" || el.type === 'hidden' ) {
					resultadoVlSinal += 0;
				} else {
					var subCampoValorRef = campoValorRef.replace(".", "").replace(",", ".");
					resultadoVlSinal += Number(subCampoValorRef);
				}
			});
		}

		return resultadoVlSinal;
	};

	var somaValorSaldo = function() {
		var resultadoValorSaldo = 0;
		var _seletorVlSinal = document.querySelectorAll("[id^=_quantidadeParcelas___]");
		var seletorVlSinal = document.querySelectorAll("[id^=quantidadeParcelas___]");

		if( _seletorVlSinal.length ) {
			_seletorVlSinal.forEach(function(el, i) {
				if(el.value === ""|| el.value == "&nbsp;" ) {
					resultadoValorSaldo += 0;
				} else {
					var valorParcela = getValor("#_valorParcela" + intToString(stringToInt(el.id)));
					var subValorParcela = valorParcela.replace(".", "").replace(",", ".");
					resultadoValorSaldo += Number(el.value) * Number(subValorParcela);
				}
			});
		}

		if( seletorVlSinal.length ) {
			seletorVlSinal.forEach(function(el, i) {
				var campoQtdeParc = getValor(el.id);
				var elValorParcela = "#valorParcela" + intToString(stringToInt(el.id));				

				if( campoQtdeParc === "" || campoQtdeParc === "&nbsp;" || document.querySelector(elValorParcela).type === 'hidden' ) {
					resultadoValorSaldo += 0;
				} else {
					var valorDaParc = getValor(elValorParcela);
					var subValorDaParc = valorDaParc.replace(".", "").replace(",", ".");
					resultadoValorSaldo += Number(campoQtdeParc) * Number(subValorDaParc);					
				}

			});
		}

		return resultadoValorSaldo;
	}

	var resultadoVlSaldo = somaValorSaldo();
	var resultadoVlSinal = somaValorSinal();
	//console.log(resultadoVlSaldo);
	//console.log(resultadoVlSinal);

	// SALDO
	var _campoVlSaldo = document.querySelector("#_valorSaldo");
	var campoVlSaldo = document.querySelector("#valorSaldo");

	if(_campoVlSaldo !== null) {
		_campoVlSaldo.value = FloatToMoeda(resultadoVlSaldo);
		MostrarExtensoCampo("#valorSaldo");
	}

	if(campoVlSaldo !== null && campoVlSaldo.type !== 'hidden') {
		setValor("#valorSaldo", FloatToMoeda(resultadoVlSaldo));
		MostrarExtensoCampo("#valorSaldo");
	}

	// SINAL
	var _inputVlSinal = document.querySelector("#_valorSinal");
	var inputVlSinal = document.querySelector("#valorSinal");

	if(_inputVlSinal !== null) {
		_inputVlSinal.value = FloatToMoeda(resultadoVlSinal);
		MostrarExtensoCampo("#valorSinal");
	}

	if(inputVlSinal !== null && inputVlSinal.type !== 'hidden') {
		setValor("#valorSinal", FloatToMoeda(resultadoVlSinal));
		MostrarExtensoCampo("#valorSinal");
	}

	// TOTAL
	var somaValorTotal = resultadoVlSinal + resultadoVlSaldo;
	var _inputVlTotal = document.querySelector("#_valorTotal");
	var inputVlTotal = document.querySelector("#valorTotal");

	if(_inputVlTotal !== null) {
		_inputVlTotal.value = FloatToMoeda(somaValorTotal);
		MostrarExtensoCampo("#valorTotal");
	}

	if(inputVlTotal !== null && inputVlTotal.type !== 'hidden') {
		setValor("#valorTotal", FloatToMoeda(somaValorTotal));
		MostrarExtensoCampo("#valorTotal");
	}

}
// #################################################

// substituir o Closest() do jQuery
function closest(el, fn) {
    return el && (
        fn(el) ? el : closest(el.parentNode, fn)
    );
}
// ################################################

