/**
 * Created by smagne on 10/20/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.services = (function () {
        var $hdnId = $("#hdnId"),
            $txtService = $("#txtService"),
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
                $tblServices = $("#tblServices"),
                $btnDelete = $("#btnDelete");

            $btnDelete.on("click", function (e) {
                deleteService();
            });

            $tblServices.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getServiceAndLoadForm($elem);
            });

            $tblServices.on("click", "a.delete-item", function (e) {
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

            isValid = multi.validation.validateText($txtService, $txtService.parent()) && isValid;

            return isValid;
        }

        function deleteService() {
            var serviceId = $hdnDeleteId.val(),
                url = '/services/delete/' + serviceId;
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
            var url = '/services/save',
                formData = {
                    serviceId: $hdnId.val(),
                    name: $txtService.val(),
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

        function getServiceAndLoadForm($elem) {
            var serviceId = $elem.data("id"),
                url = '/services/getService/' + serviceId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getServiceHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getServiceHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtService.val(data.Name);
            $txtPrice.val(data.Price);
        }

        function clearForm() {
            var $frmServiceInputs = $("#frmService input");
            $frmServiceInputs.val("");
        }

        function initTable() {
            var $tblServices = $('#tblServices'),
                columns = [
                    {"sTitle": "Servicios", "bSortable": true},
                    {"sTitle": 'Precio', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/services/getServices';
            multi.dataTables.init($tblServices, columns, url);
        }

        return {
            init: init
        }
    })();

    multi.services.init();
})(jQuery, this);