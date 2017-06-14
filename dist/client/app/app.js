'use strict';

angular.module('movieAppApp', ['movieAppApp.auth', 'movieAppApp.admin', 'movieAppApp.constants', 'ngCookies', 'ngResource', 'ngSanitize', 'ngRoute', 'btford.socket-io', 'validation.match']).config(function ($routeProvider, $locationProvider) {
  $routeProvider.otherwise({
    redirectTo: '/'
  });

  $locationProvider.html5Mode(true);
});
//# sourceMappingURL=app.js.map

'use strict';

angular.module('movieAppApp.admin', ['movieAppApp.auth', 'ngRoute']);
//# sourceMappingURL=admin.module.js.map

'use strict';

angular.module('movieAppApp.auth', ['movieAppApp.constants', 'movieAppApp.util', 'ngCookies', 'ngRoute']).config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
});
//# sourceMappingURL=auth.module.js.map

'use strict';

angular.module('movieAppApp.util', []);
//# sourceMappingURL=util.module.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'app/account/login/login.html',
    controller: 'LoginController',
    controllerAs: 'vm'
  }).when('/logout', {
    name: 'logout',
    referrer: '/',
    template: '',
    controller: function controller($location, $route, Auth) {
      var referrer = $route.current.params.referrer || $route.current.referrer || '/';
      Auth.logout();
      $location.path(referrer);
    }
  }).when('/signup', {
    templateUrl: 'app/account/signup/signup.html',
    controller: 'SignupController',
    controllerAs: 'vm'
  }).when('/settings', {
    templateUrl: 'app/account/settings/settings.html',
    controller: 'SettingsController',
    controllerAs: 'vm',
    authenticate: true
  });
}).run(function ($rootScope) {
  $rootScope.$on('$routeChangeStart', function (event, next, current) {
    if (next.name === 'logout' && current && current.originalPath && !current.authenticate) {
      next.referrer = current.originalPath;
    }
  });
});
//# sourceMappingURL=account.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoginController = function () {
  function LoginController(Auth, $location) {
    _classCallCheck(this, LoginController);

    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$location = $location;
  }

  _createClass(LoginController, [{
    key: 'login',
    value: function login(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.login({
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Logged in, redirect to home
          _this.$location.path('/');
        }).catch(function (err) {
          _this.errors.other = err.message;
        });
      }
    }
  }]);

  return LoginController;
}();

angular.module('movieAppApp').controller('LoginController', LoginController);
//# sourceMappingURL=login.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SettingsController = function () {
  function SettingsController(Auth) {
    _classCallCheck(this, SettingsController);

    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
  }

  _createClass(SettingsController, [{
    key: 'changePassword',
    value: function changePassword(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.changePassword(this.user.oldPassword, this.user.newPassword).then(function () {
          _this.message = 'Password successfully changed.';
        }).catch(function () {
          form.password.$setValidity('mongoose', false);
          _this.errors.other = 'Incorrect password';
          _this.message = '';
        });
      }
    }
  }]);

  return SettingsController;
}();

angular.module('movieAppApp').controller('SettingsController', SettingsController);
//# sourceMappingURL=settings.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SignupController = function () {
  //end-non-standard

  function SignupController(Auth, $location) {
    _classCallCheck(this, SignupController);

    this.user = {};
    this.errors = {};
    this.submitted = false;

    this.Auth = Auth;
    this.$location = $location;
  }
  //start-non-standard


  _createClass(SignupController, [{
    key: 'register',
    value: function register(form) {
      var _this = this;

      this.submitted = true;

      if (form.$valid) {
        this.Auth.createUser({
          name: this.user.name,
          email: this.user.email,
          password: this.user.password
        }).then(function () {
          // Account created, redirect to home
          _this.$location.path('/');
        }).catch(function (err) {
          err = err.data;
          _this.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function (error, field) {
            form[field].$setValidity('mongoose', false);
            _this.errors[field] = error.message;
          });
        });
      }
    }
  }]);

  return SignupController;
}();

angular.module('movieAppApp').controller('SignupController', SignupController);
//# sourceMappingURL=signup.controller.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var AdminController = function () {
    function AdminController(User) {
      _classCallCheck(this, AdminController);

      // Use the User $resource to fetch all users
      this.users = User.query();
    }

    _createClass(AdminController, [{
      key: 'delete',
      value: function _delete(user) {
        user.$remove();
        this.users.splice(this.users.indexOf(user), 1);
      }
    }]);

    return AdminController;
  }();

  angular.module('movieAppApp.admin').controller('AdminController', AdminController);
})();
//# sourceMappingURL=admin.controller.js.map

'use strict';

angular.module('movieAppApp.admin').config(function ($routeProvider) {
  $routeProvider.when('/admin', {
    templateUrl: 'app/admin/admin.html',
    controller: 'AdminController',
    controllerAs: 'admin',
    authenticate: 'admin'
  });
});
//# sourceMappingURL=admin.router.js.map

"use strict";

(function (angular, undefined) {
	angular.module("movieAppApp.constants", []).constant("appConfig", {
		"userRoles": ["guest", "user", "admin"]
	});
})(angular);
//# sourceMappingURL=app.constant.js.map

'use strict';

function bookingService() {
  this.selectedMovie = '';
  this.selectedPoster = '';
  this.selectedTheater = '';
  this.selectedDate = '';
  this.selectedTime = '';
  this.selectedClass = '';
  this.selectedSeats = [];
  this.price = '';
  this.totPrice = '';
  this.userRole;
  this.userName;
}

angular.module('movieAppApp').service('booking', bookingService);
//# sourceMappingURL=booking.service.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var DatetimeSelectComponent = function () {
    function DatetimeSelectComponent($http, $scope, $location, socket, booking) {
      _classCallCheck(this, DatetimeSelectComponent);

      this.$http = $http;
      this.$location = $location;
      this.socket = socket;
      this.theaterData = [];
      this.sortedDates = [];
      this.newDates = [];
      this.booking = booking;

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('movieTheaterEndpoint');
      });

      this.movie = booking.selectedMovie;
    }

    _createClass(DatetimeSelectComponent, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        var dates = [];
        this.$http.get('/api/movie-theater-endpoints').then(function (response) {
          _this.boundData = response.data;

          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this.boundData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var ele = _step.value;

              if (ele.movie === _this.movie) {
                dates.push.apply(dates, _toConsumableArray(ele.dates));
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          _this.filteredDates = dates.filter(function (item, pos) {
            return dates.indexOf(item) == pos;
          });

          for (var i = 0; i < _this.filteredDates.length - 1; i++) {
            if (_this.filteredDates[i] > _this.filteredDates[i + 1]) {
              var temp = _this.filteredDates[i];
              _this.filteredDates[i] = _this.filteredDates[i + 1];
              _this.filteredDates[i + 1] = temp;
            }
          }

          function addZero(i) {
            if (i < 10) {
              i = "0" + i;
            }return i;
          }
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = _this.filteredDates[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var dateEle = _step2.value;

              var date = addZero(new Date(dateEle).getDate());
              var month = addZero(new Date(dateEle).getMonth());
              var year = new Date(dateEle).getFullYear();
              var fullDate = date + "." + month + "." + year;
              _this.newDates.push(fullDate);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          _this.socket.syncUpdates('movieTheaterEndpoint', _this.boundData);
        });
      }
    }, {
      key: 'getTheaterDetails',
      value: function getTheaterDetails(date) {
        function addZero(i) {
          if (i < 10) {
            i = "0" + i;
          }return i;
        }
        this.booking.selectedDate = date;
        this.theatersData = [];
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.boundData[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var ele = _step3.value;

            if (ele.movie === this.movie) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = ele.dates[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var dateEle = _step4.value;

                  var d = addZero(new Date(dateEle).getDate());
                  var m = addZero(new Date(dateEle).getMonth());
                  var y = new Date(dateEle).getFullYear();
                  var fullDate = d + "." + m + "." + y;
                  console.log(date);
                  console.log(fullDate);
                  if (date === fullDate) {
                    this.theatersData.push(ele);
                  }
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        console.log(this.theatersData);
      }
    }, {
      key: 'sel',
      value: function sel(theater, timing) {
        this.booking.selectedTheater = theater;
        this.booking.selectedTime = timing;
        this.$location.path('/seat-select');
      }
    }]);

    return DatetimeSelectComponent;
  }();

  angular.module('movieAppApp').component('datetimeSelect', {
    templateUrl: 'app/datetime-select/datetime-select.html',
    controller: DatetimeSelectComponent,
    controllerAs: 'datetimeSelectCtrl'
  });
})();
//# sourceMappingURL=datetime-select.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/datetime-select', {
    template: '<datetime-select></datetime-select>'
    // authenticate: 'user'
  });
});
//# sourceMappingURL=datetime-select.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MainController = function () {
    function MainController($http, $location, Auth, booking) {
      _classCallCheck(this, MainController);

      this.$http = $http;
      this.$location = $location;
      this.movieNames = [];
      this.movieDetails = [];
      this.adminMovieDetails = [];
      this.rating = 0;
      this.count = 0;
      this.avgR = 0;
      this.movie;
      this.cityName;
      this.booking = booking;
      this.currentUser = Auth.getCurrentUser().role;
      this.userName = Auth.getCurrentUser().name;
      this.canRate = true;
      this.rateObj = [];
      this.cnt = 0;
    }

    _createClass(MainController, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        if (!this.currentUser) {
          this.currentUser = 'anon';
        }
        console.log(this.currentUser);
        $("#clickety").click(function () {
          $('html, body').animate({
            scrollTop: $("#search-bar").offset().top
          }, 700);
        });
        if (this.currentUser !== 'admin') {
          $('#myModal').modal();
        };
        this.$http.get('/api/cities').then(function (response) {
          _this.citiesData = response.data;
        });
        this.$http.get('/api/movie-theater-endpoints').then(function (response) {
          _this.boundData = response.data;
          _this.$http.get('/api/movie-endpoints').then(function (response) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = _this.boundData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var ele = _step.value;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                  for (var _iterator2 = response.data[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var elem = _step2.value;

                    if (elem.title === ele.movie && !_this.adminMovieDetails.includes(elem)) {
                      _this.adminMovieDetails.push(elem);
                    }
                  }
                } catch (err) {
                  _didIteratorError2 = true;
                  _iteratorError2 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                      _iterator2.return();
                    }
                  } finally {
                    if (_didIteratorError2) {
                      throw _iteratorError2;
                    }
                  }
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          });
        });
      }
    }, {
      key: 'getMovieDet',
      value: function getMovieDet(movie) {
        $('#movieModal').modal();
        console.log("vds");
        this.selMov = _.findWhere(this.movieDetails, { title: movie });
      }
    }, {
      key: 'rate',
      value: function rate(movie) {
        if (this.cnt === 0) {
          this.cnt++;
          this.$rateYo = $("#rateYo").rateYo();
        } else {
          var movieData = _.findWhere(this.movieDetails, { title: movie });
          this.canRate = false;
          this.cnt = 0;
          this.rating += this.$rateYo.rateYo("rating");
          this.count++;
          this.avgR = this.rating / this.count;
          this.rateObj.push({
            userName: this.userName,
            hasRated: true
          });
          if (this.rateObj.length) {
            this.$http.put('/api/movie-endpoints/' + movieData._id, {
              avgRating: this.avgR,
              rating: this.rateObj
            });
          }
        }
      }
    }, {
      key: 'selCity',
      value: function selCity() {
        $('#myModal').modal('hide');
        console.log(this.boundData);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.boundData[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var ele = _step3.value;

            if (ele.city === this.cityName) {
              var _iteratorNormalCompletion4 = true;
              var _didIteratorError4 = false;
              var _iteratorError4 = undefined;

              try {
                for (var _iterator4 = this.adminMovieDetails[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                  var elem = _step4.value;

                  if (elem.title === ele.movie && !this.movieDetails.includes(elem)) {
                    this.movieDetails.push(elem);
                  }
                }
              } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                  }
                } finally {
                  if (_didIteratorError4) {
                    throw _iteratorError4;
                  }
                }
              }
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }
      }
    }, {
      key: 'sel',
      value: function sel(movie, poster) {
        this.booking.selectedMovie = movie;
        this.booking.selectedPoster = poster;
        this.$location.path('/datetime-select');
      }
    }]);

    return MainController;
  }();

  angular.module('movieAppApp').component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController,
    controllerAs: 'mainCtrl'
  });
})();
//# sourceMappingURL=main.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/', {
    template: '<main></main>'
  });
});
//# sourceMappingURL=main.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MovieTheaterComponent = function () {
    function MovieTheaterComponent($http, $scope, socket) {
      _classCallCheck(this, MovieTheaterComponent);

      this.$http = $http;
      this.socket = socket;
      this.movieName;
      this.cityName;
      this.theaterName;
      this.dates;
      this.times;
      this.theatersList = [];
      this.ogDatesList = [];
      this.datesList = [];
      this.timesList = [];

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('movieEndpoint');
        socket.unsyncUpdates('city');
        socket.unsyncUpdates('movieTheaterEndpoint');
      });
    }

    _createClass(MovieTheaterComponent, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/movie-endpoints').then(function (response) {
          _this.moviesData = response.data;
          _this.socket.syncUpdates('movieEndpoint', _this.moviesData);
        });
        this.$http.get('/api/cities').then(function (response) {
          _this.citiesData = response.data;
          _this.socket.syncUpdates('city', _this.citiesData);
        });
        this.$http.get('/api/movie-theater-endpoints').then(function (response) {
          _this.boundData = response.data;
          _this.socket.syncUpdates('movieTheaterEndpoint', _this.boundData);
        });
      }
    }, {
      key: 'getTheaters',
      value: function getTheaters() {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.citiesData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var city = _step.value;

            if (city.name === this.cityName) {
              this.theatersList = city.theater;
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: 'getTheaterDetails',
      value: function getTheaterDetails(theaterName) {
        console.log(theaterName);
        this.theaterName = theaterName;
        this.datesList = [];
        this.timesList = [];
        function addZero(i) {
          if (i < 10) {
            i = "0" + i;
          }return i;
        }
        if (this.boundData.length) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = this.boundData[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var ele = _step2.value;

              if (ele.city === this.cityName && ele.movie === this.movieName && ele.theater === theaterName) {
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                  for (var _iterator3 = ele.dates[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var dateEle = _step3.value;

                    var d = addZero(new Date(dateEle).getDate());
                    var m = addZero(new Date(dateEle).getMonth() + 1);
                    var y = new Date(dateEle).getFullYear();
                    var fullDate = d + "." + m + "." + y;
                    this.datesList.push(fullDate);
                  }
                  // this.datesList.push(...ele.dates);
                } catch (err) {
                  _didIteratorError3 = true;
                  _iteratorError3 = err;
                } finally {
                  try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                      _iterator3.return();
                    }
                  } finally {
                    if (_didIteratorError3) {
                      throw _iteratorError3;
                    }
                  }
                }

                this.timesList = ele.times;
                console.log(this.datesList);
                console.log(this.timesList);
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }
    }, {
      key: 'addDate',
      value: function addDate() {
        function addZero(i) {
          if (i < 10) {
            i = "0" + i;
          }return i;
        }
        var d = addZero(new Date(this.date).getDate());
        var m = addZero(new Date(this.date).getMonth() + 1);
        var y = new Date(this.date).getFullYear();
        var fullDate = d + "." + m + "." + y;
        this.datesList.push(fullDate);
        this.ogDatesList.push(this.date);
      }
    }, {
      key: 'deleteDate',
      value: function deleteDate(date) {
        var pos = this.datesList.indexOf(date);
        this.datesList.splice(pos, 1);
      }
    }, {
      key: 'addTime',
      value: function addTime() {
        function addZero(i) {
          if (i < 10) {
            i = "0" + i;
          }return i;
        }
        var hour = addZero(new Date(this.time).getHours());
        var min = addZero(new Date(this.time).getMinutes());
        var time = hour + ":" + min;
        this.timesList.push(time);
        this.time = '';
      }
    }, {
      key: 'deleteTime',
      value: function deleteTime(time) {
        var pos = this.timesList.indexOf(time);
        this.timesList.splice(pos, 1);
      }
    }, {
      key: 'saveDetails',
      value: function saveDetails() {
        if (this.boundData.length) {
          var _iteratorNormalCompletion4 = true;
          var _didIteratorError4 = false;
          var _iteratorError4 = undefined;

          try {
            for (var _iterator4 = this.boundData[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
              var ele = _step4.value;

              if (ele.city === this.cityName && ele.movie === this.movieName && ele.theater === this.theaterName) {
                console.log("adding date and time");
                return this.$http.put('/api/movie-theater-endpoints/' + ele._id, {
                  dates: this.ogDatesList,
                  times: this.timesList
                });
              } else if (ele.city !== this.cityName || ele.movie !== this.movieName || ele.theater !== this.theaterName) {
                console.log("new mapping");
                return this.$http.post('/api/movie-theater-endpoints', {
                  city: this.cityName,
                  movie: this.movieName,
                  theater: this.theaterName,
                  dates: this.ogDatesList,
                  times: this.timesList
                });
              }
            }
          } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
              }
            } finally {
              if (_didIteratorError4) {
                throw _iteratorError4;
              }
            }
          }
        } else {
          console.log("posting for the first time");
          this.$http.post('/api/movie-theater-endpoints', {
            city: this.cityName,
            movie: this.movieName,
            theater: this.theaterName,
            dates: this.ogDatesList,
            times: this.timesList
          });
        }
        this.datesList = [];
        this.movieName = '';
        this.cityName = '';
        this.theatersList = [];
        console.log("defw");
      }
    }, {
      key: 'deleteMapping',
      value: function deleteMapping(theaterName) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.boundData[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var ele = _step5.value;

            if (ele.city === this.cityName && ele.movie === this.movieName && ele.theater === theaterName) {
              if (confirm(this.movieName + " is mapped to " + theaterName + ". Are you sure you want to remove it?") === true) {
                this.$http.delete('/api/movie-theater-endpoints/' + ele._id);
              }
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }
      }
    }]);

    return MovieTheaterComponent;
  }();

  angular.module('movieAppApp').filter('cropFilt', function () {
    return function (x) {
      var i,
          txt = "";
      for (i = 0; i < x.length; i++) {
        if (x[i] !== " ") {
          txt += x[i];
        } else if (x[i] === " ") {
          return txt;
        }
      }
    };
  });
  angular.module('movieAppApp').component('movieTheater', {
    templateUrl: 'app/movie-theater/movie-theater.html',
    controller: MovieTheaterComponent,
    controllerAs: 'movieTheaterCtrl'
  });
})();
//# sourceMappingURL=movie-theater.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/movie-theater', {
    template: '<movie-theater></movie-theater>'
    // authenticate: 'admin'
  });
});
//# sourceMappingURL=movie-theater.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var MovieComponent = function () {
    function MovieComponent($http, $scope, socket) {
      _classCallCheck(this, MovieComponent);

      this.$http = $http;
      this.socket = socket;
      this.moviesData = [];
      this.newMovie = [];
      this.movieInput = false;

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('movie');
      });
    }

    _createClass(MovieComponent, [{
      key: '$onInit',
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/movie-endpoints').then(function (response) {
          _this.moviesData = response.data;
          _this.socket.syncUpdates('movieEndpoint', _this.moviesData);
        });
      }
    }, {
      key: 'addMovie',
      value: function addMovie() {
        this.$http.post('/api/movie-endpoints', {
          title: this.newMovieInfo.title,
          genre: this.genre,
          date: this.newMovieInfo.release_date,
          poster: this.poster,
          plot: this.newMovieInfo.overview,
          actors: _.pluck(this.newMovieCredits.cast, 'name'),
          directors: _.pluck(_.filter(this.newMovieCredits.crew, function (member) {
            return member.job === "Director";
          }), 'name'),
          producers: _.pluck(_.filter(this.newMovieCredits.crew, function (member) {
            return member.job === "Producer";
          }), 'name'),
          language: this.language,
          runtime: this.newMovieInfo.runtime + " mins"
        });
        this.movieInput = false;
      }
    }, {
      key: 'deleteMovie',
      value: function deleteMovie(movie) {
        this.$http.delete('/api/movie-endpoints/' + movie._id);
      }
    }, {
      key: 'searchMovie',
      value: function searchMovie(title) {
        var _this2 = this;

        this.$http.get('https://api.themoviedb.org/3/search/movie?api_key=44bbe2a64fc1333b71c7aedd8d04ad28&query=' + title).then(function (response) {
          _this2.newMovieId = response.data.results[0].id;
          console.log(response.data.results[0]);
          _this2.$http.get('https://api.themoviedb.org/3/movie/' + _this2.newMovieId + '?api_key=44bbe2a64fc1333b71c7aedd8d04ad28').then(function (response) {
            _this2.newMovieInfo = response.data;
            console.log(_this2.newMovieInfo);
            _this2.poster = 'http://image.tmdb.org/t/p/w185' + _this2.newMovieInfo.poster_path;
          });
          _this2.$http.get('https://api.themoviedb.org/3/movie/' + _this2.newMovieId + '/credits?api_key=44bbe2a64fc1333b71c7aedd8d04ad28').then(function (response) {
            _this2.newMovieCredits = response.data;
            console.log(_this2.newMovieCredits);
            _this2.genre = _.pluck(_this2.newMovieInfo.genres, 'name').join(", ");
            _this2.language = _.pluck(_this2.newMovieInfo.spoken_languages, 'name').join(", ");
          });
          if (_this2.newMovieInfo) {
            _this2.title = '';
            _this2.movieInput = true;
            document.getElementById("searchButton").value = "";
          }
        });
      }
    }]);

    return MovieComponent;
  }();

  angular.module('movieAppApp').component('movie', {
    templateUrl: 'app/movie/movie.html',
    controller: MovieComponent,
    controllerAs: 'movieCtrl'
  });
})();
//# sourceMappingURL=movie.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/movie', {
    template: '<movie></movie>'
    // authenticate: 'admin'
  });
});
//# sourceMappingURL=movie.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var PaymentComponent = function () {
    function PaymentComponent($http, $location, booking, Auth) {
      _classCallCheck(this, PaymentComponent);

      this.$http = $http;
      this.booking = booking;
      this.$location = $location;
      this.currentUser = Auth.getCurrentUser().name;
    }

    _createClass(PaymentComponent, [{
      key: '$onInit',
      value: function $onInit() {
        this.selectedTheater = this.booking.selectedTheater;
        this.selectedMovie = this.booking.selectedMovie;
        this.selectedDate = this.booking.selectedDate;
        this.selectedTime = this.booking.selectedTime;
        this.selectedClass = this.booking.selectedClass;
        this.selectedSeats = this.booking.selectedSeats;
        this.price = this.booking.price;
        this.totPrice = this.booking.totPrice;
      }
    }, {
      key: 'toggle',
      value: function toggle(paymentType) {
        if (paymentType == 'credit') {
          this.credit = true;
          this.cash = false;
          this.gv = false;
        } else if (paymentType == 'cash') {
          this.cash = true;
          this.credit = false;
          this.gv = false;
        } else if (paymentType == 'gv') {
          this.gv = true;
          this.cash = false;
          this.credit = false;
        }
      }
    }, {
      key: 'submit',
      value: function submit() {
        this.$http.post('/api/payment-endpoints', {
          userName: this.currentUser,
          movieName: this.selectedMovie,
          theaterName: this.selectedTheater,
          classType: this.selectedClass,
          seatNos: this.selectedSeats,
          date: this.selectedDate,
          time: this.selectedTime
        });
        this.$location.path('/receipt');
      }
    }]);

    return PaymentComponent;
  }();

  angular.module('movieAppApp').component('payment', {
    templateUrl: 'app/payment/payment.html',
    controller: PaymentComponent,
    controllerAs: 'paymentCtrl'
  });
})();
//# sourceMappingURL=payment.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/payment', {
    template: '<payment></payment>'
    // authenticate: 'user'
  });
});
//# sourceMappingURL=payment.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var ReceiptComponent = function () {
    function ReceiptComponent($http, booking) {
      _classCallCheck(this, ReceiptComponent);

      this.$http = $http;
      this.booking = booking;
    }

    _createClass(ReceiptComponent, [{
      key: '$onInit',
      value: function $onInit() {
        this.selectedPoster = this.booking.selectedPoster;
        this.selectedTheater = this.booking.selectedTheater;
        this.selectedMovie = this.booking.selectedMovie;
        this.selectedDate = this.booking.selectedDate;
        this.selectedTime = this.booking.selectedTime;
        this.selectedClass = this.booking.selectedClass;
        this.selectedSeats = this.booking.selectedSeats;
        this.price = this.booking.price;
        this.totPrice = this.booking.totPrice;
      }
    }]);

    return ReceiptComponent;
  }();

  angular.module('movieAppApp').component('receipt', {
    templateUrl: 'app/receipt/receipt.html',
    controller: ReceiptComponent,
    controllerAs: 'receiptCtrl'
  });
})();
//# sourceMappingURL=receipt.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/receipt', {
    template: '<receipt></receipt>'
    // authenticate: 'user'
  });
});
//# sourceMappingURL=receipt.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var SeatSelectComponent = function () {
    _createClass(SeatSelectComponent, [{
      key: "generateArray",
      value: function generateArray(n) {
        var ar = [];
        for (var i = 1; i <= n; i++) {
          ar.push(i);
        }
        return ar;
      }
    }]);

    function SeatSelectComponent($http, $location, booking) {
      _classCallCheck(this, SeatSelectComponent);

      this.totSeats = 1;
      this.count = 0;
      this.clicked = false;
      this.selectedSeats = [];
      this.classType = ["PREMIUM [RS.300]", "GOLD [Rs.210]", "SILVER [Rs.180]"];
      this.selectedClass;
      this.booking = booking;
      this.$http = $http;
      this.$location = $location;
      this.bookedSeats = [];
      this.seatNos = [];
    }

    _createClass(SeatSelectComponent, [{
      key: "$onInit",
      value: function $onInit() {
        var _this = this;

        $('#myModal').modal();
        this.$http.get('/api/payment-endpoints').then(function (response) {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = response.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var ele = _step.value;
              var _iteratorNormalCompletion2 = true;
              var _didIteratorError2 = false;
              var _iteratorError2 = undefined;

              try {
                for (var _iterator2 = ele.seatNos[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                  var seat = _step2.value;

                  _this.bookedSeats.push(seat);
                }
              } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                  }
                } finally {
                  if (_didIteratorError2) {
                    throw _iteratorError2;
                  }
                }
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        });
        this.selectedTheater = this.booking.selectedTheater;
        this.selectedMovie = this.booking.selectedMovie;
        this.selectedDate = this.booking.selectedDate;
        this.selectedTime = this.booking.selectedTime;
      }
    }, {
      key: "onClick",
      value: function onClick(e) {
        console.log(this.count);
        var singlePrice = parseInt($(e.target).attr('data-classType').slice(-4, -1));
        if (this.count == 0) {
          this.showPrice = false;
        }
        /*    if selected   */
        if ($(e.target).hasClass('selected-cell')) {
          this.count--;
          if (this.count == 0) {
            this.showPrice = false;
          }
          this.price = singlePrice / this.count;
          this.totPrice = this.price + 4 + 15;
          this.seatNos = this.seatNos.filter(function (no) {
            var row = parseInt(no.substr(0, 1).charCodeAt(0) - 65);
            var col = parseInt(no.substr(1));
            return row != $(e.target).attr('data-row') || col != $(e.target).attr('data-col');
          });
          this.selectedSeats = this.selectedSeats.filter(function (seat) {
            return seat.row != $(e.target).attr('data-row') || seat.col != $(e.target).attr('data-col');
          });
        }
        /*    if unselected   */
        else {
            /*    if class mismatch   */
            if (this.selectedSeats.length) {
              var _iteratorNormalCompletion3 = true;
              var _didIteratorError3 = false;
              var _iteratorError3 = undefined;

              try {
                for (var _iterator3 = this.selectedSeats[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                  var ele = _step3.value;

                  if (ele.classType !== $(e.target).attr('data-classType')) {
                    this.selectedSeats = [];
                    this.seatNos = [];
                    this.count = 0;
                    console.log(this.count);
                  }
                }
              } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
              } finally {
                try {
                  if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                  }
                } finally {
                  if (_didIteratorError3) {
                    throw _iteratorError3;
                  }
                }
              }
            }
            /*    to select   */
            if (this.count < this.totSeats) {
              this.selectedSeats.push({
                row: $(e.target).attr('data-row'),
                col: $(e.target).attr('data-col'),
                classType: $(e.target).attr('data-classType')
              });
              this.count++;
              console.log(this.count);
              this.showPrice = true;
              this.selectedClass = $(e.target).attr('data-classType').slice(0, -9).concat(" CLASS");
              this.price = singlePrice * this.count;
              this.totPrice = this.price + 4 + 15;
              this.seatNos.push(String.fromCharCode(64 + parseInt($(e.target).attr('data-row'))) + $(e.target).attr('data-col'));
            }
            /*    if selecting more that count   */
            else {
                window.alert("Can't select more seats. Please increase the number of tickets needed.");
              }
            console.log(this.selectedSeats);
          }
      }
    }, {
      key: "isSelected",
      value: function isSelected(r, c) {
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
          for (var _iterator4 = this.selectedSeats[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var ele = _step4.value;

            if (ele.row == r && ele.col == c) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        return false;
      }
    }, {
      key: "isBooked",
      value: function isBooked(r, c) {
        var _iteratorNormalCompletion5 = true;
        var _didIteratorError5 = false;
        var _iteratorError5 = undefined;

        try {
          for (var _iterator5 = this.bookedSeats[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var ele = _step5.value;

            var row = ele.substr(0, 1).charCodeAt(0) - 64;
            var col = parseInt(ele.substr(1));
            if (r === row && c === col) {
              return true;
            }
          }
        } catch (err) {
          _didIteratorError5 = true;
          _iteratorError5 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion5 && _iterator5.return) {
              _iterator5.return();
            }
          } finally {
            if (_didIteratorError5) {
              throw _iteratorError5;
            }
          }
        }

        return false;
      }
    }, {
      key: "getTotSeats",
      value: function getTotSeats(totSeats) {
        this.totSeats = totSeats;
        console.log(this.totSeats);
        $('#myModal').modal('hide');
      }
    }, {
      key: "submit",
      value: function submit() {
        this.booking.selectedClass = this.selectedClass;
        this.booking.selectedSeats = this.seatNos;
        this.booking.totPrice = this.totPrice;
        this.booking.price = this.price;
        this.$location.path('/payment');
      }
    }]);

    return SeatSelectComponent;
  }();

  angular.module('movieAppApp').component('seatSelect', {
    templateUrl: 'app/seat-select/seat-select.html',
    controller: SeatSelectComponent,
    controllerAs: 'seatSelectCtrl'
  });
})();
//# sourceMappingURL=seat-select.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/seat-select', {
    template: '<seat-select></seat-select>'
    // authenticate: 'user'
  });
});
//# sourceMappingURL=seat-select.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function () {
  var TheaterComponent = function () {
    function TheaterComponent($http, $scope, socket) {
      _classCallCheck(this, TheaterComponent);

      this.$http = $http;
      this.socket = socket;
      this.theatersData = [];
      this.newTheater = [];
      this.cityName = "Choose a city";
      this.findCity = "Choose a city";
      this.citiesData = [];
      this.viewMovie = false;

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('theaterEndpoint');
        socket.unsyncUpdates('city');
      });
    }

    _createClass(TheaterComponent, [{
      key: "$onInit",
      value: function $onInit() {
        var _this = this;

        this.$http.get('/api/theater-endpoints').then(function (response) {
          _this.theatersData = response.data;
          _this.socket.syncUpdates('theaterEndpoint', _this.theatersData);
        });
        this.$http.get('/api/cities').then(function (response) {
          _this.citiesData = response.data;
          _this.socket.syncUpdates('city', _this.citiesData);
        });
      }
    }, {
      key: "addCity",
      value: function addCity() {
        var city = prompt("Enter a new city");
        if (city.length) {
          this.$http.post('/api/cities', {
            name: city
          });
        }
      }
    }, {
      key: "removeCity",
      value: function removeCity() {
        var city = prompt("Enter city to remove");
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.citiesData[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var ele = _step.value;

            if (ele.name === city) {
              this.$http.delete('/api/cities/' + ele._id);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    }, {
      key: "addTheater",
      value: function addTheater() {

        /* to citiesdetails collection */
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this.citiesData[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var city = _step2.value;

            if (city.name === this.cityName) {
              this.selectedCity = city;
              this.theatersList = city.theater;
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }

        this.$http.put('/api/cities/' + this.selectedCity._id, {
          $push: {
            theater: this.newTheater.name
          }
        });

        /* to theaterdetails collection */
        this.$http.post('/api/theater-endpoints/', {
          name: this.newTheater.name,
          location: this.newTheater.location
        });

        this.newTheater = '';
        this.cityName = '';
        this.findCity = '';
        this.viewMovie = false;
      }
    }, {
      key: "getTheaters",
      value: function getTheaters() {
        console.log(this.citiesData);
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = this.citiesData[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var city = _step3.value;

            if (city.name === this.findCity) {
              this.theatersList = city.theater;
            }
          }
        } catch (err) {
          _didIteratorError3 = true;
          _iteratorError3 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
              _iterator3.return();
            }
          } finally {
            if (_didIteratorError3) {
              throw _iteratorError3;
            }
          }
        }

        this.viewMovie = true;
      }
    }, {
      key: "deleteTheater",
      value: function deleteTheater(theaterToDel) {
        var _this2 = this;

        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {

          for (var _iterator4 = this.citiesData[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var city = _step4.value;

            if (city.name === this.findCity) {
              var cityId = city._id;
            }
          }
        } catch (err) {
          _didIteratorError4 = true;
          _iteratorError4 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
              _iterator4.return();
            }
          } finally {
            if (_didIteratorError4) {
              throw _iteratorError4;
            }
          }
        }

        this.$http.put('/api/cities/' + cityId, {
          name: this.findCity,
          theater: this.theatersList.filter(function (theater) {
            return theater !== theaterToDel;
          })
        }).then(function (response) {
          console.log(_this2.citiesData);
          var _iteratorNormalCompletion5 = true;
          var _didIteratorError5 = false;
          var _iteratorError5 = undefined;

          try {
            for (var _iterator5 = _this2.citiesData[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
              var city = _step5.value;

              if (city.name === _this2.findCity) {
                _this2.theatersList = city.theater;
              }
            }
          } catch (err) {
            _didIteratorError5 = true;
            _iteratorError5 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion5 && _iterator5.return) {
                _iterator5.return();
              }
            } finally {
              if (_didIteratorError5) {
                throw _iteratorError5;
              }
            }
          }
        });
      }
    }, {
      key: "updateTheater",
      value: function updateTheater(theater) {
        var location = prompt("change location in " + theater.city);
        this.$http.put('/api/theater-endpoints/' + theater._id, {
          location: location
        });
      }
    }]);

    return TheaterComponent;
  }();

  angular.module('movieAppApp').component('theater', {
    templateUrl: 'app/theater/theater.html',
    controller: TheaterComponent,
    controllerAs: 'theaterCtrl',
    authenticate: 'admin'
  });
})();
//# sourceMappingURL=theater.controller.js.map

'use strict';

angular.module('movieAppApp').config(function ($routeProvider) {
  $routeProvider.when('/theater', {
    template: '<theater></theater>'
    // authenticate: 'admin'
  });
});
//# sourceMappingURL=theater.js.map

'use strict';

(function () {

  function AuthService($location, $http, $cookies, $q, appConfig, Util, User, booking) {
    var safeCb = Util.safeCb;
    var currentUser = {};
    var userRoles = appConfig.userRoles || [];

    if ($cookies.get('token') && $location.path() !== '/logout') {
      currentUser = User.get();
      booking.userRole = currentUser;
    }

    var Auth = {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      login: function login(_ref, callback) {
        var email = _ref.email,
            password = _ref.password;

        return $http.post('/auth/local', {
          email: email,
          password: password
        }).then(function (res) {
          $cookies.put('token', res.data.token);
          currentUser = User.get();
          return currentUser.$promise;
        }).then(function (user) {
          safeCb(callback)(null, user);
          return user;
        }).catch(function (err) {
          Auth.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        });
      },


      /**
       * Delete access token and user info
       */
      logout: function logout() {
        $cookies.remove('token');
        currentUser = {};
      },


      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional, function(error, user)
       * @return {Promise}
       */
      createUser: function createUser(user, callback) {
        return User.save(user, function (data) {
          $cookies.put('token', data.token);
          currentUser = User.get();
          return safeCb(callback)(null, user);
        }, function (err) {
          Auth.logout();
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional, function(error, user)
       * @return {Promise}
       */
      changePassword: function changePassword(oldPassword, newPassword, callback) {
        return User.changePassword({
          id: currentUser._id
        }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function () {
          return safeCb(callback)(null);
        }, function (err) {
          return safeCb(callback)(err);
        }).$promise;
      },


      /**
       * Gets all available info on a user
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, funciton(user)
       * @return {Object|Promise}
       */
      getCurrentUser: function getCurrentUser(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = currentUser.hasOwnProperty('$promise') ? currentUser.$promise : currentUser;
        return $q.when(value).then(function (user) {
          safeCb(callback)(user);
          return user;
        }, function () {
          safeCb(callback)({});
          return {};
        });
      },


      /**
       * Check if a user is logged in
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isLoggedIn: function isLoggedIn(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var is = user.hasOwnProperty('role');
          safeCb(callback)(is);
          return is;
        });
      },


      /**
       * Check if a user has a specified role or higher
       *   (synchronous|asynchronous)
       *
       * @param  {String}     role     - the role to check against
       * @param  {Function|*} callback - optional, function(has)
       * @return {Bool|Promise}
       */
      hasRole: function hasRole(role, callback) {
        var hasRole = function hasRole(r, h) {
          return userRoles.indexOf(r) >= userRoles.indexOf(h);
        };

        if (arguments.length < 2) {
          return hasRole(currentUser.role, role);
        }

        return Auth.getCurrentUser(null).then(function (user) {
          var has = user.hasOwnProperty('role') ? hasRole(user.role, role) : false;
          safeCb(callback)(has);
          return has;
        });
      },


      /**
       * Check if a user is an admin
       *   (synchronous|asynchronous)
       *
       * @param  {Function|*} callback - optional, function(is)
       * @return {Bool|Promise}
       */
      isAdmin: function isAdmin() {
        return Auth.hasRole.apply(Auth, [].concat.apply(['admin'], arguments));
      },


      /**
       * Get auth token
       *
       * @return {String} - a token string used for authenticating
       */
      getToken: function getToken() {
        return $cookies.get('token');
      }
    };

    return Auth;
  }

  angular.module('movieAppApp.auth').factory('Auth', AuthService);
})();
//# sourceMappingURL=auth.service.js.map

'use strict';

(function () {

  function authInterceptor($rootScope, $q, $cookies, $location, Util) {
    return {
      // Add authorization token to headers
      request: function request(config) {
        config.headers = config.headers || {};
        if ($cookies.get('token') && Util.isSameOrigin(config.url)) {
          config.headers.Authorization = 'Bearer ' + $cookies.get('token');
        }
        return config;
      },


      // Intercept 401s and redirect you to login
      responseError: function responseError(response) {
        if (response.status === 401) {
          $location.path('/login');
          // remove any stale tokens
          $cookies.remove('token');
        }
        return $q.reject(response);
      }
    };
  }

  angular.module('movieAppApp.auth').factory('authInterceptor', authInterceptor);
})();
//# sourceMappingURL=interceptor.service.js.map

'use strict';

(function () {

  angular.module('movieAppApp.auth').run(function ($rootScope, $location, Auth) {
    // Redirect to login if route requires auth and the user is not logged in, or doesn't have required role
    $rootScope.$on('$routeChangeStart', function (event, next) {
      if (!next.authenticate) {
        return;
      }

      if (typeof next.authenticate === 'string') {
        Auth.hasRole(next.authenticate, _.noop).then(function (has) {
          if (has) {
            return;
          }

          event.preventDefault();
          return Auth.isLoggedIn(_.noop).then(function (is) {
            $location.path(is ? '/' : '/login');
          });
        });
      } else {
        Auth.isLoggedIn(_.noop).then(function (is) {
          if (is) {
            return;
          }

          event.preventDefault();
          $location.path('/');
        });
      }
    });
  });
})();
//# sourceMappingURL=router.decorator.js.map

'use strict';

(function () {

  function UserResource($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      }
    });
  }

  angular.module('movieAppApp.auth').factory('User', UserResource);
})();
//# sourceMappingURL=user.service.js.map

'use strict';

angular.module('movieAppApp').directive('footer', function () {
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    link: function link(scope, element) {
      element.addClass('footer');
    }
  };
});
//# sourceMappingURL=footer.directive.js.map

'use strict';

/**
 * Removes server error when user updates input
 */

angular.module('movieAppApp').directive('mongooseError', function () {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function link(scope, element, attrs, ngModel) {
      element.on('keydown', function () {
        return ngModel.$setValidity('mongoose', true);
      });
    }
  };
});
//# sourceMappingURL=mongoose-error.directive.js.map

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NavbarController = function () {
  //end-non-standard

  function NavbarController($location, Auth, booking) {
    _classCallCheck(this, NavbarController);

    this.isCollapsed = true;

    this.$location = $location;
    this.isLoggedIn = Auth.isLoggedIn;
    this.isAdmin = Auth.isAdmin;
    this.hasRole = Auth.hasRole;
    this.getCurrentUser = Auth.getCurrentUser;
  }
  //start-non-standard

  _createClass(NavbarController, [{
    key: 'isActive',
    value: function isActive(route) {
      return route === this.$location.path();
    }
  }]);

  return NavbarController;
}();

angular.module('movieAppApp').controller('NavbarController', NavbarController);
//# sourceMappingURL=navbar.controller.js.map

'use strict';

angular.module('movieAppApp').directive('navbar', function () {
  return {
    templateUrl: 'components/navbar/navbar.html',
    restrict: 'E',
    controller: 'NavbarController',
    controllerAs: 'nav'
  };
});
//# sourceMappingURL=navbar.directive.js.map

/* global io */
'use strict';

angular.module('movieAppApp').factory('socket', function (socketFactory) {
  // socket.io now auto-configures its connection when we ommit a connection url
  var ioSocket = io('', {
    // Send auth token on connection, you will need to DI the Auth service above
    // 'query': 'token=' + Auth.getToken()
    path: '/socket.io-client'
  });

  var socket = socketFactory({
    ioSocket: ioSocket
  });

  return {
    socket: socket,

    /**
     * Register listeners to sync an array with updates on a model
     *
     * Takes the array we want to sync, the model name that socket updates are sent from,
     * and an optional callback function after new items are updated.
     *
     * @param {String} modelName
     * @param {Array} array
     * @param {Function} cb
     */
    syncUpdates: function syncUpdates(modelName, array, cb) {
      cb = cb || angular.noop;

      /**
       * Syncs item creation/updates on 'model:save'
       */
      socket.on(modelName + ':save', function (item) {
        var oldItem = _.find(array, {
          _id: item._id
        });
        var index = array.indexOf(oldItem);
        var event = 'created';

        // replace oldItem if it exists
        // otherwise just add item to the collection
        if (oldItem) {
          array.splice(index, 1, item);
          event = 'updated';
        } else {
          array.push(item);
        }

        cb(event, item, array);
      });

      /**
       * Syncs removed items on 'model:remove'
       */
      socket.on(modelName + ':remove', function (item) {
        var event = 'deleted';
        _.remove(array, {
          _id: item._id
        });
        cb(event, item, array);
      });
    },


    /**
     * Removes listeners for a models updates on the socket
     *
     * @param modelName
     */
    unsyncUpdates: function unsyncUpdates(modelName) {
      socket.removeAllListeners(modelName + ':save');
      socket.removeAllListeners(modelName + ':remove');
    }
  };
});
//# sourceMappingURL=socket.service.js.map

'use strict';

(function () {

  /**
   * The Util service is for thin, globally reusable, utility functions
   */
  function UtilService($window) {
    var Util = {
      /**
       * Return a callback or noop function
       *
       * @param  {Function|*} cb - a 'potential' function
       * @return {Function}
       */
      safeCb: function safeCb(cb) {
        return angular.isFunction(cb) ? cb : angular.noop;
      },


      /**
       * Parse a given url with the use of an anchor element
       *
       * @param  {String} url - the url to parse
       * @return {Object}     - the parsed url, anchor element
       */
      urlParse: function urlParse(url) {
        var a = document.createElement('a');
        a.href = url;

        // Special treatment for IE, see http://stackoverflow.com/a/13405933 for details
        if (a.host === '') {
          a.href = a.href;
        }

        return a;
      },


      /**
       * Test whether or not a given url is same origin
       *
       * @param  {String}           url       - url to test
       * @param  {String|String[]}  [origins] - additional origins to test against
       * @return {Boolean}                    - true if url is same origin
       */
      isSameOrigin: function isSameOrigin(url, origins) {
        url = Util.urlParse(url);
        origins = origins && [].concat(origins) || [];
        origins = origins.map(Util.urlParse);
        origins.push($window.location);
        origins = origins.filter(function (o) {
          var hostnameCheck = url.hostname === o.hostname;
          var protocolCheck = url.protocol === o.protocol;
          // 2nd part of the special treatment for IE fix (see above):  
          // This part is when using well-known ports 80 or 443 with IE,
          // when $window.location.port==='' instead of the real port number.
          // Probably the same cause as this IE bug: https://goo.gl/J9hRta
          var portCheck = url.port === o.port || o.port === '' && (url.port === '80' || url.port === '443');
          return hostnameCheck && protocolCheck && portCheck;
        });
        return origins.length >= 1;
      }
    };

    return Util;
  }

  angular.module('movieAppApp.util').factory('Util', UtilService);
})();
//# sourceMappingURL=util.service.js.map

angular.module("movieAppApp").run(["$templateCache", function($templateCache) {$templateCache.put("components/footer/footer.html","<div class=\"container\">\n  <p>Angular Fullstack v3.7.6 |\n    <a href=\"https://twitter.com/tyhenkel\">@tyhenkel</a> |\n    <a href=\"https://github.com/DaftMonk/generator-angular-fullstack/issues?state=open\">Issues</a>\n  </p>\n</div>\n");
$templateCache.put("components/navbar/navbar.html","<div class=\"navbar navbar-inverse\" ng-controller=\"NavbarController\" style=\"margin:0;\">\n  <div>\n    <div class=\"navbar-header\">\n      <button class=\"navbar-toggle\" type=\"button\" ng-click=\"nav.isCollapsed = !nav.isCollapsed\">\n        <span class=\"sr-only\">Toggle navigation</span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n      </button>\n      <a href=\"/\" class=\"navbar-brand\"><img src=\"assets/images/lo-5df405a55a.png\" style=\"height:25px; margin:0; padding:0;\"></a>\n    </div>\n    <div uib-collapse=\"nav.isCollapsed\" class=\"navbar-collapse collapse\" id=\"navbar-main\">\n      <ul class=\"nav navbar-nav\">\n       <li><a href=\"/\">HOME</a></li>\n       <li ng-show=\"nav.isAdmin()\"><a href=\"/movie\">MOVIE</a></li>\n       <li ng-show=\"nav.isAdmin()\"><a href=\"/theater\">THEATER</a></li>\n       <li ng-show=\"nav.isAdmin()\"><a href=\"/movie-theater\">MOVIE-THEATER</a></li>\n      </ul>\n\n\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li ng-hide=\"nav.isLoggedIn()\" ng-class=\"{active: nav.isActive(\'/signup\')}\"><a href=\"/signup\">Sign up</a></li>\n        <li ng-hide=\"nav.isLoggedIn()\" ng-class=\"{active: nav.isActive(\'/login\')}\"><a href=\"/login\">Login</a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><p class=\"navbar-text\">Hello {{ nav.getCurrentUser().name }}</p> </li>\n        <li ng-show=\"nav.isLoggedIn()\" ng-class=\"{active: nav.isActive(\'/settings\')}\"><a href=\"/settings\"><span class=\"glyphicon glyphicon-cog\"></span></a></li>\n        <li ng-show=\"nav.isLoggedIn()\"><a href=\"/logout\">Logout</a></li>\n      </ul>\n\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/admin/admin.html","<div class=\"container\">\n  <p>The delete user and user index api routes are restricted to users with the \'admin\' role.</p>\n  <ul class=\"list-group user-list\">\n    <li class=\"list-group-item\" ng-repeat=\"user in admin.users\">\n	    <div class=\"user-info\">\n	        <strong>{{user.name}}</strong><br>\n	        <span class=\"text-muted\">{{user.email}}</span>\n	    </div>\n        <a ng-click=\"admin.delete(user)\" class=\"trash\"><span class=\"fa fa-trash fa-2x\"></span></a>\n    </li>\n  </ul>\n</div>\n");
$templateCache.put("app/datetime-select/datetime-select.html","<div class=\"container\">\n  <ul class=\"nav nav-pills\">\n    <li class=\"hoverClass\" ng-repeat=\"date in datetimeSelectCtrl.newDates\"><a ng-click=\"datetimeSelectCtrl.getTheaterDetails(date)\" data-toggle=\"pill\"><span class=\"glyphicon glyphicon-calendar\"></span>&nbsp;{{date}}</a></li>\n  </ul>\n\n  <table class=\"table\">\n    <tr ng-repeat=\"data in datetimeSelectCtrl.theatersData\">\n      <td><h5><span class=\"glyphicon glyphicon-film\"></span>&nbsp;{{data.theater}}</h5></td>\n      <td class=\"hoverClass\" ng-repeat=\"timing in data.times\"><a class=\"btn btn-default\" ng-click=\"datetimeSelectCtrl.sel(data.theater, timing)\">{{timing}}</a></td>\n    </tr>\n  </table>\n</div>\n");
$templateCache.put("app/main/main.html","<div class=\"home-cont\">\n  <!-- Modal -->\n  <div ng-hide=\"mainCtrl.currentUser === \'admin\'\" class=\"modal fade\" data-backdrop=\"static\" id=\"myModal\" role=\"dialog\">\n    <div class=\"modal-dialog modal-sm\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <h4 class=\"modal-title\">Choose your city</h4>\n        </div>\n        <div class=\"modal-body form-group\">\n          <select class=\"form-control\" ng-model=\"mainCtrl.cityName\">\n            <option ng-repeat=\"city in mainCtrl.citiesData\" value=\"{{city.name}}\">{{city.name}}</option>\n          </select>\n          <button class=\"form-control btn btn-default\" ng-click=\"mainCtrl.selCity()\">Select</button>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div ng-hide=\"mainCtrl.currentUser === \'admin\'\" class=\"carousel-cont\">\n    <div class=\"carousel slide\" id=\"ex-carousel\">\n      <div class=\"carousel-inner\">\n        <div class=\"item\">\n          <img class=\"car-img\" src=\"assets/images/img/collage1-cd37519758.jpg\">\n        </div>\n        <div class=\"item active\">\n          <img class=\"car-img\" src=\"assets/images/img/collage2-d56babfc20.jpg\">\n        </div>\n        <div class=\"item\">\n          <img class=\"car-img\" src=\"assets/images/img/collage3-20e472bda9.jpg\">\n        </div>\n      </div>\n      <a class=\"left carousel-control\" href=\"#ex-carousel\" data-slide=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\"></span></a>\n      <a class=\"right carousel-control\" href=\"#ex-carousel\" data-slide=\"next\"><span class=\"glyphicon glyphicon-chevron-right\"></span></a>\n    </div>\n\n    <div id=\"msg\">\n      <h1>C O M I N G&nbsp;&nbsp;&nbsp;&nbsp;S O O N</h1>\n    </div>\n\n  </div>\n\n\n\n  <div class=\"container\">\n    <button ng-hide=\"mainCtrl.currentUser === \'admin\'\" class=\"btn btn-info\" id=\"clickety\">NOW PLAYING</button>\n\n    <br/><br/>\n\n    <div id=\"search-bar\">\n      <input id=\"search-inp\" class=\"form-control\" placeholder=\"search by movie title\" ng-model=\"mainCtrl.searchString\">\n    </div>\n\n    <br/>\n\n    <div class=\"well well-lg\" id=\"movie-disp\">\n<!--  if anon -->\n      <div ng-show=\"mainCtrl.currentUser === \'anon\'\" class=\"movie-display\" ng-repeat=\"movie in mainCtrl.movieDetails | filter:{title:mainCtrl.searchString}\">\n        <div class=\"cont\">\n          <img class=\"blurImg\" src=\"{{movie.poster}}\">\n          <div class=\"rateCont\">\n            <p>Average Rating = {{mainCtrl.avgR | number:2}}</p>\n          </div>\n        </div>\n        <h6>{{movie.genre}}</h6>\n        <button class=\"btn btn-default\" data-toggle=\"modal\" ng-click=\"mainCtrl.getMovieDet(movie.title)\" style=\"padding:4px;\"><span class=\"glyphicon glyphicon-info-sign\" style=\"font-size:25px;\"></span></button>\n        <a class=\"btn btn-info\" ng-hide=\"mainCtrl.currentUser === \'admin\'\" ng-click=\"mainCtrl.sel(movie.title, movie.poster)\">BOOK NOW</a><br/><br/>\n      </div>\n<!--  if user -->\n      <div ng-show=\"mainCtrl.currentUser === \'user\'\" class=\"movie-display\" ng-repeat=\"movie in mainCtrl.movieDetails | filter:{title:mainCtrl.searchString}\">\n        <div class=\"cont\">\n          <img class=\"blurImg\" src=\"{{movie.poster}}\">\n          <div class=\"rateCont\">\n            <p>Average Rating = {{mainCtrl.avgR | number:2}}</p>\n            <div ng-show=\"mainCtrl.canRate\" id=\"rateYo\">\n\n            </div>\n            <a ng-show=\"mainCtrl.canRate\" class=\"btn btn-info\" id=\"rateBtn\" ng-click=\"mainCtrl.rate(movie.title)\">RATE</a>\n          </div>\n        </div>\n        <h6>{{movie.genre}}</h6>\n        <button class=\"btn btn-default\" data-toggle=\"modal\" ng-click=\"mainCtrl.getMovieDet(movie.title)\" style=\"padding:4px;\"><span class=\"glyphicon glyphicon-info-sign\" style=\"font-size:25px;\"></span></button>\n        <a class=\"btn btn-info\" ng-hide=\"mainCtrl.currentUser === \'admin\'\" ng-click=\"mainCtrl.sel(movie.title, movie.poster)\">BOOK NOW</a><br/><br/>\n      </div>\n<!--  if admin -->\n      <div ng-show=\"mainCtrl.currentUser === \'admin\'\" class=\"movie-display\" ng-repeat=\"movie in mainCtrl.adminMovieDetails | filter:{title:mainCtrl.searchString}\">\n        <div class=\"cont\">\n          <img class=\"img\" src=\"{{movie.poster}}\">\n        </div>\n        <h6>{{movie.genre}}</h6>\n        <button class=\"btn btn-default\" data-toggle=\"modal\" ng-click=\"mainCtrl.getMovieDet(movie.title)\" style=\"padding:4px;\"><span class=\"glyphicon glyphicon-info-sign\" style=\"font-size:25px;\"></span></button>\n      </div>\n\n    </div>\n  </div>\n  <!-- Modal -->\n  <div class=\"modal fade\" id=\"movieModal\">\n    <div class=\"modal-dialog\" role=\"document\">\n      <div class=\"modal-content\">\n        <div class=\"modal-header\">\n          <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-label=\"Close\"><span aria-hidden=\"true\">&times;</span></button>\n          <h4 class=\"modal-title\" id=\"myModalLabel\">{{mainCtrl.selMov.title | uppercase}}</h4>\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Genre = {{mainCtrl.selMov.genre}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Date = {{mainCtrl.selMov.date}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Plot = {{mainCtrl.selMov.plot}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Language = {{mainCtrl.selMov.language}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Runtime = {{mainCtrl.selMov.runtime}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Producers = {{mainCtrl.selMov.producers}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Directors = {{mainCtrl.selMov.directors}}\n        </div>\n        <div class=\"modal-footer\" style=\"text-align:left;\">\n          Average Rating = {{mainCtrl.selMov.avgRating}}\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/movie/movie.html","<div class=\"container-fluid\" id=\"movCont\">\n  <div class=\"table-responsive movTable\">\n    <table class=\"table table-bordered\">\n      <tr id=\"movHead\">\n        <th class=\"text-center col-md-2\">Title</th>\n        <th class=\"text-center col-md-2\">Language</th>\n        <th class=\"text-center col-md-2\">Genre</th>\n        <th class=\"text-center col-md-2\">Runtime</th>\n        <th class=\"text-center col-md-2\">Release Date</th>\n        <th class=\"text-center col-md-2\"></th>\n      </tr>\n\n      <tr ng-repeat=\"movie in movieCtrl.moviesData\">\n        <td class=\"text-center col-md-2\">{{movie.title}}</td>\n        <td class=\"text-center col-md-2\">{{movie.language}}</td>\n        <td class=\"text-center col-md-2\">{{movie.genre}}</td>\n        <td class=\"text-center col-md-2\">{{movie.runtime}}</td>\n        <td class=\"text-center col-md-2\">{{movie.date}}</td>\n        <td class=\"text-center col-md-2\"><button class=\"btn btn-danger\" ng-click=\"movieCtrl.deleteMovie(movie)\"><span class=\"glyphicon glyphicon-trash\"></span></button></td>\n      </tr>\n    </table>\n  </div>\n\n  <div class=\"table-responsive movTable\">\n    <table class=\"table\">\n      <tr ng-show=\"movieCtrl.movieInput\">\n        <td class=\"text-center col-md-2\">{{movieCtrl.newMovieInfo.title}}</td>\n        <td class=\"text-center col-md-2\">{{movieCtrl.language}}</td>\n        <td class=\"text-center col-md-2\">{{movieCtrl.genre}}</td>\n        <td class=\"text-center col-md-2\">{{movieCtrl.newMovieInfo.runtime}} mins</td>\n        <td class=\"text-center col-md-2\">{{movieCtrl.newMovieInfo.release_date}}</td>\n        <td class=\"text-center col-md-2\"><button class=\"btn btn-success\" ng-click=\"movieCtrl.addMovie()\"><span class=\"glyphicon glyphicon-plus\"></button></td>\n      </tr>\n\n      <tr>\n        <td class=\"text-center col-md-2\"></td>\n        <td class=\"text-center col-md-2\"></td>\n        <td class=\"text-center col-md-2\">\n          <form name=\"movForm\">\n            <div class=\"form-group\">\n              <input type=\"text\" placeholder=\"Title\" class=\"form-control\" ng-model=\"movieCtrl.title\" required><br/>\n              <button type=\"submit\" id=\"searchButton\" class=\"btn btn-default\" ng-disabled=\"movForm.$invalid\" ng-click=\"movieCtrl.searchMovie(movieCtrl.title)\">Search</button>\n            </div>\n          </form>\n        </td>\n        <td class=\"text-center col-md-2\"></td>\n        <td class=\"text-center col-md-2\"></td>\n        <td class=\"text-center col-md-2\"></td>\n      </tr>\n    </table>\n  </div>\n\n  </div>\n</div>\n");
$templateCache.put("app/movie-theater/movie-theater.html","<div class=\"tainer\" style=\"margin: 50px 0 0 350px;\">\n  <form class=\"form-horizontal\" style=\"margin-top:30px;\">\n    <div class=\"form-group\">\n      <label class=\"col-sm-3 control-label\">Choose a movie</label>\n      <div class=\"col-sm-3\">\n        <select class=\"form-control\" ng-model=\"movieTheaterCtrl.movieName\">\n          <option ng-repeat=\"movie in movieTheaterCtrl.moviesData\" value=\"{{movie.title}}\">{{movie.title}}</option>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <label class=\"col-sm-3 control-label\">Choose a city</label>\n      <div class=\"col-sm-3\">\n        <select class=\"form-control\" ng-model=\"movieTheaterCtrl.cityName\">\n          <option ng-repeat=\"city in movieTheaterCtrl.citiesData\" value=\"{{city.name}}\">{{city.name}}</option>\n        </select>\n      </div>\n    </div>\n\n    <div class=\"form-group\">\n      <div class=\"col-sm-3\"></div>\n      <div class=\"col-sm-3\">\n        <button class=\"form-control btn btn-default\" ng-click=\"movieTheaterCtrl.getTheaters()\">Select</button>\n      </div>\n    </div>\n  </form>\n\n\n  <div class=\"panel-group\" id=\"accordion\" style=\"width: 600px; margin-left: 100px;\">\n    <div class=\"panel\" ng-repeat=\"theater in movieTheaterCtrl.theatersList\">\n      <div class=\"panel-heading\">\n        <button class=\"btn btn-default\" data-toggle=\"collapse\" data-parent=\"#accordion\" data-target=\"#collapse-{{theater | cropFilt}}\" ng-click=\"movieTheaterCtrl.getTheaterDetails(theater)\">{{theater}}</button>\n        <button class=\"btn btn-danger\" ng-click=\"movieTheaterCtrl.deleteMapping(theater)\">X</button>\n      </div>\n      <div id=\"collapse-{{theater | cropFilt}}\" class=\"panel-collapse collapse\">\n        <div class=\"panel-body col-sm-5\">\n          <p ng-hide=\"movieTheaterCtrl.datesList\">No Dates Available</p>\n          <p class=\"panel-title\" ng-show=\"movieTheaterCtrl.datesList\">Dates</p>\n          <div class=\"well well-sm\" ng-show=\"movieTheaterCtrl.datesList\" ng-repeat=\"date in movieTheaterCtrl.datesList\">\n            <label>{{date}}</label>\n            <button class=\"btn btn-danger\" ng-click=\"movieTheaterCtrl.deleteDate(date)\">-</button>\n          </div>\n          <div class=\"well\">\n            <input class=\"form-control\" type=\"date\" ng-model=\"movieTheaterCtrl.date\">\n            <button class=\"form-control btn btn-default\" ng-click=\"movieTheaterCtrl.addDate()\">+</button>\n          </div>\n        </div>\n        <div class=\"panel-body col-sm-5\">\n          <p ng-hide=\"movieTheaterCtrl.timesList\">No Timings Available</p>\n          <p class=\"panel-title\" ng-show=\"movieTheaterCtrl.timesList\">Timings</p>\n          <div class=\"well well-sm\" ng-show=\"movieTheaterCtrl.timesList\" ng-repeat=\"time in movieTheaterCtrl.timesList\">\n            <label>{{time}}</label>\n            <button class=\"btn btn-danger\" ng-click=\"movieTheaterCtrl.deleteTime(time)\">-</button>\n          </div>\n          <div class=\"well\">\n            <input class=\"form-control\" type=\"time\" ng-model=\"movieTheaterCtrl.time\">\n            <button class=\"form-control btn btn-default\" ng-click=\"movieTheaterCtrl.addTime()\">+</button>\n          </div>\n        </div>\n        <br/><br/><br/>\n        <button type=\"submit\" class=\"btn btn-success col-sm-2\" ng-click=\"movieTheaterCtrl.saveDetails()\">Save</button>\n      </div>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/payment/payment.html","<script type=\"text/ng-template\" id=\"error-messages\">\n  <div ng-message=\"required\">*cannot be blank*</div>\n  <div ng-message=\"email\">*not a valid email*</div>\n  <div ng-message=\"number\">*should be a number*</div>\n  <div ng-message=\"pattern\">*must be a valid phone number*</div>\n  <div ng-message=\"maxlength\">*too long*</div>\n</script>\n\n<div class=\"container\">\n\n  <div class=\"pay-cont-left\">\n\n    <div ng-show=\"paymentCtrl.currentUser=== \'anon\'\" class=\"panel panel-default\">\n      <div class=\"panel-heading\">\n        <span class=\"glyphicon glyphicon-chevron-down\"></span>\n        <h3 style=\"display:inline;\" class=\"panel-title\">Contact Details</h3>\n      </div>\n      <div class=\"panel-body\">\n        <div class=\"row\" style=\"margin:30px;\">\n          <div class=\"col-md-4\">\n            <input type=\"email\" placeholder=\"Email\" class=\"form-control\" required/>\n          </div>\n\n          <div class=\"col-md-4\">\n            <input type=\"text\" placeholder=\"Phone Number\" minlength=10 maxlength=10 class=\"form-control\" required/>\n          </div>\n\n          <div class=\"col-md-4\">\n            <button class=\"btn btn-contact\" type=\"submit\">CONTINUE</button>\n          </div>\n        </div>\n      </div>\n    </div>\n\n    <div class=\"panel panel-default pay-panel\">\n      <div class=\"panel-heading\">\n        <span class=\"glyphicon glyphicon-chevron-down\"></span>\n        <h3 style=\"display:inline;\" class=\"panel-title\">Payment Information</h3>\n      </div>\n      <div class=\"panel-body\">\n        <div class=\"panel-left list-group\">\n          <a class=\"list-group-item selected\" ng-click=\"paymentCtrl.toggle(\'credit\')\">Credit/Debit</a>\n          <a class=\"list-group-item\" ng-click=\"paymentCtrl.toggle(\'cash\')\">Cash</a>\n          <a class=\"list-group-item\"ng-click=\"paymentCtrl.toggle(\'gv\')\">Gift Voucher</a>\n        </div>\n        <div class=\"panel-right\">\n          <div ng-show=\"paymentCtrl.credit\">\n            Enter your card details\n            <div class=\"card-det\">\n              <input style=\"width:320px; margin:20px 5px;\" class=\"card-inp form-control\" type=\"text\" minlength=12 maxlength=12 placeholder=\"Credit card number\"/>\n              <input style=\"width:320px; margin:20px 5px;\" class=\"card-inp form-control\" type=\"text\" placeholder=\"Name on the card\"/>\n              Expiry\n              <input style=\"width:50px; margin:1px; display:inline;\" class=\"card-inp form-control\" type=\"text\" minlength=2 maxlength=2 placeholder=\"MM\"/>\n              <input style=\"width:50px; margin:1px; display:inline;\" class=\"card-inp form-control\" type=\"text\" minlength=2 maxlength=2 placeholder=\"YY\"/>\n              <input style=\"width:55px; margin-left:50px; display:inline;\" class=\"card-inp form-control\" type=\"text\" minlength=3 maxlength=3 placeholder=\"CVV\"/>\n            </div>\n          </div>\n          <div style=\"margin-top:50px;\" ng-show=\"paymentCtrl.cash\">\n            Make the payment when you collect your ticket(s).\n          </div>\n          <div ng-show=\"paymentCtrl.gv\">\n            <input style=\"width:320px; margin:50px 0;\" type=\"text\" placeholder=\"Gift Voucher Number\" minlength=5 maxlength=5 class=\"form-control\"/>\n            <button class=\"btn btn-contact\" type=\"submit\">CONTINUE</button>\n          </div>\n        </div>\n      </div>\n    </div>\n  </div>\n\n  <div class=\"cont-right\">\n    <div class=\"order-sum\">\n      <h3 class=\"summary-title\">ORDER SUMMARY</h3>\n      <div class=\"sub-cont\">\n        <h5>You have chosen to watch <span style=\"font-size:1.75rem\">{{paymentCtrl.selectedMovie}}</span></h5>\n        <h5>at <span style=\"font-size:1.75rem\">{{paymentCtrl.selectedTheater}}</span></h5>\n        <h5>on <span style=\"font-size:1.75rem\">{{paymentCtrl.selectedDate}}, {{paymentCtrl.selectedTime}}</span></h5>\n      </div>\n      <div class=\"sub-cont\" style=\"padding-bottom: 40px;\">\n        <h4>{{paymentCtrl.selectedClass}}</h4>\n        <p class=\"seat-no\" ng-repeat=\"seat in paymentCtrl.selectedSeats\">{{seat}} </p>\n      </div>\n      <div class=\"sub-cont\">\n        <h5>Ticket Price : <span style=\"font-size:1.5rem\">Rs.{{paymentCtrl.price}}</span></h5>\n        <h5>Service Tax : <span style=\"font-size:1.5rem\">Rs.4</span></h5>\n        <h5>Convenience Fee: <span style=\"font-size:1.5rem\">Rs.15</span></h5>\n      </div>\n      <h4>Total Amount: Rs.{{paymentCtrl.totPrice}}</h4>\n    </div>\n    <a style=\"margin-top:30px;\" class=\"btn btn-info\" ng-click=\"paymentCtrl.submit()\" >CONFIRM</a>\n  </div>\n\n</div>\n");
$templateCache.put("app/receipt/receipt.html","<div class=\"contain\">\n  <div class=\"alert alert-success\" role=\"alert\">Ticket(s) have been successfully booked</div>\n  <div class=\"receipt-cont\">\n    <div class=\"left-rec\">\n      <img class=\"card-img-top\" src=\"{{receiptCtrl.selectedPoster}}\">\n    </div>\n    <div class=\"right-rec\">\n      <h4>Tickets booked for {{receiptCtrl.selectedMovie}}</h4>\n      <h4>at {{receiptCtrl.selectedTheater}} on {{receiptCtrl.selectedDate}}, {{receiptCtrl.selectedTime}}</h4>\n      <br/>\n      <h4>{{receiptCtrl.selectedClass}}</h4>\n      <p class=\"seat-no\" ng-repeat=\"seat in receiptCtrl.selectedSeats\">{{seat}} </p>\n      <br/><br/>\n      <h5>Ticket Price : <span style=\"font-size:1.5rem\">Rs.{{receiptCtrl.price}}</span></h5>\n      <h5>Service Tax : <span style=\"font-size:1.5rem\">Rs.4</span></h5>\n      <h5>Convenience Fee: <span style=\"font-size:1.5rem\">Rs.15</span></h5>\n      <br/>\n      <h4 text-center>Total Amount: Rs.{{receiptCtrl.totPrice}}</h4>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/seat-select/seat-select.html","<!-- Modal -->\n<div class=\"modal fade\" id=\"myModal\" role=\"dialog\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <h4 class=\"modal-title\">How many tickets?</h4>\n      </div>\n      <div class=\"modal-body\">\n        <ul class=\"modalUL\">\n          <li class=\"modalLI\" ng-repeat=\"n in [].constructor(10) track by $index\" ng-click=\"seatSelectCtrl.getTotSeats($index+1)\">{{$index+1}}</li>\n        </ul>\n      </div>\n    </div>\n  </div>\n</div>\n\n\n<div class=\"container\" style=\"text-align:center\">\n\n  <div class=\"cont-left\">\n    <ol id=\"list\" type=\"A\">\n      <h4>{{seatSelectCtrl.classType[0]}}</h4>\n      <li ng-repeat=\"r in seatSelectCtrl.generateArray(10) | limitTo:2:0\">\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[0]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:10:0\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n        <div class=\"space\"></div>\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[0]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:20:10\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n      </li>\n      <div class=\"space\"></div>\n      <h4>{{seatSelectCtrl.classType[1]}}</h4>\n      <li ng-repeat=\"r in seatSelectCtrl.generateArray(10) | limitTo:3:2\">\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[1]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:10:0\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n        <div class=\"space\"></div>\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[1]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:20:10\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n      </li>\n      <div class=\"space\"></div>\n      <h4>{{seatSelectCtrl.classType[2]}}</h4>\n      <li ng-repeat=\"r in seatSelectCtrl.generateArray(10) | limitTo:5:5\">\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[2]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:10:0\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n        <div class=\"space\"></div>\n        <div class=\"seat\" data-row=\"{{r}}\" data-col=\"{{c}}\" data-classType=\"{{seatSelectCtrl.classType[2]}}\" ng-repeat=\"c in seatSelectCtrl.generateArray(20) | limitTo:20:10\" ng-class=\"{\'selected-cell\': seatSelectCtrl.isSelected(r,c), \'booked-cell\': seatSelectCtrl.isBooked(r,c)}\" ng-click=\"seatSelectCtrl.onClick($event)\">{{c}}</div>\n      </li>\n      <div class=\"space\"></div>\n    </ol>\n  </div>\n\n  <div class=\"cont-right\">\n    <div class=\"order-summary\" style=\"padding-top:2px;\">\n      <h3 id=\"order-title\">ORDER SUMMARY</h3>\n      <div class=\"sub-cont\">\n        <h5>You have chosen to watch <span style=\"font-size:1.75rem\">{{seatSelectCtrl.selectedMovie}}</span></h5>\n        <h5>at <span style=\"font-size:1.75rem\">{{seatSelectCtrl.selectedTheater}}</span></h5>\n        <h5>on <span style=\"font-size:1.75rem\">{{seatSelectCtrl.selectedDate}}, {{seatSelectCtrl.selectedTime}}</span></h5>\n      </div>\n      <div class=\"sub-cont\" ng-show=\"seatSelectCtrl.showPrice\" style=\"padding-bottom: 40px;\">\n        <h4>{{seatSelectCtrl.selectedClass}}</h4>\n        <p class=\"seat-no\" ng-repeat=\"seat in seatSelectCtrl.seatNos\">{{seat}} </p>\n      </div>\n      <div class=\"sub-cont\" ng-show=\"seatSelectCtrl.showPrice\">\n        <h5>Ticket Price : <span style=\"font-size:1.5rem\">Rs.{{seatSelectCtrl.price}}</span></h5>\n        <h5>Service Tax : <span style=\"font-size:1.5rem\">Rs.4</span></h5>\n        <h5>Convenience Fee: <span style=\"font-size:1.5rem\">Rs.15</span></h5>\n      </div>\n      <div ng-show=\"seatSelectCtrl.showPrice\" style=\"margin-top:15px;\">\n        <h4>Total Amount: Rs.{{seatSelectCtrl.totPrice}}</h4>\n      </div>\n    </div>\n    <a style=\"margin-top:30px;\" class=\"btn btn-info\" ng-click=\"seatSelectCtrl.submit()\" >CONFIRM</a>\n  </div>\n\n</div>\n");
$templateCache.put("app/theater/theater.html","<div class=\"container-fluid\" style=\"text-align: center;\">\n\n  <div style=\"margin:10px; font-family:\'Courier New\'; border-bottom:7px double #46b8da; padding:0 0 50px 0;\">\n    <h3>VIEW THEATERS</h3>\n    <br/>\n    <div class=\"dropdown\" style=\"display:inline\">\n      <button class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n        {{theaterCtrl.findCity}}\n        <span class=\"caret\"></span>\n      </button>\n      <ul class=\"dropdown-menu\">\n        <li ng-repeat=\"city in theaterCtrl.citiesData\"><a ng-click=\"theaterCtrl.findCity=city.name\">{{city.name}}</a></li>\n      </ul>\n    </div>\n    <button class=\"btn btn-default\" type=\"submit\" ng-click=\"theaterCtrl.getTheaters()\">Select</button>\n    <br/><br/>\n    <table class=\"table table-bordered\" ng-show=\"theaterCtrl.viewMovie\">\n      <tr style=\"background-color: rgba(70,184,218,0.5)\">\n        <th class=\"text-center col-md-4\">Name</th>\n        <th class=\"text-center col-md-4\"></th>\n      </tr>\n\n      <tr ng-repeat=\"theater in theaterCtrl.theatersList\">\n        <td class=\"text-center col-md-4\">{{theater}}</td>\n        <td class=\"text-center col-md-4\"><button class=\"btn btn-danger\" ng-click=\"theaterCtrl.deleteTheater(theater)\">Remove</button></td>\n      </tr>\n    </table>\n  </div>\n\n\n  <div style=\"\">\n    <h3>ADD A NEW THEATER</h3>\n    <div class=\"row\" style=\"margin:30px;\">\n      <div class=\"col-md-4\">\n        <input type=\"text\" placeholder=\"Name\" class=\"form-control\" ng-model=\"theaterCtrl.newTheater.name\" />\n      </div>\n\n      <div class=\"col-md-4\">\n        <input type=\"text\" placeholder=\"Location\" class=\"form-control\" ng-model=\"theaterCtrl.newTheater.location\" />\n      </div>\n\n      <div class=\"col-md-4\">\n        <div class=\"dropdown\" style=\"display:inline\">\n          <button class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\n            {{theaterCtrl.cityName}}\n            <span class=\"caret\"></span>\n          </button>\n          <ul class=\"dropdown-menu\">\n            <li ng-repeat=\"city in theaterCtrl.citiesData\"><a ng-click=\"theaterCtrl.cityName=city.name\">{{city.name}}</a></li>\n          </ul>\n        </div>\n        <button class=\"btn btn-default\" type=\"submit\" ng-click=\"theaterCtrl.addCity()\">Add a city</button>\n        <button class=\"btn btn-default\" type=\"submit\" ng-click=\"theaterCtrl.removeCity()\">Remove a city</button>\n      </div>\n    </div>\n\n    <div class=\"row\">\n      <button class=\"btn btn-default\" type=\"submit\" ng-click=\"theaterCtrl.addTheater()\">Add theater</button>\n    </div>\n  </div>\n\n</div>\n");
$templateCache.put("app/account/login/login.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Login</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.login(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\" required>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\" required>\n        </div>\n\n        <div class=\"form-group has-error\">\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && form.password.$error.required && vm.submitted\">\n             Please enter your email and password.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n             Please enter a valid email.\n          </p>\n\n          <p class=\"help-block\">{{ vm.errors.other }}</p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-login\" type=\"submit\">\n            Login\n          </button>\n          <a class=\"btn btn-default btn-lg btn-register\" href=\"/signup\">\n            Register\n          </a>\n        </div>\n\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");
$templateCache.put("app/account/settings/settings.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Change Password</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.changePassword(form)\" novalidate>\n\n        <div class=\"form-group\">\n          <label>Current Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.oldPassword\"\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n              {{ vm.errors.other }}\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>New Password</label>\n\n          <input type=\"password\" name=\"newPassword\" class=\"form-control\" ng-model=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required/>\n          <p class=\"help-block\"\n             ng-show=\"(form.newPassword.$error.minlength || form.newPassword.$error.required) && (form.newPassword.$dirty || vm.submitted)\">\n            Password must be at least 3 characters.\n          </p>\n        </div>\n\n        <div class=\"form-group\">\n          <label>Confirm New Password</label>\n\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.newPassword\"\n                 ng-minlength=\"3\"\n                 required=\"\"/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n\n        </div>\n\n        <p class=\"help-block\"> {{ vm.message }} </p>\n\n        <button class=\"btn btn-lg btn-primary\" type=\"submit\">Save changes</button>\n      </form>\n    </div>\n  </div>\n</div>\n");
$templateCache.put("app/account/signup/signup.html","<div class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <h1>Sign up</h1>\n    </div>\n    <div class=\"col-sm-12\">\n      <form class=\"form\" name=\"form\" ng-submit=\"vm.register(form)\" novalidate>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.name.$valid && vm.submitted,\n                                            \'has-error\': form.name.$invalid && vm.submitted }\">\n          <label>Name</label>\n\n          <input type=\"text\" name=\"name\" class=\"form-control\" ng-model=\"vm.user.name\"\n                 required/>\n          <p class=\"help-block\" ng-show=\"form.name.$error.required && vm.submitted\">\n            A name is required\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.email.$valid && vm.submitted,\n                                            \'has-error\': form.email.$invalid && vm.submitted }\">\n          <label>Email</label>\n\n          <input type=\"email\" name=\"email\" class=\"form-control\" ng-model=\"vm.user.email\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\" ng-show=\"form.email.$error.email && vm.submitted\">\n            Doesn\'t look like a valid email.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.required && vm.submitted\">\n            What\'s your email address?\n          </p>\n          <p class=\"help-block\" ng-show=\"form.email.$error.mongoose\">\n            {{ vm.errors.email }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.password.$valid && vm.submitted,\n                                            \'has-error\': form.password.$invalid && vm.submitted }\">\n          <label>Password</label>\n\n          <input type=\"password\" name=\"password\" class=\"form-control\" ng-model=\"vm.user.password\"\n                 ng-minlength=\"3\"\n                 required\n                 mongoose-error/>\n          <p class=\"help-block\"\n             ng-show=\"(form.password.$error.minlength || form.password.$error.required) && vm.submitted\">\n            Password must be at least 3 characters.\n          </p>\n          <p class=\"help-block\" ng-show=\"form.password.$error.mongoose\">\n            {{ vm.errors.password }}\n          </p>\n        </div>\n\n        <div class=\"form-group\" ng-class=\"{ \'has-success\': form.confirmPassword.$valid && vm.submitted,\n                                            \'has-error\': form.confirmPassword.$invalid && vm.submitted }\">\n          <label>Confirm Password</label>\n          <input type=\"password\" name=\"confirmPassword\" class=\"form-control\" ng-model=\"vm.user.confirmPassword\"\n                 match=\"vm.user.password\"\n                 ng-minlength=\"3\" required/>\n          <p class=\"help-block\"\n             ng-show=\"form.confirmPassword.$error.match && vm.submitted\">\n            Passwords must match.\n          </p>\n        </div>\n\n        <div>\n          <button class=\"btn btn-inverse btn-lg btn-register\" type=\"submit\">\n            Sign up\n          </button>\n          <a class=\"btn btn-default btn-lg btn-login\" href=\"/login\">\n            Login\n          </a>\n        </div>\n\n      </form>\n    </div>\n  </div>\n  <hr>\n</div>\n");}]);