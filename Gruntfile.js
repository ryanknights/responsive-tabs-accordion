module.exports = function (grunt)
{
	grunt.initConfig({

		pkg : grunt.file.readJSON('package.json'),

		uglify :
		{
			app :
			{
				files :
				{
					'js/responsivetabs.min.js' : ['js/responsivetabs.js']
				}
			}
		},

		less :
		{
			app :
			{
				files :
				{
					'css/responsivetabs.css' : 'css/responsivetabs.less'
				}
			}
		},

		cssmin : 
		{	
			app :
			{
				files : 
				{
					'css/responsivetabs.css' : ['css/responsivetabs.css']
				}
			}
		},

		watch :
		{
			options :
			{
				livereload : true,
			},

			scripts :
			{
				files : ['js/responsivetabs.js'],
				tasks : ['uglify']
			},

			stylesheets :
			{
				files : ['css/responsivetabs.less'],
				tasks : ['less', 'cssmin']
			},
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['less', 'cssmin', 'uglify']);
};