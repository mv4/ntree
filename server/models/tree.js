let mongoose = require("mongoose");
let Schema = mongoose.Schema;
let SchemaTree = new Schema({
    node: {
        type: String,
        required: true
    },

    text: {
        type: String
    },

    lft: {
        type: Number,
        required: true
    },

    rgt: {
        type: Number,
        required: true
    },

    depth: {
        type: Number,
        default: 0
    },
    parent_id: {
        type: mongoose.Types.ObjectId
    }
}, {versionKey: false});

SchemaTree.methods = {
    addLast: async function () {
        let parent = await this.getParent();

        await Tree.updateMany({lft: {$gt: parent.rgt}}, {$inc: {lft: 2}});
        await Tree.updateMany({rgt: {$gte: parent.rgt}}, {$inc: {rgt: 2}});

        this.lft = parent.rgt;
        this.rgt = parent.rgt + 1;
        this.depth = parent.depth + 1;

        return this.save();
    },
    getParent: async function () {
        return await Tree.findOne({_id: this.parent_id});
    }
};

class TreeClass {
    static dataRoot = {depth: 0, lft: 1};
    static selectField = "_id node depth lft rgt isLeaf";

    get isLeaf() {
        return this.lft + 1 === this.rgt;
    }

    static findRoot() {
        return this.findOne(this.dataRoot);
    }
}

SchemaTree.loadClass(TreeClass);

let Tree = mongoose.model('Tree', SchemaTree);


Tree.findRoot().then((item) => {
    if (null === item) {
        console.log('root not found');
        let data = {};
        Object.assign(data, Tree.dataRoot, {node: 'Root', rgt: 2});
        (new Tree(data)).save().then(() => {
            console.log('root is created');
        });
    }
    else {
        console.log('root is present');
    }
});

module.exports = Tree;
