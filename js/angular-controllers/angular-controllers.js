/**
 * Created by Davi on 29/04/16.
 */

var app = angular.module("postit-login", [
    'angular-ladda'
]);

app.controller( "loginController" , function ($scope, $http) {

    //Variável responsável para dar feedback sobre problemas no processo de login
    $scope.loginErro = false;
    $scope.loginLoading = false;

    $scope.onSubmit = function () {
        $scope.loginLoading = true;
        var params = {
            login: $scope.form.login,
            password: $scope.form.password
        };

        $http.post('http://localhost:3000/user/login', params).then(onLoginSuccess, onLoginFail)

        //Função chamada quando a requisição é processada normalmente
        function onLoginSuccess(response) {
            $scope.loginLoading = false;
            $scope.loginErro = !response.data.hasUser;
            if(response.data.hasUser) {
                //Fazer processo de login e armazenar usuário para passar para a outra tela
                console.log(response);
            }

        }

        //Função chamada quando há algum erro no processamento da função. Ex: Timeout ou servidor não acessível.
        function onLoginFail(err) {
            $scope.loginLoading = false;
            console.log("Erro na requisição");
            console.log(err);
        }
    }
});