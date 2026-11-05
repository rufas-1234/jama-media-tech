# Content, Database, and Media Setup

## Local Development

Start the app with `npm run dev`, then open `http://127.0.0.1:3000/admin/login`.

Without TiDB credentials, development uses `data/news-posts.json` and `data/site-content.json`. Local uploads go to `public/uploads`. These files are a development fallback only; Vercel's filesystem is not persistent.

## TiDB Cloud

1. Create a TiDB Cloud cluster and database. Create an application user with access limited to this database.
2. Select the database in the TiDB SQL editor and run [`db/schema.sql`](./db/schema.sql).
3. If this database already has the `posts` table, run [`db/migrations/002-post-gallery-images.sql`](./db/migrations/002-post-gallery-images.sql) once to enable multiple images per news story or project. New databases already include this column in `schema.sql`.
4. Configure the following server-only environment variables:
   - `TIDB_HOST`: cluster endpoint hostname.
   - `TIDB_PORT`: cluster port, normally `4000`.
   - `TIDB_USER`: application username.
   - `TIDB_PASSWORD`: application password.
   - `TIDB_DATABASE`: database name.
   - `TIDB_CA_CERT`: optional PEM certificate content if your cluster requires its downloaded CA certificate. Paste the certificate content (preserving PEM newlines), not a local file path.

The application connects using TLS and expects the schema to exist before deployment. Do not expose TiDB credentials through `NEXT_PUBLIC_*` variables.

## Vercel

Create or link the `jama-media-tech` Vercel project, connect it to `rufas-1234/jama-media-tech`, and add production environment variables for the five TiDB settings above, plus:

- `ADMIN_USERNAME`: a non-default editorial account name.
- `ADMIN_PASSWORD`: a unique, strong editorial password.
- `ADMIN_SESSION_SECRET`: a randomly generated secret with at least 32 characters.
- `NEXT_PUBLIC_SITE_URL`: the production Vercel URL or custom domain.
- `NEXT_PUBLIC_BASE_PATH`: leave blank unless the site is intentionally hosted below a URL path.
- `ENQUIRIES_ENABLED`: keep `false` until enquiry handling and privacy wording are configured.

Create a **public** Vercel Blob store and connect it to the project using Vercel's default OIDC authentication. Vercel adds the store/OIDC environment values; the app uses those on Vercel. `BLOB_READ_WRITE_TOKEN` is optional for local or non-Vercel use. Uploaded images are public because they are displayed by public pages. Keep any static token server-only.

Use the same database and admin variables for Preview only if preview deployments should have access to production content. Otherwise configure a separate TiDB database and separate admin credentials for Preview.

## Existing WordPress Content

The application no longer calls WordPress. Existing WordPress posts and site settings are **not imported automatically**; export and migrate the content and media into TiDB/Blob before cutover if those records need to be retained. The local JSON files are not a substitute for a WordPress export.

## Verify

After applying the schema and setting Vercel variables, deploy and sign in at `/admin/login`. Verify editing site content, publishing news/projects, and uploading an image. Do not rely on local JSON or `public/uploads` for production data.
