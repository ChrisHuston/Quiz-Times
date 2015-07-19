'use strict';

/**
 * @ngdoc service
 * @name submissionViewerApp.User
 * @description
 * # User
 * Factory in the submissionViewerApp.
 */
angular.module('submissionViewerApp')
  .factory('UserService', function ($http, $filter) {


        var inst = {};
        inst.user = {loginError:null, course_id:null, priv_level:1, quizzes:[], users:[], quiz_submissions:[], gridOptions:{}};
        inst.appDir = 'https://www.kblocks.com/app/quiz_stats/';

        inst.login = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script = 'lti_login.php';
            var params = {};
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    if (data.login_error === "NONE") {
                        inst.user.course_id = data.course_id;
                        inst.user.priv_level = parseInt(data.priv_level);
                        getCanvasQuizzes();
                    } else {
                        inst.user.loginError =  data.login_error;
                    }
                }).
                error(function(data, status) {
                    inst.user.loginError =  "Error: " + status + " Sign-in failed. Check your internet connection";
                    $location.path('/');
                });
        };
        inst.login();

        var getCanvasQuizzes = function() {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script;
            php_script = "getCanvasQuizzes.php";
            var params = {};
            params.course_id = inst.user.course_id;
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var quizzes = [];
                    angular.forEach(data.quizzes, function(q) {
                       var newQuiz = {quiz_id: q.id, title: q.title};
                        quizzes.push(newQuiz);
                    });
                    inst.user.quizzes = quizzes;
                }).
                error(function(data, status) {
                    alert( "Error: " + status + " Get quizzes failed. Check your internet connection");
                });
        };


        var simpleTimeFormatter = function(seconds) {
            var h = Math.floor(seconds / 3600);
            var mm = Math.floor((seconds - (h * 3600)) / 60);
            var ss = seconds - (h * 3600) - (mm * 60);

            if (mm < 10) {mm = '0' + mm}
            if (ss < 10) {ss = '0' + ss}

            return h + ':' + mm;
        };

        inst.getQuizSubmissions = function(quiz_id, gridOptions) {
            var uniqueSuffix = "?" + new Date().getTime();
            var php_script = 'getCanvasQuizSubmissions.php';
            var params = {};
            params.course_id = inst.user.course_id;
            params.quiz_id = quiz_id;
            $http({method: 'POST',
                url: inst.appDir + 'php/' + php_script + uniqueSuffix,
                data: params,
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).
                success(function(data) {
                    var quiz_submissions = [];
                    var users = data.submissions.users;
                    angular.forEach(data.submissions.quiz_submissions, function(q) {
                        var newSubmission = {};
                        var user = _.find(users, {id: q.user_id});
                        newSubmission.user_name = user.sortable_name;
                        newSubmission.net_id = user.login_id;
                        if (q.started_at && q.started_at != 'null') {
                            newSubmission.started_at = moment.utc(q.started_at).local().format("YYYY-MM-DD HH:mm");
                        } else {
                            newSubmission.started_at = '--'
                        }

                        if (q.finished_at && q.finished_at != 'null') {
                            newSubmission.finished_at = moment.utc(q.finished_at).local().format("YYYY-MM-DD HH:mm");
                        } else {
                            newSubmission.finished_at = '--'
                        }
                        newSubmission.html_url = q.html_url;
                        if (q.score) {
                            newSubmission.score = parseFloat(q.score);
                        } else {
                            newSubmission.score = ''
                        }

                        if (q.time_spent) {
                            newSubmission.time_spent = Math.floor(parseInt(q.time_spent)/60);
                        } else {
                            newSubmission.time_spent = '';
                        }

                        quiz_submissions.push(newSubmission);
                    });
                    inst.user.quiz_submissions = quiz_submissions;
                    gridOptions.data = inst.user.quiz_submissions;
                }).
                error(function(data, status) {
                    inst.user.loginError =  "Error: " + status + " Get assignments failed. Check your internet connection";
                });
        };

        return inst;
  });
