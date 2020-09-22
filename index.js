const { ApolloServer, gql } = require('apollo-server');

const knex = require('knex')({
    client: 'pg', //postgresql数据库
    connection: { 
      host : '127.0.0.1',
      user : '',
      password : '',
      database : 'test'
    }
    // debug: true
  })
 

const typeDefs = gql`

type Cat {
    id:Int
    name:String
    age:String
  }

  type Query {
    hello: String,
    user : [Cat],
    findCat(id: ID!): [Cat]
    
  }


  type Mutation {
    createCat(name: String!): [Cat]
    updateCat(id: ID!, name: String!): [Cat]
    delete(id: ID!) : [Cat]
  }
`;

//拉取数据库users的数据
 /* const k = async ()=>{
     user = await knex('users').select() 
    } 
k()  
 */


  const resolvers = {
    Query: { //查询数据
        hello: () => "Hello world 233!",
        user: async () =>  knex('users').select(),
       async findCat({id}) {
            let user = await knex('users').select()
            return user.find( item =>  item.id == id )
        }
    },
    Mutation: {
        async createCat(root, args, context) {
            console.log(args.name)
            // user.push({ id: user.length + 1,name:args.name }); 
            let results = await knex('users')
                .insert({
                    name: args.name,
                    age: 123
                })
                 .returning('*')
            return null;
          },
        async updateCat(root, args, context) {
            console.log(args)
            //user.find(el => el.id == id)
            let results = await knex('users').where('id','=', args.id).update({
              name:args.name
            })
            return null
          },
          async delete(root, args, context){
              console.log(args)
            let results = await knex('users').where('id','=', args.id).del()
            return null
        }
    }
   
    
  }; 

//查询全部
/* {
    user {
      name id 
    }
  } */
//删除
/* mutation {
    delete(id: 5) {
      name id
    }
  } */
//修改
/* mutation {
    updateCat(id: 1, name: "new name") {
      name id
    }
  } */
//增加
/* mutation {
    createCat(name: "new name") {
      name id
    }
  } */
const server = new ApolloServer({ typeDefs, resolvers });


server.listen().then(({ url }) => {
  console.log(` Server ready at ${url}`);
});