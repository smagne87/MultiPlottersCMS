/**
 * Created by smagne on 10/18/2016.
 */
var mongoose = require('mongoose');
var models = require('../models/plotterModel')(mongoose);

var pController = module.exports = {};

pController.importPlotter = function (plotter, callback) {
    var newPlotter = new models.Plotter();
    newPlotter.Name = plotter.name;
    newPlotter.Brand = plotter.brand;
    newPlotter.MainImage = plotter.mainImage;
    newPlotter.PDFInfo = plotter.pdfUrl;
    newPlotter.URLVideo = plotter.videoUrl;
    newPlotter.Images = plotter.images;
    newPlotter.save(function (err) {
        console.log("Plotter added: " + plotter.name);
        callback();
    });
};

pController.deletePlotter = function (idPlotter, callback) {
    var result = {
        success: true
    };

    models.Plotter.remove({_id: idPlotter}, function (err) {
        if (err) console.log(err);

        result.success = true;
        callback(err, result);
    });
};

pController.savePlotter = function (idPlotter, name, brand, mainImage, pdfUrl, videoUrl, images, callback) {
    var result = {
        success: true,
        message: "",
        plotter: {}
    };
    if (idPlotter === "") {
        idPlotter = null;
    }
    models.Plotter.findOne({_id: idPlotter}).exec(function (err, plotter) {
        if (err) {
            result.success = false;
            callback(err, result);
        }
        else if (!plotter) {
            plotter = new models.Plotter();
        }
        plotter.Name = name;
        plotter.Brand = brand;
        plotter.MainImage = mainImage;
        plotter.PDFInfo = pdfUrl;
        plotter.URLVideo = videoUrl;
        plotter.Images = images;
        plotter.save(function (err) {
            if (err) {
                console.log(err);
                result.success = false;
                result.message = 'Unexpected error!';
            }
            else {
                result.plotter = plotter;
            }
            callback(err, result);
        });
    });
};

pController.retrievePlotters = function (brand, callback) {
    var result = {
        success: true,
        message: "",
        plotters: []
    };

    var filter = {};
    if(brand === "*"){
        filter = {};
    }
    else{
        filter = { Brand: brand }
    }

    models.Plotter.find(filter)
        .exec(function (err, plotters) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < plotters.length; i++) {
                    var plot = plotters[i];
                    result.plotters.push({
                        title: plot.Name,
                        marca: plot.Brand,
                        img: plot.MainImage,
                        pdf: plot.PDFInfo,
                        imgb: plot.Images,
                        videoUrl: plot.URLVideo
                    });
                }
                callback(err, result);
            }
        });
};

pController.getAllPlotters = function (searchText, currentPage, pageSize, callback) {
    var result = {
        success: true,
        message: "",
        plotters: [],
        total: 0
    };

    models.Plotter.find({Name: new RegExp(searchText, "i")})
        .skip(parseInt(currentPage))
        .limit(parseInt(pageSize))
        .exec(function (err, plotters) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < plotters.length; i++) {
                    var plot = plotters[i];
                    result.plotters.push([
                        plot.Name,
                        plot.Brand,
                        "<a class='edit-item' href='#' data-id='" + plot._id + "'>Editar</a> | <a class='delete-item' data-open='deleteModal' href='#' data-id='" + plot._id + "'>Borrar</a>"
                    ]);
                }
                models.Plotter.count({Name: new RegExp(searchText, "i")}, function (err, count) {
                    result.success = true;
                    result.total = count;
                    callback(err, result);
                });
            }
        });
};

pController.getPlotter = function (plotterId, callback) {
    var result = {
        success: true,
        message: "",
        plotter: {}
    };

    models.Plotter.findOne({_id: plotterId})
        .exec(function (err, plotter) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                result.success = true;
                result.plotter = plotter;
                callback(err, result);
            }
        });
};
