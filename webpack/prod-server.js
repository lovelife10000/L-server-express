const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = [

    {
        // The configuration for the server-side rendering
        name: 'server-side rendering',
        context: path.join(__dirname, '../'),
        target: 'node',
        entry: {
            server: ['babel-polyfill', './server/serverRender.js']
        },
        output: {
            path: path.join(__dirname, '../dist/'),
            filename: 'serverRender.js',
            publicPath: '/',
            libraryTarget: 'commonjs2'
        },
        plugins: [
            new UglifyJSPlugin(),
            new webpack.DefinePlugin({
                __DEVCLIENT__: false,
                __DEVSERVER__: false,
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new webpack.IgnorePlugin(/vertx/),

            new ExtractTextPlugin({
                filename: '[hash:8].style.css',
                disable: false, allChunks: true
            }),
        ],
        module: {
            rules: [
                {enforce: 'pre', test: /\.js$|\.jsx$/, exclude: /node_modules/, use: ['eslint-loader']},
                {
                    test: /\.js$|\.jsx$/,
                    loader: 'babel-loader',
                    include: path.join(__dirname, '..'),
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    include: path.join(__dirname, '..'),
                    use: ExtractTextPlugin.extract({
                        fallback: 'style-loader',
                        use: 'css-loader'
                    })
                },
                {
                    test: /\.less$/,
                    include: path.join(__dirname, '..'),
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [{
                            loader: "css-loader",
                            options: {
                                modules: true,
                                ignoreOrder: true
                            }
                        }, {
                            loader: "less-loader"
                        }]

                    })
                },
                {test: /\.json$/, loader: 'json-loader'},
                {
                    test: /\.(jpe?g|png|gif)$/i,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 10000,
                                name: 'images/[hash:8].[name].[ext]'
                            }
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    quality: 65
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4
                                },
                                svgo: {
                                    plugins: [
                                        {
                                            removeViewBox: false
                                        },
                                        {
                                            removeEmptyAttrs: false
                                        }
                                    ]
                                },
                                gifsicle: {
                                    optimizationLevel: 7,
                                    interlaced: false
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                    interlaced: false
                                }
                            }
                        }
                    ]
                },
            ],
        },
        // resolve: {
        //   extensions: ['.js', '.jsx', '.css'],
        //   alias: {
        //     components: path.resolve(__dirname, '../src/components'),
        //     actions: path.resolve(__dirname, '../src/actions'),
        //     reducers: path.resolve(__dirname, '../src/reducers'),
        //     api: path.resolve(__dirname, '../src/api'),
        //     assets: path.resolve(__dirname, '../src/assets'),
        //     utils: path.resolve(__dirname, '../src/utils'),
        //   }
        // }
    }
]