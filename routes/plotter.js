/**
 * Created by smagne on 10/18/2016.
 */
var express = require('express');
var path = require('path');
var plotterController = require('../controller/plotterController');

var router = express.Router();

router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/plotter/index'));
});

router.get('/getPlotters', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    plotterController.getAllPlotters(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.plotters
        });
    });
});

router.get('/getPlotter/:id', requireLogin, function (req, res, next) {
    plotterController.getPlotter(req.params.id, function (err, result) {
        res.jsonp({
            data: result.plotter
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    plotterController.deletePlotter(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    plotterController.savePlotter(req.body.idPlotter, req.body.name, req.body.brand, req.body.mainImage, req.body.pdfUrl, req.body.videoUrl, req.body.images, function (err, result) {
        res.jsonp({ result: result.success });
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