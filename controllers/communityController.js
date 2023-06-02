const { firebase, database} = require('../config/firebase');
const { Storage } = require("@google-cloud/storage");


class CommunityController {
  
  static createPost(req, res) {
    const { title, content } = req.body ; 

    const newPostRef = database.ref('posts').push();
    const postId = newPostRef.key;

    const postData = {
      title,
      content,
    };

    newPostRef.set(postData)
      .then(() => {
        if (req.files && req.files.photo) {
          const photo = req.files.photo;
          const bucketName = 'gs://andireski-110103-u40i4-postimage/'; // Nama bucket Firebase Storage Anda
          const storage = firebase.storage();

          // Mengunggah foto ke Firebase Storage
          const bucket = storage.bucket(bucketName);
          const photoPath = `posts/${postId}/photo.jpg`;
          const file = bucket.file(photoPath);

          const blobStream = file.createWriteStream({
            metadata: {
              contentType: 'image/jpeg'
            }
          });

          blobStream.on('error', (error) => {
            console.error(error);
            res.status(500).json({ error: 'Failed to upload photo' });
          });

          blobStream.on('finish', () => {
            res.json({ postId });
          });

          blobStream.end(photo.data);
        } else {
          res.json({ postId });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post' });
      });
  }

  // ...



  static getPostById(req, res) {
    const postId = req.params.postId;
  
    database.ref(`posts/${postId}`).once('value')
      .then((snapshot) => {
        const post = snapshot.val();
        if (post) {
          res.json(post);
        } else {
          res.status(404).json({ error: 'Post not found' });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to get post' });
      });
  }
  

  static createComment(req, res) {
    const { postId, content } = req.body;
    const userId = getRegisteredUid().uid; // Menggunakan ID pengguna yang telah disimpan dalam objek request user saat login

    const newCommentRef = database.ref(`comments/${postId}`).push();
    const commentId = newCommentRef.key;

    const commentData = {
      content,
      userId
    };

    newCommentRef.set(commentData)
      .then(() => res.json({ commentId }))
      .catch((error) => {
        console.error(error);
        res.status(500).json({ error: 'Failed to create comment' });
      });
  }
}

module.exports = CommunityController;
