# Categorize Expenses Features

## Add Expenditure
**Description:**  
The Add-Expenditure feature allows users to store their expenses in the logs by entering a label of choice, amount they spent, and the category they would like to put that expense under. All expenditures are saved to an indexed database. The feature ensures users can store their spending in real time and keep seamless track of them.

### Sequence Diagram
```mermaid
sequenceDiagram
    User->>Frontend: Opens Add Expenditure page
    Frontend-->>User: Displays the form (label, amount, category, submit button)
    User->>Frontend: Enters label, amount, category of choice and clicks the submit button
    Frontend->>IndexedDB: Saves expenditure with label, amount, category, and date when this was entered
    IndexedDB-->>Frontend: Confirms save
    Frontend-->>User: Clears the form as it is saved
```