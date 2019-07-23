let publicPath = "/";

// if (process.env.NODE_ENV === "production") {
//     publicPath = "/new-paper-wallet/";
// }

if (process.env.RELEASE_TYPE === "dev") {
    publicPath = "/";
}

if (process.env.RELEASE_TYPE === "dist") {
    publicPath = "./";
}

module.exports = {
    publicPath,
    lintOnSave: false,
};
