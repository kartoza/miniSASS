$(document).ready(function () {
    var organisation_name = $("#id_organisation_name");

    $("#id_organisation_type").change(function() {
        var selectedText = this.options[this.selectedIndex].text;
        if (selectedText == 'School') {
            $("#id_organisation_name").autocomplete("enable");
        } else {
            $("#id_organisation_name").autocomplete("disable");
        };
    });

    $("#id_organisation_name").autocomplete({
        source: '/autocomplete/school_names/',
        minLength: 3,
        disabled: true
    });
})
