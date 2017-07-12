# generator-vulcanjs

## Notice
- This yeoman generator is a sub component of our bigger project, [VulcanJS-cli](https://www.npmjs.com/package/vulcanjs-cli). If you wish to use this tool as a scaffolder, we advise that you use [VulcanJS-cli](https://www.npmjs.com/package/vulcanjs-cli).
- However, you can still use this as a yeoman generator if you wish, for whatever reason.

## Installing
- To run this generator, you need to have `yo` installed globally.
- To install all, run `npm install -g generator-vulcanjs yo`

- Or, you can completely avoid installing `yo` by just using our bigger project, [VulcanJS-cli](https://www.npmjs.com/package/vulcanjs-cli).

## Usage
- Create new app: `yo vulcanjs`
- Create new package: `yo vulcanjs:package`
- Create new model: `yo vulcanjs:model`
- Create new component: `yo vulcanjs:component`
- Create new route: `yo vulcanjs:route`

## Issues
- React components don't get generated properly.

## Extra
- To see redux logs, set the environment variable `VULCANJS_SEE_REDUX_LOGS` to `true`. For example:  `VULCANJS_SEE_REDUX_LOGS=true yo vulcanjs:package`
- To turn the logs off, set the same environment variable to `false`. For example: `VULCANJS_SEE_REDUX_LOGS=false yo vulcanjs:package`

## Contributing
PRs are accepted and always welcome. Check [Contributing](CONTRIBUTE.md) for instructions.
