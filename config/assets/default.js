var bower_components_path = 'src/client/bower_components';
var node_modules_path = 'node_modules';

module.exports = {
    client: {
        lib: {
            js: [
                bower_components_path + '/jquery/dist/jquery.min.js',
                bower_components_path + '/tether/dist/js/tether.min.js',
                bower_components_path + '/bootstrap/dist/js/bootstrap.min.js',
                bower_components_path + '/angular/angular.min.js',
                bower_components_path + '/angular-animate/angular-animate.min.js',
                bower_components_path + '/angular-messages/angular-messages.min.js',
                bower_components_path + '/angular-aria/angular-aria.min.js',
                bower_components_path + '/angular-material/angular-material.min.js',
                bower_components_path + '/angular-ui-router/release/angular-ui-router.min.js',
                bower_components_path + '/oclazyload/dist/ocLazyLoad.min.js',
                bower_components_path + '/angular-breadcrumb/dist/angular-breadcrumb.min.js',
                bower_components_path + '/angular-loading-bar/build/loading-bar.min.js',
                bower_components_path + '/angularjs-datepicker/dist/angular-datepicker.min.js',
                bower_components_path + '/file-saver/FileSaver.min.js',
                bower_components_path + '/ng-file-upload/ng-file-upload-shim.min.js',
                bower_components_path + '/ng-file-upload/ng-file-upload.min.js',
                bower_components_path + '/angular-object-diff/dist/angular-object-diff.min.js',
                node_modules_path + '/survey-jquery/survey.jquery.min.js',
                node_modules_path + '/angular-uuid/angular-uuid.js'
            ]
        }
    },
    server: {
        gulpConfig: 'gulpfile.js',
        allJS: ['server.js', 'config/**/*.js', 'src/*/server/**/*.js'],
        models: 'src/server/models/**/*.js',
        routes: 'src/server/routes.js',
        sockets: 'src/server/sockets/**/*.js'
    }
};
