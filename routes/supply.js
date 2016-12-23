/**
 * Created by smagne on 10/20/2016.
 */
var express = require('express');
var path = require('path');
var supplyController = require('../controller/supplyController');

var router = express.Router();
router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/supply/index'));
});

router.get('/getSupplies', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    supplyController.getAllSupplies(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.supplies
        });
    });
});

router.get('/getSupply/:id', requireLogin, function (req, res, next) {
    supplyController.getSupply(req.params.id, function (err, result) {
        res.jsonp({
            data: result.supply
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    supplyController.deleteSupply(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    supplyController.saveSupply(req.body.idSupply, req.body.name, req.body.type, req.body.width, req.body.length, req.body.category, req.body.price, function (err, result) {
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