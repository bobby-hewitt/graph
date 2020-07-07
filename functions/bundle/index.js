const { createLocalServer } = require("./server")
const PORT = process.env.PORT || 4000
const server = createLocalServer();

server.listen(PORT).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});