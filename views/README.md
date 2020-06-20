# *View folder*

***View:***

View is what is presented to the user. Views utilize the Model and present data in a form in which the user wants. A user can also be allowed to make changes to the data presented to the user. They consist of static and dynamic pages which are rendered or sent to the user when the user requests them.

[*EJS*](https://ejs.co/) is used for view engine.

**What is EJS?**

What is the "E" for? "Embedded?" Could be. How about "Effective," "Elegant," or just "Easy"? EJS is a simple templating language that lets you generate HTML markup with plain JavaScript. No religiousness about how to organize things. No reinvention of iteration and control-flow. It's just plain JavaScript.

***Tags***

- ```<%``` 'Scriptlet' tag, for control-flow, no output
- ```<%_``` ‘Whitespace Slurping’ Scriptlet tag, strips all whitespace before it
- ```<%=``` Outputs the value into the template (HTML escaped)
- ```<%-``` Outputs the unescaped value into the template
- ```<%#``` Comment tag, no execution, no output
- ```<%%``` Outputs a literal '<%'
- ```%>``` Plain ending tag
- ```-%>``` Trim-mode ('newline slurp') tag, trims following newline
- ```_%>``` ‘Whitespace Slurping’ ending tag, removes all whitespace after it

**Includes**

Includes are relative to the template with the include call. (This requires the 'filename' option.) For example if you have "./views/index.ejs" and "./views/partials/posts.ejs" you would use <%- include('./partials/posts'); %>.

You'll likely want to use the raw output tag (<%-) with your include to avoid double-escaping the HTML output.

```
<div class="list-group">
  <%- include('./partials/add-comment') %>
  <% const comments = post.comments.reverse() %>
  <% for( let i = 0; i < comments.length; i++) {
          const comment = comments[i] %>
          <div>
            <%- include('./partials/comment', {comment}) %>
          </div>
  <% } %>
</div>
```

***Partials***

Contains reusable small components.

eg.

- navbar.ejs
- footer.ejs
- comments.ejs
- messages.ejs
- etc
