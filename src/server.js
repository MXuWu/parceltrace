const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: './src', dev });
const handle = app.getRequestHandler();
const { createExpressServer } = require('./express');

const port = process.env.PORT || 3000;

app.prepare()
.then(() => {
  const server = createExpressServer();

  server.get('/', (req, res) => {
    app.render(req, res, '/index', { ...reqProps(req) });
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`)
  });
  
})
.catch((ex) => {
  console.error(ex.stack)
  process.exit(1)
});

const reqProps = (req) => ({
  ...req.params,
  ...req.query,
})