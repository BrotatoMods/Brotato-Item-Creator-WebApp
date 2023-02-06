
// Dependancies
// ============================================================================

const autoprefixer = require("autoprefixer");
const browsersync  = require("browser-sync").create();
const cssnano      = require("cssnano");
const del          = require("del");
const gulp         = require("gulp");
const plumber      = require("gulp-plumber");
const postcss      = require("gulp-postcss");
// const sass         = require("gulp-sass");
const sass         = require('gulp-sass')(require('node-sass'));
const sourcemaps   = require("gulp-sourcemaps");


// Config
// ============================================================================

const paths = {
    styles: {
        src:  './assets/styles/src/**/*.scss',
        dest: './assets/styles/dist/'
    },
    watchFiles: [
        './*.html',
    ],
};


// Styles
// ============================================================================

// Clean Styles
function clean()
{
    return del( ["./assets/styles/dist"] );
}

// Optimize Styles
function styles()
{
    const plugins = [
        autoprefixer(),
        cssnano()
    ];

    return gulp
        .src(paths.styles.src)
        .pipe(
            plumber({
                errorHandler: function(err) {
                    console.log(err);
                    this.emit("end");
                }
            })
        )
        .pipe(sourcemaps.init())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(postcss(plugins))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.styles.dest))
        // .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest(paths.styles.dest))

        // Stream changes to bsync
        // https://github.com/BrowserSync/browser-sync/issues/955#issuecomment-218927650
        .pipe(browsersync.stream( { match: '**/*.css' } ));
}


// Browser Sync
// ============================================================================

const bsyncOptions = {
	// Proxy an EXISTING vhost
	// proxy: 'https://brotato-items.localdev',

	server: {
		baseDir: "./"
	},

	// Don't show any notifications in the browser.
	notify: false, // default: true

	// Clicks, Scrolls & Form inputs on any device will be mirrored to all others
	ghostMode: {
		clicks: false, // default: true
		forms:  false, // default: true
		scroll: false, // default: false
	},

    // Log information about changed files (default: true)
    // logFileChanges: true,
    logFileChanges: false,

    watch: true,

    injectChanges: true,
    // logLevel: "debug"
}


// Watch
// ============================================================================

// Watch Files
function watch()
{
    browsersync.init( bsyncOptions );

    gulp.watch( paths.styles.src, styles );

    // Hotfix for css changes not reloading
    // gulp.watch( paths.styles.src ).on( 'change', browsersync.reload() );

    gulp.watch( paths.watchFiles ).on( 'change', browsersync.reload );
}


// Tasks
// ============================================================================

// Build Assets and start watching files
const build = gulp.series(
    clean,
    gulp.parallel( styles ),
);

// Build Assets and start watching files
const serve = gulp.series(
    clean,
    gulp.parallel( styles ),
    watch
);

// Tasks
exports.clean = clean;
exports.styles = styles;
exports.watch = watch;
exports.serve = serve;
exports.build = build;

// Default Task
exports.default = build;
