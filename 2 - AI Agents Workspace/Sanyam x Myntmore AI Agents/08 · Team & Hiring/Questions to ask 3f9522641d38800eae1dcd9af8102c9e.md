# Questions to ask

**GitHub**

**You and a teammate edited the same file and got a merge conflict. What do you do?**

Pull the latest code first. Git marks the clash in the file with `<<<<<<<`, `=======` and `>>>>>>>`. Open the file, decide which version to keep or combine both, and check with the teammate if unsure. Delete the markers, test that it still works, then commit and push.

Red flag: deleting the teammate’s changes, or “I’d just copy my file over theirs.”

**You pushed something that broke the code. How do you undo it safely?**

Use `git revert` on the bad commit. This adds a new commit that undoes it, then push. Don’t use `git reset` or force-push on a shared branch, because that rewrites history for everyone. If the live site is down, roll back on Vercel first, then fix the code.

Red flag: force-pushing to main, or manually deleting the code they think caused it.

**Vercel**

**How does code get from GitHub to a live site on Vercel?**

The GitHub repo is connected to a Vercel project. Every push triggers an automatic build. Pushes or merges to the production branch (usually main) go to the live domain. Other branches get preview links.

**What’s a preview deployment, and how is it different from production?**

A preview deployment is a separate build with its own URL, made from a branch or pull request. It’s for testing and sharing before going live. Production is the live site on the real domain, built from the main branch. They can use different environment variables.

**Where do you put API keys for a project on Vercel, and why not in the code?**

In Project Settings → Environment Variables, set separately for Production, Preview and Development. Keys in code end up on GitHub, where anyone with access can see them. They also stay in the Git history even after you delete them. If a key leaks, rotate it.

Bonus: knows that in Next.js, variables starting with `NEXT_PUBLIC_` are visible in the browser, so secrets must never use that prefix.

**The live site broke after a deploy. How do you get the old version back in under a minute?**

In the Vercel dashboard, open Deployments, find the last working one and use Instant Rollback (or promote it to production). It goes live straight away with no rebuild. Then fix or revert the bad code before deploying again.

Red flag: “I’d fix the bug and redeploy” while the site stays down.

**Claude Code / Codex**

**What’s the biggest thing you’ve built with it?**

There’s no single right answer, so listen for specifics:

- what it does and who uses it
- whether it’s live or has a link
- which parts they did versus the AI
- problems they hit and how they solved them

Strong candidates can explain how it works without looking it up.

Red flag: vague answers, only tiny demo projects, or not being able to explain their own code.

**Tell me about a time it got something wrong. How did you notice?**

A concrete example, such as:

- making up a function or library that doesn’t exist
- editing files it shouldn’t have
- saying something works when it doesn’t
- quietly deleting code

They should have caught it by reading the changes, running the build, or testing it themselves.

Red flag: “It never gets things wrong,” or they only found out when a user complained.

**Supabase**

**What do you use Supabase for, and how is it different from a Google Sheet?**

Supabase is a hosted Postgres database with login, file storage and auto-generated APIs. Apps use it to store data like leads. Unlike a sheet, it has:

- fixed data types and rules (e.g. email must be unique)
- links between tables
- SQL queries
- safe handling of many writes at once
- security rules for apps

A sheet is made for people to read and edit by hand, and it breaks down at scale.

**What’s the difference between the anon key and the service_role key?**

The anon key is public and safe to use in the browser, but it can only do what the RLS rules allow. The service_role key ignores RLS and has full admin access. It must stay on the server (environment variables) and never go in browser code or GitHub.

Red flag: thinking they’re interchangeable, or using service_role in the frontend.

**What is RLS (Row Level Security), and why does it matter?**

RLS is a set of rules on each table that decides which rows a user or key can read, add, change or delete. It matters because the anon key is public. Without RLS, anyone who finds it could read or delete the whole table, such as our leads. For example, the website form should be allowed to add leads but not read them.

Red flag: never heard of it, or “I turn it off so things work.”