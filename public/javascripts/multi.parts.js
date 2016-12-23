/**
 * Created by smagne on 10/20/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.parts = (function () {
        var $hdnId = $("#hdnId"),
            $txtPart = $("#txtPart"),
            $txtDescription = $("#txtDescription"),
            $txtMainImage = $("#txtMainImage"),
            $hdnDeleteId = $("#hdnDeleteId");

        function init() {
            initTable();
            handleEvents();
        }

        function handleEvents() {
            var $btnCreate = $("#btnCreate"),
                $btnSave = $("#btnSave"),
                $btnCancel = $("#btnCancel"),
                $tblParts = $("#tblParts"),
                $btnDelete = $("#btnDelete");

            $btnDelete.on("click", function (e) {
                deletePart();
            });

            $tblParts.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getPartAndLoadForm($elem);
            });

            $tblParts.on("click", "a.delete-item", function (e) {
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

            isValid = multi.validation.validateText($txtPart, $txtPart.parent()) && isValid;
            isValid = multi.validation.validateText($txtDescription, $txtDescription.parent()) && isValid;
            isValid = multi.validation.validateText($txtMainImage, $txtMainImage.parent()) && isValid;

            return isValid;
        }

        function deletePart() {
            var partId = $hdnDeleteId.val(),
                url = '/parts/delete/' + partId;
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
            var url = '/parts/save',
                formData = {
                    partid: $hdnId.val(),
                    name: $txtPart.val(),
                    description: $txtDescription.val(),
                    mainImage: $txtMainImage.val()
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

        function getPartAndLoadForm($elem) {
            var partId = $elem.data("id"),
                url = '/parts/getPart/' + partId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getPartHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getPartHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtPart.val(data.Name);
            $txtDescription.val(data.Description);
            $txtMainImage.val(data.MainImage);
        }

        function clearForm() {
            var $frmPartInputs = $("#frmPart input");
            $frmPartInputs.val("");
        }

        function initTable() {
            var $tblParts = $('#tblParts'),
                columns = [
                    {"sTitle": "Partes", "bSortable": true},
                    {"sTitle": 'Descripcion', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/parts/getParts';
            multi.dataTables.init($tblParts, columns, url);
        }

        return {
            init: init
        }
    })();

    multi.parts.init();
})(jQuery, this);