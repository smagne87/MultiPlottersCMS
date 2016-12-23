/**
 * Created by smagne on 10/20/2016.
 */
var express = require('express');
var path = require('path');
var serviceController = require('../controller/serviceController');

var router = express.Router();
router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/services/index'));
});

router.get('/getServices', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    serviceController.getAllServices(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.services
        });
    });
});

router.get('/getService/:id', requireLogin, function (req, res, next) {
    serviceController.getService(req.params.id, function (err, result) {
        res.jsonp({
            data: result.service
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    serviceController.deleteService(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    serviceController.saveService(req.body.serviceId, req.body.name, req.body.price, function (err, result) {
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