# Tips Feature
**Description:** 
The tips feature provides budgeting advice by highlighting two key spending areas: the user's biggest purchase and largest expense category. It generates three weekly tips—either automatically or user-initiated—sourced from general saving strategies or personalized user tips like "Dunkin' only once a week," which appear randomly in weekly suggestions. A "tip jar" allows users to submit personal tips, and a sidebar highlights three finance influencers with links to their social media for additional advice.

## Sequence Diagram
```mermaid
sequenceDiagram
    user->>frontend: opens page
    frontend-->>user: displays page
    frontend-->>user: shows the biggest purchase and expense category
    frontend-->>user: shows 3 tips for the week
    user->>frontend: clicks cash
    frontend-->>user: refreshes and re-randomizes the 3 displayed tips
    user->>frontend: inputs and submits a custom tip
    frontend-->>user: refreshes and re-randomizes the 3 displayed tips with chance of being the custom tip
    user->>frontend: clicks any of influencer links
    frontend-->>user: redirects user to a different site depending on the link clicked
```