const App = require("./config/App/App");


const elegance_salon = new App();


elegance_salon.controllers();
elegance_salon.connectDB();
elegance_salon.middlewares();
elegance_salon.routes();
elegance_salon.listen();