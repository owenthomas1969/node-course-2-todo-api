env = process.env.NODE_ENV || 'development';

// mongoose.connect(process.env.DEV_MONGODB || 'mongodb://localhost:27017/TodoApp');

if(env == 'development') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env == 'test') {
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}

console.log("***** env ::", env);
