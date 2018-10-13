const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 引入热更新
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

// 压缩js文件
const uglify= require('uglifyjs-webpack-plugin')

module.exports = {
    mode:'development',
    // 多文件打包成一个
    // entry:[
    //     './src/main.js',
    //     './src/enter.js'
    // ],
    // 多文件打包成多个
    entry:{
      index:'./src/js/index.js',
      apple:'./src/js/apple.js'
    },
    output:{
        path:path.resolve(__dirname,'../dist'),
        filename:'js/[name].js',
        publicPath:'/dist/' 
    },
    // 映射
    resolve:{
        // 配置路径
         alias: {
            '@': path.resolve('src'),
        }  
    },
    module:{
        rules:[
        {
           test:/\.css$/,
           use:[
        //        {
        //        loader: MiniCssExtractPlugin.loader,
        //     //    'style-loader',
        //        loader:'css-loader'
        //    }
            MiniCssExtractPlugin.loader, 
            'css-loader'
           ]
        },
        //  less配置
        { 
            test: /\.less$/,
            use: [
                MiniCssExtractPlugin.loader,
                // 'style-loader',
                'css-loader',
                'less-loader'
            ]
        },
        // {
        //     test: /\.(png|jpg|gif|jpeg)/,  //是匹配图片文件后缀名称
        //     use: [{
        //         loader: 'url-loader', //是指定使用的loader和loader的配置参数
        //         options: {
        //             // limit: 500,  //是把小于500B的文件打成Base64的格式，写入JS
        //             outputPath: 'images/',   //打包后的图片放到images文件夹下
        //             name:'[name].[hash:5].[ext]'
        //         }
        //     }]
        // },
        // 图片loader
         {
            test: /\.(png|jpg|gif|jpeg)$/,  //匹配图片文件后缀名称
            use: [{
                loader: 'file-loader', //指定使用的loader和loader的配置参数
                options: {
                    outputPath: 'images/',   //打包后的图片放到images文件夹下
                    name:'[name].[hash:5].[ext]' 
                }
            }]
        },
        // html图片处理
        {
            test: /\.(htm|html)$/i,
            use: ['html-withimg-loader']
        },
            //babel 配置
        {
            test: /\.(jsx|js)$/,
            use: {
                loader: 'babel-loader',
            },
            exclude: /node_modules/
        },
        // zepto配置 
        {
            test: require.resolve('zepto'),
            loader: 'exports-loader?window.Zepto!script-loader'
        },
        // 字体图标配置
        {
            test: /\.(ttf|eot|woff|woff2|svg)$/,
            use: [
                {
                    loader: 'url-loader', options: { 
                        name: 'fonts/[name].[ext]',
                     }//
                 }
                ]
                // 第二种方法
            // loader:"url-loader?name=fonts/[name].[ext]"
        }
      ]
    },
    plugins:[
        // 压缩js文件
        new uglify(),
        // 热更新
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            // 抽离成指定名字的css，要在在js引入相同的css/less/sass  
            // filename: 'index.css'
            // 分别抽离css,在js引入的css/less/sass 可以不相同
            filename:'css/[name].css',

        }),
        new CleanWebpackPlugin(['./dist']),
        new HtmlWebpackPlugin({
            hash:true,
            filename:'index.html',
            chunks:['index'],
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true,  //removeAttrubuteQuotes是却掉属性的双引号。
                collapseWhitespace:true    //    压缩成一行
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/index.html', //是要打包的html模版路径和文件名称。
        }),
        // 打包多个html
        new HtmlWebpackPlugin({
            hash:true,
            filename:'apple.html',
            chunks:['apple'],
            minify: { //是对html文件进行压缩
                removeAttributeQuotes: true,  //removeAttrubuteQuotes是却掉属性的双引号。
                collapseWhitespace:true    //    压缩成一行
            },
            hash: true, //为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template: './src/apple.html', //是要打包的html模版路径和文件名称。
        }),
    ]
    ,
    devServer: {
        contentBase: path.resolve(__dirname,'../dist'),
        hot: true,
        host:'localhost',
        port:8080,
        compress:true
    }
}

