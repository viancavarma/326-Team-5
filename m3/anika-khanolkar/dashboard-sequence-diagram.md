# Dashboard
**Description:** 
The tips feature provides budgeting advice by highlighting two key spending areas: the user's biggest purchase and largest expense category. It generates three weekly tips—either automatically or user-initiated—sourced from general saving strategies or personalized user tips like "Dunkin' only once a week," which appear randomly in weekly suggestions. A "tip jar" allows users to submit personal tips, and a sidebar highlights three finance influencers with links to their social media for additional advice.

## Sequence Diagram
```mermaid
sequenceDiagram
    user->>frontend: opens page
    frontend-->>user: displays page
    frontend-->>user: shows the bar graph for weekly spending habits
    frontend-->>user: shows the pie chart for monthly spending habits
    frontend-->>user: shows the badges for savings
    user->>frontend: clicks forwards/backward buttons to scroll through weeks/months in the respective graphs
    frontend-->>user: categorically shows user where money was spent by color coding the categories in both charts
    user->>frontend: clicks the boxes next to each save option to track how much they have saved
    frontend-->>user: clicked boxes are shown with a blue tick
```
