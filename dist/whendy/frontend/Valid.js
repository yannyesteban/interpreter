import { DateUtil } from "./DateUtil.js";
const spanishMessage = {
    "required": "El campo {=title} es obligatorio",
    "alpha": "El campo {=title} solo debe tener caracteres alfabéticos",
    "alphanumeric": "El campo {=title} solo debe tener caracteres alfanuméricos",
    "nospaces": "El campo {=title} no debe tener espacio en blancos",
    "numeric": "El campo {=title} debe ser un valor numérico",
    "positive": "El campo {=title} debe ser un número positivo",
    "integer": "El campo {=title} debe ser un número entero",
    "email": "El campo {=title} no es una dirección de correo válida",
    "date": "El campo {=title} no es una fecha válida",
    "time": "El campo {=title} no es una hora válida",
    "exp": "El campo {=title} no coincide con un patrón válido",
    "minlength": "La longitud en caracteres del campo {=title}, debe ser mayor que {=value}",
    "maxlength": "La longitud en caracteres del campo {=title}, debe ser menor que {=value}",
    "greater": "El campo {=title} debe ser mayor que {=value}",
    "less": "El campo {=title} debe ser menor que {=value}",
    "greatestequal": "El campo {=title} debe ser mayor o igual que {=value}",
    "lessequal": "El campo {=title} debe ser menor o igual que {=value}",
    "condition": "El campo {=title} no cumple la condición predefinida",
    "titledefault": "campo",
    "messagedefault": "El {=title} no posee un valor válido"
};
let lang = "spa";
const messages = {};
export function setLanguage(lang) {
    this.lang = lang;
}
export function setMessage(lang, message) {
    messages[lang] = message;
}
function isValid(rule, value, options) {
    switch (rule) {
        case "required":
            return value !== "";
        case "alpha":
            return new RegExp(/^([ A-ZáéíóúÁÉÍÓÚüÜñÑ]+)$/).test(value);
        case "alphanumeric":
            return new RegExp(/^([\w]+)$/).test(value);
        case "nospaces":
            return !new RegExp(/[ ]+/).test(value);
        case "numeric":
            return new RegExp(/^[-]?\d*\.?\d*$/).test(value);
        case "integer":
            return new RegExp(/^[-]?\d*$/).test(value);
        case "positive":
            return new RegExp(/^\d*\.?\d*$/).test(value);
        case "exp":
            return new RegExp(options.value, "ig").test(value);
        case "email":
            return new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(value);
        case "greater":
            return value > options.value;
        case "less":
            return value < options.value;
        case "greatestequal":
            return value >= options.value;
        case "lessequal":
            return value <= options.value;
        case "date":
            return DateUtil.valid(value, options.value || "%y-%m-%d");
    }
}
function evalMessage(rule, value, title, ruleMessage) {
    let msg = ruleMessage || messages[lang][rule];
    msg = msg.replace("{=title}", title || messages[lang].titledefault);
    return msg.replace("{=value}", value);
}
export function valid(rules, value, title) {
    value = String(value).trim();
    for (const [rule, options] of Object.entries(rules)) {
        if (!isValid(rule, value, options)) {
            return { error: true, message: evalMessage(rule, value, title, options.message) };
        }
    }
    return { error: false, message: "" };
}
setMessage("spa", spanishMessage);
//# sourceMappingURL=Valid.js.map