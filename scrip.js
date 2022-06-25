window.onload=function(){
	listar();
	document.getElementById('frmCadastro').addEventListener('submit', adicionarOuAlterar);
	document.getElementById('frmCadastro').addEventListener('submit', listar);
}

//variavel global
var idAlterar = null;

//Evento do botao cadastrar/salvar (verificação)
function adicionarOuAlterar(e){
	var nom = document.getElementById('txtnomb').value;
	var p = {
		nomb : !nom ? "sem nomb": nom, //mesmo que if(nom = ""){ nom = "sem nomb";}
		nasc : new Date(document.getElementById('dtpDataNacimiento').value.replace("-","/")),
		sexo : document.getElementById('rdoMasculino').checked ? 'M' : 'F',
		data : new Date()
	}

	if(idAlterar == null)
		adicionar(p);
	else if(idAlterar > 0)
		alterar(p);
	else
		alert("Ação desconhecida");

	//bloqueia a ação de atualização do browser
	e.preventDefault();
}

function adicionar(p){
	var persona = [];
	var idValido = 1;

	if(localStorage.getItem('value') !== null ){
		persona = JSON.parse(localStorage.getItem('value'));

		if(persona.length > 0)
			idValido = 	(function obterIdValido() {
							for(var i = 0; i < persona.length; i++)
								if(persona[i].Id != i+1)
									return i + 1;
							return persona[persona.length - 1].Id + 1;
						})();
	}

	var pessoa = {
		Id: idValido,
		nomb: p.nome,
		DataNacimiento: p.nasc.toLocaleString("pt-ES").substring(0, 10),
		Sexo: p.sexo,
		Guardar : p.data.toLocaleString("pt-ES")
	};


	persona.push(pessoa);

	persona.sort(function(a,b) {
		return a.Id - b.Id;
	});

	localStorage.setItem('value', JSON.stringify(persona));

	document.getElementById('frmCadastro').reset();
}

function alterar(p){
	var btn = document.getElementById('btnCadastrarSalvar');

	persona = JSON.parse(localStorage.getItem('value'));
	//substituir as informaçoes
	for(var i = 0; i < persona.length; i++){
		if(persona[i].Id == idAlterar){
			persona[i].nomb = p.nomb;
			persona[i].DataNacimiento = p.nasc.toLocaleString("pt-ES").substring(0, 10);
			persona[i].Sexo = p.sexo;
			persona[i].Guardar = p.data.toLocaleString("pt-ES");

			btn.value = "Cadastrar";
			idAlterar = null;

			localStorage.setItem('value', JSON.stringify(persona));
			document.getElementById('frmCadastro').reset();
			break;
		}
	}
}

function prepararAlterar(idRow){
	document.getElementById('btnCadastrarSalvar').value = "Salvar";

	var txtnomb = document.getElementById('txtnomb'),
	    dtpDataNacimiento = document.getElementById('dtpDataNacimiento'),
	    rdoMasculino = document.getElementById('rdoMasculino'),
	    rdoFeminino = document.getElementById('rdoFeminino');

	var persona = JSON.parse(localStorage.getItem('value'));
	for(var i = 0; i < persona.length; i++){
		if(persona[i].Id == idRow){
			//popular os campos
			txtnomb.value = persona[i].nomb;
			dtpDataNacimiento.value = persona[i].DataNacimiento.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1');
			rdoMasculino.checked = !(rdoFeminino.checked = (persona[i].Sexo == 'F'));

			listar();

			idAlterar = null;
			if(idAlterar === null){

				var th = document.getElementById("rowTable"+i);
				th.className = "estadoAlteracao";
			}

			idAlterar = persona[i].Id;
			break;
		}
	}
}

function excluir(cod){
	var persona = JSON.parse(localStorage.getItem('value'));

	for(var i = 0; i < persona.length; i++)
		if(persona[i].Id == cod)
			persona.splice(i, 1);


	localStorage.setItem('value', JSON.stringify(persona));
	listar();
	if(persona.length == 0)
		window.localStorage.removeItem("value");
}

function listar(){

	if(localStorage.getItem('value') === null)
		return;
	var persona = JSON.parse(localStorage.getItem('value'));
	var tbody = document.getElementById("tbodyResultados");
	tbody.innerHTML = '';

	for(var i = 0; i < persona.length; i++){
		var	id = persona[i].Id,
		    nomb = persona[i].nomb,
		    nasc = persona[i].DataNacimiento,
		    sexo = persona[i].Sexo,
			data = persona[i].Guardar

		tbody.innerHTML += '<tr id="rowTable'+i+'">'+
								'<td>'+id+'</td>'+
								'<td>'+nomb+'</td>'+
								'<td>'+nasc+'</td>'+
								'<td>'+sexo+'</td>'+
								'<td>'+data+'</td>'+
								'<td><button onclick="excluir(\'' + id + '\')">Eliminar</button></td>'+
								'<td><button onclick="prepararAlterar(\'' + id + '\')">Editar</button></td>'+
						   '</tr>';
	}
}
