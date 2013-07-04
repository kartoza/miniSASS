$(document).ready(function () {
    var organisation_type = $("#id_organisation_type");
    var organisation_list = $("#id_organisation_list"); 
    var organisation_name = $("#id_organisation_name");
    var list_row = organisation_list.parent().parent();
    var name_row = organisation_name.parent().parent();

    list_row.hide();

    organisation_type.change(function() {
        var selectedText = this.options[this.selectedIndex].text;

        if (selectedText == 'School') {
            $.get('/map/schools/', {
                    'query': 'stra',
                },
                function(data) {
                    alert(data);
                    list_row.show();
                    // name_row.hide()
                    return false;
                });
        } else {
            list_row.hide();
            // name_row.show()
        };
    });
})
