# GitLab Authentication Guide

Since I cannot access your GitLab account directly to generate a token, you'll need to generate one and configure it.

## Step 1: Generate a Personal Access Token

1.  Log in to your GitLab account.
2.  Go to **User Settings** > **Access Tokens** (or click this link: [https://gitlab.com/-/user_settings/personal_access_tokens](https://gitlab.com/-/user_settings/personal_access_tokens)).
3.  Click **Add new token**.
4.  **Name**: `salam-deploy` (or anything you like).
5.  **Expiration date**: Leave empty for no expiration, or set one if you prefer.
6.  **Scopes**: Select **`write_repository`** (this allows pushing code).
7.  Click **Create personal access token**.
8.  **COPY THE TOKEN**. You won't see it again.

## Step 2: Configure the Remote URL

Run the following command in your terminal, replacing `YOUR_TOKEN_HERE` with the token you just copied.

> **Note:** I noticed you used `slam-nextjs` (missing 'a') in the URL. If the repo is actually `salam-nextjs`, please correct it in the command below.

```bash
git remote set-url gitlab https://oauth2:YOUR_TOKEN_HERE@gitlab.com/islamux/slam-nextjs.git
```

_If your repo name is actually `salam-nextjs`, use this instead:_

```bash
git remote set-url gitlab https://oauth2:YOUR_TOKEN_HERE@gitlab.com/islamux/salam-nextjs.git
```

## Step 3: Push

Now you can push without being asked for a password:

```bash
git push gitlab refactor/improvement-plan
```
