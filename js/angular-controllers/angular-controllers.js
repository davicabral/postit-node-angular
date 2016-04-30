/**
 * Created by Davi on 29/04/16.
 */

var app = angular.module("postit-login", [
    'angular-ladda',
    'ngStorage'
]);

app.factory('Application', function ($http, $localStorage) {

    var baseUrl = "http://localhost:3000";

    function urlBase64Decode(str) {
        var output = str.replace('-', '+').replace('_', '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Cadeia de caracteres base64url inválida!';
        }
        return window.atob(output);
    }

    function getUserFromToken() {
        var token = $localStorage.token;
        var user = {};
        if (typeof token !== 'undefined') {
            var encoded = token.split('.')[1];
            user = JSON.parse(urlBase64Decode(encoded));
        }
        return user;
    }

    var currentUser = getUserFromToken();

    return {
        currentUser : currentUser,
        login: function(data, success, error) {
            $http.post(baseUrl + '/user/login', data).then(success,error);
        },
        signup: function(data, success, error) {
            $http.post(baseUrl + '/authenticate', data).success(success).error(error)
        },
        getPostit: function(success, error) {
            $http.get(baseUrl + '/postit').then(success,error);
        }
    };
});


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/view/login.html');
                }
                return $q.reject(response);
            }
        };
    });
});

app.controller( "loginController" , function ($scope, $http, $localStorage, Application) {

    $scope.loginErro = false;           //Variável responsável para dar feedback sobre problemas no processo de login
    $scope.loginLoading = false;        //Variável responsável para dar feedback enquanto a requisição de login está sendo processada
    $scope.$storage = $localStorage;


    $scope.onSubmit = function () {
        $scope.loginLoading = true;
        var params = {
            login: $scope.form.login,
            password: $scope.form.password
        };

        Application.login(params, onLoginSuccess, onLoginFail);

        //Função chamada quando a requisição é processada normalmente
        function onLoginSuccess(response) {
            $scope.loginLoading = false;
            $scope.loginErro = !response.data.hasUser;
            if(response.data.hasUser) {
                $scope.$storage.token = response.data.user.token;
                //Passar para a tela dos PostIts
            }

        }

        //Função chamada quando há algum erro no processamento da função. Ex: Timeout ou servidor não acessível.
        function onLoginFail(err) {
            $scope.loginLoading = false;
            console.log("Erro na requisição");
            console.log(err);
        }
    };

    $scope.click = function () {
        Application.getPostit(onPostitSuccess, onPostitFail);

        function onPostitSuccess(response) {
            console.log(response);
        }

        function onPostitFail() {
            console.log('deu errado');
        }
    };
});