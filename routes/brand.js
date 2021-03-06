/**
 * Created by smagne on 10/20/2016.
 */
var express = require('express');
var path = require('path');
var brandController = require('../controller/brandController');

var router = express.Router();

router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/brands/index'));
});

router.get('/getBrands', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    brandController.getAllBrands(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.brands
        });
    });
});

router.get('/getBrand/:id', requireLogin, function (req, res, next) {
    brandController.getBrand(req.params.id, function (err, result) {
        res.jsonp({
            data: result.brand
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    brandController.deleteBrand(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    brandController.saveBrand(req.body.brandId, req.body.name, req.body.code, function (err, result) {
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