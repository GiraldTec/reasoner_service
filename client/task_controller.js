(function() {
	var app = angular.module('taskDemo', []);
	

	app.controller('TaskController', function() {
		this.task = {};

		this.addTask = function() {
			
			var url = document.URL + 'reasoner';//'reasoner';
			console.log(url);
			$.getJSON(url, this.task, function (data) {
				console.log('API response received');
				console.log(data.value);
				$('#output').append('<p>output for request ' + data.value + '</p>');
			});

			this.review = {};
		};
	});
	
	
	})();