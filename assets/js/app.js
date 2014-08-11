angular.module('toDoList',[
	'toDoList.controllers',
	'toDoList.services',
	'ngRoute',
	'ngCookies'
]).config(appRouter);

function appRouter($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: 'partials/login.html',
			controller: 'sessionController'
		})
		.when('/signin', {
			templateUrl: 'partials/signin.html',
			controller: 'sessionController'
		})
		.when('/dashboard', {
			templateUrl: 'partials/dashboard.html',
			controller: 'dashboardController'
		});
}