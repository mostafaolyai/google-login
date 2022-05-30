import * as mongoose from 'mongoose';

mongoose.plugin((schema: any) => {
    // Add deleted condition to all MongoDB queries
    schema.pre(['find', 'findOne', 'findById', 'countDocuments'], function () {
        const query: any = this.getQuery();
        if (query.deleted === undefined) this.getQuery().deleted = { $ne: true };

        const _id: string | mongoose.Types.ObjectId = this.getQuery()._id;
        if (_id && typeof _id === 'string') this.getQuery()._id = new mongoose.Types.ObjectId(_id);
    });

    // Update updated propery of documents
    schema.pre('findOneAndUpdate', function () {
        const set: object = this.getUpdate().$set || {};
        this.getUpdate().$set = { ...set, updated: new Date() };
    });
    schema.pre('', function () {
        const set: object = this.getUpdate().$set || {};
        this.getUpdate().$set = { ...set, updated: new Date() };
    });
    schema.pre('updateOne', function () {
        const set: object = this.getUpdate().$set || {};
        this.getUpdate().$set = { ...set, updated: new Date() };
    });

    // Add _id to new documents
    schema.pre('save', function () {
        if (this.isNew && !this._id) this._id = new mongoose.Types.ObjectId();
    });

    schema.pre('insertMany', function (next, docs) {
        docs.map((doc) => {
            if (!doc.created) {
                doc.created = new Date();
                return doc;
            }
            doc.updated = new Date();
            return doc;
        });
        next();
    });

    schema.pre('updateMany', function (next) {
        const set: object = this.getUpdate().$set || {};
        this.getUpdate().$set = { ...set, updated: new Date() };
        next();
    });
});
