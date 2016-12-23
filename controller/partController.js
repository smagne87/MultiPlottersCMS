/**
 * Created by smagne on 10/20/2016.
 */
var mongoose = require('mongoose');
var models = require('../models/partModel')(mongoose);

var partController = module.exports = {};

partController.importParts = function (part, callback) {
    var newPart = new models.Part();
    newPart.Name = part.name;
    newPart.Description = part.description;
    newPart.MainImage = part.mainImage;
    newPart.save(function (err) {
        console.log("Part added: " + part.name);
        callback();
    });
};

partController.deletePart = function (idPart, callback) {
    var result = {
        success: true
    };

    models.Part.remove({_id: idPart}, function (err) {
        if (err) console.log(err);

        result.success = true;
        callback(err, result);
    });
};

partController.savePart = function (idPart, name, mainImage, description, callback) {
    var result = {
        success: true,
        message: "",
        part: {}
    };
    if (idPart === "") {
        idPart = null;
    }
    models.Part.findOne({_id: idPart}).exec(function (err, part) {
        if (err) {
            result.success = false;
            callback(err, result);
        }
        else if (!part) {
            part = new models.Part();
        }
        part.Name = name;
        part.Description = description;
        part.MainImage = mainImage;
        part.save(function (err) {
            if (err) {
                console.log(err);
                result.success = false;
                result.message = 'Unexpected error!';
            }
            else {
                result.part = part;
            }
            callback(err, result);
        });
    });
};

partController.getAllParts = function (searchText, currentPage, pageSize, callback) {
    var result = {
        success: true,
        message: "",
        parts: [],
        total: 0
    };

    models.Part.find({Name: new RegExp(searchText, "i")})
        .skip(parseInt(currentPage))
        .limit(parseInt(pageSize))
        .exec(function (err, parts) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    result.parts.push([
                        part.Name,
                        part.Description,
                        "<a class='edit-item' href='#' data-id='" + part._id + "'>Editar</a> | <a class='delete-item' data-open='deleteModal' href='#' data-id='" + part._id + "'>Borrar</a>"
                    ]);
                }
                models.Part.count({Name: new RegExp(searchText, "i")}, function (err, count) {
                    result.success = true;
                    result.total = count;
                    callback(err, result);
                });
            }
        });
};

partController.retrieveParts = function (callback) {
    var result = {
        success: true,
        message: "",
        parts: []
    };

    models.Part.find({})
        .exec(function (err, parts) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < parts.length; i++) {
                    var part = parts[i];
                    result.parts.push({
                        name: part.Name,
                        description: part.Description,
                        image: part.MainImage
                    });
                }
                callback(err, result);
            }
        });
};

partController.getPart = function (partId, callback) {
    var result = {
        success: true,
        message: "",
        part: {}
    };

    models.Part.findOne({_id: partId})
        .exec(function (err, part) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                result.success = true;
                result.part = part;
                callback(err, result);
            }
        });
};