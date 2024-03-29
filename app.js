var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var passport = require('passport');
var app = express();
var checkLogined = require('./utils/checkLogined');

require('./databases/mongodb/base').connect();
require('./utils/passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var classesRouter = require('./routes/classes');
var documentRouter = require('./routes/documents');
var excercisesRouter = require('./routes/exercises');
var answerSheetRouter = require('./routes/answer-sheets');
var pdfRouter = require('./routes/pdfs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ limit: '100mb', extended: true , parameterLimit:50000}));
app.use(cookieParser());
app.use(session({
    secret: '_btq_',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        secure: false
    }
}))
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);

app.use('/users', usersRouter);
app.use('/classes', checkLogined, classesRouter);
app.use('/documents', checkLogined, documentRouter);
app.use('/exercises', checkLogined, excercisesRouter);
app.use('/answer-sheets', checkLogined, answerSheetRouter);
app.use('/pdfs/web', checkLogined, pdfRouter);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;