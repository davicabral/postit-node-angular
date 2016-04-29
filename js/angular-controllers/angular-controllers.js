/**
 * Created by Davi on 29/04/16.
 */

var app = angular.module("postit-login", []);

app.controller( "loginController" , function ($scope, $http) {

    $scope.onSubmit = function () {
        console.log("Formulário completo");
    }
});