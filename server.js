const { ApolloServer, gql, UserInputError } = require("apollo-server");
const mongoose = require("mongoose");
const cors = require("cors");
const QuoteCollection = require("./models/quoteSchema");
require("dotenv").config();

const { DB_USER, DB_PASS, DB_HOST, DB_NAME } = process.env;
const mongoURL = `mongodb+srv://${DB_USER}:${DB_PASS}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority`;
// const PORT = process.env.PORT || 3000;
mongoose
  .connect(mongoURL)

  .then(() => console.log("successfully connect to the database Atlas"))
  .catch((err) => console.log(`error connecting to the database Atlas ${err}`));

const typeDefs = gql`
  type QuoteType {
    id: ID
    author: String!
    quote: String!
    keywords: String!
    image: String
  }
  type Query {
    getQuotes: [QuoteType]
    getOneQuote(id: ID): QuoteType
  }
  type Mutation {
    addQuote(
      author: String!
      quote: String!
      keywords: String!
      image: String
    ): QuoteType
    deleteQuote(id: ID): QuoteType
    updateQuote(
      id: ID!
      author: String
      quote: String
      keywords: String
      image: String
    ): QuoteType
  }
`;
const resolvers = {
  Query: {
    //   here we wr arrow functions because we dont need to receive parameters
    getQuotes: async () => {
      const getAllQuote = await QuoteCollection.find({});
      return getAllQuote;
    },
    // here we can use normal function like ↓ , we can use arrow functions as well
    //   but we have to receive id in args parameter
    async getOneQuote(_, args) {
      const getQuote = await QuoteCollection.findById(args.id);
      if (getQuote) {
        return getQuote;
      } else {
        throw new UserInputError("Invalid id value quote not found");
      }
    },
  },
  Mutation: {
    async addQuote(_, args) {
      const addQuote = new QuoteCollection(args);

      return await addQuote.save();
    },
    async updateQuote(_, args) {
      const updateQuote = await QuoteCollection.findByIdAndUpdate(
        args.id,
        {
          ...args,
        },
        { new: true }
      );

      return updateQuote;
    },
    async deleteQuote(_, args) {
      const deleteQuote = await QuoteCollection.findByIdAndDelete(args.id);
      return deleteQuote;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
