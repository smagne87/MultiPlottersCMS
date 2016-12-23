/**
 * Created by smagne on 10/20/2016.
 */
var mongoose = require('mongoose');
var models = require('../models/serviceModel')(mongoose);

var serviceController = module.exports = {};

serviceController.importService = function (service, callback) {
    var newService = new models.Service();
    newService.Name = service.name;
    newService.Price = service.price;
    newService.save(function (err) {
        console.log("Service added: " + service.name);
        callback();
    });

};

serviceController.deleteService = function (idService, callback) {
    var result = {
        success: true
    };

    models.Service.remove({_id: idService}, function (err) {
        if (err) console.log(err);

        result.success = true;
        callback(err, result);
    });
};

serviceController.saveService = function (idService, name, price, callback) {
    var result = {
        success: true,
        message: "",
        service: {}
    };
    if (idService === "") {
        idService = null;
    }
    models.Service.findOne({_id: idService}).exec(function (err, service) {
        if (err) {
            result.success = false;
            callback(err, result);
        }
        else if (!service) {
            service = new models.Service();
        }
        service.Name = name;
        service.Price = price;
        service.save(function (err) {
            if (err) {
                console.log(err);
                result.success = false;
                result.message = 'Unexpected error!';
            }
            else {
                result.service = service;
            }
            callback(err, result);
        });
    });
};

serviceController.getAllServices = function (searchText, currentPage, pageSize, callback) {
    var result = {
        success: true,
        message: "",
        services: [],
        total: 0
    };

    models.Service.find({Name: new RegExp(searchText, "i")})
        .skip(parseInt(currentPage))
        .limit(parseInt(pageSize))
        .exec(function (err, services) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < services.length; i++) {
                    var serv = services[i];
                    result.services.push([
                        serv.Name,
                        serv.Price,
                        "<a class='edit-item' href='#' data-id='" + serv._id + "'>Editar</a> | <a class='delete-item' data-open='deleteModal' href='#' data-id='" + serv._id + "'>Borrar</a>"
                    ]);
                }
                models.Service.count({Name: new RegExp(searchText, "i")}, function (err, count) {
                    result.success = true;
                    result.total = count;
                    callback(err, result);
                });
            }
        });
};

serviceController.retrieveServices = function (callback) {
    var result = {
        success: true,
        message: "",
        services: []
    };

    models.Service.find({})
        .exec(function (err, services) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < services.length; i++) {
                    var serv = services[i];
                    result.services.push({
                        name: serv.Name,
                        price: serv.Price
                    });
                }
                callback(err, result);
            }
        });
};

serviceController.getService = function (serviceId, callback) {
    var result = {
        success: true,
        message: "",
        service: {}
    };

    models.Service.findOne({_id: serviceId})
        .exec(function (err, service) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                result.success = true;
                result.service = service;
                callback(err, result);
            }
        });
};
