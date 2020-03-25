export const parsePostDate = postDate =>
  new Date(
    postDate.substr(0, 4),
    parseInt(postDate.substr(4, 2) - 1),
    postDate.substr(6, 2),
  );
