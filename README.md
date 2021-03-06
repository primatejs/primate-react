# React for Primate

A Primate React handler that can serve as an alternative to the native HTML
handler.

## Installing

```
npm install primate-react
```

## Using

Create a [JSX][jsx] component in `components`, e.g. `PostIndex.jsx`.

```jsx
import React from "react";

export default class extends React.Component {
  render() {
    const {posts} = this.props;

    return (
      <div>
        <h1>All posts</h1>
        {posts.map(({_id, title}) => (
          <h2><a href={`/react/post/view/${_id}`}>{title}</a></h2>
        ))}
      </div>
    )
  }
}
```

Create a route using the handler.

```js
import {router} from "primate";
import react from "primate-react";
import Post from "../domains/Post.js";

router.get("/react/posts", () => react`<PostIndex posts="${Post.find()}" />`);
```

## Resources

[Primate app][primate-app] includes examples for routes and components that are
1:1 aligned with the HTML examples.

## Alternatives

See [primate-vue] for the same functionality in Vue.

## License

BSD-3-Clause

[primate-app]: https://github.com/primatejs/primate-app
[primate-vue]: https://github.com/primatejs/primate-vue
[jsx]: https://reactjs.org/docs/jsx-in-depth.html
