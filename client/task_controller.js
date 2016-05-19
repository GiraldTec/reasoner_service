(function() {
	var app = angular.module('taskDemo', []);
	

	app.controller('TaskController', function() {
		this.task = {};

		this.addTask = function() {
			
			var url = document.URL + 'reasoner';//'reasoner';
			console.log(url);
			console.log(this.task);

			$.ajax({
			  type: "POST",
			  url: url,
			  data: this.task,
			  success: function (data) {
					console.log('API response received');
					console.log(data.value);
					$('#output').append('<p>output for request ' + data.value + '</p>');
				},
			  dataType: 'json',
			  contentType: "application/X-www-form-urlencoded; charset=utf-8"
			});
//			$.post(url, this.task, function (data) {
//				console.log('API response received');
//				console.log(data.value);
//				$('#output').append('<p>output for request ' + data.value + '</p>');
//			}, 'json');


			this.review = {};
		};
	});
	
	
	})();