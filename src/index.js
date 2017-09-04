
let arts = {
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
}

let app = angular.module('app', ['wallet', 'ngAnimate', 'ui.bootstrap'])

app.config(($compileProvider) => {
  $compileProvider.debugInfoEnabled(false)
})

app.controller('main', ($scope) => {
})

app.factory('util', () => {
  return {
    lpad (str, pad, length) {
      while (str.length < length) str = pad + str
      return str
    },
    rpad (str, pad, length) {
      while (str.length < length) str = str + pad
      return str
    }
  }
})

app.directive('animateOnChange', ($animate, $timeout) => (scope, elem, attr) => {
  scope.$watch(attr.animateOnChange, (nv, ov) => {
    if (nv != ov) {
      $animate.addClass(elem, 'change').then(() => {
        $timeout(() => $animate.removeClass(elem, 'change'))
      })
    }
  })
})

app.directive('entropy', ($rootScope, $document, $timeout, wallet, util) => {
  return {
    restrict: 'E',
    templateUrl: 'entropy',
    scope: {},
    link (scope, elem, attrs) {
      let $input = elem.find('.input_passphrase')
      let $button = elem.find('.btn_generate')
      let $form = $input.parent()

      let fix = v => v.replace(/ +/g, ' ').trim().toLowerCase()

      scope.$watch('enter.valid', (valid) => {
        if (valid) {
          $form.removeClass('has-error').addClass('has-success')
          $button.removeClass('btn-danger').addClass('btn-success')
        } else {
          $form.removeClass('has-success').addClass('has-error')
          $button.removeClass('btn-success').addClass('btn-danger')
        }
      })

      scope.enterGenerate = () => {
        scope.btn.disable()
        scope.enter.stop()

        $timeout(() => $rootScope.$broadcast('wallet_start', fix($input.val())))
      }

      scope.enterKeyUp = (ev) => {
        let value = fix($input.val())

        if (value.split(' ').length !== 12 || !wallet.validateMnemonic(value)) {
          scope.enter.valid = false
        }
        else {
          scope.enter.valid = true

          if (ev.keyCode === 13)
            scope.enterGenerate()
        }
      }

      scope.enterFocus = () => {
        $timeout(() => $input.focus())
      }
    },
    controller ($scope) {
      $scope.btn = {
        disable () {
          $scope.btn_disabled = true
        },
        enable () {
          $scope.btn_disabled = false
        }
      }

      $scope.stage = 'stage-1'

      $rootScope.$on('btn_disabled', () => {
        $scope.btn.disable()
      })

      $rootScope.$on('btn_enabled', () => {
        $scope.btn.enable()
      })

      $scope.random = {
        empty () {
          return [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        },
        reset () {
          $scope.random.progress = 0
          $scope.random.tmp = $scope.random.empty()
        },
        stop () {
          $scope.random.started = false
        },
        start () {
          $scope.btn.disable()

          $scope.stage = 'stage-2'

          $scope.random.started = true

          $rootScope.$broadcast('wallet_stop')
          $scope.enter.stop()
          $scope.random.reset()

          let last = [0, 0]
          let used = $scope.random.empty()

          let turns = 20 + parseInt(Math.random() * 10)
          let steps = 1
          let total = turns * used.length
          let count = 0

          console.log('entropy', { turns, steps, total })

          let listener = (ev) => {
            let distance = Math.sqrt(Math.pow(ev.pageX - last[0], 2) + Math.pow(ev.pageY - last[1], 2))

            if (distance > 60) {
              for (let p = 0; p < steps; p++) {
                let pos
                let available = []

                for (let i in used) {
                  if (!used[i]) {
                    available.push(i)
                  }
                }

                if (!available.length) {
                  used = used.map(v => 0)
                  pos = parseInt(Math.random() * used.length)
                } else {
                  pos = available[parseInt(Math.random() * available.length)]
                }

                count++

                last = [ev.pageX, ev.pageY]
                used[pos] = 1

                $scope.$apply(() => {
                  $scope.random.tmp[pos] = wallet.randomBytes(1)[0]
                  $scope.random.progress = parseInt(count / total * 100)
                })

                if (count >= total) {
                  $document.unbind('mousemove', listener)

                  $timeout(() => {
                    let hex = $scope.random.tmp.map(v => util.lpad(v.toString(16), '0', 2)).join('')

                    $scope.random.reset()
                    $scope.random.stop()

                    $timeout(() => $rootScope.$broadcast('wallet_start', wallet.entropyToMnemonic(hex)))
                  }, 400)

                  return
                }
              }
            }
          }

          $timeout(() => $document.mousemove(listener), 300)
        }
      }

      $scope.enter = {
        reset () {
          $scope.enter.valid = false
          $scope.enter.value = ''
        },
        stop () {
          $scope.enter.started = false
        },
        start () {
          $rootScope.$broadcast('wallet_stop')

          $scope.enter.started = true

          $scope.enter.reset()
          $scope.enterFocus()
        }
      }
    }
  }
})

app.directive('byte', (util) => {
  return {
    restrict: 'E',
    templateUrl: 'byte',
    scope: { data: '=ngData' },
    link (scope, elem, attrs) {
      scope.$watch('data', (nv) => {
        scope.dec = util.lpad(nv.toString(), '0', 3)
        scope.hex = util.lpad(nv.toString(16), '0', 2)
      })
    }
  }
})

app.directive('wallet', ($rootScope, $timeout, wallet) => {
  return {
    restrict: 'E',
    templateUrl: 'wallet',
    scope: {},
    link (scope, elem, attrs) {
      let $loading = elem.find('.loading').hide()
      let $after = elem.find('.after').hide()

      scope.arts = arts

      let extendArt = (id) => {
        if (!scope.arts[id]) {
          return {}
        }

        return angular.merge({}, extendArt(scope.arts[id].extend), scope.arts[id])
      }

      scope.set_art = (id) => {
        scope.art_active = id
        scope.art = extendArt(scope.art_active)
      }

      scope.set_art('1')

      $rootScope.$on('wallet_start', (ev, passphrase) => {
        $loading.show()

        $timeout(() => {
          scope.data = wallet.mnemonicToData(passphrase)

          $rootScope.$broadcast('btn_enabled')
          $loading.hide()
          $after.show()
        }, 700)
      })

      $rootScope.$on('wallet_stop', () => {
        $after.hide()
        scope.data = {}
      })

      scope.print = () => {
        window.print()
      }
    }
  }
})

app.directive('clipboard', () => {
  return {
    restrict: 'A',
    link (scope, elem, attrs) {
      elem.click(() => {
        let range, selection

        if (window.getSelection) {
          selection = window.getSelection()
          range = document.createRange()
          range.selectNodeContents(elem[0])
          selection.removeAllRanges()
          selection.addRange(range)
         } else if (document.body.createTextRange) {
          range = document.body.createTextRange()
          range.moveToElementText(elem[0])
          range.select()
         }
      })
    }
  }
})

app.directive('qrcode', () => {
  return {
    restrict: 'E',
    scope: { data: '=data', size: '=size' },
    link (scope, elem, attrs) {
      scope.$watch('data', (nv) => {
        elem.empty()

        if (nv) {
          elem.qrcode({ render: 'image', size: scope.size, text: nv })
        }
      })
    }
  }
})

angular.bootstrap(document, ['app'])
