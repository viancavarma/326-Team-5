# Notifications




## Sequence Diagram

```mermaid
sequenceDiagram
    User ->> UI: Opens Notification Tab
    User ->> UI: Clicks "Mark as Read"
    User ->> UI: Clicks "Mark as Important"
    User ->> UI: Clicks "Archive"
    User ->> UI: Clicks "Delete"
    User ->> UI: Clicks "Clear All Notifications"
    UI ->> Database: Update notification status in array
    Database ->> Display: Update display
```