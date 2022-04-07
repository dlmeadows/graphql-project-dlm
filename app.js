const express = require("express");
const graphglHTTP = require("express-graphql");

const schema = require("./server/schema/schema");
const testSchema = require("./server/schema/types_schema");
const mongoose = require("mongoose");

const app = express();
const cors = require('cors');

const port = process.env.PORT || 4000;
// mongodb+srv://dmeadows:zHEMx5V8pN09VHB6@cluster0@cluster0.z0cyi.mongodb.net/test
app.use(cors());
app.use(
  "/graphql",
  graphglHTTP.graphqlHTTP({
    graphiql: true,
    schema: schema,
  })
);

mongoose.connect(
  `mongodb+srv://${process.env.mongoUserName}:${process.env.mongoUserPassword}@cluster0.z0cyi.mongodb.net/${process.env.mongoDatabase}?retryWrites=true&w=majority`,
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => {
    app.listen(4000, () => {
        //localhost:4000
        console.log("listening for requests on my awsome port: " + port);
      });
}).catch((e)=> console.log(`Error: ${e}`));
