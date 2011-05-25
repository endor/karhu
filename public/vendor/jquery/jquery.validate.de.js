/*
 * Translated default messages for the jQuery validation plugin.
 * Locale: DE
 */
jQuery.extend(jQuery.validator.messages, {
	required: "Dieses Feld ist ein Pflichtfeld.",
	maxlength: jQuery.validator.format("Geben Sie bitte maximal {0} Zeichen ein."),
	minlength: jQuery.validator.format("Geben Sie bitte mindestens {0} Zeichen ein."),
	rangelength: jQuery.validator.format("Geben Sie bitte mindestens {0} und maximal {1} Zeichen ein."),
	email: "Geben Sie bitte eine gültige E-Mail Adresse ein.",
	url: "Geben Sie bitte eine gültige URL ein.",
	date: "Bitte geben Sie ein gültiges Datum ein.",
	number: "Geben Sie bitte eine Nummer ein.",
	digits: "Geben Sie bitte nur Ziffern ein.",
	equalTo: "Bitte denselben Wert wiederholen.",
	range: jQuery.validator.format("Geben Sie bitten einen Wert zwischen {0} und {1}."),
	max: jQuery.validator.format("Geben Sie bitte einen Wert kleiner oder gleich {0} ein."),
	min: jQuery.validator.format("Geben Sie bitte einen Wert größer oder gleich {0} ein."),
	creditcard: "Geben Sie bitte ein gültige Kreditkarten-Nummer ein."
});

/*
 * Localized default methods for the jQuery validation plugin.
 * Locale: DE
 */
jQuery.extend(jQuery.validator.methods, {
	date: function(value, element) {
		return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
	},
	number: function(value, element) {
		return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
	}
});