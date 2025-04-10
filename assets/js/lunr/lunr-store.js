---
layout: null
---

var store = [
  {%- for c in site.collections -%}
    {%- if forloop.last -%}
      {%- assign l = true -%}
    {%- endif -%}
    {%- assign docs = c.docs | where_exp:'doc','doc.search != false' -%}
    {%- for doc in docs -%}
    {%- unless doc.collection == "es_2019.2.1" or doc.collection == "es_2019.1.1" or doc.collection == "es_2019.4" or doc.collection == "es_2018.3.1" or doc.collection == "es_10.0" or doc.collection == "es_10.1" or doc.collection == "es_10.2" or doc.collection == "es_10.3"-%}
      {%- if doc.header.teaser -%}
        {%- capture teaser -%}{{ doc.header.teaser }}{%- endcapture -%}
      {%- else -%}
        {%- assign teaser = site.teaser -%}
      {%- endif -%}
      {
        {%- if doc.collection == "connectors" and doc.url contains "/installation" -%}
        "title": {{ doc.connectorTitle | jsonify }},
        {%- else -%}
        "title": {{ doc.title | jsonify }},
        {%- endif -%}
        "collection": {{ doc.collection | jsonify }},
        "excerpt":
          {%- if site.search_full_content == true -%}
            {{ doc.content |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | jsonify }},
          {%- else -%}
            {{ doc.content |
              replace:"</p>", " " |
              replace:"</h1>", " " |
              replace:"</h2>", " " |
              replace:"</h3>", " " |
              replace:"</h4>", " " |
              replace:"</h5>", " " |
              replace:"</h6>", " "|
            strip_html | strip_newlines | truncatewords: 50 | jsonify }},
          {%- endif -%}
        "categories": {{ doc.categories | jsonify }},
        "tags": {{ doc.tags | jsonify }},
        "url": {{ doc.url | absolute_url | jsonify }},
        "teaser":
          {%- if teaser contains "://" -%}
            {{ teaser | jsonify }}
          {%- else -%}
            {{ teaser | absolute_url | jsonify }}
          {%- endif -%}
      }{%- unless forloop.last and l -%},{%- endunless -%}
      {%- endunless -%}
    {%- endfor -%}
  {%- endfor -%}]
