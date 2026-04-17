---
title: Explorations
subtitle: Travel notes, long rides, and reflective writing.
permalink: /explorations/
description: Reflective travel and riding posts by YashVardhan Gupta.
---

<div class="panel">
  <p>A markdown-based reflective section for travel stories, bike rides, and lessons observed on the road.</p>
</div>

{% assign entries = site.explorations | sort: "date" | reverse %}
<ul class="entry-list">
  {% for post in entries %}
    <li>
      <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
      <p class="muted">{{ post.date | date: "%d %b %Y" }}</p>
      <p>{{ post.excerpt | strip_html | truncate: 180 }}</p>
    </li>
  {% endfor %}
</ul>
