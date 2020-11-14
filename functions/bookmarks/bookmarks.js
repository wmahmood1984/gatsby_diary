const { ApolloServer, gql } = require('apollo-server-lambda')
const faunadb = require('faunadb'),
  q = faunadb.query;

const typeDefs = gql`
  
  type Query {
    bookmark: [Bookmark!]
  }
  type Bookmark {
    id: ID!
    url: String!
    desc: String!
  }

  type Mutation {
    addBookmark (url:String!, desc:String!) : Bookmark
  }
 
`

const authors = [
  { id: 1, url: 'https://www.apollographql.com/docs/react/get-started/', desc: "This is github gatsby repo" },
  { id: 2, url: 'https://www.apollographql.com/docs/react/get-started/', desc: "This is github gatsby repo" },
  { id: 3, url: 'https://www.apollographql.com/docs/react/get-started/', desc: "This is github gatsby repo" },
]

const resolvers = {
  Query: {
    
    bookmark: async (root, args,context) => {
      try {
        var client = new faunadb.Client({ secret: "fnAD5Blz71ACAdXQgDkntLDFp3Ky4EVBRI5OGZvm" });
        var result = await client.query(
          q.Map(
            q.Paginate(q.Match(q.Index("url"))),
            q.Lambda(x => q.Get(x))
          )
        )
        console.log('result',result.data)
        return result.data.map(d => {
          return ({
            id: d.ts,
            url: d.data.url,
            desc: d.data.desc,
          })
        })
      } catch (error) {
       console.log('err',error) 
      }
    }
  },
  Mutation: {
    addBookmark : async (_,{url,desc})=>{
      var client = new faunadb.Client({ secret: "fnAD5Blz71ACAdXQgDkntLDFp3Ky4EVBRI5OGZvm" });
      console.log('url',url,'desc',desc);
      try {
        var result = await client.query(
          q.Create(
            q.Collection('Links'),
            { data: {
              url,
              desc,
            } },
          )
        );
        return result.ref.data
        console.log("Document Created and Inserted in Container: " + result.ref.id);
      } 
      catch (error){
          console.log('Error: ');
          console.log(error);
      }


    }

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
