# SCAS — Sports Club Attraction Score

Deploy this app to Railway in 10 minutes. No coding required.

---

## What you need before starting

- A **GitHub account** (free) → https://github.com/signup
- A **Railway account** (free tier available) → https://railway.com

---

## Step 1: Create a GitHub repository

1. Go to https://github.com/new
2. Set **Repository name** to: `scas-tool`
3. Keep it **Public** (or Private — both work)
4. Do NOT check "Add a README" or ".gitignore" — this package already has those
5. Click **"Create repository"**
6. You'll see a page with setup instructions — keep this page open, you'll need the URL

---

## Step 2: Upload the code to GitHub

### Option A: Using GitHub's web interface (easiest)

1. On your new repository page, click **"uploading an existing file"** (it's in the blue Quick Setup section)
2. **Unzip** this package on your computer first
3. Drag ALL the files and folders from inside the unzipped folder into the GitHub upload area
   - Make sure you drag: `client/`, `server/`, `shared/`, `script/`, `package.json`, `nixpacks.toml`, and all other files
   - Do NOT drag the outer folder itself — drag the contents
4. Write a commit message like "Initial commit"
5. Click **"Commit changes"**
6. Verify: your repository should now show files like `package.json`, `nixpacks.toml`, `client/`, `server/`, etc. at the top level

### Option B: Using the terminal (if you have Git installed)

```bash
# 1. Unzip the package and go into the folder
cd /path/to/unzipped/scas-deploy-clean

# 2. Initialize git
git init

# 3. Connect to your GitHub repo (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/scas-tool.git

# 4. Add all files
git add .

# 5. Commit
git commit -m "Initial commit"

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy on Railway

1. Go to https://railway.com and sign in (use "Sign in with GitHub")
2. Click **"New Project"** (top right)
3. Click **"Deploy from GitHub Repo"**
4. Select your **scas-tool** repository from the list
   - If you don't see it, click "Configure GitHub App" and grant access to the repo
5. Railway will automatically start building. Wait 2–3 minutes.
6. Once the build succeeds (green checkmark), click on the service
7. Go to **Settings** → **Networking** → click **"Generate Domain"**
8. Railway gives you a URL like `scas-tool-production-xxxx.up.railway.app`
9. Open that URL — your SCAS app is live!

---

## Troubleshooting

**Build fails?**
- Make sure `package.json` and `nixpacks.toml` are at the root level of your repo (not inside a subfolder)
- Go to your GitHub repo and verify you can see `package.json` directly (not inside another folder)

**Page is blank?**
- Wait 30 seconds and refresh — the first load can be slow
- Check Railway logs for any error messages

**Need help?**
- Railway docs: https://docs.railway.com
- Railway Discord: https://discord.gg/railway

---

## What this app does

SCAS (Sports Club Attraction Score) assesses how attractive a sports club is across 5 dimensions:
- Fan Attraction (30%)
- Commercial Attraction (25%)
- Talent Attraction (15%)
- Media & Cultural Attraction (15%)
- Competitive Attraction (15%)

It supports 5 tiers from Grassroots to Elite, with tiered pricing (€19–€490).

---

## Notes

- Data is stored **in memory** — it resets when the app restarts. To keep data permanently, you'd need to add a PostgreSQL database (a future upgrade).
- The app automatically uses whatever port Railway assigns.
