const {
  ApolloServer,
  gql
} = require('apollo-server');

// The GraphQL schema
const typeDefs = gql `
interface Entity {
  id: Int!
}

interface Page {
  skip: Int
  take: Int
  hits: Int
  list: [Entity!]!
}

type Course implements Entity {
  id: Int!
  title: String
  author: String
  topic: String
  url: String
  description: String
  human: String
}

input CourseInput {
  title: String
  author: String
  topic: String
  url: String
  description: String
}

type CoursePage implements Page {
  skip: Int
  take: Int
  hits: Int
  list: [Course!]!
}

enum CourseKey {
  id
  title
  author
  topic
  url
}

input CourseSort {
  key: CourseKey
  direction: Boolean
}

input CourseCompare {
  key: CourseKey!
  set: [String]!
}

type Query {
  queryCourse(
    skip: Int
    take: Int
  ): CoursePage!
}

type Mutation {
  mutateCourse(course: CourseInput!): Course!
}


`;


var courseList = [{
		id: 1,
		title: 'The Complete Node.js Developer Course',
		author: 'Andrew Mead, Rob Percival',
		description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs/'
	},
	{
		id: 2,
		title: 'Node.js, Express & MongoDB Dev to Deployment',
		author: 'Brad Traversy',
		description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
		topic: 'Node.js',
		url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
	},
	{
		id: 3,
		title: 'JavaScript: Understanding The Weird Parts',
		author: 'Anthony Alicea',
		description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
		topic: 'JavaScript',
		url: 'https://codingthesmartway.com/courses/understand-javascript/'
	}
]

function skipData(list, skip) {
	return list.slice(skip);
}

function takeData(list, take) {
	return list.slice(0, take);
}

const courseGet = (args) => {
	const {
		eq,
		nq,
		lt,
		lq,
		gt,
		ge,
		search,
		sort,
		skip,
		take,
	} = args;

	var list = courseList;

	if (eq) {
		eq.forEach(({
			key,
			set
		}) => {
			list = list.filter(i => set.includes(String(i[key])));
		});
	}

	if (nq) {
		nq.forEach(({
			key,
			set
		}) => {
			list = list.filter(i => !set.includes(String(i[key])));
		});
	}

	if (search) {
		search.forEach(key => {
			list = list.filter(i => i.description.includes(key));
		});
	}

	if (sort) {
		sort.forEach(({
			key,
			direction
		}) => {
			list = list.sort((a, b) => {
				if (a[key] > b[key]) {
					return direction ? -1 : +1;
				}
				if (b[key] > a[key]) {
					return direction ? +1 : -1;
				}
				return 0;
			});
		});
	}

	if (skip) {
		list = skipData(list, skip);
	}

	if (take) {
		list = takeData(list, take);
	}

	return {
		skip: skip,
		take: take,
		hits: list.length,
		list: list,
	};
};

const queryCourse = async (obj, args, context, info) => {
	console.log({obj, args, context, info});
	
	const {
		skip,
		take,
	} = args;
	
	var list = courseList;
	
	return {
		skip: skip,
		take: take,
		hits: list.length,
		list: list,
	};
};

const mutateCourse = async (args) => {
	console.log(args);
	var list = courseList;
	return list[0];
};

const resolvers = {
  Query: {
    queryCourse,
  },
  Mutation: {
    mutateCourse,
  },
  Course:{
    human: () => "Human Rick Hunter",
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen(2991).then(({
  url
}) => {
  console.log({
    url
  });
});