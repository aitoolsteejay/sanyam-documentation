# Outreach Tool: secure client LinkedIn credentials (vault the CREDENTIALS_ENCRYPTION_KEY, decide on plaintext 2FA codes, review who can reveal passwords)

Area: Tech & infra
Notes: Accepted as is (8 Oct). CREDENTIALS_ENCRYPTION_KEY lives only in the Outreach Tool's Vercel environment variables: never delete or change it, or every stored client LinkedIn password is lost. 2FA codes stay as plain text. Admins (Sanyam, TJ) can reveal passwords, and every reveal is logged.
Phase: 2. Secure access
Priority: High
Status: Done
System: Outreach Tool