---
title: Blog
subtitle: Technical insights, open source, and learning journey.
permalink: /blog/
description: Technical blog posts on AI, machine learning, distributed systems, and open source contributions by YashVardhan Gupta.
---

<div class="panel">
  <p>Thoughts on AI systems, machine learning, distributed systems, open source contributions, and the journey of learning.</p>
  <p class="muted" style="font-style: italic;">Latest posts and technical deep-dives below →</p>
</div>

<ul class="entry-list">
  {% for post in site.posts %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="muted">{{ post.date | date: "%d %b %Y" }}</p>
      <p>{{ post.excerpt | strip_html | truncate: 200 }}</p>
      <p><a href="{{ post.url | relative_url }}" style="color: var(--accent); font-weight: 500;">Read more →</a></p>
    </li>
  {% endfor %}
</ul>
