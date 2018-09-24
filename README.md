# Azure DevOps Web Sample Extension

Full API reference of DevOps.SDK.js can be found at [Core Client SDK](https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/core-sdk) page.

1. After compiling (`tsc -p .`), resulting .js files are placed in `dist`. For example, `dist/app.js`.

2. If your code directly uses types from other @types modules, you will want to include the module(s) in your package.json and add them to the `types` array. See [@types](http://www.typescriptlang.org/docs/handbook/tsconfig-json.html).


`scripts` provides a convenient way to define common operations that you want to perform on your project, like compiling and packaging. 
   * For example, to build (compile) and package your extension, run: `npm run build`. This runs `build` and `postbuild`. If you make a change that doesn't require compiling, you can package by simply running `npm run package`.
   * To package and publish directly to the Marketplace on build, change the `postbuild` script to run the `gallery-publish` script (instead of `package`). You can then run `npm run build -- --token xxxxxx` (where xxxx is you personal access token for publishing to the Marketplace) to build, package, and publish your extension.

# Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
