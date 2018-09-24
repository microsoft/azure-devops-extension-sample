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
            hub: "./" + path.relative(process.cwd(), path.join(__dirname, "src/Hub/hub"))
        },
        output: {
            filename: path.relative(process.cwd(), path.join(__dirname, "dist", "js", "[name].js"))
        },
        resolve: {
            alias: { OfficeFabric: "../node_modules/office-ui-fabric-react/lib-amd" },
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
                    use:['style-loader','css-loader', 'sass-loader']
                },
                {
                    test: /\.css$/,
                    use: ["style-loader", "css-loader"],
                },
            ],
        },
        plugins: plugins,
    };
};
