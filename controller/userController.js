/**
 * Created by smagne on 10/18/2016.
 */
var mongoose = require('mongoose');
var models = require('../models/userModel')(mongoose);

var uController = module.exports = {};

uController.login = function (email, password, callback) {
    var result = {
        success: true,
        message: "",
        user: {}
    };

    models.User.findOne({Email: email}, function (err, user) {
        if (!user) {
            result.message = 'Invalid email or password.';
            result.success = false;
        } else {
            if (password === user.Password) {
                result.user = user;
            } else {
                result.message = 'Invalid email or password.';
                result.success = false;
            }
        }
        callback(err, result);
    });
};
uController.deleteUser = function (idUser, callback) {
    var result = {
        success: true
    };

    models.User.remove({_id: idUser}, function (err) {
        if (err) console.log(err);

        result.success = true;
        callback(err, result);
    });
};

uController.saveUser = function (idUser, fullName, username, password, email, mainImage, isAdmin, callback) {
    var result = {
        success: true,
        message: "",
        user: {}
    };
    if (idUser === "") {
        idUser = null;
    }
    models.User.findOne({_id: idUser}).exec(function (err, newUser) {
        if (err) {
            result.success = false;
            callback(err, result);
        }
        else if (!newUser) {
            newUser = new models.User();
        }
        newUser.Username = username;
        newUser.Password = password;
        newUser.Email = email;
        newUser.IsAdmin = isAdmin;
        newUser.Image = mainImage;
        newUser.FullName = fullName;
        newUser.save(function (err) {
            if (err) {
                console.log(err);
                result.success = false;
                result.message = 'Unexpected error!';
            }
            else {
                result.user = newUser;
            }
            callback(err, result);
        });
    });
};

uController.getAllUsers = function (searchText, currentPage, pageSize, callback) {
    var result = {
        success: true,
        message: "",
        users: [],
        total: 0
    };

    models.User.find({})
        .skip(parseInt(currentPage))
        .limit(parseInt(pageSize))
        .exec(function (err, users) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    result.users.push([
                        user.FullName,
                        user.Email,
                        "<a class='edit-item' href='#' data-id='" + user._id + "'>Editar</a> | <a class='delete-item' data-open='deleteModal' href='#' data-id='" + user._id + "'>Borrar</a>"
                    ]);
                }
                models.User.count({Name: new RegExp(searchText, "i")}, function (err, count) {
                    result.success = true;
                    result.total = count;
                    callback(err, result);
                });
            }
        });
};

uController.retrieveUsers = function (callback) {
    var result = {
        success: true,
        message: "",
        users: []
    };

    models.User.find({})
        .exec(function (err, users) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                for (var i = 0; i < users.length; i++) {
                    var user = users[i];
                    result.users.push({
                        email: user.Email,
                        fullName: user.FullName,
                        image: user.MainImage
                    });
                }
                callback(err, result);
            }
        });
};

uController.getUser = function (userId, callback) {
    var result = {
        success: true,
        message: "",
        user: {}
    };

    models.User.findOne({_id: userId})
        .exec(function (err, user) {
            if (err) {
                result.message = err;
                result.success = false;
            } else {
                result.success = true;
                result.user = user;
                callback(err, result);
            }
        });
};
uController.createAdmin = function () {
    var u = new models.User();
    u.Email = 'admin@admin.com';
    u.Password = 'admin1234';
    u.Username = 'admin';
    u.save(function (err) {
        if (err) {
            console.log(err);
        }
    });
}
