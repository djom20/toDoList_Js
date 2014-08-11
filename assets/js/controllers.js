angular.module('toDoList.controllers', [])
	
	.controller('taskList', ['$scope','taskService','taskService2', function($scope, taskService, taskService2){
        $scope.tasks = taskService2.listTasks({}, {'uid':1}, function(response){
        	console.log(response);
        });
    }])

    .controller('sessionController', ['$scope', '$location', '$cookieStore', 'usersService', function($scope, $location, $cookieStore, usersService){

		$scope.doClick = function(item, event) {
			$scope.users = usersService.listUsers({}, { }, function(response){
	        	console.log('Correct Services Api Users');

				angular.forEach($scope.users, function(user) {
					if(user.email = $scope.loginEmail){
						if(user.name = $scope.loginPassword){
			    			$scope.warning = false;
			    			$scope.current_user = user;

			    			$cookieStore.put('current_user', user);

			    			$location.path('/dashboard');
						}else{ $scope.warning = true; }
					}else{ $scope.warning = true; }
				});
	        });

			if($scope.warning === true){ console.log("Show Error";) $scope.warning_text = 'The Username or Password no exist'; }
	    };

	 	$scope.dontError = function() { $scope.warning = false; };
	    $scope.logout = function() { $location.path('/'); };
	}])

	.controller('dashboardController', ['$scope', '$cookieStore', '$location', 'tasksService', 'ticketsService', function($scope, $cookieStore, $location, tasksService, ticketsService){
		if($cookieStore.get('current_user')){
			$scope.current_user = $cookieStore.get('current_user');
			$scope.userName = $cookieStore.get('current_user').name + $cookieStore.get('current_user').lastname;
			$scope.visible_tickets = false;
			$scope.current_task_name = '';
			
			$scope.tasks = tasksService.listTasks({}, {'uid':$scope.current_user.id}, function(response){
	        	console.log('Correct Services Api Tasks');
	        });

		    $scope.listTickets = function(id, name) {
		        $scope.tickets = ticketsService.listTickets({}, {'uid':$scope.current_user.id, 'tid': id}, function(response){
		        	console.log('Correct Services Api Tickets');
		        });

			    $scope.percentage = function() {
			      	var remaining = 0;
			      	var total = 0;
			    	angular.forEach($scope.tickets, function(ticket) { remaining += ticket.state ? 1 : 0; });
			    	total = (remaining * 100) / $scope.tickets.length;
			      	return total;
			    };

		        $scope.visible_tickets = true;
		        $scope.current_task_name = name;
		        console.log('visible_tickets: ' + $scope.visible_tickets);
		      	
		      	return id;
		    };

			$scope.remaining = function() {
		      	var count = 0;
		    	angular.forEach($scope.tasks, function(task) {
			        count += task.state ? 1 : 0;
		      	});
		      	return count;
		    };

		    $scope.changeState = function(id, state) {
		    	angular.forEach($scope.tickets, function(ticket) {
			        if(ticket.id == id){
			        	ticket.state = state;
			        	console.log('item change a ' + state);
			        }
		      	});
		    };

			$scope.checkState = function(id) {
		      	var checked = '';
		    	angular.forEach($scope.tickets, function(ticket) { checked += ticket.state ? 'checked' : ''; });
		      	console.log('Estado del check: ' + id);
		      	return checked;
		    };

		    $scope.deleteTicket = function(id) {
		    	$scope.tickets.splice(id, 1);
			    console.log('item delete');

			    // $scope.listTickets();
		    };

		  	$scope.partialURL = 'partials/tasks.html';
		}else{ $location.path('/'); }
	}]);