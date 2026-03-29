

# CMS Medicare Plan Freshness Dashboard

interactive dashboard analyzing how Medicare Advantage plan data changes over time — and what that means for building a reliable plan matching system.

## the dashboard

deployed on vercel ([link here](https://chapter-data-freshness.vercel.app/))

## overview

analyzes CMS CPSC data (Dec 2025 → Feb 2026) to surface:

* plan churn at the plan year transition
* rename volatility (names are unreliable identifiers)
* field stability (structural vs display data)
* geographic coverage shifts
* enrollment concentration + data masking

## key takeaway

data freshness isn’t uniform — systems should prioritize **when, where, and what to refresh**.

## stack

next.js · react · tailwind · recharts

---

built by Aashni Joshi · 2026
