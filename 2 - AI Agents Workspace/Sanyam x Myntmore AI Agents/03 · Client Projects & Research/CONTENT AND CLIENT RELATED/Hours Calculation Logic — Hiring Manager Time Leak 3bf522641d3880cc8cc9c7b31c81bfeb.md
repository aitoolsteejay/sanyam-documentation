# Hours Calculation Logic — Hiring Manager Time Leak

---

## The Big Idea

When a hiring manager or leader spends time on hiring — reading resumes, sitting in interviews, chatting about candidates afterward — that's time they're not spending running their team. This tool adds up all of that time into one number: **total leadership hours spent to make one hire.**

Then it shows a second number: **roughly how many of those hours a specialist recruiter (like Antal) would save**, because a specialist finds the right people *before* they ever reach an interview room.

---

## Part 1: Adding Up "Right Now" Hours

Think of it like adding up receipts. Every little task in hiring has a small time cost, and we just add them all up. Here are the 9 things we count:

1. **Reading resumes** — every resume the hiring manager personally looks at takes a few minutes.
2. **Setting up interviews** — every interview round someone has to schedule takes a bit of back-and-forth.
3. **Recruiter check-ins** — every candidate a recruiter screens needs a quick sync with the hiring manager.
4. **Technical interviews** — the actual time spent in technical interview rounds, plus the time spent preparing beforehand.
5. **Hiring manager interviews** — same idea, for rounds the hiring manager personally runs.
6. **Leadership interviews** — same idea again, but if *more than one* senior leader (like a Director, VP, or CTO) sits in on these rounds, we count their time separately for each person in the room. Three leaders in the same interview = three people's time, not one.
7. **Feedback chats** — after every interview round, someone has to discuss how it went.
8. **Rejecting candidates** — every candidate who doesn't move forward still takes a few minutes to formally close out.
9. **Offers that fall through** — if someone gets an offer and turns it down, that's extra rework to restart part of the process.

We add all nine of those up, and that's the big number at the top of the report: **total leadership hours.** We also show that same number as "working days" and "weeks," just so it's easier to picture.

### A real example

Here's what it looks like for a sample hiring process (reviewing 70 resumes, 35 recruiter screens, 16 technical interviews, 10 hiring-manager interviews, and so on, with a Director, VP, and CTO all involved in later rounds):

| What it is | Hours it costs |
| --- | --- |
| Reading resumes | 7 |
| Setting up interviews | 5.5 |
| Recruiter check-ins | 5.8 |
| Technical interviews | 21.3 |
| Hiring manager interviews | 13.3 |
| Leadership interviews | 16 |
| Feedback chats | 8.3 |
| Rejecting candidates | 3.3 |
| Offers falling through | 6 |
| **Total** | **≈ 86.5 hours** |

That's about **11 working days**, or **2.2 weeks**, of a leader's time — just to make one hire.

---

## Part 2: What a Specialist Would Save

Now for the second number: what happens if a specialist recruiter (Antal) is running this search instead?

The idea is simple: **a specialist filters out the wrong people before anyone's calendar gets touched.** So instead of your technical, hiring-manager, and leadership rounds being full of some candidates who were never going to be a fit, a specialist has already screened those people out. That means:

- Most of the interview time that used to be wasted on unsuitable candidates goes away.
- Almost all of the time spent formally rejecting candidates goes away too, because far fewer unsuitable people make it that far.

We don't wipe out *all* of it — hiring will always take some leadership time — so there's a floor: the specialist number can never drop below about a quarter of what it started at. That keeps the comparison realistic instead of sounding too good to be true.

### Same example, with a specialist

Starting from the same 86.5 hours above:

- We look at how many hours were spent on technical, hiring-manager, and leadership interviews, plus rejecting candidates.
- We estimate a specialist removes more than half of the "wasted on the wrong candidates" portion of that interview time, and almost all of the rejection-closing-out time.
- That works out to about **30 hours saved.**

So the comparison shown is:

> **Right now: 87 hours → With a specialist: 56 hours → 31 hours given back** (about 4 working days), for this one hire.
> 

---

## The Honest Caveat

Every number here comes from simple assumptions we've written down on purpose (like "a rejected candidate takes 15 minutes to close out") — not from real data about your company. Think of it as a realistic *estimate* to show the shape of the problem, not an exact audit. If real numbers from your own hiring process were plugged in, the constants behind these estimates should be recalibrated to match.