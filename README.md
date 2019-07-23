# ARK Paper Wallet

<p align="center">
    <img src="https://raw.githubusercontent.com/ARKEcosystem/paper-wallet/master/banner.png" />
</p>

[![Build Status](https://badgen.now.sh/circleci/github/ARKEcosystem/paper-wallet)](https://circleci.com/gh/ARKEcosystem/paper-wallet)
[![Codecov](https://badgen.now.sh/codecov/c/github/arkecosystem/paper-wallet)](https://codecov.io/gh/arkecosystem/paper-wallet)
[![License: MIT](https://badgen.now.sh/badge/license/MIT/green)](https://opensource.org/licenses/MIT)

> Lead Maintainer: [Michel Kraaijeveld](https://github.com/ItsANameToo)

## Running Locally

TODO; download source code and run it.

## Adding Networks

By default, the ARK Paper Wallet uses the ARK mainnet when generating a wallet.
However, it comes bundles with multiple network options that you can switch to, making it usable on for example devnet and bridgechains.
If you run a public bridgechain, you can have your network added by creating a PR that adds the `name`, `pubkeyHash` and `WIF` to the existing list of networks.

## Using Custom Network

If the network you want to use is not listed in the dropdown, you can switch to custom networks in the modal, fill in the `pubkeyHash` and `WIF` values of the network you want to use, and press `Save` to apply it. That's it!

## Development

```sh
yarn install
```

### Compiles and hot-reloads for development

```sh
yarn run serve
```

### Compiles and minifies for production

```sh
yarn run build
```

### Run your tests

```sh
yarn run test
```

### Lints and fixes files

```sh
yarn run lint
```

## Security

If you discover a security vulnerability within this package, please send an e-mail to security@ark.io. All security vulnerabilities will be promptly addressed.

## Credits

This project exists thanks to all the people who [contribute](../../contributors).

## License

[MIT](LICENSE) © [ARK Ecosystem](https://ark.io)
