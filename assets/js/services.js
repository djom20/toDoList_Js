angular.module('toDoList.services',['ngResource'])

    .factory('tasksService', ['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId/tasks',{userId:'@uid'}, {listTasks:{method:"GET", isArray:true}});
    }])

    .factory('ticketsService', ['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId/tasks/:tasksId/tickets/:ticketsId', {userId: '@uid', tasksId: '@tid', ticketsId: '@ticd'}, {
            listTickets: {method:"GET", isArray:true},
            deleteTickets: {method:"DELETE", isArray:false, headers: {'Content-Type': 'application/json'}},
            updateTickets: {method:"PUT", isArray:true}
        });
    }])

    .factory('addTicketsService', ['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId/tasks/:tasksId/tickets/new', {userId: '@uid', tasksId: '@tid'}, {
            addTickets: {method:"GET", isArray:true}
        });
    }])

    .factory('usersService', ['$resource', function($resource){
        return $resource('http://todolistrails.herokuapp.com/api/v1/users/:userId', {userId: '@uid'}, {listUsers:{method:"GET", isArray:true}});
    }]);