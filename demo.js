(function() {
	var app = angular.module('taskDemo', []);
	

	app.controller('TaskController', function() {
		this.task = {};

		this.addTask = function() {
			
			
			// TODO send the http request
			
			var url = document.URL + 'prolog';//'reasoner';
			$.getJSON(url, this.task, function (data) {
				console.log('API response received');
				$('#output').append('<p>output for request ' + data.value + '</p>');
			});

			this.review = {};
		};
	});
	
	
	})();