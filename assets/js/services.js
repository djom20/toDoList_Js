angular.module('toDoList.services',['ngResource'])

    .factory('tasksService',['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId/tasks',{userId:'@uid'}, {listTasks:{method:"GET",isArray:true}});
    }])

    .factory('ticketsService',['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId/tasks/:tasksId/tickets', {userId: '@uid', tasksId: '@tid'}, {listTickets:{method:"GET",isArray:true}});
    }])

    .factory('usersService',['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId', {userId: '@uid'}, {listUsers:{method:"GET",isArray:true}});
    }]);