"use strict";

import gulp from "gulp";
import babel from "gulp-babel";
import less from "gulp-less";
import watch from "gulp-watch";
import * as gulpBrowser from "@pushrocks/gulp-browser";
import jade from "gulp-jade";

gulp.task("babel", () => {
    gulp.src(["src/**/*.js", "!src/wallet.js"])
        .pipe(watch("src/**/*.js", { verbose: true }))
        .pipe(babel({ presets: ["@babel/preset-env"] }))
        .pipe(gulp.dest("lib"));
});

gulp.task("less", () => {
    gulp.src("src/**/*.less")
        .pipe(watch("src/**/*.less"))
        .pipe(less())
        .pipe(gulp.dest("lib"));
});

gulp.task("jade", () => {
    gulp.src("src/**/*.jade")
        .pipe(watch("src/**/*.jade"))
        .pipe(jade({ pretty: true }))
        .pipe(gulp.dest("."));
});

gulp.task("bundle", () => {
    gulp.src("src/wallet.js")
        .pipe(watch("src/wallet.js", { verbose: true }))
        .pipe(babel({ presets: ["@babel/preset-env"] }))
        .pipe(gulpBrowser.browserify())
        .pipe(gulp.dest("lib"));
});

gulp.task("default", gulp.parallel("babel", "less", "jade", "bundle"));
