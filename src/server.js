const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');

const { makeAugmentedSchema } = require('neo4j-graphql-js')
const neo4j = require('neo4j-driver')
const dotenv = require('dotenv')
dotenv.config()
const resolvers = require('./resolvers')



const typeDefs = gql`
type Article {
	articleId:ID!
	cardType: String
	subtitle:String
	type: String
	lastEdited: Float
	image: String
    title: String
    policyAreas:[String]
    issues:[String]
    description: String
    reactions: Boolean
    voteId: String
}

type Department {
	departmentId: ID!
	name: String
	imageUrl: String
	people:[Person]@relation(name: "HOLDS_OFFICE", direction:"IN")
	articles: [Article]
	votes: [Vote]
}

type Issue {
	issueId: ID!
	name: String,
}

type PolicyArea {
	policyAreaId: ID!
	name: String
}

type Quote {
	quoteId: ID!
	author: Person
	quote: String
	vote:[Vote]
	date: Date
}

type Tweet {
	text: String
}

type Person {
	personId:ID!
	name: String
	twitter: String 
	image: String
	party:Party @relation(name: "MEMBER_OF", direction: "OUT")
	departments:[Department] @relation(name: "HOLDS_OFFICE", direction:"OUT")
	jobTitle: String
	supporterOf: [Article]
	opponentOf: [Article]
	votedFor:[Vote]
	votedAgainst:[Vote]
	constituency:String,

	tweets:String
}

type Party {
	partyId: ID!
	name: String
	color: String
	logo: String
	members:[Person]@relation(name: "MEMBER_OF", direction: "IN")
	supporterOf: [Article]
	opponentOf: [Article]
	votedFor:[Vote]
	votedAgainst:[Vote]
}




type Vote {
	voteId:ID!
}


type Party_Vote_On @relation(name: "PARTY_POSITION_ON") {
  from: Person
  to: Article
  position: String
  articles: [Article]
  quotes: [Quote]
}



type Person_Position_On @relation(name: "PERSON_POSITION_ON") {
  from: Person
  to: Article
  position: String
  articles: [Article]
  quotes: [Quote]
}
`;


var driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), {encrypted: 'ENCRYPTION_ON'});


const schema = makeAugmentedSchema({ typeDefs, resolvers })

function createLambdaServer () {
  return new ApolloServerLambda({
	  schema,
	  context: { driver },
	  formatError: (err) => {
    // Don't give the specific errors to the client.
    }
  })
	
}

function createLocalServer () {
  return new ApolloServer({
    schema,
	context: { driver },
    introspection: true,
    playground: true,
  });
}

module.exports = { createLambdaServer, createLocalServer }

