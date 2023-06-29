/**
 * 
 * @param value 
 * @returns 
 */

const sgDate = {dateFrom:null};

sgDate.dateFrom = function(query, pattern){
	let
		aux = {day:null, month:null, year:null},
		date = / /,
		pattern_ = null,
		result = null;

	pattern_ = pattern.replace(/%dd/g,"([0-9]{1,2})");
	pattern_ = pattern_.replace(/%mm/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%yy/g,"[0-9]{4}");

	pattern_ = pattern_.replace(/%d/g,"([0-9]{1,2})");
	pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

	date.compile(pattern_);
	if((result = date.exec(query))){
		aux.day = result[1] *1;
	}else{
		return false;
	}

	pattern_ = pattern.replace(/%dd/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%mm/g,"([0-9]{1,2})");
	pattern_ = pattern_.replace(/%yy/g,"[0-9]{4}");
	pattern_ = pattern_.replace(/%d/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%m/g,"([0-9]{1,2})");
	pattern_ = pattern_.replace(/%y/g,"[0-9]{4}");

	date.compile(pattern_);
	if((result = date.exec(query))){
		aux.month = result[1] *1;
	}else{
		return false;
	}
	pattern_ = pattern.replace(/%dd/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%mm/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%yy/g,"([0-9]{4})");

	pattern_ = pattern_.replace(/%d/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%m/g,"[0-9]{1,2}");
	pattern_ = pattern_.replace(/%y/g,"([0-9]{4})");

	date.compile(pattern_);
	if((result = date.exec(query))){
		aux.year = result[1] *1;
	}else{
		return false;
	}

	return new Date(aux.year, aux.month-1, aux.day);
};

	let trim = function(value){
		
		let re = /^\s+/i;
		let matchArray = re.exec(value);
		
		if (matchArray){
			value = value.replace(re, "");
		}
		
		re = / +$/i;
		matchArray = re.exec(value);
		if (matchArray){
			value = value.replace(re, "");
		}
		return value;
	};
	
	let empty = function(value){
		let re = /.+/;
		let matchArray = re.exec(value);
		if (matchArray){
			return false;
		}
		return true;
	};
	let evalExp = function(pattern, value){
		if (!empty(value)){
			
			let re = new RegExp(pattern, "gi");
			let matchArray = re.exec(value);

			if (matchArray){
				return true;
			}else{
				return false;
			}
		}
		return true;
	};
	
	let evalDate = function(value, pattern){
		
		if(trim(value) === ""){
			return true;
		}
		
		let aux = sgDate.dateFrom(value, pattern);

		if(!aux){
			return false;
		}else{
			return true;
		}

	};
	
	
	export let Valid = {
		msg: {},
		
		
		setErrorMessages: function(msg){
			this.msg = msg;
		},

		evalMsg: function(key, rules, value, title){
			
			let msg = "";
			
			if(rules[key].msg){
				msg = rules[key].msg || this.msg[key]["messagedefault"];
			}else{
				msg = this.msg[key] || this.msg[key]["messagedefault"];
			}

			msg = msg.replace("{=title}", title || this.msg[key]["titledefault"]);

			if(rules[key].value){
				msg = msg.replace("{=value}", rules[key].value);
			}

			return msg;
		},
		
		send: function(rules, value, title, masterData){
			let error = false, rule = null, key = null;
			for(key in rules){
				rule = rules[key];	
				error = false;

				switch(key){
					case "required":
						if(trim(value) === ""){
							error = true;
						}
						break;
					case "alpha":
						if(!evalExp("^([ A-ZáéíóúÁÉÍÓÚüÜñÑ]+)$", value)){
							error = true;
						}
						break;
					case "alphanumeric":
						if(!evalExp("^([\\w]+)$", value)){
							error = true;
						}
						break;
					case "nospaces":
						if(evalExp("[ ]+", value)){
							error = true;
						}
						break;
					case "numeric":
						if(!evalExp("^[-]?\\d*\\.?\\d*$", value)){
							error = true;
						}
						break;
					case "integer":
						if(!evalExp("^[-]?\\d*$", value)){
							error = true;
						}
						break;
					case "positive":
						if(!evalExp("^\\d*\\.?\\d*$", value)){
							error = true;
						}
						break;
					case "exp":
						if(!evalExp(rules[rule].value, value)){
							error = true;
						}
						break;
					case "email":
						if(!evalExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", value)){
							error = true;
						}
						break;
					case "greater":
						if(value <= rule.value){
							error = true;
						}
						break;	
					case "less":
						if(value >= rule.value){
							error = true;
						}
						break;	
					case "greatestequal":
						if(value < rule.value){
							error = true;
						}
						break;	
					case "lessequal":
						if(value > rule.value){
							error = true;
						}
						break;	
					case "condition":
						if(!this.evalCondition(rule.value, value)){
							error = true;
						}
						break;	
					case "date":
						if(!evalDate(value, rule.value || "%y-%m-%d")){
							error = true;
						}
						break;	
				}
				if(error){
					return this.evalMsg(key, rules, value, title);
				}
				
			}
			
			return false;
		
		},
		
		
	};

	
	const spanishMessage = {
		"required": "El campo {=title} es obligatorio",
		"alpha"			:"El campo {=title} solo debe tener caracteres alfabéticos",
		"alphanumeric"	:"El campo {=title} solo debe tener caracteres alfanuméricos",
		"nospaces"		:"El campo {=title} no debe tener espacio en blancos",
		"numeric"		:"El campo {=title} debe ser un valor numérico",
		"positive"		:"El campo {=title} debe ser un número positivo",
		"integer"		:"El campo {=title} debe ser un número entero",
		"email"			:"El campo {=title} no es una dirección de correo válida",
		"date"			:"El campo {=title} no es una fecha válida",
		"time"			:"El campo {=title} no es una hora válida",
		"exp"			:"El campo {=title} no coincide con un patrón válido",
		"minlength"		:"La longitud en caracteres del campo {=title}, debe ser mayor que {=value}",
		"maxlength"		:"La longitud en caracteres del campo {=title}, debe ser menor que {=value}",
		"greater"		:"El campo {=title} debe ser mayor que {=value}",
		"less"			:"El campo {=title} debe ser menor que {=value}",
		"greatestequal"	:"El campo {=title} debe ser mayor o igual que {=value}",
		"lessequal"		:"El campo {=title} debe ser menor o igual que {=value}",
		"condition"		:"El campo {=title} no cumple la condición predefinida",
		"titledefault"	:"campo",
		"messagedefault":"El {=title} no posee un valor válido" 

	};



	Valid.setErrorMessages(spanishMessage);
	//Valid.msg["spa"]= valigMessage["spa"];

