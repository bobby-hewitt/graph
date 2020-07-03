const ApolloServer = require('apollo-server').ApolloServer
const ApolloServerLambda = require('apollo-server-lambda').ApolloServer
const { gql } = require('apollo-server-lambda');
const { makeAugmentedSchema } = require('neo4j-graphql-js')

const typeDefs = gql`
type Topic {
	topicId: ID!
	title: String
	description: String
	image: String
	articles: [Article]
	quotes:[Quote]
	supporters:[Person]
	partySupporters:[Party]
	opponents:[Person]
	partyOpponents:[Party]
	relatedVotes:[Vote]
}

type Department {
	departmentId: ID!
	name: String
	people:[Person]@relation(name: "HOLDS_OFFICE", direction:"IN")
	topics: [Topic]
	votes: [Vote]
}

type IssueTag {
	name: String,
	topics:[Topic]
	votes:[Vote]
}

type Article {
	articleId: ID!
	title: String
	image: String
	author: String 
	copy: String
	url: String
}

type Quote {
	quoteId: ID!
	author: Person
	quote: String
	topic: [Topic]
	vote:[Vote]
	date: Date
}

type Person {
	personId:ID!
	name: String
	twitter: String 
	image: String
	party:Party @relation(name: "MEMBER_OF", direction: "OUT")
	departments:[Department] @relation(name: "HOLDS_OFFICE", direction:"OUT")
	jobTitle: String
	supporterOf: [Topic]
	opponentOf: [Topic]
	votedFor:[Vote]
	votedAgainst:[Vote]
}

type Party {
	partyId: ID!
	name: String
	color: String
	logo: String
	members:[Person]@relation(name: "MEMBER_OF", direction: "IN")
	supporterOf: [Topic]
	opponentOf: [Topic]
	votedFor:[Vote]
	votedAgainst:[Vote]
}

type Vote {
	voteId:ID!
}


type Party_Vote_On @relation(name: "PARTY_POSITION_ON") {
  from: Person
  to: Topic
  position: String
  articles: [Article]
  quotes: [Quote]
}



type Person_Position_On @relation(name: "PERSON_POSITION_ON") {
  from: Person
  to: Topic
  position: String
  articles: [Article]
  quotes: [Quote]
}
`;

var driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD), {encrypted: 'ENCRYPTION_ON'});

function createLambdaServer () {
  return new ApolloServerLambda{
	  schema: makeAugmentedSchema({ typeDefs }),
	  context: { driver, neo4jDatabase: process.env.NEO4J_DATABASE },
	})
}

function createLocalServer () {
  return new ApolloServer({
    schema: makeAugmentedSchema({ typeDefs }),
	context: { driver, neo4jDatabase: process.env.NEO4J_DATABASE },
    introspection: true,
    playground: true,
  });
}

module.exports = { createLambdaServer, createLocalServer }

