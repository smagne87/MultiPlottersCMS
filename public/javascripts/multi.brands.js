/**
 * Created by smagne on 10/20/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.brands = (function () {
        var $hdnId = $("#hdnId"),
            $txtBrand = $("#txtBrand"),
            $txtCode = $("#txtCode"),
            $hdnDeleteId = $("#hdnDeleteId");

        function init() {
            initTable();
            handleEvents();
        }

        function handleEvents() {
            var $btnCreate = $("#btnCreate"),
                $btnSave = $("#btnSave"),
                $btnCancel = $("#btnCancel"),
                $tblBrands = $("#tblBrands"),
                $btnDelete = $("#btnDelete");

            $btnDelete.on("click", function (e) {
                deleteBrand();
            });

            $tblBrands.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getBrandAndLoadForm($elem);
            });

            $tblBrands.on("click", "a.delete-item", function (e) {
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

            isValid = multi.validation.validateText($txtBrand, $txtBrand.parent()) && isValid;
            isValid = multi.validation.validateText($txtCode, $txtCode.parent()) && isValid;

            return isValid;
        }

        function deleteBrand() {
            var brandId = $hdnDeleteId.val(),
                url = '/brands/delete/' + brandId;
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
            var url = '/brands/save',
                formData = {
                    brandId: $hdnId.val(),
                    name: $txtBrand.val(),
                    code: $txtCode.val()
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

        function getBrandAndLoadForm($elem) {
            var brandId = $elem.data("id"),
                url = '/brands/getBrand/' + brandId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getBrandHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getBrandHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtBrand.val(data.Name);
            $txtCode.val(data.Code);
        }

        function clearForm() {
            var $frmBrandInputs = $("#frmBrand input");
            $frmBrandInputs.val("");
        }

        function initTable() {
            var $tblBrands = $('#tblBrands'),
                columns = [
                    {"sTitle": "Marca", "bSortable": true},
                    {"sTitle": 'Codigo Marca', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/brands/getBrands';
            multi.dataTables.init($tblBrands, columns, url);
        }

        return {
            init: init
        }
    })();

    multi.brands.init();
})(jQuery, this);