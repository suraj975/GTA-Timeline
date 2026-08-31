# Buy Me a Coffee: viability and analytics plan

_Research snapshot: 31 August 2026_

## Executive summary

Buy Me a Coffee is a credible, low-risk way to accept voluntary support for Grand Theft History. It can cover hosting and incremental development costs if the site attracts a meaningful audience, but it should not be treated as predictable income.

The platform is a payment and supporter-management layer, not a discovery channel. Grand Theft History must generate its own traffic through search, social sharing, communities and GTA-related news cycles.

The recommended approach is to add one restrained **Support the Archive** call to action near the finale, instrument the full support funnel and run a 60–90 day experiment before adding memberships or more prominent monetization.

## Market signals

- Buy Me a Coffee says more than one million creators use the platform.
- Third-party trend service Glimpse estimated 83,000 monthly searches and 14% year-over-year growth in search interest.
- Third-party traffic aggregators estimated approximately six million monthly visits to `buymeacoffee.com`. These figures are directional estimates, not audited company data.
- A Buy Me a Coffee team account stated that more than 50,000 creators received a payment during the preceding year. This is a company claim shared in a community discussion, not an independently audited earnings report.
- The company does not publish a useful median or percentile distribution of creator earnings. Its examples of high-earning creators therefore should not be used to forecast this project's income.

### Sources

- [Buy Me a Coffee overview and creator count](https://help.buymeacoffee.com/en/articles/10182730-what-is-buy-me-a-coffee-and-how-does-it-work)
- [Glimpse search-interest estimate](https://meetglimpse.com/trend/buy-me-a-coffee/)
- [Third-party traffic estimates](https://hypestat.com/info/buymeacoffee.com)
- [Community thread containing the 50,000-creators-paid claim](https://www.reddit.com/r/buymeacoffee/comments/1q56veg/newbie_here/)

## Evidence from creators

Public creator reports vary from no contributions over several years to hundreds of dollars in occasional support. One creator reported $1,063.80 in gross support and a $974.71 payout after platform, payment-processing and currency-related charges. Another community discussion includes examples ranging from zero payments to a few hundred pounds.

These reports demonstrate that the system can generate real payments, but they are self-reported anecdotes with selection bias. They are useful for understanding the range of outcomes, not for calculating an average.

An older donation-button discussion illustrates the funnel problem: one site reported roughly 200,000 visits with no donations, while an open-source project reported 11 donations from 5,953 visitors who had already clicked its donation link—about 0.2% conversion after the click. Placement, audience loyalty, utility and the wording of the request can change the result substantially.

### Sources

- [Recent small-creator experiences](https://www.reddit.com/r/SmallYTChannel/comments/1uzzcln/buy_me_a_coffee/)
- [Reported payout and fee example](https://www.reddit.com/r/buymeacoffee/comments/1q56veg/newbie_here/)
- [Donation-button conversion experiences](https://www.reddit.com/r/juststart/comments/fay2al/whats_the_conversion_rate_like_on_donation/)

## Current economics

Buy Me a Coffee currently lists:

- no monthly platform charge;
- a 5% platform fee;
- typical Stripe processing of 2.9% plus $0.30 per successful transaction;
- a 0.5% payout-processing fee;
- possible international, currency-conversion and subscription charges.

Creators can absorb the card-processing charge or ask supporters to cover it. Actual net receipts depend on the supporter location, creator payout country, currency and payment method.

For planning purposes, this document uses **$4.25 net from an average $5 contribution**. That is a conservative working assumption rather than a guaranteed payout.

### Sources

- [Official fee calculation](https://help.buymeacoffee.com/en/articles/8105744-how-to-calculate-charges-on-your-payment)
- [Official payout timing](https://help.buymeacoffee.com/en/articles/6364717-when-are-payouts-processed)
- [Supported payout countries](https://help.buymeacoffee.com/en/articles/6258038-supported-countries-for-payouts-on-buy-me-a-coffee)

## Grand Theft History revenue scenarios

There is no trustworthy Buy Me a Coffee visitor-to-support benchmark. The following table is a scenario model using a 0.05%–0.15% visitor-to-support rate and $4.25 net per contribution.

| Monthly visitors | Expected contributions | Approximate monthly net |
| ---: | ---: | ---: |
| 1,000 | 0–2 | $0–$8 |
| 10,000 | 5–15 | $21–$64 |
| 50,000 | 25–75 | $106–$319 |
| 100,000 | 50–150 | $213–$638 |

These are not forecasts. A viral post or a GTA VI news event may produce a temporary spike, while passive search traffic may convert below the model.

The model is:

```text
estimated net revenue = visitors × support conversion rate × average net contribution
```

## Fit for this project

### Advantages

- The experience visibly represents substantial design and development work.
- Nostalgia creates a stronger emotional response than a generic information site.
- A voluntary contribution preserves the premium presentation better than display advertising.
- There is no monthly platform cost, so a failed experiment has little financial downside.
- GTA VI news cycles may create concentrated periods of high-intent traffic.

### Constraints

- The current experience is primarily a one-time journey, so repeat support may be limited.
- Visitors initially connect with GTA history rather than with the individual creator.
- An intrusive donation request could weaken the archive's editorial tone.
- The project must remain clearly independent from Rockstar Games and Take-Two Interactive.
- Support must be described as funding the independent archive, hosting and original development—not funding GTA or selling Rockstar-owned material.

## Recommended presentation

Place the primary request after the visitor reaches the finale:

> **KEEP THE ARCHIVE RUNNING**  
> Grand Theft History is independently designed and maintained. If you enjoyed the drive, help cover hosting and future additions.  
> **Support the archive →**

Recommended rules:

1. Do not use a large floating donation widget throughout the journey.
2. Keep the primary action near the finale and a quiet text link in the footer.
3. Explain what support funds: hosting, accessibility, performance work and future chapters.
4. Default to a one-time $5 contribution; do not launch memberships without a recurring content plan.
5. Preserve the existing independent-project disclaimer beside the support language.

## 60–90 day analytics experiment

### Funnel events

Track these events without collecting unnecessary personal information:

| Event | Trigger | Purpose |
| --- | --- | --- |
| `support_cta_view` | Finale support block enters the viewport | Measures eligible audience |
| `support_cta_click` | Visitor opens the support link | Measures message and placement effectiveness |
| `support_return` | Visitor returns from the support page | Helps identify checkout return traffic |
| `timeline_complete` | Visitor reaches the finale | Separates engaged visitors from all visitors |
| `trailer_open` | Visitor opens a trailer case | Provides an engagement-quality signal |
| `era_complete` | Visitor crosses an era boundary | Shows where visitors abandon the journey |

Buy Me a Coffee's dashboard should be used for completed-support totals. Do not claim a completed contribution from a CTA click alone.

### Core metrics

```text
CTA click-through rate = support_cta_click / support_cta_view
Journey completion rate = timeline_complete / unique visitors
Visitor-to-support rate = completed contributions / unique visitors
Engaged visitor-to-support rate = completed contributions / timeline_complete
Net revenue per 1,000 visitors = net support revenue / unique visitors × 1,000
```

Segment results by:

- device class;
- traffic source;
- country or broad region, where privacy settings allow it;
- new versus returning visitor;
- journey completion;
- campaign or social post using UTM parameters.

### Decision thresholds

The thresholds below are internal experiment rules, not industry benchmarks.

- **Continue:** at least 0.05% of visitors contribute, or support reliably covers hosting.
- **Iterate:** visitors click the CTA but do not complete support; test the message, suggested amount and support-page trust signals.
- **Reposition:** finale completion is healthy but CTA clicks are very low; revise placement or explain the funding purpose more concretely.
- **Pause:** no contributions after 20,000 engaged visitors and at least two CTA/message tests.

## Opportunities beyond tips

If voluntary support is weak, the better long-term route is not a more aggressive donation prompt. It is expanding the archive into useful, shareable features that generate repeat visits:

- sourced release and platform pages;
- map and technology comparisons;
- original behind-the-scenes development notes;
- accessibility and performance case studies;
- an email update for major archive additions;
- original, legally reviewed digital products unrelated to copied game assets.

The timeline should remain the flagship attraction. Buy Me a Coffee is best treated as a lightweight support layer around that product, not the product itself.
