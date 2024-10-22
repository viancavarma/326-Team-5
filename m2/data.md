# Application Data

## Overview

### 1. Account Details

- **Description**: Unique to the user and how they are able to access their account from anywhere at any time.
- **Attributes**:
  - `user_name` (string): Used to log into account unique to each user.
  - `user_password` (string): Password for security of account.
  - `user_id` (integer): Links user to their account.
- **Data Source**: Data will be user-input upon creation of account, id will be system generated.

### 2. Dashboard

- **Description**: Provides user with an all encompassing look at how their spending has been for this period. 
- **Attributes**:
  - `badges` (boolean): Evaluate based on the users completiton of savings for the given month.
  - `badges_time` (datetime): Date and time the badge was completed by the user. 
  - `category` (string): Category of given expense.
  - `total_spending` (float): Sum of expenses made by user.
  - `amount_category` (float): Amount of money spent for a given category.
  - `spending_breakdown_percent` (object): Categories will map to percent of the amount to total spending.
  - `spending_breakdown_bar` (object): Categories will map to the amount spend in that category to create the bar chart. 
  - `dashboard_time` (datetime): Takes the date and time the dashboard was last altered. 
  - `dashboard_id` (integer): Allows dashboard to be accessed via unique identification code, will be overwritten if dashboard is accessed again in same month.
- **Data Source**: Data will be user-input for badges and the expense details, however any datetime, ids, and calculations will be system-generated.

### 3. Logs

- **Description**: Allows the user to access past dashboards and expenses from priot months of spending. 
- **Attributes**:
  - `month_year` (datetime): Month and year of the dashboard desired to be accessed.
  - `dashboard_id` (datetime): Allows dashboard to be accessed via unique identification code, will be overwritten if dashboard is accessed again in same month.
  - `expense_id` (integer): A unique identifier for each expense entry.
- **Data Source**: Data will be user-input for the time of log they would like to access, but system generated for id types.

### 4. Settings

- **Description**: Allows user to change preferences about their account.
- **Attributes**:
  - `user_name` (string): Used to log into account unique to each user.
  - `user_password` (string): Password for security of account.
  - `user_id` (integer): Links user to their account.
  - `currency` (string): Type of currency that the user is familiar with.
- **Data Source**: Currency, name, and password, are all user-input fields, but id will be system generated.

### 5. Tips

- **Description**: Displays different tips based on user spending.
- **Attributes**:
  - `tips` (array): Array of strings which are different tips generated from user habits and help advise less spending. 
- **Data Source**: This data will be system generated upon the creation of our application.

### 6. Expenses

- **Description**: Allows user to input expenses and describe them for further use in tracking and logging. 
- **Attributes**:
  - Expense_id(integer): A unique identifier for each expense entry.
  - user_id(integer):The identifier linking the expense to a user.
  - category(string): The category of the expense for example: food rent and utilities.
  - amount(float): the amount of money spent.
  - data(datetime): The data the expense was incurred.
  - description(string): A brief descriptions of the expense.
- **Data Source**: Data will be user-input every time there is a new expenditure being logged on the page.

### 7. Financial Goals
- **Description**: User will be able to set goals that they want to attain for spending. 
- **Attributes**:
  - goal_id(integer): A unique identifier for each financial goals.
  - user_id(integer): The identifier when linking the goal to a user.
  - target_amount(float): The financial target of the goal.
  - current_amount(float): the current saved amount towards the goal.
  - deadline(date): the target date to achieve the financial goal.
  - description(string): A brief description of the goal.
- **Data Source**: Goals data will be user-input and stored.

### 8. Notifications
- **Description**: Alerts that can be recieved by the user anywhere on their dashboard. 
- **Attributes**:
  - notification_id(integer): A way to identify for each notification.
  - user_id(integer): The identifier linking the notification to a user.
  - message(string): the content of the notification.
  - data(datetime): The data and time the notification was generated.
- **Data Source**: Notifications will be system-generated from algorithms based on urgency and use. 

## Data Relationships

- **User Profile and Expenses:** For each user profile they can have multiple expense entries allowing the the user to keep a relationship that allow us to track all expense by the user.
- **User Profile and Financial Goals:** Each user profile can have multiple financial goals. This can help support tracking progress toward financial target set by the user.
- **User Profile and Notification:** The notification are generated based on the user activities and preferences. Each user profile can receive multiple notifications particularly related to budget limited or goal achievements.
- **User expenses and tips:** Tips will be generated through patterns in user spending, so if the application sees an increase in a certain category of spending it will prompt a tip to appear about minimizing this type of expenditure. 
- **Logs and dashboard:** The dashboard is essentially a summary of user spending so it will have to be accessed by the logs whenever the user wants to look back into their prior spending habit summaries
- **Logs and expenses:** Like the dashboard, the expenses will need to be accessed in a monthly list whenever the user wants to go back and access their past expenditures. 

## Data Sources

- **User Inputs:** Majority of the data, including expense, financial goals and user profiles updates, come directly from user input through the application interface.
- **System generated:** Same with notifications they are generated by the system, based on rules set for budget tracking or goal progress.
- **Third party apis:** Data can also be integrated from banking apis to automatically updates expense records and financial goal process.
