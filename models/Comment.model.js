const { Schema, model, SchemaTypes } = require('mongoose');

const commentSchema = new Schema({
    user: { type: SchemaTypes.ObjectId, ref: "User" },
    comment: { type: String, maxlength: 200 }
  });

const Comment = model('Comment', commentSchema);

module.exports = Comment;
