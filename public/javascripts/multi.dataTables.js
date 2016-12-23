/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.dataTables = (function () {
        var tbl,
            $tblElem,
            tableColumns,
            currentUrl;

        function init($element, columns, url) {
            $tblElem = $element;
            tableColumns = columns;
            currentUrl = url;
            drawTable();
        }

        function reloadTable() {
            if (tbl) {
                tbl.draw();
            } else {
                drawTable();
            }
        }

        function drawTable() {
            tbl = $tblElem.DataTable({
                'bProcessing': true,
                'bServerSide': true,
                'bJQueryUI': true,
                "bAutoWidth": false,
                'iDisplayLength': 20,
                'iDisplayStart': 0,
                'sAjaxSource': currentUrl,
                "aLengthMenu": [[20, 50, 100], [20, 50, 100]],
                'sPaginationType': 'full_numbers',
                'aoColumns': tableColumns,
                //'oLanguage': {
                //    'sUrl': '/Home/GetGridTranslations'
                //},
                'fnServerData': function (sSource, aoData, fnCallback) {
                    $.ajax({
                        dataType: 'json',
                        type: "GET",
                        url: currentUrl,
                        data: aoData,
                    }).done(
                        function (json) {
                            fnCallback(json);
                        }).fail(function (a, b, c) {

                    });
                }
            });
        }

        return {
            init: init,
            reloadTable: reloadTable
        }
    })();
})(jQuery, this);