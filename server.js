const express = require('express')
const app = express();
import controllerRouting from './routes/index';
const port = process.env.PORT || 5000;

app.use(express.json());

controllerRouting(app)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

export default app;