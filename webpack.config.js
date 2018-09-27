const path = require("path");
const webpack = require("webpack");

module.exports = env => {
    const plugins = [];
    if (env && env.substring(0, 4) === "prod") {
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false,
                },
                output: {
                    comments: false,
                },
            }),
        );
    }
    return {
        entry: {
            hub: "./" + path.relative(process.cwd(), path.join(__dirname, "src/Hub/Hub")),
            panel: "./" + path.relative(process.cwd(), path.join(__dirname, "src/Panel/Panel")),
            menu: "./" + path.relative(process.cwd(), path.join(__dirname, "src/Menu/Menu"))
        },
        output: {
            filename: path.relative(process.cwd(), path.join(__dirname, "dist", "js", "[name].js"))
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: "ts-loader"
                },
                {
                    test: /\.scss$/,
                    use: ["style-loader", "css-loader", {
                        loader: "sass-loader",
                        options: {
                            includePaths: [path.join(__dirname, "node_modules/vss-ui/Core")]
                        }
                    }]
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.woff$/,
                    use: [{
                        loader: 'base64-inline-loader'
                    }]
                }
            ],
        },
        plugins: plugins,
    };
};
