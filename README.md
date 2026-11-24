# Clevanoo website

The public site uses the supplied redesign in `frontend/` and the existing Laravel API in `backend/`.

## Run locally

```bash
npm ci
npm start
```

The preview listens on `http://localhost:3000`. Set `PORT` to use a different port. The command builds an isolated preview before serving it. Restart it after editing the source.

With XAMPP running, the preview forwards the public forms and jobs requests to
`http://localhost/clevanoo_website/backend/public/api`. Set `CLEVANOO_API_BASE_URL` to point at another local or staging API when needed.

## Build for Apache

```bash
npm run build
```

Publish the contents of `build/` at the domain root, including its generated `.htaccess`. Enable `mod_rewrite` and keep the Laravel backend available at `/backend/public/api`. The build includes clean URLs such as `/speciality`, `/case-studies`, and `/job/<id>`. An explicit `CLEVANOO_API_BASE_URL` overrides the default production API location.

### Production Laravel configuration

- Serve the Laravel `public/` directory over HTTPS. For the existing nested Apache layout, install both Laravel `.htaccess` files and enable rewrite overrides.
- Set `APP_ENV=production`, `APP_DEBUG=false`, `SESSION_SECURE_COOKIE=true` and `APP_URL=https://clevanoo.com/backend/public`. Set PHP `display_errors=Off` and point `upload_tmp_dir` at a directory writable by PHP. Preserve the deployed `APP_KEY`, database, and uploaded files.
- Configure the production SMTP transport and `WEBSITE_MAIL_TO`. Contact, unsubscribe and application notifications go to that mailbox. New résumés use Laravel's public disk and can be downloaded by anyone with the link. Previously saved private résumés still require their signed links.
- The original `/jobUpload` page and its job write endpoints are accessible without a login.
- Run `php artisan migrate --force` from `backend/` for pending migrations and rebuild the Laravel config cache after changing environment settings. Test mailbox delivery on the deployed environment with a controlled recipient before launch.

Run `php artisan test` from `backend/` for isolated job management, mail and résumé checks. The suite uses an in-memory SQLite database and defaults to a non-delivery mail transport.

Shared templates are in `frontend/src/partials/`, public page content in `frontend/src/pages/`, and jobs and form integrations in `frontend/src/site/`. The original React app remains available with `npm run start:legacy` or `npm run build:legacy`.
