import React, { useState, useEffect } from 'react';
import Post from './Post';

// airtable configuration
const Airtable = require('airtable');

const airtableConfig = {
  apiKey: process.env.REACT_APP_AIRTABLE_USER_KEY,
  baseKey: process.env.REACT_APP_AIRTABLE_BASE_KEY,
};

const base = new Airtable({ apiKey: airtableConfig.apiKey })
  .base(airtableConfig.baseKey);

const PostsDisplay = function () {
  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState();
  const [body, setBody] = useState();

  const getPosts = () => {
    base('Posts').select({ view: 'Grid view' }).all()
      .then((records) => {
        setPosts(records);
      });
  };

  useEffect(getPosts, []);

  const displayPosts = posts.map((post) => (
    <Post
      key={post.id}
      author={post.fields.Author}
      body={post.fields.Body}
    />
  ));

  const inputForm = (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        base('Posts').create([
          {
            fields: {
              Body: body,
              Author: author,
            },
          },
        ], (err, records) => {
          if (err) {
            console.error(err);
            return;
          }
          records.forEach((record) => {
            console.log(record.getId());
          });
        });
        getPosts();
      }}
    >
      <label>
        Author:
        <input type="text" onChange={(e) => setAuthor(e.target.value)} />
      </label>
      <label>
        Body:
        <input type="text" onChange={(e) => setBody(e.target.value)} />
      </label>
      <input
        type="submit"
      />
    </form>
  );

  return (
    <div className="App">
      <h1>Printer</h1>
      <div>
        {inputForm}
      </div>
      <div>
        {displayPosts}
      </div>
    </div>
  );
};

export default PostsDisplay;
