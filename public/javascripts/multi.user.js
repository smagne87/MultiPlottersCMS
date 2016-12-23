/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.users = (function () {
        var $hdnId = $("#hdnId"),
            $txtUsername = $("#txtUsername"),
            $txtFullName = $("#txtFullName"),
            $txtEmail = $("#txtEmail"),
            $txtPassword = $("#txtPassword"),
            $chkIsAdmin = $("#chkIsAdmin"),
            $txtImage = $("#txtImage"),
            $hdnDeleteId = $("#hdnDeleteId");

        function init() {
            initTable();
            handleEvents();
        }

        function handleEvents() {
            var $frmLogin = $("#frmLogin"),
                $errorBlock = $('.error-block'),
                $errorBlockText = $('.error-block p'),
                $btnCreate = $("#btnCreate"),
                $btnSave = $("#btnSave"),
                $btnCancel = $("#btnCancel"),
                $tblUsers = $("#tblUsers"),
                $btnDelete = $("#btnDelete");

            $frmLogin.on("submit", function (e) {
                $errorBlock.addClass("hide");
                $errorBlockText.html("");
                if (!validLoginForm()) {
                    e.preventDefault();
                    $errorBlock.removeClass("hide");
                }
            });

            $btnDelete.on("click", function (e) {
                deleteUser();
            });

            $tblUsers.on("click", "a.edit-item", function (e) {
                var $elem = $(this);
                e.preventDefault();
                multi.tabs.addLoaderTab2();
                getUserAndLoadForm($elem);
            });

            $tblUsers.on("click", "a.delete-item", function (e) {
                var $elem = $(this),
                    userId = $elem.data("id");
                e.preventDefault();
                $hdnDeleteId.val(userId);
            });

            $btnCreate.on("click", function (e) {
                multi.tabs.addLoaderTab2();
                clearForm();
                multi.tabs.changeToTab2();
                multi.tabs.restoreTab2();
            });

            $btnCancel.on("click", function (e) {
                multi.tabs.addLoaderTab1();
                clearForm();
                multi.tabs.changeToTab1();
                multi.tabs.restoreTab1();
            });

            $btnSave.on("click", function (e) {
                var $errorBlock = $('.error-block'),
                    $errorBlockText = $('.error-block p');

                e.preventDefault();
                multi.tabs.addLoaderTab1();
                $errorBlock.addClass("hide");
                $errorBlockText.html("");
                if (validForm()) {
                    saveData();
                }
                else {
                    $errorBlock.removeClass("hide");
                    multi.tabs.restoreTab1();
                }
            });
        }

        function validForm() {
            var isValid = true;

            isValid = multi.validation.validateText($txtUsername, $txtUsername.parent()) && isValid;
            isValid = multi.validation.validateText($txtFullName, $txtFullName.parent()) && isValid;
            isValid = multi.validation.validateText($txtEmail, $txtEmail.parent()) && isValid;
            isValid = multi.validation.validateText($txtPassword, $txtPassword.parent()) && isValid;
            isValid = multi.validation.validateText($txtImage, $txtImage.parent()) && isValid;

            return isValid;
        }

        function deleteUser() {
            var userId = $hdnDeleteId.val(),
                url = '/users/delete/' + userId;
            $.ajax({
                dataType: "json",
                type: "POST",
                url: url
            })
                .done(function (data) {
                    multi.dataTables.reloadTable();
                })
                .fail(function (err) {
                    console.log(err);
                });
        }

        function saveData() {
            var url = '/users/save',
                formData = {
                    userId: $hdnId.val(),
                    fullName: $txtFullName.val(),
                    username: $txtUsername.val(),
                    password: $txtPassword.val(),
                    email: $txtEmail.val(),
                    mainImage: $txtImage.val(),
                    isAdmin: $chkIsAdmin.is(":checked")
                };

            $.ajax({
                dataType: "json",
                type: "POST",
                url: url,
                data: formData
            })
                .done(function (data) {
                    if (data.result) {
                        clearForm();
                        multi.dataTables.reloadTable();
                        multi.tabs.changeToTab1();
                    }
                })
                .fail(function (err) {
                    console.log(err);
                })
                .always(function () {
                    multi.tabs.restoreTab1();
                });
        }

        function getUserAndLoadForm($elem) {
            var userId = $elem.data("id"),
                url = '/users/getUser/' + userId;
            $.ajax({
                dataType: "json",
                type: "GET",
                url: url
            })
                .done(getUserHandleData)
                .fail(function (err) {

                })
                .always(function () {
                    multi.tabs.changeToTab2();
                    multi.tabs.restoreTab2();
                });

        }

        function getUserHandleData(result) {
            var data = result.data;
            $hdnId.val(data._id);
            $txtUsername.val(data.Username);
            $txtFullName.val(data.FullName);
            $txtEmail.val(data.Email);
            $txtImage.val(data.Image);
            $txtPassword.val(data.Password);
            $chkIsAdmin.prop("checked", data.IsAdmin);
        }

        function clearForm() {
            var $frmUserInputs = $("#frmUser input");
            $chkIsAdmin.attr("checked", false);
            $frmUserInputs.val("");
        }

        function initTable() {
            var $tblUsers = $('#tblUsers'),
                columns = [
                    {"sTitle": "Nombre Completo", "bSortable": true},
                    {"sTitle": 'Email', "bSortable": true},
                    {"sTitle": 'Acciones', "bSearchable": false, "bSortable": false}
                ],
                url = '/users/getUsers';
            multi.dataTables.init($tblUsers, columns, url);
        }

        function validLoginForm() {
            var $txtEmail = $("#txtEmail"),
                $txtPassword = $("#txtPassword"),
                isValid = true;
            isValid = multi.validation.validateText($txtEmail, $txtEmail.parent()) && isValid;
            isValid = multi.validation.validateEmail($txtEmail, $txtEmail.parent()) && isValid;
            isValid = multi.validation.validateText($txtPassword, $txtPassword.parent()) && isValid;
            return isValid
        }

        return {
            init: init
        }
    })();
    multi.users.init();

}(jQuery, this));