/* - - - - - - - - - - - - - - - - - - - - - - - - 
--  Doc: config.js  THCM - ECM / GED              --
--  Proposta de venda                           --
--  @author:Maurício Duarte<mauricio@thcm.com.br>-
--  Funcoes gerais da Proposta                  --
--                                              --
- - - - - - - - - - - - - - - - - - - - - - - -  */

// var $tc Global para não dar conflito
$tc = jQuery.noConflict();

function fnCustomDelete(oElement){
  // Chamada a funcao padrao, NAO RETIRAR
  fnWdkRemoveChild(oElement);

  CalcularSaldo(oElement);
  MostrarExtenso();

  //console.log("Saldo Calculado");
}

var pegaProp = parseInt($tc('#proponente').val());

$tc(function() {

	IniForm();

	if($tc('#executou1vez').val() == 'true') {
		//$tc('.tc-ret-botoes').hide();
		//$tc('.btn-addChild').hide();
	}

	if($tc('#proponente').val() == "") {
		$tc('#proponente').attr("value", 0);
		fcnBotao();
	}

	if(pegaProp > 0) {
		fcnMostrar();
	}

	$tc('.tc-btnAddProp').on('click', fcnBotao );

	$tc('.tc-btnCancelProp').on('click', fcnBotaoDeletar );

	// indice de reajuste
	$tc('#indiceReajuste').change(function(){
		SelecionarIndiceReajuste($tc(this).val());
	});

	// chamar janela de lotes
	$tc('.btn_zoomExterno').on('click', function() {
    mostraLista();
  });

});

$tc("body").on('blur', '.valorParcela', function() {
  CalcularSaldo(this);
  ////console.log("blur no " + this.name);
  MostrarExtensoCampoParcela(this.name);
});

$tc(window).load(function(){

	//MostrarExtensoCampo("valorSinal");
	//MostrarExtensoCampo("valorSaldo");
	MostrarExtensoCampo("valorIntermediacaoImob");
	//MostrarExtensoCampo("valorParcela");
	//MostrarExtensoCampo("valorTotal");
	//MostrarExtensoCampoPorClasse("valorParcela");

	var pagamentoSinal = $tc('#pagamentoSinal').is('span') ? $tc('#pagamentoSinal').text() : $tc('#pagamentoSinal').val();

	SelecionarPagamentoSinal(pagamentoSinal);
	$tc('#pagamentoSinal').change(function(){
		SelecionarPagamentoSinal($tc(this).val());
	});

	$tc('.valorParcela').each(function() {

		var valorExtenso = $tc(this).is('span') ? $tc(this).text() : $tc(this).val();
		var valor = valorExtenso.replace(".","");

		$tc(this).closest('tr').find('.Extenso_valorParcela').text(ConvertToWords(valor.replace(",",".")));		

	});

	$tc('[class^=tc-div-conjuge_]').each(function(i){
		var className = $tc(this).attr('class');
		var conjugeId = '#conjugue_'+(i+1);
		////console.log("area do conjuge class -> " + className);

		if( $tc(conjugeId).is('span') && ($tc(conjugeId).text() == "" || $tc(conjugeId).text() == '\xa0') )  {
			$tc('.'+className).addClass(className + ' not-print');
		}

	});

	$tc('.junta-extenso:last-child').each(function(i){

		var tamanhoPai = $tc(this).parent().width();
		//console.log("extenso "+i+" -> tamanho da div q está é "+tamanhoPai);	

		if(tamanhoPai > 0) {
			var somaFilhos = 0;

			$tc(this).parent().children().each(function(){
				if($tc(this).is(":last-child")) {
					//console.log("filho " + this.className + " - último");
				} else {
					//console.log("filho " + this.className + " com valor de "+$tc(this).width());
					somaFilhos += $tc(this).width();
				}
			});

			//console.log("soma filhos = "+somaFilhos);
			var ultimoExtenso = (tamanhoPai - somaFilhos) - 5;
			//console.log('valor pra inserir no extenso ultimo' + ultimoExtenso);
			$tc(this).css("width", ultimoExtenso+"px");
		}		

	});

	$tc('.junta-valor:has(span)').css('padding-top', '5px');
	$tc('.junta-extenso:has(span)').css('padding-top', '5px');
	$tc('.junta-valor:has(label)').css('padding-top', '5px');
	$tc('.junta-extenso:has(label)').css('padding-top', '5px');

	calculaPreencheValorTotal();
});

function fcnMostrar(){
	var proponente = parseInt($tc('#proponente').val());
	$tc('#proponente').attr("value", proponente);
	$tc('.tc-div-proponente').hide();
	$tc(".tc-div-proponente").each(function(index, element) {
			$tc(element).show();
			if( (index + 1) == proponente){
				return false;
			}
	});
}

function fcnBotao(){
	var proponente = parseInt($tc('#proponente').val()) + 1;
	if( parseInt($tc('#proponente').val()) < 4 ){
		$tc('#proponente').attr("value", proponente);
		$tc('.tc-div-proponente').hide();
		$tc(".tc-div-proponente").each(function(index, element) {
			$tc(element).show();
			if( (index + 1) == proponente){
				return false;
			}
		});
	}

	if( parseInt($tc('#proponente').val()) == 1){
		$tc('#btn_adicionaProp').prop('disabled', false);
		$tc('#btn_deletaProp').prop('disabled', true);
	}
	if( parseInt($tc('#proponente').val()) >= 4){
		$tc('#btn_adicionaProp').prop('disabled', true);
		$tc('#btn_deletaProp').prop('disabled', false);
	}
	if( parseInt($tc('#proponente').val()) > 1 && parseInt($tc('#proponente').val()) < 4 ){
		$tc('#btn_adicionaProp').prop('disabled', false);
		$tc('#btn_deletaProp').prop('disabled', false);
	}
}

function calculaPreencheValorTotal() {
	// VALOR DO SINAL É CASO TENHA PARCELAS
	// VALOR DO SALDO A PAGAR É PREENCHIDO PELO NÚM. DE PARCELAS X VALOR DA PARCELA (PODE VARIAR NÚM. DE LINHAS)
	// TUDO ISSO SOMADO RESULTA NO VALOR TOTAL

	var somaValorTotal = 0;
	var somaValorSinal = function(){

		var seletores = "";
		var _seletores = "";
		var selPagamentoSinal = $tc("#pagamentoSinal").is("span") ? $tc("#pagamentoSinal").text() : $tc("#pagamentoSinal").val();
		if (selPagamentoSinal.toLowerCase() === "cheque"){
			seletores = "[id^=valorCheque___]";
			_seletores = "[id^=_valorCheque___]";
		} else if(selPagamentoSinal.toLowerCase() === "outros"){
			seletores = "[id^=valorOutros___]";
			_seletores = "[id^=_valorOutros___]";
		} else {
			seletores = "[id^=valorBoleto___]";
			_seletores = "[id^=_valorBoleto___]";
		}

		var _camposVlSinal = $tc(_seletores);
		//var _camposVlSinal = $tc("[id^=_valorCheque___]").add("[id^=_valorBoleto___]").add("[id^=_valorOutros___]");
		//var _camposVlSinal = document.querySelectorAll("[id^=_valorCheque___], [id^=_valorBoleto___]", "[id^=_valorOutros___]");
		var camposVlSinal = $tc(seletores);
		//var camposVlSinal = $tc("[id^=valorCheque___]").add("[id^=valorBoleto___]").add("[id^=valorOutros___]");
		//var camposVlSinal = document.querySelectorAll("[id^=valorCheque___], [id^=valorBoleto___], [id^=valorOutros___]");
		var resultadoVlSinal = 0;

		if( _camposVlSinal.length ) {
			_camposVlSinal.each(function(){
				var campoValorSinal = $tc(this).val();
				if( campoValorSinal == "" || campoValorSinal == "&nbsp;" ) {
					resultadoVlSinal += 0;
				} else {
					campoValorSinal = campoValorSinal.replace(".", "");
					campoValorSinal = campoValorSinal.replace(",", ".");
					resultadoVlSinal += Number(campoValorSinal);
				}
			});
		} 
		if( camposVlSinal.length ) {
			camposVlSinal.each(function(){
				var selValorSinal = $tc(this);
				var campoValorRef = selValorSinal.is("span") ?  selValorSinal.text() : selValorSinal.val();
				if( campoValorRef == "" || campoValorRef == "&nbsp;" || selValorSinal.attr('type') == 'hidden' ) {
					resultadoVlSinal += 0;
				} else {
					campoValorRef = campoValorRef.replace(".", "");
					campoValorRef = campoValorRef.replace(",", ".");
					resultadoVlSinal += Number(campoValorRef);
				}
			});
		}
		console.log("soma do valor do sinal -> " + resultadoVlSinal);
		return resultadoVlSinal;
	}
	var somaValorSaldo = function() {
		var resultadoValorSaldo = 0;
		if( $tc("[id^=_quantidadeParcelas___]").length ) {
			$tc("[id^=_quantidadeParcelas___]").each(function(){
				if( $tc(this).val() == "" || $tc(this).val() == "&nbsp;" ) {
					resultadoValorSaldo += 0;
				} else {
					var valorParcela = $tc("#_valorParcela___" + stringToInt(this.id)).val();
					valorParcela = valorParcela.replace(".", "");
					valorParcela = valorParcela.replace(",", ".");
					resultadoValorSaldo += Number($tc(this).val()) * Number(valorParcela);
					//console.log("1 if -> soma do valor do saldo -> " + resultadoValorSaldo);
				}
			});
		}
		if( $tc("[id^=quantidadeParcelas___]").length ) {
			$tc("[id^=quantidadeParcelas___]").each(function(){
				var campoQtdeParc = $tc(this).is("span") ?  $tc(this).text() : $tc(this).val();
				var selValorParc = $tc("#valorParcela___" + stringToInt(this.id));
				if( campoQtdeParc == "" || campoQtdeParc == "&nbsp;" || selValorParc.attr('type') == 'hidden' ) {
					resultadoValorSaldo += 0;
				} else {
					var valorParcela = selValorParc.is("span") ? selValorParc.text() : selValorParc.val();
					valorParcela = valorParcela.replace(".", "");
					valorParcela = valorParcela.replace(",", ".");
					resultadoValorSaldo += Number(campoQtdeParc) * Number(valorParcela);
					//console.log("2 if -> soma do valor do saldo -> " + resultadoValorSaldo);
				}
			});
		}
		return resultadoValorSaldo;
	}

	var resultadoVlSinal = somaValorSinal();
	var resultadoVlSaldo = somaValorSaldo();
	console.log("campo valor do sinal -> " + resultadoVlSinal);
	console.log("campo valor do saldo -> " + resultadoVlSaldo);

	var selValorSaldo = $tc("#valorSaldo")
	var campoValorSaldo = selValorSaldo.is('span') ? selValorSaldo.text() : selValorSaldo.val()

	// ABAIXO VAMOS PREENCHER O CAMPO DE VALOR DE SALDO
	if( $tc("#_valorSaldo").length ) {
		/*var valorSaldo = $tc("#_valorSaldo").is("input") ? $tc("#_valorSaldo").val() : $tc("#_valorSaldo").text();
		valorSaldo = valorSaldo.replace(".", "");
		valorSaldo = valorSaldo.replace(",", ".");*/
		$tc("#_valorSaldo").val(FloatToMoeda(resultadoVlSaldo));
		MostrarExtensoCampo("valorSaldo");
	}
	
	if( selValorSaldo.length && selValorSaldo.attr('type') !== 'hidden' ) {
		selValorSaldo.is("span") ? selValorSaldo.text(FloatToMoeda(resultadoVlSaldo)) : selValorSaldo.val(FloatToMoeda(resultadoVlSaldo));
		MostrarExtensoCampo("valorSaldo");
	}
	// #######################

	// ABAIXO VAMOS PREENCHER O CAMPO DE VALOR DO SINAL
	if( $tc("#_valorSinal").length ) {
		$tc("#_valorSinal").val(FloatToMoeda(resultadoVlSinal));
		MostrarExtensoCampo("valorSinal");
	}
	if( $tc("#valorSinal").length && $tc("#valorSinal").attr('type') !== 'hidden'){
		$tc("#valorSinal").is("span") ? $tc("#valorSinal").text(FloatToMoeda(resultadoVlSinal)) : $tc("#valorSinal").val(FloatToMoeda(resultadoVlSinal));
		MostrarExtensoCampo("valorSinal");
	}
	//AGORA VAMOS PREENCHER O VALOR TOTAL
	somaValorTotal = resultadoVlSinal + resultadoVlSaldo;
	console.log("campo valor total -> " + somaValorTotal);

	if( $tc("#_valorTotal").length ) {
		$tc("#_valorTotal").val(FloatToMoeda(somaValorTotal));
		MostrarExtensoCampo("valorTotal");
	}
	if($tc("#valorTotal").length && $tc("#valorTotal").attr('type') !== 'hidden') {
		$tc("#valorTotal").is("span") ? $tc("#valorTotal").text(FloatToMoeda(somaValorTotal)) : $tc("#valorTotal").val(FloatToMoeda(somaValorTotal));
		MostrarExtensoCampo("valorTotal");
	}
}

function fcnBotaoDeletar(){
	var proponente = parseInt($tc('#proponente').val()) - 1;
	if( parseInt($tc('#proponente').val()) > 1 ){
		$tc('#proponente').attr("value", proponente);
		$tc('.tc-div-proponente').hide();
		$tc(".tc-div-proponente").each(function(index, element) {
			$tc(element).show();
			if( (index + 1) == proponente){
				return false;
			}
		});
	}

	if( parseInt($tc('#proponente').val()) <= 1){
		$tc('#btn_deletaProp').prop('disabled', true);
		$tc('#btn_adicionaProp').prop('disabled', false);
	}
	if( parseInt($tc('#proponente').val()) == 1){
		$tc('#btn_adicionaProp').prop('disabled', false);
		$tc('#btn_deletaProp').prop('disabled', true);
	}
	if( parseInt($tc('#proponente').val()) >= 4){
		$tc('#btn_adicionaProp').prop('disabled', true);
		$tc('#btn_deletaProp').prop('disabled', false);
	}
	if( parseInt($tc('#proponente').val()) > 1 && parseInt($tc('#proponente').val()) < 4 ){
		$tc('#btn_adicionaProp').prop('disabled', false);
		$tc('#btn_deletaProp').prop('disabled', false);
	}
}

var imaxPS = 1; // qtde de registros de pagamento do sinal

function IniForm() {

	if($tc('#data').is('input') && $tc('#data').val() == ''){
		// inicia campo Data com data de hoje
		IniciarData();
	}

	// PAGAMENTO DO SINAL
	if($tc('#pagamentoSinal').is('select')){
		SelecionarPagamentoSinal($tc('#pagamentoSinal').val().toLowerCase());
	}else if($tc('#pagamentoSinal').is('span')){
		SelecionarPagamentoSinal($tc('#pagamentoSinal').text().toLowerCase());
	}

	// INDICE DO REAJUSTE
	if($tc('#indiceReajuste').is('select')){
		SelecionarIndiceReajuste($tc('#indiceReajuste').val().toLowerCase());
	}else if($tc('#indiceReajuste').is('span')){
		SelecionarIndiceReajuste($tc('#indiceReajuste').text().toLowerCase());
	}

	if ( document.getElementById("exe1Exp").value == "true" ) {
		horas1Exp.style.visibility = "visible";
	} else {
	  horas1Exp.style.visibility = "hidden";
		horas1Exp.style.position = "absolute";
	}

	if ( document.getElementById("exe2Exp").value == "true" ) {
		horas2Exp.style.visibility = "visible";
	} else {
	  horas2Exp.style.visibility = "hidden";
		horas2Exp.style.position = "absolute";
	}

  if ( document.getElementById("exeSinal").value == "true" ) {
  	horasSinal.style.visibility = "visible";
  } else {
	  horasSinal.style.visibility = "hidden";
		horasSinal.style.position = "absolute";
	}

	if (document.getElementById("executou1vez").value == "") {
		wdkAddChild("tabelaBoleto");
    wdkAddChild("tabelaCheque");
    wdkAddChild("tabelaFormaPagamento");
    wdkAddChild("tabelaOutros");

    divBoleto.style.position = "relative";
		divOutros.style.position = "relative";
		divCheque.style.position = "relative";

    // inicia com foco no campo => Numero da Proposta
    var campoInicial = document.getElementById("proposta");
	    if (campoInicial != null) {
				document.getElementById("proposta").value = 0;
	      campoInicial.focus();
	    }
	}

	document.getElementById("executou1vez").value = "true";
	// fim do Iniform() abaixo
}

function CalcularSaldo(elemento) {

	var soma = 0;

	if (imaxPS < stringToInt(elemento.id)) {
		imaxPS = stringToInt(elemento.id);
	}
	
	for (var i = 1; i <= imaxPS; i++) {

		if ((		document.getElementById("quantidadeParcelas" + intToString(i)) 			!= null			) &&
    		(		document.getElementById("valorParcela" 		 + intToString(i)) 			!= null			) &&
			(typeof(document.getElementById("quantidadeParcelas" + intToString(i)).value) 	!= "undefined"	) &&
			(typeof(document.getElementById("valorParcela"       + intToString(i)).value) 	!= "undefined"	) &&
			(		document.getElementById("quantidadeParcelas" + intToString(i)).value 	!= ""			) &&
			(		document.getElementById("valorParcela"       + intToString(i)).value 	!= ""			)) {

			var qtdeParc = document.getElementById("quantidadeParcelas" + intToString(i)).value;
			var valorParc = document.getElementById("valorParcela" + intToString(i)).value.replace(".", "");
			valorParc = valorParc.replace(",", ".");
			soma = Number(soma) + (Number(qtdeParc) * Number(valorParc));
		
		}
  }	

  document.getElementById("valorSaldo").value = FloatToMoeda(soma);
  var valorSinal = document.getElementById("valorSinal").value.replace(".", "");
  valorSinal = valorSinal.replace(",", ".");
  var valorIntImob = document.getElementById("valorIntermediacaoImob").value.replace(".", "");
  valorIntImob = valorIntImob.replace(",", ".");
	document.getElementById("valorTotal").value = FloatToMoeda( Number(valorSinal) + Number(valorIntImob) + Number(soma) );

	MostrarExtenso();

}

function handleEnter (field, event) {

	var code = event.keyCode ? event.keyCode : event.which ? event.which : event.charCode;
	if (code == 13) {

		if ( !ValidarCampo(field, event) )
			return true;

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

function ValidarCampo(field, event)	{

	if (field.readOnly == true)
		return;

	// se o campo nao estiver oculto
	if($tc(this).not(':hidden')){

		switch (this)	{
			case "data":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimento_1":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimento_2":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimento_3":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimento_4":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicao_1":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicao_2":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicao_3":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicao_4":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataCasamento_1":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataCasamento_2":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataCasamento_3":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataCasamento_4":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimentoCojugue_1":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimentoCojugue_2":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimentoCojugue_3":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataNascimentoCojugue_4":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicaoCojugue_1":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicaoCojugue_2":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicaoCojugue_3":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "dataExpedicaoCojugue_4":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "vencimento":
				if ( !ValidarData(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpf_1":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpf_2":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpf_3":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpf_4":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpfCojugue_1":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpfCojugue_2":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpfCojugue_3":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
			case "cpfCojugue_4":
				if ( !ValidarCPF(field.value) ) {
					field.style.border  = "2px solid red";
					return false;
				}
				break;
		}

		 // campos obrigat?ios
		if ( (field.value == "")						&& (
			  (field.id == "nacionalidade_1"				   ) ||
			  (field.id == "nacionalidade_2"				   ) ||
			  (field.id == "nacionalidade_3"				   ) ||
			  (field.id == "nacionalidade_4"				   ) ||
			  (field.id == "valorTotalExtenso"			) ||
			  (field.id == "estadoCivil_1"					) ||
			  (field.id == "estadoCivil_2"					) ||
			  (field.id == "estadoCivil_3"					) ||
			  (field.id == "estadoCivil_4"					) ||
			  (field.id == "vencimento"					) ||
			  (field.id == "orgaoEmissor_1"				   ) ||
			  (field.id == "orgaoEmissor_2"				   ) ||
			  (field.id == "orgaoEmissor_3"				   ) ||
			  (field.id == "orgaoEmissor_4"				   ) ||
			  (field.id == "profissao_1"					   ) ||
			  (field.id == "profissao_2"					   ) ||
			  (field.id == "profissao_3"					   ) ||
			  (field.id == "profissao_4"					   ) ||
			  (field.id == "cpf_1"							   ) ||
			  (field.id == "cpf_2"							   ) ||
			  (field.id == "cpf_3"							   ) ||
			  (field.id == "cpf_4"							   ) ||
			  (field.id == "vendedora"					   ) ||
			  (field.id == "numero"						   ) ||
			  (field.id == "valorSinal"					) ||
			  (field.id == "valorTotal"					) ||
			  (field.id == "nome"						   ) ||
			  (field.id == "indiceReajuste"				) ||
			  (field.id == "cnpjVendedora"				) ||
			  (field.id == "proposta"					   ) ||
			  (field.id == "naturalidade_1"				   ) ||
			  (field.id == "naturalidade_2"				   ) ||
			  (field.id == "naturalidade_3"				   ) ||
			  (field.id == "naturalidade_4"				   ) ||
			  (field.id == "data"						   ) ||
			  (field.id == "rg_1"							   ) ||
			  (field.id == "rg_2"							   ) ||
			  (field.id == "rg_3"							   ) ||
			  (field.id == "rg_4"							   ) ||
			  (field.id == "area"						   ) ||
			  (field.id == "valorSaldo"					) ||
			  (field.id == "dataNascimento_1"				) ||
			  (field.id == "dataNascimento_2"				) ||
			  (field.id == "dataNascimento_3"				) ||
			  (field.id == "dataNascimento_4"				) ||
			  (field.id == "valorSinalExtenso"			) ||
			  (field.id == "empreendimento"				) ||
			  (field.id == "valorSaldoExtenso"			) ||
			  (field.id == "cidade_1"						   ) ||
			  (field.id == "cidade_2"						   ) ||
			  (field.id == "cidade_3"						   ) ||
			  (field.id == "cidade_4"						   ) ||
			  (field.id == "bairro_1"						   ) ||
			  (field.id == "bairro_2"						   ) ||
			  (field.id == "bairro_3"						   ) ||
			  (field.id == "bairro_4"						   ) ||
			  (field.id == "quadra"						   ) ||
			  (field.id == "foneResidencial_1"				) ||
			  (field.id == "foneResidencial_2"				) ||
			  (field.id == "foneResidencial_3"				) ||
			  (field.id == "foneResidencial_4"				) ||
			  (field.id == "endereco_1"					   ) ||
			  (field.id == "endereco_2"					   ) ||
			  (field.id == "endereco_3"					   ) ||
			  (field.id == "endereco_4"					   ) ||
			  (field.id == "quantidadeParcelas___1"	) ||
			  (field.id == "valorParcela___1"			) ) )	{

				field.style.border  = "2px solid red";
				return false;
		}
		 // valida informa?es do conjugue quando estado civil for casado
		 if ( (field.value == ""									) &&
			 (document.getElementById("estadoCivil_1").value == "casado") && (
				 (field.id == "regimeCasamento_1"						) ||
				 (field.id == "conjugue_1"							) ||
				 (field.id == "dataNascimentoCojugue_1"				) ||
				 (field.id == "profissaoCojugue_1"					) ||
				 (field.id == "nacionalidadeCojugue_1"				) ||
				 (field.id == "naturalidadeCojugue_1"					) ||
				 (field.id == "cpfCojugue_1"							) ||
				 (field.id == "rgCojugue_1"							) ||
				 (field.id == "orgaoEmissorCojugue_1"					) ) )	{
				field.style.border  = "2px solid red";
				return false;
		}

		if ( (field.value == ""									) &&
			 (document.getElementById("estadoCivil_2").value == "casado") && (
				 (field.id == "regimeCasamento_2"						) ||
				 (field.id == "conjugue_2"							) ||
				 (field.id == "dataNascimentoCojugue_2"				) ||
				 (field.id == "profissaoCojugue_2"					) ||
				 (field.id == "nacionalidadeCojugue_2"				) ||
				 (field.id == "naturalidadeCojugue_2"					) ||
				 (field.id == "cpfCojugue_2"							) ||
				 (field.id == "rgCojugue_2"							) ||
				 (field.id == "orgaoEmissorCojugue_2"					) ) )	{
				field.style.border  = "2px solid red";
				return false;
		}

		if ( (field.value == ""									) &&
			 (document.getElementById("estadoCivil_3").value == "casado") && (
				 (field.id == "regimeCasamento_3"						) ||
				 (field.id == "conjugue_3"							) ||
				 (field.id == "dataNascimentoCojugue_3"				) ||
				 (field.id == "profissaoCojugue_3"					) ||
				 (field.id == "nacionalidadeCojugue_3"				) ||
				 (field.id == "naturalidadeCojugue_3"					) ||
				 (field.id == "cpfCojugue_3"							) ||
				 (field.id == "rgCojugue_3"							) ||
				 (field.id == "orgaoEmissorCojugue_3"					) ) )	{
				field.style.border  = "2px solid red";
				return false;
		}

		if ( (field.value == ""									) &&
			 (document.getElementById("estadoCivil_4").value == "casado") && (
				 (field.id == "regimeCasamento_4"						) ||
				 (field.id == "conjugue_4"							) ||
				 (field.id == "dataNascimentoCojugue_4"				) ||
				 (field.id == "profissaoCojugue_4"					) ||
				 (field.id == "nacionalidadeCojugue_4"				) ||
				 (field.id == "naturalidadeCojugue_4"					) ||
				 (field.id == "cpfCojugue_4"							) ||
				 (field.id == "rgCojugue_4"							) ||
				 (field.id == "orgaoEmissorCojugue_4"					) ) )	{
				field.style.border  = "2px solid red";
				return false;
		}

		 // valida informa?es do conjugue quando estado civil for casado
			if ( (field.value == "") && (!field.readOnly) && (field.id == "indiceOutros") ) {
				field.style.border  = "2px solid red";
				return false;
			}

	}

	field.style.border  = "";
	return true;

	// fim do ValidarCampo abaixo
}

function ValidarCPF(cpf) {

  if (cpf == "")
      return true;
  var cpfNumeros = RemoverCaracteres("1234567890", cpf);
  if (cpfNumeros == "99999999999")
      return true;

  if (cpfNumeros.length != 11 || cpfNumeros == "00000000000" || cpfNumeros == "11111111111" || cpfNumeros == "22222222222" || cpfNumeros == "33333333333" || cpfNumeros == "44444444444" || cpfNumeros == "55555555555" || cpfNumeros == "66666666666" || cpfNumeros == "77777777777" || cpfNumeros == "88888888888" || cpfNumeros == "99999999999")
      return false;

  add = 0;
  for (i = 0; i < 9; i++)
      add += parseInt(cpfNumeros.charAt(i)) * (10 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
      rev = 0;
  if (rev != parseInt(cpfNumeros.charAt(9)))
      return false;

  add = 0;
  for (i = 0; i < 10; i++)
      add += parseInt(cpfNumeros.charAt(i)) * (11 - i);
  rev = 11 - (add % 11);
  if (rev == 10 || rev == 11)
      rev = 0;
  if (rev != parseInt(cpfNumeros.charAt(10)))
      return false;

  return true;
}

function RemoverCaracteres(caracteresValidos, strInput) {

    var strRetorno = "";
    var tam = Tamanho(strInput);

    for (var i = 0; i < tam; i++) {
        if ( caracteresValidos.indexOf(strInput.substring(i, i + 1)) > 0 ||
        	 caracteresValidos.substring(0, 1) == strInput.substring(i, i + 1) )
            strRetorno += strInput.substring(i, i + 1);
    }
    return strRetorno;
}

function Tamanho(valor) {
    var tam = 0;
    try {
    	tam = valor.length();
    }
    catch(e){
    	tam = valor.length;
    }
    return tam;
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

// FORMATAÇÃO DOS CAMPOS
function VerificarNumero(valor) {

    var digitosValidos = "0123456789";

    if (digitosValidos.indexOf(valor) < 0)
        return false;

    return true;
}

function FormatarCampo(campo, mascara, evento) {
    /* mascara deve ser:
        # para qualquer caracter;
        9 para numericos;
        X para texto; */

	if (!handleEnter(campo, evento))
		return;

    var i = campo.value.length;
    if (i >= mascara.length)
        return false;

    var texto = mascara.substring(i);
    i = 0;
    var digitoMascara = texto.substring(i, i + 1);
    while (digitoMascara != '#' && digitoMascara != 'X' && digitoMascara != '9' && i < texto.length) {
        campo.value += digitoMascara;
        i++;
        digitoMascara = texto.substring(i, i + 1);
    }

    if (VerificarNumero(String.fromCharCode(evento.keyCode))) {
        if (digitoMascara == 'X')
            return false;
    }
    else {
        if (digitoMascara == '9')
            return false;
    }
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

// TRATAMENTO DE DATAS
function IniciarData() {

    var data = document.getElementById("data");

    data.value = RetornarDataAtual();
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

function FormatarData(campo, evento) {

	if (!handleEnter(campo, evento))
		return;

    var valorCampo = "";
    var digitosValidos = "0123456789";
    var teclaDigitada = String.fromCharCode(evento.keyCode);

    if (digitosValidos.indexOf(teclaDigitada) < 0)
        return false;

    valorCampo = campo.value;
    if (campo.value.length >= 5)
        campo.value = valorCampo.substring(0, 5) + "/" + valorCampo.substring(6);
    else if (campo.value.length >= 2)
        campo.value = valorCampo.substring(0, 2) + "/" + valorCampo.substring(3);
}

// INDICE DE REAJUSTE
function SelecionarIndiceReajuste(opcaoSelecionada) {
  //var campoIndiceOutros = document.getElementById("indiceOutros");
	//$tc('.campoIndiceOutros').hide();
	switch(opcaoSelecionada) {
		case "outros" :
			$tc('.campoIndiceOutros').css({ position: "relative" }).show();
	}
  if (opcaoSelecionada == "outros")	{
 		$tc('.campoIndiceOutros').css({
      position: "relative"
	  }).show();
	 	$tc('#indiceOutros').focus();
	}
  else	{
  	$tc('.campoIndiceOutros').hide();
	}
}
function SelecionarPagamentoSinal(opcaoSelecionada) {

		var opcaoMinusculaSelecionada = opcaoSelecionada.toLowerCase();

    switch(opcaoMinusculaSelecionada) {

    	case "cheque":
    		$tc('#divCheque').css({ position: "relative" }).show();
    		$tc('#divBoleto').hide();
    		$tc('#divOutros').hide();
    		break;

    	case "outros":
    		$tc('#divOutros').css({ position: "relative" }).show();
    		$tc('#divBoleto').hide();
    		$tc('#divCheque').hide();
    		break;

    	default:
    		$tc('#divBoleto').css({ position: "relative" }).show();
    		$tc('#divCheque').hide();
    		$tc('#divOutros').hide();
    }
}

function RetornarCampoOpcao(idRadio, opcao) {

    var opcaoAux = null;
    var opcoes = document.getElementsByName(idRadio);

    for (var i = 0; i < opcoes.length; i++) {
        opcaoAux = opcoes[i];
        if (opcaoAux.value == opcao)
            return opcaoAux;
    }
}

function SelecionarFormaPagamento(opcaoSelecionada) {

    opcaoSelecionada.checked = true;

    var opcoesParcela = document.getElementsByName("parcelas");
    for (var i = 0; i < opcoesParcela.length; i++) {

        var campoValorParcela = document.getElementById("valorP" + opcoesParcela[i].value.substring(1));
        if (campoValorParcela != null) {

            if (campoValorParcela.id == "valorP" + opcaoSelecionada.value.substring(1)) {
                campoValorParcela.readOnly = false;
                campoValorParcela.focus();
            }
            else {
                campoValorParcela.value = "";
                campoValorParcela.readOnly = true;
            }

            var campoQtdParcelas = document.getElementById("quantidadeParcelas");
            if (campoQtdParcelas != null) {
                if (opcaoSelecionada.value == "parcelasX") {
                    campoQtdParcelas.readOnly = false;
                    campoQtdParcelas.focus();
                }
                else {
                    campoQtdParcelas.value = "";
                    campoQtdParcelas.readOnly = true;
                }
            }
        }
    }
}

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

// utilizado nas rotinas para retornar valor por extenso
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

// Define as partes do valor por extenso

function MostrarExtenso()	{
	MostrarExtensoCampo("valorSinal");
	MostrarExtensoCampo("valorSaldo");
	MostrarExtensoCampo("valorIntermediacaoImob");
	MostrarExtensoCampo("valorParcela");
	MostrarExtensoCampo("valorTotal");
	MostrarExtensoCampoPorClasse("valorParcela");
}

function MostrarExtensoCampo(campo)	{

	var valorExtenso = $tc("#_"+campo).length ? $tc("#_"+campo).val() : ( $tc("#"+campo).is('span') ? $tc("#"+campo).text() : $tc("#"+campo).val() );

	if(campo != null && valorExtenso == "") {
		$tc("."+campo+"_Extenso").text("");
	}else if ( campo != null && valorExtenso != "" && Number(valorExtenso.replace(",",".")) != 0 ) {
		var valor = valorExtenso.replace(".","");
		$tc("."+campo+"_Extenso").text(ConvertToWords(valor.replace(",",".")));
	}

}

function MostrarExtensoCampoParcela(campo)	{

	var valorExtenso = $tc("#"+campo).is('span') ? $tc("#"+campo).text() : $tc("#"+campo).val();

	if ( campo != null && valorExtenso != "" && Number(valorExtenso.replace(",",".")) != 0 ) {
		var valor = valorExtenso.replace(".","");
		$tc("#Extenso_"+campo+":visible").text(ConvertToWords(valor.replace(",",".")));
	}

}

function MostrarExtensoCampoPorClasse(campo)	{

	var valorExtenso = $tc("."+campo).is('span') ? $tc("."+campo).text() : $tc("."+campo).val();

	if ( campo != null && valorExtenso != "" && Number(valorExtenso.replace(",",".")) != 0 ) {
		var valor = valorExtenso.replace(".","");
		$tc("."+campo+"_Extenso").text(ConvertToWords(valor.replace(",",".")));
	}

}
