/**
 * Created by smagne on 10/20/2016.
 */
var mongoose = require('mongoose');
var models = require('../models/brandModel')(mongoose);

var brandController = module.exports = {};

brandController.deleteBrand = function (idBrand, callback) {
    var result = {
        success: true
    };

    models.Brand.remove({_id: idBrand}, function (err) {
        if (err) console.log(err);

        result.success = true;
        callback(err, result);
    });
};

brandController.saveBrand = function (idBrand, name, code, logo, callback) {
    var result = {
        success: true,
        message: "",
        brand: {}
    };
    if (idBrand === "") {
        idBrand = null;
    }
    models.Brand.findOne({_id: idBrand}).exec(function (err, brand) {
        if (err) {
            result.success = false;
            callback(err, result);
        }
        else if (!brand) {
            brand = new models.Brand();
        }
        brand.Name = name;
        brand.Code = code;
        brand.Logo = logo;
        brand.save(function (err) {
            if (err) {
                console.log(err);
                result.success = false;
                result.message = 'Unexpected error!';
            }
            else {
                result.brand = brand;
            }
            callback(err, result);
        });
    });
};

brandController.getAllBrands = function (searchText, currentPage, pageSize, callback) {
    var result = {
        success: true,
        message: "",
        brands: [],
        total: 0
    };

    models.Brand.find({Name: new RegExp(searchText, "i")})
        .skip(parseInt(currentPage))
        .limit(parseInt(pageSize))
        .exec(function (err, brands) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < brands.length; i++) {
                    var bra = brands[i];
                    result.brands.push([
                        bra.Name,
                        bra.Code,
                        "<a class='edit-item' href='#' data-id='" + bra._id + "'>Editar</a> | <a class='delete-item' data-open='deleteModal' href='#' data-id='" + bra._id + "'>Borrar</a>"
                    ]);
                }
                models.Brand.count({Name: new RegExp(searchText, "i")}, function (err, count) {
                    result.success = true;
                    result.total = count;
                    callback(err, result);
                });
            }
        });
};

brandController.retrieveBrands = function (callback) {
    var result = {
        success: true,
        message: "",
        brands: []
    };

    models.Brand.find({})
        .exec(function (err, brands) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < brands.length; i++) {
                    var bra = brands[i];
                    result.brands.push({
                        name: bra.Name,
                        code: bra.Code,
                        logo: bra.logo
                    });
                }
                callback(err, result);
            }
        });
};

brandController.getBrand = function (brandId, callback) {
    var result = {
        success: true,
        message: "",
        brand: {}
    };

    models.Brand.findOne({_id: brandId})
        .exec(function (err, brand) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                result.success = true;
                result.brand = brand;
                callback(err, result);
            }
        });
};
