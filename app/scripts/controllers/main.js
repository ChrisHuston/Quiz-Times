'use strict';

/**
 * @ngdoc function
 * @name submissionViewerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the submissionViewerApp
 */

angular.module('submissionViewerApp')
  .controller('MainCtrl', function ($scope, UserService, uiGridConstants) {
        $scope.user = UserService.user;

        $scope.user.selectedQuiz = {};

        $scope.getQuizSubmissions = function() {
            UserService.getQuizSubmissions($scope.user.selectedQuiz.quiz_id, $scope.gridOptions);
        };

        var num_filters = [
            {condition: uiGridConstants.filter.GREATER_THAN, placeholder: ' >'},
            {condition: uiGridConstants.filter.LESS_THAN, placeholder: ' <'}
        ];

        $scope.gridOptions = {
            showGridFooter: true,
            enableGridMenu: true,
            exporterCsvFilename: 'quiz_time_stats.csv',
            exporterMenuPdf: false,
            enableFiltering: true,
            enableSorting: true,
            multiSelect: false,
            modifierKeysToMultiSelect: false,
            enableRowHeaderSelection: false,
            rowHeight: 40,
            columnDefs: [
                {field: 'user_name', displayName: "Student Name", type:'string'},
                {field: 'net_id', width: 90, displayName: "Net ID", type:'string'},
                {field: 'started_at', width: 140, cellClass:'r-cell', displayName: "Start", type:'string'},
                {field: 'finished_at', width: 140, cellClass:'r-cell', displayName: "End", type:'string'},
                {field: 'time_spent', type:"number", width: 90, cellClass:'r-cell', displayName: "Minutes", filters:num_filters},
                {field: 'score', width: 90, type:"number", cellClass:'r-cell', displayName: "Score"},
                { field: 'html_url', type:'string', enableSorting: false, width:110, displayName:"Grader", enableFiltering: false, cellTemplate:'<div class="ui-grid-cell-contents"><a class="btn btn-default btn-sm" ng-href="{{COL_FIELD CUSTOM_FILTERS}}" target="_blank">View</a></div>'}
            ]};
  });
