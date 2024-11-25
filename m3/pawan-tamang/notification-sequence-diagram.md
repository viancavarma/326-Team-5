# Notifications




## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant UI as User Interface
    participant JS as Notification Script
    participant DOM as DOM Manipulation
    participant DB as Notification Array
    
    User ->>+ UI: Opens Notification Tab
    UI ->>+ JS: Trigger renderNotifications()
    JS ->>+ DOM: Clear existing notifications
    DOM ->>- JS: Cleared
    JS ->>+ DB: Fetch notifications
    DB -->>- JS: Return notifications
    
    alt No Notifications
        JS ->> DOM: Display "No Notifications"
    else Notifications Exist
        loop For Each Notification
            JS ->> DOM: Display Notification with Actions
        end
    end
    
    User ->>+ UI: Interact with Notification (e.g., Mark as Read)
    UI ->>+ JS: Execute Action (e.g., markAsRead(id))
    JS ->>+ DB: Update Notification Status
    DB -->>- JS: Updated
    JS ->> DOM: Update Notification Display
    DOM -->>- JS: Display Updated

    User ->> UI: Click "Clear All Notifications"
    UI ->> JS: clearNotifications()
    JS ->> DB: Clear All Notifications
    DB -->> JS: Cleared
    JS ->> DOM: Display "No Notifications"
    DOM -->> JS: Display Updated
```