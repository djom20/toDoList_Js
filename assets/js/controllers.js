angular.module('toDoList.controllers', [])
	
	// .controller('taskList', ['$scope','taskService','taskService2', function($scope, taskService, taskService2){
 //        $scope.tasks = taskService2.listTasks({}, {'uid':1}, function(response){ console.log(response); });
 //    }])

    .controller('sessionController', ['$scope', '$location', '$cookieStore', 'usersService', function($scope, $location, $cookieStore, usersService){

    	$scope.loginEmail = '';
		$scope.loginPassword = '';

		$scope.doClick = function(item, event){
			$scope.users = usersService.listUsers({}, { }, function(response){
	        	console.log('Correct Services Api Users');

				angular.forEach($scope.users, function(user){
					if(user.email == $scope.loginEmail){
						if(user.name == $scope.loginPassword){
			    			$scope.warning = false;
			    			$scope.current_user = user;

			    			$cookieStore.put('current_user', user);

			    			$location.path('/dashboard');
						}else{ $scope.warning = true; }
					}else{ $scope.warning = true; }
				});
	        });

	        console.log('email: ' + $scope.loginEmail);
	        console.log('password: ' + $scope.loginPassword);

	        if($scope.loginEmail == '' && $scope.loginPassword == ''){
				$scope.warning_text = 'All fields are required';	        	
	        }else{
				$scope.warning_text = 'The Username or Password no exist';
	        }
	    };

	 	$scope.dontError = function(){ $scope.warning = false; };
	    $scope.logout = function(){ $location.path('/'); };
	}])

	.controller('dashboardController', ['$scope', '$cookieStore', '$location', 'tasksService', 'ticketsService', function($scope, $cookieStore, $location, tasksService, ticketsService){
		if($cookieStore.get('current_user')){
			$scope.current_user = $cookieStore.get('current_user');
			$scope.userName = $cookieStore.get('current_user').name + ' ' + $cookieStore.get('current_user').lastname;
			$scope.visible_tickets = false;
			$scope.orderTasks = 'created_at';
			$scope.orderTicktes = 'created_at';
			$scope.divSize = 'col-md-12';
			$scope.current_task = {};
			$scope.tickets = {};
			
			$scope.tasks = tasksService.listTasks({}, {'uid': $scope.current_user.id}, function(response){
	        	console.log('Correct Services Api Tasks');
	        });

		    $scope.listTickets = function(current_task){
			    console.log('List Tickets');
		        $scope.tickets = ticketsService.listTickets({}, {'uid':$scope.current_user.id, 'tid': current_task.id}, function(response){
		        	console.log('Correct Services Api Tickets');
		        });

		        $scope.divSize = 'col-md-6';

		        $scope.visible_tickets = true;
		        $scope.current_task = current_task;
		        console.log('visible_tickets: ' + $scope.visible_tickets);
		      	
		      	return current_task.id;
		    };

		    $scope.sortBy = function(order, type){
			    if(type == 'tasks'){
			    	console.log('Orders Tasks by ' + order);
			    	$scope.orderTasks = order;
			    }else{
			    	console.log('Orders Ticktes by ' + order);
			    	$scope.orderTicktes = order;
			    }
		    };

			$scope.percentage = function(){
		      	var remaining = 0;
		      	var total = 0;
		    	angular.forEach($scope.tickets, function(ticket) { remaining += ticket.completed ? 1 : 0; });
		    	if($scope.tickets.length > 0){ total = (remaining * 100) / $scope.tickets.length; }
		      	return Math.round(total);
		    };

		    $scope.changeStateTicket = function(ticket){
			    if(ticket.completed == 1){ ticket.completed = 0; }else{ ticket.completed = 1; }
			    console.log('item change a ' + ticket.completed);
			    $scope.validateStateTask();
		    };

		    $scope.validateStateTask = function(ticket){
				total = $scope.percentage();
		    	if(total == 100){ $scope.current_task.completed = 1; }else{ $scope.current_task.completed = 0; }
		    };

			$scope.remaining = function(){
		      	var count = 0;
		    	angular.forEach($scope.tasks, function(task){ count += task.completed ? 1 : 0; });
		      	return count;
		    };

		    $scope.updateTicket = function(keyEvent, ticket, inputText){
			    if (keyEvent.which === 13){ ticket.description = inputText; }
		    };

		    $scope.updateTask = function(keyEvent, task, inputText){
		      	if (keyEvent.which === 13){ task.name = inputText; }
		    };

		    $scope.deleteTicket = function(ticket){
				// $scope.tickets = ticketsService.deleteTickets({}, {'uid': $scope.current_user.id, 'tid': $scope.current_task.id, 'ticd': ticket.id}, function(response){
		    		$scope.tickets.splice($scope.tickets.indexOf(ticket), 1);
			    	// console.log('item delete id:' + ticket.id + ' index: ' + $scope.tickets.indexOf(ticket));
		        // });
		    };

		    $scope.deleteTask = function(task){
		    	if($scope.current_task.id = task.id){ $scope.hideTickets(); }
		    	$scope.tasks.splice($scope.tasks.indexOf(task), 1);
		    };

		    $scope.deleteTicketsComplete = function(){
				$scope.tickets = $scope.tickets.filter(function(ticket){ return ticket.completed !== 1; });
		    };

		    $scope.deleteTasksComplete = function(){
				$scope.tasks = $scope.tasks.filter(function(task){ return task.completed !== 1; });
				$scope.hideTickets();
				console.log($scope.tasks);
		    };

		    $scope.hideTickets = function(){ $scope.visible_tickets = false; $scope.divSize = 'col-md-12'; };

		  	$scope.partialURL = 'partials/tasks.html';
		}else{ $location.path('/'); }
	}]);