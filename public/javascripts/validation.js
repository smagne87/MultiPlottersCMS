/**
 * Created by smagne on 10/18/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.validation = (function () {
        function validateText($inputElement, $parent) {
            var errorMessage = "";
            multi.utils.removeError($parent);

            if ($inputElement.val().trim().length == 0) {
                multi.utils.addError($parent);
                errorMessage = $inputElement.data("error-message");
                if (errorMessage) {
                    multi.utils.addErrorMessage(errorMessage);
                }
                return false;
            }
            return true;
        };
        function validateEmail($inputEmail, $parent) {
            var inputValue = $inputEmail.val(),
                errorMessage = "";
            if (inputValue) {
                var emailRegex = new RegExp(/^([\w\.\-\+\$]+)@([\w\-]+)(([\.\-](\w){1,63})+)$/i),
                    isValid = emailRegex.test(inputValue);
                if (isValid) {
                    multi.utils.removeError($parent);
                    return true;
                } else {
                    if ($parent) {
                        multi.utils.addError($parent);
                        errorMessage = $inputEmail.data("error-format-message");
                        if (errorMessage) {
                            multi.utils.addErrorMessage(errorMessage);
                        }
                    }
                    return false;
                }
            } else {
                if ($parent) {
                    multi.utils.addError($parent);
                }
                return false;
            }
        };
        function validateRegex($elem, patten) {
            var regex = new RegExp(patten),
                errorMessage = "";
            multi.utils.removeError($elem.parent());
            if (!regex.test($elem.val())) {
                multi.utils.addError($elem.parent());
                errorMessage = $elem.data("error-regexp-message");
                if (errorMessage) {
                    multi.utils.addErrorMessage(errorMessage);
                }
                return false;
            }
            return true;
        };

        //Exposing as Public
        return {
            validateText: validateText,
            validateEmail: validateEmail
        };
    })();

}(jQuery, this));