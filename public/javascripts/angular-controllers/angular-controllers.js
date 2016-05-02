/**
 * Created by Davi on 29/04/16.
 */

var app = angular.module("postit-login", [
    'angular-ladda',
    'ngStorage'
]);

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


app.factory('Application', function ($http, $localStorage) {

    var baseUrl = "https://postit-herakles.herokuapp.com";
    //var baseUrl = "http://localhost:5500";
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
            $http.post(baseUrl + '/user', data).then(success,error);
        },
        signup: function(data, success, error) {
            $http.post(baseUrl + '/authenticate', data).success(success).error(error)
        },
        getPostit: function(id_usuario,success, error) {
            $http.get(baseUrl + '/postit/' + id_usuario).then(success,error);
        },
        editPostit: function(data, success, error) {
            $http.put(baseUrl + '/postit', data).then(success, error);
        },
        createPostit: function(data, success, error) {
            $http.post(baseUrl + '/postit', data).then(success, error);
        },
        deletePostit: function(data, success, error) {
            $http.delete(baseUrl + '/postit', data).then(success, error);
        }
    };
});

app.controller('applicationController', function ($scope ,$localStorage, Application) {

    $scope.$storage = $localStorage;

    if(Application.currentUser.id) {
        $scope.isLoggedIn = true;       //verifica se há a existência de um usuario autenticado
    } else {
        $scope.isLoggedIn = false;      //verifica se há a existência de um usuario autenticado
    }
});

app.controller( "loginController" , function ($scope, $http, Application, $window) {

    $scope.loginErro = false;           //Variável responsável para dar feedback sobre problemas no processo de login
    $scope.loginLoading = false;        //Variável responsável para dar feedback enquanto a requisição de login está sendo processada



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
                $window.location.reload();
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
        Application.getPostit(Application.currentUser.id , onPostitSuccess, onPostitFail);

        function onPostitSuccess(response) {
            console.log(response);
        }

        function onPostitFail() {
            console.log('deu errado');
        }
    };
});

app.controller('postitController' , function ($scope, $http, Application) {

    $scope.postits = [];

    $scope.creatingPostit = false;

    $scope.createNewPostit = function () {

        $scope.creatingPostit = true;
        var data = {
            id_usuario : Application.currentUser.id,
            texto: $scope.postit_text
        };

        Application.createPostit(data, onCreateSuccess, onCreateFail)

        function onCreateSuccess (newPostit) {
            $scope.creatingPostit = false;
            newPostit.isEditting = false;
            $scope.postits.push(newPostit);
        }

        function onCreateFail (err) {
            $scope.creatingPostit = false;
            console.log(err);
        }
    };

    $scope.getAllPostits = function () {

        Application.getPostit(onGetSuccess,onGetFail);

        function onGetSuccess (postits) {

            if(Array.isArray(postits)) {
                $scope.postits = postits;
            } else {
                $scope.postits.push(postits);
            }
        }

        function onGetFail (err) {

            console.log(err);
        }
    };

    $scope.deletePostit = function (index) {
        this.postits.splice(index, 1)
    };
});

app.directive('resizeTextarea', function ($compile) {
    return function (scope, element, attrs) {

        scope.$watch(function () {
                return element[0].value;
            },
            function () {
                element[0].style.height = element[0].scrollHeight + "px";
            });
    };
});