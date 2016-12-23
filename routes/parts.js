/**
 * Created by smagne on 10/20/2016.
 */
var express = require('express');
var path = require('path');
var partController = require('../controller/partController');

var router = express.Router();
router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/parts/index'));
});

router.get('/getParts', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    partController.getAllParts(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.parts
        });
    });
});

router.get('/getPart/:id', requireLogin, function (req, res, next) {
    partController.getPart(req.params.id, function (err, result) {
        res.jsonp({
            data: result.part
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    partController.deletePart(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    partController.savePart(req.body.partid, req.body.name, req.body.mainImage, req.body.description, function (err, result) {
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