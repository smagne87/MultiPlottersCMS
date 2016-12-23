var express = require('express');
var path = require('path');
var userController = require('../controller/userController');

var router = express.Router();

router.get('/logout', requireLogin, function (req, res, next) {
    req.session.regenerate(function () {
        res.redirect('/');
    });
});

router.get('/login', function (req, res, next) {
    res.render(path.join(__dirname, '../views/users/login'), {error: ""});
});


router.post('/login', function (req, res, next) {
    userController.login(req.body.email, req.body.password, function (err, result) {
        if (result.success) {
            //req.session.regenerate(function() {
            req.session.user = result.user;
            res.redirect('/');
            //});
        } else {
            res.render(path.join(__dirname, '../views/users/login'), {error: result.message});
        }
    });
});

router.get('/', requireLogin, function (req, res, next) {
    res.render(path.join(__dirname, '../views/users/index'));
});

router.get('/getUsers', requireLogin, function (req, res, next) {
    var sEcho = req.query.sEcho;
    userController.getAllUsers(req.query.sSearch, req.query.iDisplayStart, req.query.iDisplayLength, function (err, result) {
        res.jsonp({
            sEcho: sEcho,
            iTotalRecords: result.total,
            iTotalDisplayRecords: result.total,
            aaData: result.users
        });
    });
});

router.get('/getUser/:id', requireLogin, function (req, res, next) {
    userController.getUser(req.params.id, function (err, result) {
        res.jsonp({
            data: result.user
        });
    });
});

router.post('/delete/:id', requireLogin, function (req, res, next) {
    userController.deleteUser(req.params.id, function (err, result) {
        res.jsonp({
            data: result.success
        });
    });
});

router.post('/save', requireLogin, function (req, res, next) {
    userController.saveUser(req.body.userId, req.body.fullName, req.body.username, req.body.password, req.body.email, req.body.mainImage, req.body.isAdmin, function (err, result) {
        res.jsonp({ result: result.success });
    });
});

router.get('/generateAdmin/:id', requireToken, function(req, res, next){
    userController.createAdmin();
    res.send("user created!");
});

function requireToken(req, res, next){
    if(req.params.id && req.params.id == 'b68d7sad9hsd8onsaybdtuaocekakbyacliuknehc'){
        next();
    }
    else{
        res.redirect('/users/login');
    }
}

function requireLogin(req, res, next) {
    if (!req.user && !req.session.user) {
        res.redirect('/users/login');
    } else {
        next();
    }
}

module.exports = router;
