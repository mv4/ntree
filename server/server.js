const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors')

const app = express();
app.use(cors());

mongoose.connect('mongodb://root:root@localhost:27017', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const graphqlHTTP = require('express-graphql');

const schema = require('./schema/node');
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));

app.listen(3012, () => {
    console.log('API app started')
});
