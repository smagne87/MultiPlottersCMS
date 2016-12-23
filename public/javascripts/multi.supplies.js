/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.supplies = (function () {
        var $hdnId = $("#hdnId"),
            $txtSupply = $("#txtSupply"),
            $txtType = $("#txtType"),
            $txtCategory = $("#txtCategory"),
            $txtWidth = $("#txtWidth"),
            $txtLength = $("#txtLength"),
            $txtPrice = $("#txtPrice"),
            $hdnDeleteId = $("#hdnDeleteId");

        function init() {
            initTable();
            handleEvents();
        }

        function handleEvents() {
            var $btnCreate = $("#btnCreate"),
                $btnSave = $("#btnSave"),
                $btnCancel = $("#btnCancel"),
                $tblSupplies = $("#tblSupplies"),
                $btnDelete = $("#btnDelete");

            $btnDelete.on("click", function (e) {
                deleteSupply();
            });

            $tblSupplies.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getSupplyAndLoadForm($elem);
            });

            $tblSupplies.on("click", "a.delete-item", function (e) {
                var $elem = $(this),
                    plotterId = $elem.data("id");
                e.preventDefault();
                $hdnDeleteId.val(plotterId);
            });

            $btnCreate.on("click", function (e) {
                multi.tabs.addLoaderTab2();
                clearForm();
                multi.tabs.changeToTab2();
                multi.tabs.restoreTab2();
            });

            $btnCancel.on("click", function (e) {
                multi.tabs.addLoaderTab1();
                clearForm();
                multi.tabs.changeToTab1();
                multi.tabs.restoreTab1();
            });

            $btnSave.on("click", function (e) {
                var $errorBlock = $('.error-block'),
                    $errorBlockText = $('.error-block p');

                e.preventDefault();
                multi.tabs.addLoaderTab1();
                $errorBlock.addClass("hide");
                $errorBlockText.html("");
                if (validForm()) {
                    saveData();
                }
                else {
                    $errorBlock.removeClass("hide");
                    multi.tabs.restoreTab1();
                }
            });
        }

        function validForm() {
            var isValid = true;

            isValid = multi.validation.validateText($txtSupply, $txtSupply.parent()) && isValid;
            isValid = multi.validation.validateText($txtType, $txtType.parent()) && isValid;
            isValid = multi.validation.validateText($txtCategory, $txtCategory.parent()) && isValid;

            return isValid;
        }

        function deleteSupply() {
            var supplyId = $hdnDeleteId.val(),
                url = '/supplies/delete/' + supplyId;
            $.ajax({
                dataType: "json",
                type: "POST",
                url: url
            })
                .done(function (data) {
                    multi.dataTables.reloadTable();
                })
                .fail(function (err) {
                    console.log(err);
                });
        }

        function saveData() {
            var url = '/supplies/save',
                formData = {
                    idSupply: $hdnId.val(),
                    name: $txtSupply.val(),
                    type: $txtType.val(),
                    category: $txtCategory.val(),
                    width: $txtWidth.val(),
                    length: $txtLength.val(),
                    price: $txtPrice.val()
                };

            $.ajax({
                dataType: "json",
                type: "POST",
                url: url,
                data: formData
            })
                .done(function (data) {
                    if (data.result) {
                        clearForm();
                        multi.dataTables.reloadTable();
                        multi.tabs.changeToTab1();
                    }
                })
                .fail(function (err) {
                    console.log(err);
                })
                .always(function () {
                    multi.tabs.restoreTab1();
                });
        }

        function getSupplyAndLoadForm($elem) {
            var supplyId = $elem.data("id"),
                url = '/supplies/getSupply/' + supplyId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getSupplyHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getSupplyHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtSupply.val(data.Name);
            $txtType.val(data.Type);
            $txtCategory.val(data.Category);
            $txtWidth.val(data.Width);
            $txtLength.val(data.Length);
            $txtPrice.val(data.Price);
        }

        function clearForm() {
            var $frmSupplyInputs = $("#frmSupply input");
            $frmSupplyInputs.val("");
        }

        function initTable() {
            var $tblSupplies = $('#tblSupplies'),
                columns = [
                    {"sTitle": "Suministro", "bSortable": true},
                    {"sTitle": 'Tipo', "bSortable": true},
                    {"sTitle": 'Categoria', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/supplies/getSupplies';
            multi.dataTables.init($tblSupplies, columns, url);
        }

        return {
            init: init
        }
    })();

    multi.supplies.init();
})(jQuery, this);