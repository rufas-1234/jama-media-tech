# News, Insights, and Projects Admin

## Local Development

Start the frontend with `npm run dev`, then open `http://127.0.0.1:3000/admin/login`.

The local development credentials are stored in the ignored `.env.local` file. The editor saves local News and Project entries to `data/news-posts.json`, and site settings to `data/site-content.json`; this is for preview and development only. Do not rely on these local files or `public/uploads` for production or serverless deployments.

## Production Publishing

Configure these values in the deployment platform's secret settings, not in tracked files:

- `ADMIN_USERNAME`: editorial account name.
- `ADMIN_PASSWORD`: unique, strong editorial password.
- `ADMIN_SESSION_SECRET`: random secret of at least 32 characters.
- `WORDPRESS_API_URL`: WordPress REST base URL, including `/wp-json`.
- `WORDPRESS_API_USER`: dedicated WordPress editor account.
- `WORDPRESS_API_PASSWORD`: an application password for that account.

For example, the WordPress URL format is `https://cms.example.org/wp-json`. The WordPress account needs permission to read, create, update, and delete posts and projects. The custom post type must use the REST route `projects` and be registered with `show_in_rest => true`.

The editor accepts JPEG, PNG, WebP, or GIF image uploads up to 5 MB. WordPress publishing uses the Media REST endpoint, so the account also needs the `upload_files` capability. In local development, uploads are stored under `public/uploads`; production deployments should use WordPress Media rather than local disk.

Projects also need these registered REST metadata keys on the `project` post type: `jama_project_category`, `jama_project_location`, and `jama_cover_image`. News posts use `jama_cover_image` when a cover image URL is supplied. Register those keys with `show_in_rest => true` and string types so values can be read and written by this editor.

A minimal registration example for a site plugin or theme:

```php
add_action('init', function () {
	register_post_type('project', [
		'label' => 'Projects',
		'public' => true,
		'show_in_rest' => true,
		'rest_base' => 'projects',
		'has_archive' => true,
		'supports' => ['title', 'editor', 'excerpt', 'thumbnail'],
	]);

	foreach (['jama_project_category', 'jama_project_location', 'jama_cover_image'] as $key) {
		register_post_meta('project', $key, [
			'type' => 'string',
			'single' => true,
			'show_in_rest' => true,
			'auth_callback' => static fn () => current_user_can('edit_posts'),
		]);
	}

	register_post_meta('post', 'jama_cover_image', [
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
		'auth_callback' => static fn () => current_user_can('edit_posts'),
	]);
});
```

After the WordPress values and REST fields are configured, the same `/admin/login` editor writes News to `/wp/v2/posts` and Projects to `/wp/v2/projects`. Published News appears on the homepage and `/news`; published Projects appear on `/projects`. Both types have dynamic detail routes.

## Site Content Storage

Site-wide editable information (company/contact details, vision, mission, homepage hero and custom sections, services, and team members) is saved in one private `site-settings` custom post. Register its REST route and metadata in a site plugin or theme:

```php
add_action('init', function () {
	register_post_type('site_setting', [
		'label' => 'Site Settings',
		'public' => false,
		'publicly_queryable' => false,
		'show_ui' => false,
		'show_in_rest' => true,
		'rest_base' => 'site-settings',
		'capability_type' => 'post',
		'supports' => ['title', 'custom-fields'],
	]);

	register_post_meta('site_setting', 'jama_site_content', [
		'type' => 'string',
		'single' => true,
		'show_in_rest' => true,
		'auth_callback' => static fn () => current_user_can('edit_posts'),
	]);
});
```

The editor creates the private record on first save. For durable production image uploads, configure WordPress Media and grant the editorial account the `upload_files` capability.

The admin session uses a signed, HTTP-only, strict same-site cookie and expires after eight hours. Change the local password and session secret before sharing the development server or deploying.