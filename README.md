# OneKey Desktop

![img](https://github.com/rayston92/graph_bed/blob/281ac3d1ce0c87f2d2ae64a69abf97c4dcf26a46/img/onekey_desktop_repo_hero.png)

## Packages

| Name                 | Packages                                                                                                                                                                                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| suite                | [core](./packages/suite), [web](./packages/suite-web), [desktop](./packages/suite-desktop), [native](./packages/suite-native), [data](./packages/suite-data), [storage](./packages/suite-storage) |
| components           | [components](./packages/components), [storybook native](./packages/components-storybook-native)                                                                                                   |
| rollout              | [rollout](./packages/rollout)                                                                                                                                                                     |
| blockchain-link      | [blockchain-link](./packages/blockchain-link)                                                                                                                                                     |
| translations-manager | [translations-manager](./packages/translations-manager)                                                                                                                                           |
| integration-tests    | [integration-tests](./packages/integration-tests)                                                                                                                                                 |

## Development

Before you start make sure you have downloaded and installed [Node.js LTS](https://nodejs.org/en/download/), [Yarn](https://yarnpkg.com/lang/en/docs/install/) and git.

-   `git clone git@github.com:OneKeyHQ/OneKey-Desktop.git`
-   `yarn && yarn build:libs`

_To set up your dev environment for a native platform (iOS/Android) follow [these additional steps](https://github.com/trezor/trezor-suite/tree/develop/packages/suite-native#development)._

Run a dev build:

-   `yarn desktop:dev` (web app)
-   `yarn desktop:dev:desktop` (electron app)
-   `yarn desktop:dev:android` (react-native Android)
-   `yarn desktop:dev:ios` (react-native iOS)

## Contribute

Inspired by [GitLab Contributing Guide](https://docs.gitlab.com/ee/development/contributing/)

Using [Conventional Commits](COMMITS.md) is strongly recommended and might be enforced in future.

## Security vulnerability disclosure

Please report suspected security vulnerabilities in private to [hi@onekey.so](mailto:hi@onekey.so), Please do NOT create publicly viewable issues for suspected security vulnerabilities.

## Issue Labels

#### Priority

| Label     | Meaning (SLA)                                                |
| --------- | ------------------------------------------------------------ |
| P1 Urgent | The current release + potentially immediate hotfix (30 days) |
| P2 High   | The next release (60 days)                                   |
| P3 Medium | Within the next 3 releases (90 days)                         |
| P4 Low    | Anything outside the next 3 releases (120 days)              |

#### Severity

| Label       | Impact                                                |
| ----------- | ----------------------------------------------------- |
| S1 Blocker  | Outage, broken feature with no workaround             |
| S2 Critical | Broken feature, workaround too complex & unacceptable |
| S3 Major    | Broken feature, workaround acceptable                 |
| S4 Low      | Functionality inconvenience or cosmetic issue         |

## IDE specific settings

Find specific settings for Integrated Development Environments (IDE) in [IDE.md](./IDE.md)

## Frequently issue

### `Module not found: Can't resolve '@trezor/components'`

It happends because the modules hasn't been properly installed, run `yarn && yarn build:libs` to fix the problem.
