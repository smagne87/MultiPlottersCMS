/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.plotters = (function () {
        var $hdnId = $("#hdnId"),
            $txtPlotter = $("#txtPlotter"),
            $txtBrand = $("#txtBrand"),
            $txtMainImage = $("#txtMainImage"),
            $txtPDF = $("#txtPDF"),
            $txtURLVideo = $("#txtURLVideo"),
            $txtImages = $("#txtImages"),
            $hdnDeleteId = $("#hdnDeleteId");

        function init() {
            initTable();
            handleEvents();
        }

        function handleEvents() {
            var $btnCreate = $("#btnCreate"),
                $btnSave = $("#btnSave"),
                $btnCancel = $("#btnCancel"),
                $tblPlotters = $("#tblPlotters"),
                $btnDelete = $("#btnDelete");

            $btnDelete.on("click", function (e) {
                deletePlotter();
            });

            $tblPlotters.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getPlotterAndLoadForm($elem);
            });

            $tblPlotters.on("click", "a.delete-item", function (e) {
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

            isValid = multi.validation.validateText($txtPlotter, $txtPlotter.parent()) && isValid;
            isValid = multi.validation.validateText($txtBrand, $txtBrand.parent()) && isValid;
            isValid = multi.validation.validateText($txtMainImage, $txtMainImage.parent()) && isValid;
            isValid = multi.validation.validateText($txtPDF, $txtPDF.parent()) && isValid;

            return isValid;
        }

        function deletePlotter() {
            var plotterId = $hdnDeleteId.val(),
                url = '/plotter/delete/' + plotterId;
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
            var url = '/plotter/save',
                formData = {
                    idPlotter: $hdnId.val(),
                    name: $txtPlotter.val(),
                    brand: $txtBrand.val(),
                    mainImage: $txtMainImage.val(),
                    pdfUrl: $txtPDF.val(),
                    videoUrl: $txtURLVideo.val(),
                    images: $txtImages.val()
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

        function getPlotterAndLoadForm($elem) {
            var plotterId = $elem.data("id"),
                url = '/plotter/getPlotter/' + plotterId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getPlotterHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getPlotterHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtPlotter.val(data.Name);
            $txtBrand.val(data.Brand);
            $txtMainImage.val(data.MainImage);
            $txtPDF.val(data.PDFInfo);
            $txtURLVideo.val(data.URLVideo);
            $txtImages.val(data.Images);
        }

        function clearForm() {
            var $frmPlotterInputs = $("#frmPlotter input");
            $frmPlotterInputs.val("");
        }

        function initTable() {
            var $tblPlotters = $('#tblPlotters'),
                columns = [
                    {"sTitle": "Plotter", "bSortable": true},
                    {"sTitle": 'Marca', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/plotter/getPlotters';
            multi.dataTables.init($tblPlotters, columns, url);
        }

        return {
            init: init
        }
    })();

    multi.plotters.init();
})(jQuery, this);