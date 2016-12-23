/**
 * Created by smagne on 10/19/2016.
 */
(function ($, window) {
    "use strict";

    window.multi = window.multi || {};

    multi.tabs = (function(){
        var tab1Text = "Lista",
            tab2Text = "Crear/Editar",
            loaderText = "<img src='/images/ajax-loader-tab.gif'>",
            $tab1Content = $("#tab1"),
            $tab2Content = $("#tab2"),
            $linkTab1 = $(".tabs a[href='#tab1']"),
            $linkTab2 = $(".tabs a[href='#tab2']");

        function addLoaderTab1() {
            $linkTab1.html(loaderText);
        }

        function restoreTab1(){
            $linkTab1.html(tab1Text);
        }

        function addLoaderTab2() {
            $linkTab2.html(loaderText);
        }

        function restoreTab2(){
            $linkTab2.html(tab2Text);
        }
        
        function changeToTab1(){
            $linkTab1.click();
        }

        function changeToTab2(){
            $linkTab2.click();
        }

        return {
            changeToTab1: changeToTab1,
            changeToTab2: changeToTab2,
            addLoaderTab1: addLoaderTab1,
            restoreTab1: restoreTab1,
            addLoaderTab2: addLoaderTab2,
            restoreTab2: restoreTab2
        };
    })();

})(jQuery, this);