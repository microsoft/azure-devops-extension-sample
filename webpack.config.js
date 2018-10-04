const path = require("path");
const webpack = require("webpack");
const fs = require("fs");

// Webpack entry points. Mapping from resulting bundle name to the source file entry.
const entries = {};

// Loop through subfolders in the "Pages" folder and add an entry for each one
const pagesDir = path.join(__dirname, "src/Pages");
fs.readdirSync(pagesDir).filter(dir => {
    if (fs.statSync(path.join(pagesDir, dir)).isDirectory()) {
        entries[dir] = "./" + path.relative(process.cwd(), path.join(pagesDir, dir, dir));
    }
});

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
        entry: entries,
        output: {
            filename: path.relative(process.cwd(), path.join(__dirname, "dist", "[name]", "[name].js"))
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
                },
                {
                    test: /\.html$/,
                    loader: "file-loader"
                }
            ],
        },
        plugins: plugins,
    };
};
