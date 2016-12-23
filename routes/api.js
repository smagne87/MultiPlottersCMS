/**
 * Created by smagne on 10/21/2016.
 */
var express = require('express');
var path = require('path');
var partController = require('../controller/partController');
var plotterController = require('../controller/plotterController');
var serviceController = require('../controller/serviceController');
var supplyController = require('../controller/supplyController');
var brandController = require('../controller/brandController');
var userController = require('../controller/userController');

var router = express.Router();

router.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

router.get('/retrieveServices', function (req, res, next) {
    serviceController.retrieveServices(function(err, result){
        res.jsonp({
            data: result.services
        });
    });
});

router.get('/retrieveBrands', function (req, res, next) {
    brandController.retrieveBrands(function(err, result){
        res.jsonp({
            data: result.brands
        });
    });
});

router.get('/retrieveParts', function (req, res, next) {
    partController.retrieveParts(function(err, result){
        res.jsonp({
            data: result.parts
        });
    });
});


router.get('/retrievePlotters/:id', function (req, res, next) {
    plotterController.retrievePlotters(req.params.id, function(err, result){
        res.jsonp({
            data: result.plotters
        });
    });
});

router.get('/retrieveSupplies/:id', function (req, res, next) {
    supplyController.retrieveSupplies(req.params.id, function(err, result){
        res.jsonp({
            data: result.supplies
        });
    });
});

router.get('/retrieveUsers/:id', function (req, res, next) {
    userController.retrieveUsers(function(err, result){
        res.jsonp({
            data: result.users
        });
    });
});
module.exports = router;