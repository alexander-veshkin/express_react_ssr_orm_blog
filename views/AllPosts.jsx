const React = require('react');
const Layout = require('./Layout');
const Post = require('./Post');

module.exports = function AllPosts({ props, myTitle }) {
  console.log(myTitle)
  return (
    <Layout myTitle = {myTitle}>
      {props.map((i) => (
        <Post props={i} key={i.id} myTitle = {myTitle}/>
      ))}
    </Layout>
  );
};
