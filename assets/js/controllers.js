angular.module('toDoList.controllers', [])
	
	// .controller('taskList', ['$scope','taskService','taskService2', function($scope, taskService, taskService2){
 //        $scope.tasks = taskService2.listTasks({}, {'uid':1}, function(response){ console.log(response); });
 //    }])

    .controller('sessionController', ['$scope', '$location', '$cookieStore', 'usersService', function($scope, $location, $cookieStore, usersService){

    	$scope.loginEmail = '';
		$scope.loginPassword = '';

		$scope.doClick = function(item, event) {
			$scope.users = usersService.listUsers({}, { }, function(response){
	        	console.log('Correct Services Api Users');

				angular.forEach($scope.users, function(user) {
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
			$scope.current_task = {};
			$scope.tickets = {};
			
			$scope.tasks = tasksService.listTasks({}, {'uid': $scope.current_user.id}, function(response){
	        	console.log('Correct Services Api Tasks');
	        });

		    $scope.listTickets = function(current_task) {
			    console.log('List Tickets');
		        $scope.tickets = ticketsService.listTickets({}, {'uid':$scope.current_user.id, 'tid': current_task.id}, function(response){
		        	console.log('Correct Services Api Tickets');
		        });

		        $scope.visible_tickets = true;
		        $scope.current_task = current_task;
		        console.log('visible_tickets: ' + $scope.visible_tickets);
		      	
		      	return current_task.id;
		    };

			$scope.percentage = function(){
		    	console.log('Charge Percentaje');
		      	var remaining = 0;
		      	var total = 0;
		    	angular.forEach($scope.tickets, function(ticket) { remaining += ticket.completed ? 1 : 0; });
		    	if($scope.tickets.length > 0){ total = (remaining * 100) / $scope.tickets.length; }
		    	if(total == 100){ $scope.current_task.completed = true; }else{ $scope.current_task.completed = false; }
		      	return Math.round(total);
		    };

			$scope.remaining = function() {
		      	var count = 0;
		    	angular.forEach($scope.tasks, function(task) { count += task.completed ? 1 : 0; });
		      	return count;
		    };

		    $scope.changeStateTicket = function(id) {
		    	angular.forEach($scope.tickets, function(ticket) {
			        if(ticket.id == id){
			        	if(ticket.completed == true){ ticket.completed = false; }else{ ticket.completed = true; }
			        	console.log('item change a ' + ticket.completed);
			        }
		      	});
		    };

		    $scope.deleteTicket = function(ticket) {
				$scope.tickets = ticketsService.deleteTickets({}, {'uid': $scope.current_user.id, 'tid': $scope.current_task.id, 'ticd': ticket.id}, function(response){
		    		$scope.tickets.splice($scope.tickets.indexOf(ticket), 1);
			    	console.log('item delete id:' + ticket.id + ' index: ' + $scope.tickets.indexOf(ticket));
		        });
		    };

		    $scope.deleteTask = function(task){
		    	if($scope.current_task.id = task.id){ $scope.dontTickets(); }
		    	$scope.tasks.splice($scope.tasks.indexOf(task), 1);
		    };

		    $scope.deleteTicketsComplete = function(){
		    	// angular.forEach($scope.tickets, function(ticket){
			    //     if(ticket.completed == true){
			    //     	$scope.tickets.splice($scope.tickets.indexOf(temp_tickets[i]), 1);
			    //     }
		     //  	});
				console.log('No hace nada');
				alert('No hace nada');
		    };

		    $scope.deleteTasksComplete = function(){
		    	// angular.forEach($scope.tickets, function(ticket){
			    //     if(ticket.completed == true){
			    //     	$scope.tickets.splice($scope.tickets.indexOf(temp_tickets[i]), 1);
			    //     }
		     //  	});
				$scope.dontTickets();
				console.log('No hace nada');
				alert('No hace nada');
		    };

		    $scope.dontTickets = function(){ $scope.visible_tickets = false; };

		  	$scope.partialURL = 'partials/tasks.html';
		}else{ $location.path('/'); }
	}]);