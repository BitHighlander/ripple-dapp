module.exports = {
    rules: [
        {
            test: /\.m?js/,
            resolve: {
                fullySpecified: false
            },
        }
    ],
    node: {
        fs: "empty"
    }
};