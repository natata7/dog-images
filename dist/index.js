const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
};
exports.__esModule = true;
const express_1 = __importDefault(require('express'));

const app = express_1.default();
const port = 5000;
app.get('/', (request, response) => {
  response.send('Hello world!');
});
app.listen(port, () => console.log(`Running on port ${port}`));
