let publicPath = "/";

if (process.env.RELEASE_TYPE === "dist") {
    publicPath = "./";
} else if (process.env.RELEASE_TYPE === "gh-pages") {
    publicPath = "/paper-wallet/";
}

module.exports = {
    publicPath,
    lintOnSave: false,
    pwa: {
      themeColor: "#fe463a",
      msTileColor: "#fe463a",
    },
};
