var express = require('express');
var path = require('path');
var router = express.Router();

var partController = require('../controller/partController');
var plotterController = require('../controller/plotterController');
var serviceController = require('../controller/serviceController');
var supplyController = require('../controller/supplyController');

/* GET home page. */
router.get('/', requireLogin, function (req, res, next) {
    res.render('index');
});

router.get('/import', requireLogin, function (req, res, next) {
    res.render('import');
});

router.post('/import-plotters', requireLogin, function (req, res, next) {
    plotterController.importPlotter(req.body.plotter, function(){
        res.json({
            result: true
        });
    });
});

router.post('/import-parts', requireLogin, function (req, res, next) {
    partController.importParts(req.body.part, function(){
       res.json({
           result: true
       });
    });
});

router.post('/import-services', requireLogin, function (req, res, next) {
    serviceController.importService(req.body.service, function(){
        res.json({
            result: true
        });
    });
});

router.post('/import-supplies', requireLogin, function (req, res, next) {
    supplyController.importSupply(req.body.supply, function(){
        res.json({
            result: true
        });
    });
});

function requireLogin(req, res, next) {
    if (!req.user && !req.session.user) {
        res.redirect('/users/login');
    } else {
        next();
    }
}

module.exports = router;
