'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var arts = {
  '0': {
    image: '01',
    width: 780,
    height: 360,
    address: {
      qr: {
        size: 150,
        width: '150px',
        height: '150px',
        top: 45,
        left: 15
      },
      text: {
        width: 760,
        height: 20,
        lineHeight: '20px',
        padding: '0 4px',
        fontSize: 16,
        fontFamily: 'Inconsolata',
        fontWeight: 'bold',
        top: 10,
        left: 10,
        textAlign: 'left'
      },
      label: {
        hide: false,
        top: 205,
        left: 10,
        lineHeight: '26px',
        fontSize: 18,
        fontFamily: 'Inconsolata',
        fontWeight: 'bold',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)'
      }
    },
    passphrase: {
      qr: {
        size: 150,
        width: '150px',
        height: '150px',
        bottom: 45,
        right: 15
      },
      text: {
        width: 760,
        height: 20,
        lineHeight: '20px',
        padding: '0 4px',
        fontSize: 14,
        fontFamily: 'Inconsolata',
        fontWeight: 'bold',
        bottom: 10,
        left: 10,
        textAlign: 'right'
      },
      label: {
        hide: false,
        bottom: 205,
        right: 10,
        lineHeight: '26px',
        fontSize: 18,
        fontFamily: 'Inconsolata',
        fontWeight: 'bold',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)'
      }
    },
    amount: {
      label: {
        top: 40,
        left: 300,
        height: 30,
        lineHeight: '30px',
        paddingLeft: 8,
        fontSize: 14,
        fontFamily: 'Inconsolata',
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)'
      }
    }
  },
  '1': {
    extend: '0',
    image: '01'
  },
  '2': {
    extend: '0',
    image: '02'
  }
};

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
      var $bip38Password = elem.find('.bip38Password');
      var $encryptedKey = elem.find('.encryptedKey');

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

        $timeout(function () {
          return $rootScope.$broadcast('wallet_start', fix($input.val()));
        });
      }, scope.decryptGenerate = function () {
        scope.decrypt.stop();
        var params = {
          password: $bip38Password.val(),
          encrypted: $encryptedKey.val()
        };

        $timeout(function () {
          return $rootScope.$broadcast('decrypt_start', params);
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
          $scope.random.stop();
          $scope.decrypt.stop();
          $scope.random.started = true;

          $rootScope.$broadcast('wallet_stop');
          $scope.enter.stop();
          $scope.random.reset();

          var last = [0, 0];
          var used = $scope.random.empty();

          var turns = 20 + parseInt(Math.random() * 10);
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
          $scope.random.stop();
          $scope.decrypt.stop();
          $scope.enter.started = true;

          $scope.enter.reset();
          $scope.enterFocus();
        }
      };

      $scope.decrypt = {
        start: function start() {
          $rootScope.$broadcast('wallet_stop');
          $scope.enter.stop();
          $scope.random.stop();
          $scope.decrypt.started = true;

          $scope.enter.reset();
          $scope.enterFocus();
        },
        stop: function stop() {
          $scope.decrypt.started = false;
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
      elem.find('.after_decrypt').hide();
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
      var $after_decrypt = elem.find('.after_decrypt').hide();

      scope.arts = arts;

      var extendArt = function extendArt(id) {
        if (!scope.arts[id]) {
          return {};
        }

        return angular.merge({}, extendArt(scope.arts[id].extend), scope.arts[id]);
      };

      scope.set_art = function (id) {
        scope.art_active = id;
        scope.art = extendArt(scope.art_active);
      };

      scope.set_art('1');

      $rootScope.$on('wallet_start', function (ev, passphrase) {
        $loading.show();

        $timeout(function () {
          scope.data = wallet.mnemonicToData(passphrase);
          scope.data.passphrase_bip38 = scope.data.passphrase;
          scope.data.passphraseqr_bip38 = scope.data.passphraseqr;

          $rootScope.$broadcast('btn_enabled');
          $loading.hide();
          $after.show();
        }, 700);
      });

      $rootScope.$on('wallet_stop', function () {
        $after.hide();
        $after_decrypt.hide();
        scope.data = {};
      });

      scope.encryptPassphrase = function () {
        var encrypted = wallet.encryptPassphrase(scope.data.entropy, scope.data.password);
        scope.data.passphrase_bip38 = encrypted;
        scope.data.passphraseqr_bip38 = '{"passphrase":"' + encrypted + '"}';
      };

      scope.print = function () {
        window.print();
      };
    }
  };
});

app.directive('decrypt', function ($rootScope, $timeout, $q, wallet) {
  return {
    restrict: 'E',
    templateUrl: 'decrypt',
    scope: {},
    link: function link(scope, elem, attrs) {
      var $loading = elem.find('.loading_decrypt').hide();
      var $after = elem.find('.after_decrypt').hide();

      $rootScope.$on('decrypt_start', function (ev, params) {
        $loading.show();

        $timeout(function () {
          var defer = $q.defer();
          defer.resolve(wallet.decryptPassphrase(params.password, params.encrypted));
          defer.promise.then(function (data) {
            scope.data = data;
          }, function () {
            alert('Incorrect passphrase for this encrypted private key.');
            $rootScope.$emit('wallet_stop');
          });
          $rootScope.$broadcast('btn_enabled');
          $loading.hide();
          $after.show();
        }, 700);
      });

      $rootScope.$on('wallet_stop', function () {
        $after.hide();
        scope.data = {};
      });
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