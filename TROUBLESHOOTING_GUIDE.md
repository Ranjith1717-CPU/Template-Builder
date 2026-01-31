# 🔧 Troubleshooting Guide - GitHub Pages 404 Error

## Common GitHub Pages 404 Issues and Solutions

### 🚨 Issue: "404 - There isn't a GitHub Pages site here"

This error typically occurs due to one of these issues:

## ✅ Solution 1: Check Repository Settings
1. Go to your GitHub repository
2. Click **Settings** (top menu)
3. Scroll down to **Pages** section (left sidebar)
4. Verify these settings:
   - **Source**: "Deploy from a branch"
   - **Branch**: "main" (or "master")
   - **Folder**: "/ (root)"
   - Click **Save**

## ✅ Solution 2: Verify Repository Name
- Repository must be named: `intelligent-template-builder`
- URL should be: `https://[your-username].github.io/intelligent-template-builder/`
- Make sure repository is **Public** (private repos need GitHub Pro for Pages)

## ✅ Solution 3: Check File Upload
Ensure all files are uploaded to the **root** of your repository:
```
your-repo/
├── index.html              ✅ MUST be in root
├── styles.css              ✅
├── app.js                  ✅
├── template-engine.js      ✅
├── README.md               ✅
└── other files...          ✅
```

**❌ WRONG**: Files in subfolder like `your-repo/intelligent-template-builder/index.html`
**✅ RIGHT**: Files in root like `your-repo/index.html`

## ✅ Solution 4: Wait for Deployment
- GitHub Pages can take 5-10 minutes to deploy
- Check the **Actions** tab for deployment status
- Look for green checkmark ✅ next to latest commit

## ✅ Solution 5: Force Refresh
1. Wait 10 minutes after enabling Pages
2. Try the URL again: `https://[username].github.io/intelligent-template-builder/`
3. Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
4. Try incognito/private browsing mode

## ✅ Solution 6: Check Custom Domain
If you set a custom domain:
- Remove custom domain temporarily
- Test with default GitHub Pages URL first
- Re-add custom domain after confirming it works

## 🔍 Debug Steps

### Step 1: Verify Repository Structure
Your GitHub repository should look like this:
```
intelligent-template-builder/
├── index.html              ← Main file (must be present)
├── styles.css
├── app.js
├── template-engine.js
├── README.md
├── LICENSE
└── .gitignore
```

### Step 2: Check GitHub Actions
1. Go to **Actions** tab in your repository
2. Look for "pages build and deployment" workflow
3. If red ❌: Click to see error details
4. If green ✅: Pages are deployed successfully

### Step 3: Test Local First
Before deploying to GitHub, test locally:
```bash
cd intelligent-template-builder
python3 -m http.server 8080
# Open: http://localhost:8080
```

If local doesn't work, fix files first before deploying.

## 🚀 Quick Fix Checklist

- [ ] Repository is **Public**
- [ ] Repository name is correct
- [ ] `index.html` is in repository **root**
- [ ] GitHub Pages is **enabled** in Settings
- [ ] Source is set to "Deploy from a branch"
- [ ] Branch is set to "main" or "master"
- [ ] Folder is set to "/ (root)"
- [ ] Waited 10+ minutes after enabling
- [ ] Tried clearing browser cache

## 📞 Still Having Issues?

### Alternative Deployment Method
If GitHub Pages still doesn't work, try these alternatives:

1. **Netlify** (Free):
   - Drag and drop the `intelligent-template-builder` folder
   - Get instant deployment URL

2. **Vercel** (Free):
   - Connect GitHub repository
   - Automatic deployment

3. **GitHub Codespaces**:
   - Use Codespaces to run the app
   - Share the preview URL

### Common URL Patterns
- ✅ `https://username.github.io/intelligent-template-builder/`
- ❌ `https://username.github.io/intelligent-template-builder/index.html`
- ❌ `https://intelligent-template-builder.github.io/`

## 📧 Need Help?
If you're still getting 404 errors:
1. Share your exact repository URL
2. Share your GitHub Pages settings screenshot
3. Share the exact error message

The most common issue is files not being in the repository root directory!