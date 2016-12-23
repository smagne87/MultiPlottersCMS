/**
 * Created by smagne on 10/24/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.import = (function () {

        function init() {
            var $btnImportPlotters = $("#btnImportPlotters"),
                $btnImportServices = $("#btnImportServices"),
                $btnImportParts = $("#btnImportParts"),
                $btnImportSupplies = $("#btnImportSupplies");
            $btnImportParts.on("click", function () {
                $.ajax({
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    url: '/JSON/parts.json'
                }).done(function (data) {
                    $.each(data, function (index, obj) {
                        var partImport = {
                            part: {
                                name: obj.name,
                                description: obj.description,
                                mainImage: obj.mainImage
                            }
                        };
                        $.ajax({
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                            url: '/import-parts',
                            data: JSON.stringify(partImport)
                        }).done(function (data) {

                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                }).fail(function (err) {
                    console.log(err);
                });
            });
            $btnImportServices.on("click", function () {
                $.ajax({
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    url: '/JSON/services.json'
                }).done(function (data) {
                    $.each(data, function (index, obj) {
                        var serviceImport = {
                            service: {
                                name: obj.name,
                                price: obj.price
                            }
                        };
                        $.ajax({
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                            url: '/import-services',
                            data: JSON.stringify(serviceImport)
                        }).done(function (data) {

                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                }).fail(function (err) {
                    console.log(err);
                });
            });
            $btnImportPlotters.on("click", function () {
                $.ajax({
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    url: '/JSON/plotters.json'
                }).done(function (data) {
                    $.each(data, function (index, obj) {
                        var plotterImport = {
                            plotter: {
                                name: obj.title,
                                brand: obj.brand,
                                mainImage: obj.img,
                                pdfUrl: obj.pdf,
                                videoUrl: obj.videoUrl,
                                images: obj.imgb
                            }
                        };
                        $.ajax({
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                            url: '/import-plotters',
                            data: JSON.stringify(plotterImport)
                        }).done(function (data) {

                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                }).fail(function (err) {
                    console.log(err);
                });
            });
            $btnImportSupplies.on("click", function () {
                $.ajax({
                    dataType: "json",
                    type: "GET",
                    contentType: "application/json",
                    url: '/JSON/supplies.json'
                }).done(function (data) {
                    $.each(data, function (index, obj) {
                        var supplyImport = {
                            supply: {
                                name: obj.name,
                                type: obj.type,
                                width: obj.width,
                                length: obj.length,
                                category: obj.category,
                                price: obj.price
                            }
                        };
                        $.ajax({
                            dataType: "json",
                            type: "POST",
                            contentType: "application/json",
                            url: '/import-supplies',
                            data: JSON.stringify(supplyImport)
                        }).done(function (data) {

                        }).fail(function (err) {
                            console.log(err);
                        });
                    });
                }).fail(function (err) {
                    console.log(err);
                });
            });
        }

        return {
            init: init
        }
    })();

    multi.import.init();
})(jQuery, this);