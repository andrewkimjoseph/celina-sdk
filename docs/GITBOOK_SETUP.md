# GitBook setup

Follow these steps to connect this repository to GitBook and publish the docs site.

## Prerequisites

- Push the `docs/` folder and `.gitbook.yaml` to `main` on [github.com/andrewkimjoseph/celina-sdk](https://github.com/andrewkimjoseph/celina-sdk)
- A [GitBook](https://www.gitbook.com) account

## 1. Create organization and space

1. Sign up or log in at [gitbook.com](https://www.gitbook.com)
2. Create an **Organization** (e.g. "Celina")
3. Create a **Space** named "Celina SDK"

## 2. Connect Git Sync

1. In the space, click **Set up Git Sync** (top right)
2. Install the **GitBook GitHub app** when prompted
3. Authorize access to `andrewkimjoseph/celina-sdk`
4. Select branch: **`main`**
5. **Project directory:** leave empty (`.gitbook.yaml` at repo root sets `root: ./docs/`)
6. Initial sync direction: **GitHub → GitBook**

GitBook will import all pages listed in `SUMMARY.md`.

## 3. Create and publish docs site

1. Create a **Docs site** in your GitBook organization
2. Link the "Celina SDK" space as a section
3. Customize branding (logo, colors) if desired
4. Optional: add a custom domain (e.g. `docs.celina.xyz`)
5. Set audience to **Public**
6. Click **Publish**

## 4. Update package homepage

After publishing, update `homepage` in `package.json`:

```json
"homepage": "https://<your-org>.gitbook.io/celina-sdk"
```

Replace with your actual GitBook site URL.

## Ongoing workflow

When you change SDK code or hand-written docs:

```bash
npm run docs:api          # regenerate API reference
npm run docs:summary      # refresh API links in SUMMARY.md (optional)
git add docs/
git commit -m "docs: update"
git push origin main
```

GitBook syncs automatically on push to `main`.

## Troubleshooting

- **New page not showing:** Add it to `docs/SUMMARY.md` — every `.md` file must appear exactly once.
- **Sync errors:** Ensure `docs/README.md` exists (GitBook homepage).
- **API pages missing:** Run `npm run docs:api` and commit `docs/api-reference/`.

See [GitBook Git Sync docs](https://gitbook.com/docs/getting-started/git-sync/content-configuration) for advanced configuration.
