const graphql = require("graphql");

// Load the full build.
const _ = require("lodash");
const User = require("./model/user");
const Hobby = require("./model/hobby");
const Post = require("./model/post");

// dummy data
// const usersData = [
//   { id: "1", name: "Bond", age: 36, profession: "Student" },
//   { id: "13", name: "Anna", age: 26, profession: "Baker" },
//   { id: "211", name: "Bella", age: 16, profession: "Mechanic" },
//   { id: "19", name: "Gina", age: 26, profession: "Teacher" },
//   { id: "150", name: "Georgina", age: 35, profession: "idk" },
//   { id: "111", name: "David", age: 36, profession: "Coder" },
//   { id: "222", name: "Daniel", age: 39, profession: "Pro Wrestler" },
// ];

// const hobbyData = [
//   {
//     id: "1",
//     title: "Programming",
//     description: "Using computers to make the world a better place.",
//     userId: "1",
//   },
//   {
//     id: "2",
//     title: "Rowing",
//     description: "Sweat and feel better before eating junk food.",
//     userId: "13",
//   },
//   {
//     id: "3",
//     title: "Swimming",
//     description: "Learn to be one with the water.",
//     userId: "211",
//   },
//   {
//     id: "4",
//     title: "Fencing",
//     description: "For people that like to poke things.",
//     userId: "111",
//   },
//   { id: "5", title: "Hiking", description: "Lots of walking.", userId: "1" },
// ];

// const postData = [
//   { id: "1", comment: "Building a Mind", userId: "1" },
//   { id: "2", comment: "GraphQL is Amazing", userId: "211" },
//   { id: "3", comment: "How to Change the World", userId: "1" },
//   { id: "4", comment: "How to Change the World", userId: "111" },
//   { id: "5", comment: "How to Change the World", userId: "222" },
// ];

const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// Create types
const UserType = new graphql.GraphQLObjectType({
  name: "User",
  description: "Documentation for user...",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    profession: { type: GraphQLString },

    posts: {
      type: new GraphQLList(PostType),
      resolve(parent, args) {
        // return _.filter(postData, { userId: parent.id });
        return Post.find({ userId: parent.id });
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),
      resolve(parent, args) {
        // return _.filter(hobbyData, { userId: parent.id });
        return Hobby.find({ userId: parent.id });
      },
    },
  }),
});

const HobbyType = new graphql.GraphQLObjectType({
  name: "Hobby",
  description: "Documentation for hobby...",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

// Post type (id, comment)
const PostType = new graphql.GraphQLObjectType({
  name: "Post",
  description: "Documentation for post...",
  fields: () => ({
    id: { type: GraphQLID },
    comment: { type: GraphQLString },
    user: {
      type: UserType,
      resolve(parent, args) {
        return User.findById(parent.userId);
      },
    },
  }),
});

// RootQuery
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  description: "Description",
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return User.findById(args.id);
        //we resolve with data
        //get and return data from a datasource
      },
    },
    users: {
      type: new GraphQLList(UserType),

      resolve(parent, args) {
        return User.find({});
      },
    },
    hobby: {
      type: HobbyType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return User.findById(args.id);
        // return data for our hobby
      },
    },
    hobbies: {
      type: new GraphQLList(HobbyType),

      resolve(parent, args) {
        return Hobby.find({ id: args.userId });
      },
    },
    post: {
      type: PostType,
      args: { id: { type: GraphQLID } },

      resolve(parent, args) {
        return Post.findById(args.id);
        // return data for our post
      },
    },
    posts: {
      type: new GraphQLList(PostType),

      resolve(parent, args) {
        return Post.find({});
      },
    },
  },
});

// Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createUser: {
      type: UserType,
      args: {
        // id: (type: GraphQLID)
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },

      resolve(parent, args) {
        const user = User({
          name: args.name,
          age: args.age,
          profession: args.profession,
        });
        return user.save();
      },
    },
    // Update User
    updateUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
        profession: { type: GraphQLString },
      },
      resolve(parent, args) {
        return (updateUser = User.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              age: args.age,
              profession: args.profession,
            },
          },
          { new: true }
        ));
      },
    },
    removeUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let removedUser = User.findByIdAndRemove(args.id).exec();
        if (!removedUser) {
          throw new "Error"()
        }
        return removedUser;
      }
    },
    createPost: {
      type: PostType,
      args: {
        // id: (type: GraphQLID),
        comment: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        const post = Post({
          comment: args.comment,
          userId: args.userId,
        });
        return post.save();
      },
    },
    // Update Post
    updatePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        comment: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updatePost = Post.findByIdAndUpdate(
          args.id,
          {
            $set: {
              comment: args.comment,
            },
          },
          { new: true }
        ));
      },
    },
    removePost: {
      type: PostType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let removedPost = Post.findByIdAndRemove(args.id).exec();
        if (!removedPost) {
          throw new "Error"()
        }
        return removedPost;
      }
    },
    createHobby: {
      type: HobbyType,
      args: {
        // id: (type: GraphQLID),
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },

      resolve(parent, args) {
        const hobby = Hobby({
          title: args.title,
          description: args.description,
          userId: args.userId,
        });
        return hobby.save();
      },
    },
    // Update Hobby
    updateHobby: {
      type: HobbyType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        return (updateHobby = Hobby.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              description: args.description,
            },
          },
          { new: true }
        ));
      },
    },
    removeHobby: {
      type: HobbyType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)}
      },
      resolve(parent, args) {
        let removedHobby = Hobby.findByIdAndRemove(args.id).exec();
        if (!removedHobby) {
          throw new "Error"()
        }
        return removedHobby;
      }
    },
  },
});
module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
