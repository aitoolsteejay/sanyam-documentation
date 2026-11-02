# Whatsapp Automation for Aditya Gupta

# 1️⃣ Official API (Best + Safest)

Using the official **WhatsApp Business API** via providers.

Examples:

- Twilio
- WATI
- Interakt
- Gupshup
- 360dialog

### Cost

Typical pricing in India:

| Item | Cost |
| --- | --- |
| Platform subscription | ₹750 – ₹3000/month |
| Marketing message | ~₹0.80 – ₹1 per message |
| Number registration | ₹1000–3000 one time |

Marketing messages cost roughly **₹0.80–₹1 each** in India.

**For 6000 messages**

```
6000 × ₹0.8 = ₹4800
Platform fee = ₹1000 approx
Total ≈ ₹5800
```

### Steps

1. Create Facebook Business Manager
2. Verify business
3. Register number for WhatsApp API
4. Create **message template**
5. Upload contacts
6. Send campaign from dashboard

### Pros

✅ Zero risk of ban

✅ Can send 50k+ messages

✅ Supports personalization

✅ Analytics

### Cons

❌ Template approval required

❌ Slightly expensive

---

# 2️⃣ WhatsApp Cloud API (Direct Meta)

Instead of a provider, connect directly to **Meta Cloud API.

### Cost

Only message charges.

```
~₹0.8 per marketing message
```

For **6000 messages**

```
≈ ₹4800
```

### Steps

1. Setup Meta Developer account
2. Create WhatsApp App
3. Get API token
4. Use Python/Node script
5. Upload contacts
6. Send template message

### Pros

✅ Cheapest official way

✅ Full control

✅ No SaaS fees

### Cons

❌ Dev setup required

❌ Template approval needed

---

# 3️⃣ Chrome Extension / Web Automation (Grey Area)

Automate **WhatsApp Web**.

Tools:

- WA Web Plus
- WASender
- WA Bulk Sender

### Cost

| Item | Cost |
| --- | --- |
| Extension license | ₹1000–₹5000 |
| Message cost | free |

### Steps

1. Install extension
2. Upload CSV contacts
3. Write message template
4. Send with delay

Example message:

```
Hi {name},

We just launched our new product at {company}.
Check it out here: {link}
```

### Risk

⚠️ Medium ban risk if you send too fast.

Safe sending:

```
50–100 messages per hour
500–800 per day
```

### Pros

✅ Cheapest

✅ Easy setup

### Cons

❌ Risk of number ban

❌ No official API

---

# 4️⃣ Script Automation (Your Google Sheet Idea)

Your idea is **Sheet → Python → WhatsApp Web automation**.

Tech stack:

- Python
- Selenium / Playwright
- Google Sheets API
- WhatsApp Web

### Cost

| Item | Cost |
| --- | --- |
| Hosting | ₹0–₹500 |
| Development | your time |

### Steps

1. Put numbers in Google Sheet
2. Script reads rows
3. Opens WhatsApp Web
4. Sends message with delay
5. Logs sent status

Pseudo workflow:

```
Sheet → Python script → WhatsApp Web → Send message
```

Safe sending:

```
1 message every 20–30 seconds
≈ 2000/day
```

### Pros

✅ Very customizable

✅ Very cheap

### Cons

❌ Risk of ban

❌ Needs engineering