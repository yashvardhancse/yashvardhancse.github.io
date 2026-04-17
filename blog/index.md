---
title: Blog
subtitle: Notes on AI systems, machine learning, distributed systems, and decision making.
permalink: /blog/
description: Technical and thought pieces by YashVardhan Gupta.
---

<div class="panel">
  <p>This is a markdown-first blog powered by Jekyll `_posts`. Categories are split into <strong>Technical</strong> and <strong>Thoughts</strong>.</p>
</div>

<ul class="entry-list">
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="muted">{{ post.date | date: "%d %b %Y" }} | {{ post.categories | join: ", " }}</p>
      <p>{{ post.excerpt | strip_html | truncate: 180 }}</p>
    </li>
  {% endfor %}
</ul>
