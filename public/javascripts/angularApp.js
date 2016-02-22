var app = angular.module('meanNews', ['ui.router']);

app.factory('posts', [function(){
   var o = {
     posts: [
       {title:'Reddit',
        link:'http://www.reddit.com',
        upvotes: 4,
        comments:[ {author: 'Dan', body: 'This site is great!', upvotes: 2 } ]}
     ]
   };
   return o;
}]);

app.controller('MainCtrl', [
  '$scope', '$stateParams', 'posts',
  function($scope, $stateParams, posts){

    $scope.posts = posts.posts;

    $scope.addPost = function(){
      if(!$scope.title || $scope.title === '') { return; }

      $scope.posts.push({
        title: $scope.title,
        link: $scope.link,
        upvotes: 0,
        comments: [
          {author: 'Joe', body: 'Cool post!', upvotes: 0},
          {author: 'Bob', body: 'Great idea but everything is wrong', upvotes: 0}
        ]
      });

      $scope.title = '';
      $scope.link = '';
    };

    $scope.incrementUpvotes = function(post){
      post.upvotes += 1;
    };
}]);

app.controller('PostsCtrl', [
  '$scope','$stateParams', 'posts',
  function($scope, $stateParams, posts){

    $scope.post = posts.posts[$stateParams.id];

    $scope.addComment = function(){
      if($scope.body === '') { return; }
      $scope.post.comments.push({
        body: $scope.body,
        author: 'user',
        upvotes: 0
      });
      $scope.body = '';
    };
}]);

app.config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: '/home.html',
          controller: 'MainCtrl'
        })
        .state('posts', {
          url: '/posts/{id}',
          templateUrl: '/posts.html',
          controller: 'PostsCtrl'
        });

      $urlRouterProvider.otherwise('home');
    }]);
