'use strict';
console.log("im in app.js");//ui.bootstrap

var app = angular.module('myApp', ['ngRoute', 'ui.bootstrap']);
app.controller('myCtrl', function($scope) {
  $scope.firstName = "John";
  $scope.lastName = "Doe";
});


// var app = angular.module('appDev', ['ngRoute', 'ui.bootstrap']);

app.config(['$routeProvider',  function ($routeProvider) {
  $routeProvider

  .when('/', {
    templateUrl: '/templates/todo.html',
    controller: 'TodoCtrl'
  })

  .otherwise({
    templateUrl: '/templates/errMsg.html',
    })

}])


app.controller('TodoCtrl', ['$scope', '$rootScope', 'TodoService', function($scope, $rootScope, TodoService) {
  console.log("im in controller");
  $scope.formData = {};
  $scope.todos = [];

  TodoService.getTodos().then(function(response) {
    $scope.todos = response;
  });

  $scope.addTodo = function() {
    TodoService.addTodo($scope.formData).then(function(response) {
      $scope.todos.push($scope.formData)
      $scope.formData = {};
    });
  }

  $scope.removeTodo = function(todo) {
    TodoService.removeTodo(todo).then(function(response) {
      $scope.todos.splice($scope.todos.indexOf(todo), 1)
    });
  }
}])

app.service('TodoService', function($http, $q) {
  return {
    'getTodos': function() {
      var defer = $q.defer();
      $http.get('/todo/getTodos').success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'addTodo': function(todo) {
      var defer = $q.defer();
      $http.post('/todo/addTodo', todo).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    },
    'removeTodo': function(todo) {
      var defer = $q.defer();
      $http.post('/todo/removeTodo', todo).success(function(resp){
        defer.resolve(resp);
      }).error( function(err) {
        defer.reject(err);
      });
      return defer.promise;
    }
}})