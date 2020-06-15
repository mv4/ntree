const graphql = require('graphql');

const Tree = require('./../models/tree');

const {
    GraphQLObjectType, GraphQLString,
    GraphQLID, GraphQLInt, GraphQLSchema,
    GraphQLNonNull, GraphQLBoolean, GraphQLList
} = graphql;

const RootType = new GraphQLObjectType({
    name: 'Root',
    fields: () => ({
        _id: {type: GraphQLID},
        node: {type: GraphQLString},
        depth: {type: GraphQLInt},
        lft: {type: GraphQLInt},
        rgt: {type: GraphQLInt},
        isLeaf: {type: GraphQLBoolean}
    })
});

const NodeType = new GraphQLObjectType({
    name: 'Node',
    fields: () => ({
        _id: {
            type: GraphQLID,
            name: 'ID'
        },
        parent_id: {type: GraphQLString},
        node: {type: GraphQLString},
        description: {type: GraphQLString},
        lft: {type: GraphQLInt},
        rgt: {type: GraphQLInt},
        isLeaf: {type: GraphQLBoolean}
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'NestedSetQuery',
    fields: {
        root: {
            type: RootType,
            resolve() {
                return Tree.findRoot().select(Tree.selectField);
            }
        },
        getChildren: {
            description: 'Children',
            // type: NodeType,
            type: new GraphQLList(NodeType),
            args:{
                parent_id: {type: new GraphQLNonNull(GraphQLString)}
            },
            async resolve(parent, args) {
                console.log(args);
                let item = await Tree.findOne({_id: args.parent_id});

                console.log(item)

                return Tree.find({lft: {$gt: item.lft}, rgt: {$lt: item.rgt}, depth: item.depth + 1})
                    .select(Tree.selectField)
                    .sort({lft: 1});
            }
        },
        getInfo:{
            description: 'Info child',
            type: NodeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                return Tree.findOne({_id: args.id}).select(Tree.selectField);
            }
        }
    }
});

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addLast: {
            description: 'add last',
            type: NodeType,
            args: {
                node: {type: new GraphQLNonNull(GraphQLString)},
                parent_id: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString}
            },
            resolve(parent, args) {
                let node = new Tree({
                    node: args.node,
                    parent_id: args.parent_id,
                    description: args.description
                });
                return node.addLast();
            }
        },
        // deleteNode: {
        //     description: 'delete node',
        //     args: {
        //         id: {type: new GraphQLNonNull(GraphQLString)}
        //     },
        // }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
