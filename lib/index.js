'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var app = angular.module('app', ['wallet', 'ngAnimate', 'ui.bootstrap']);

app.config(function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
});

app.controller('main', function ($scope) {});

app.factory('util', function () {
  return {
    lpad: function lpad(str, pad, length) {
      while (str.length < length) {
        str = pad + str;
      }return str;
    },
    rpad: function rpad(str, pad, length) {
      while (str.length < length) {
        str = str + pad;
      }return str;
    }
  };
});

app.directive('animateOnChange', function ($animate, $timeout) {
  return function (scope, elem, attr) {
    scope.$watch(attr.animateOnChange, function (nv, ov) {
      if (nv != ov) {
        $animate.addClass(elem, 'change').then(function () {
          $timeout(function () {
            return $animate.removeClass(elem, 'change');
          });
        });
      }
    });
  };
});

app.directive('entropy', function ($rootScope, $document, $timeout, wallet, util) {
  return {
    restrict: 'E',
    templateUrl: 'entropy',
    scope: {},
    link: function link(scope, elem, attrs) {
      var $input = elem.find('.input_passphrase');
      var $button = elem.find('.btn_generate');
      var $form = $input.parent();

      var fix = function fix(v) {
        return v.replace(/ +/g, ' ').trim().toLowerCase();
      };

      scope.$watch('enter.valid', function (valid) {
        if (valid) {
          $form.removeClass('has-error').addClass('has-success');
          $button.removeClass('btn-danger').addClass('btn-success');
        } else {
          $form.removeClass('has-success').addClass('has-error');
          $button.removeClass('btn-success').addClass('btn-danger');
        }
      });

      scope.enterGenerate = function () {
        scope.btn.disable();
        scope.enter.stop();

        scope.stage = 2;

        $timeout(function () {
          return $rootScope.$broadcast('wallet_start', fix($input.val()));
        });
      };

      scope.enterKeyUp = function (ev) {
        var value = fix($input.val());

        if (value.split(' ').length !== 12 || !wallet.validateMnemonic(value)) {
          scope.enter.valid = false;
        } else {
          scope.enter.valid = true;

          if (ev.keyCode === 13) scope.enterGenerate();
        }
      };

      scope.enterFocus = function () {
        $timeout(function () {
          return $input.focus();
        });
      };
    },
    controller: function controller($scope) {
      $scope.btn = {
        disable: function disable() {
          $scope.btn_disabled = true;
        },
        enable: function enable() {
          $scope.btn_disabled = false;
        }
      };

      $scope.stage = 1;

      $rootScope.$on('btn_disabled', function () {
        $scope.btn.disable();
      });

      $rootScope.$on('btn_enabled', function () {
        $scope.btn.enable();
      });

      $scope.random = {
        empty: function empty() {
          return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        },
        reset: function reset() {
          $scope.random.progress = 0;
          $scope.random.tmp = $scope.random.empty();
        },
        stop: function stop() {
          $scope.random.started = false;
        },
        start: function start() {
          $scope.btn.disable();

          $scope.stage = 2;

          $scope.random.started = true;

          $rootScope.$broadcast('wallet_stop');
          $scope.enter.stop();
          $scope.random.reset();

          var last = [0, 0];
          var used = $scope.random.empty();

          var turns = 4 + parseInt(Math.random() * 10);
          var steps = 1;
          var total = turns * used.length;
          var count = 0;

          console.log('entropy', { turns: turns, steps: steps, total: total });

          var listener = function listener(ev) {
            var distance = Math.sqrt(Math.pow(ev.pageX - last[0], 2) + Math.pow(ev.pageY - last[1], 2));

            if (distance > 60) {
              var _loop = function _loop(p) {
                var pos = void 0;
                var available = [];

                for (var i in used) {
                  if (!used[i]) {
                    available.push(i);
                  }
                }

                if (!available.length) {
                  used = used.map(function (v) {
                    return 0;
                  });
                  pos = parseInt(Math.random() * used.length);
                } else {
                  pos = available[parseInt(Math.random() * available.length)];
                }

                count++;

                last = [ev.pageX, ev.pageY];
                used[pos] = 1;

                $scope.$apply(function () {
                  $scope.random.tmp[pos] = wallet.randomBytes(1)[0];
                  $scope.random.progress = parseInt(count / total * 100);
                });

                if (count >= total) {
                  $document.unbind('mousemove', listener);

                  $timeout(function () {
                    var hex = $scope.random.tmp.map(function (v) {
                      return util.lpad(v.toString(16), '0', 2);
                    }).join('');

                    $scope.random.reset();
                    $scope.random.stop();

                    $timeout(function () {
                      return $rootScope.$broadcast('wallet_start', wallet.entropyToMnemonic(hex));
                    });
                  }, 400);

                  return {
                    v: void 0
                  };
                }
              };

              for (var p = 0; p < steps; p++) {
                var _ret = _loop(p);

                if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
              }
            }
          };

          $timeout(function () {
            return $document.mousemove(listener);
          }, 300);
        }
      };

      $scope.enter = {
        reset: function reset() {
          $scope.enter.valid = false;
          $scope.enter.value = '';
        },
        stop: function stop() {
          $scope.enter.started = false;
        },
        start: function start() {
          $rootScope.$broadcast('wallet_stop');

          $scope.enter.started = true;

          $scope.stage = 1.5;

          $scope.enter.reset();
          $scope.enterFocus();
        }
      };
    }
  };
});

app.directive('byte', function (util) {
  return {
    restrict: 'E',
    templateUrl: 'byte',
    scope: { data: '=ngData' },
    link: function link(scope, elem, attrs) {
      scope.$watch('data', function (nv) {
        scope.dec = util.lpad(nv.toString(), '0', 3);
        scope.hex = util.lpad(nv.toString(16), '0', 2);
      });
    }
  };
});

app.directive('wallet', function ($rootScope, $timeout, wallet) {
  return {
    restrict: 'E',
    templateUrl: 'wallet',
    scope: {},
    link: function link(scope, elem, attrs) {
      var $loading = elem.find('.loading').hide();
      var $after = elem.find('.after').hide();

      $rootScope.$on('wallet_start', function (ev, passphrase) {
        $loading.show();

        $timeout(function () {
          scope.data = wallet.mnemonicToData(passphrase);

          $rootScope.$broadcast('btn_enabled');
          $loading.hide();
          $after.show();
        }, 700);
      });

      $rootScope.$on('wallet_stop', function () {
        $after.hide();
        scope.data = {};
      });

      scope.print = function () {
        window.print();
      };
      scope.save = function () {
        var toScreenshot = jQuery(document.body);
        var scrollPosition = toScreenshot.scrollTop();
        html2canvas(document.body, {
          onrendered: function onrendered(canvas) {
            toScreenshot.scrollTop(scrollPosition);
            var link = document.createElement('a');
            link.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
            link.download = 'ark-paperwallet.jpg';
            link.click();
          }
        });
      };
    }
  };
});

app.directive('clipboard', function () {
  return {
    restrict: 'A',
    link: function link(scope, elem, attrs) {
      elem.click(function () {
        var range = void 0,
            selection = void 0;

        if (window.getSelection) {
          selection = window.getSelection();
          range = document.createRange();
          range.selectNodeContents(elem[0]);
          selection.removeAllRanges();
          selection.addRange(range);
        } else if (document.body.createTextRange) {
          range = document.body.createTextRange();
          range.moveToElementText(elem[0]);
          range.select();
        }
      });
    }
  };
});

app.directive('qrcode', function () {
  return {
    restrict: 'E',
    scope: { data: '=data', size: '=size' },
    link: function link(scope, elem, attrs) {
      scope.$watch('data', function (nv) {
        elem.empty();

        if (nv) {
          elem.qrcode({ render: 'image', size: scope.size, text: nv });
        }
      });
    }
  };
});

angular.bootstrap(document, ['app']);