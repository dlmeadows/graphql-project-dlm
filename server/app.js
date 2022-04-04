const express = require('express');
const graphglHTTP = require('express-graphql');

const schema = require('./schema/schema');
const testSchema = require('./schema/types_schema');

const app = express();
app.use('/graphql', graphglHTTP.graphqlHTTP({
    graphiql: true,
    schema: testSchema
}))

app.listen(4000, () => { //localhost:4000
    console.log('listening for requests on my awsome port 4000');

})