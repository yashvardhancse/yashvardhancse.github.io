# YashVardhan Gupta - GitHub Pages Personal Website

A minimal, research-style Jekyll website designed for GitHub Pages.

## Key Technologies Used

### What is Jekyll?
**Jekyll** is a static site generator that transforms plain text (Markdown, HTML, CSS) into a complete static website. It's perfect for blogs and documentation sites because:
- No database needed - content is stored in simple files
- Fast and secure - serves pre-built HTML files
- GitHub Pages native support - free hosting with automatic deployment
- Great for developers who prefer version control over content management

Jekyll processes your Markdown files, applies layout templates, and generates the final HTML site.

### What is Ruby?
**Ruby** is a dynamic, expressive programming language known for being beginner-friendly yet powerful. In this project:
- Jekyll is built with Ruby and requires Ruby to run locally
- Ruby's package manager (`gem`) installs dependencies like Jekyll, Bundler, and plugins
- Bundler (a Ruby gem) manages all project dependencies listed in the Gemfile

### What is Ruby on Rails?
**Ruby on Rails** (or Rails) is a full-featured web framework built on Ruby for creating dynamic web applications with databases. It's different from Jekyll:
- Rails builds **dynamic, database-driven** applications (like Twitter, Shopify)
- Jekyll builds **static sites** with no server backend needed
- We use Jekyll here, not Rails, because this is a static personal website

### What is Liquid Template Language?
**Liquid** is a template language used by Jekyll to add dynamic content to static pages. It allows:
- Looping through blog posts: `{% for post in site.posts %}`
- Formatting dates: `{{ post.date | date: "%Y-%m-%d" }}`
- Conditional rendering: `{% if page.title %}`
- Accessing site data without rewriting HTML repeatedly

Examples in this site:
- Footer automatically shows current year: `{{ "now" | date: "%Y" }}`
- Blog listings dynamically pull from the `_posts` folder
- Navigation highlights active pages

add all this to readme without altering or removing anything else
what is jekyll
what is ruby
what is ruby on rails
what is liquid template language

## Run locally

### Prerequisites

**Ruby is required before installing bundle.** Follow these steps:

1. **Install Ruby** (if not already installed):
   - Download and install Ruby from [ruby-lang.org](https://www.ruby-lang.org/en/downloads/)
   - Follow the official installation guide for your operating system
   - **Optional:** Run your terminal as Administrator before installing Ruby for smoother installation
   - Verify installation by running: `ruby --version`

2. **Install Bundler**:
   ```bash
   gem install bundler
   ```

### Setup and Run

1. Install dependencies:

   ```bash
   bundle install
   ```

2. Start development server:

   ```bash
   bundle exec jekyll serve
   ```

3. Open `http://127.0.0.1:4000`.

## Deploy on GitHub Pages

1. Push this folder as your repository `yashvardhancse.github.io`.
2. In repository settings, ensure GitHub Pages is enabled for the default branch.
3. Your site will be live at `https://yashvardhancse.github.io`.

## Content locations

- Blog posts: `_posts/`
- Explorations posts: `_explorations/`
- Learning log page: `learning-log/index.md`
- Contact page: `contact/index.md`
- Styling: `assets/css/main.css`
