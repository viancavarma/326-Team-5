# UI Diagrams

## Dashboard Screen
The Dashboard screen serves as the central hub where users can monitor their spending and savings progress. On the left side, a sidebar provides navigation links for the primary features of the application, including "Dashboard," "Add Expenditure," "Logs," "Saving Goals," "Tips," "Notes" and "Settings."
![2](https://github.com/user-attachments/assets/bc57a257-eddb-44a5-a8a1-f2689ab4902e)
The main part of the screen displays two visualizations: a bar chart for daily expenditures across a week and a pie graph that breaks down spending habits by category. This helps users understand how their spending is distributed across different needs. On the right side of the screen, there is a "Badges" section, which tracks the user’s progress toward various savings milestones. This feature encourages users to set and meet financial goals in a gamified manner. 
Users can quickly navigate to other sections like adding new expenditures or checking saving goals from the sidebar.

## Add Expenditure Screen
This screen allows users to add any new expense. For each expense they add, they would specify a label for it (any name they like), the amount of the expense, and the category they would like to put this under(e.g., food, travel, shopping, etc).
![3](https://github.com/user-attachments/assets/8f05e7fa-dec9-4ffa-aac4-7ba26709213f)
The add expenditure screen is a simple form where users can quickly add their expenditures and pick labels and categories for them. These will assist in making the visual analytics for their monthly/weekly expenditures. The user has to fill out three fields in the form: the label (e.g., "Target run Sun 10/20"), the amount (e.g., 137.52), and the category from a dropdown list (e.g., food, utilities, travel, etc). They can also add a new category if they want to personalize the categories they have.

**Use Case**: After purchasing groceries, the user goes to the "Add Expenditure" tab from the nav bar. They enter the details of the purchase (for instance, label: Target groceries, amount: 110.00, category: food). Next, they click the 'Submit' button to complete adding it from their side. The expense is then added to their logs and will be reflected in the summary graphs and charts.

## Expense Logs Screen
This screen provides the user with a tabular view of all the expenses entered by them. It would also allow them to search for expenses based on date, labels, amounts, or categories.
![4](https://github.com/user-attachments/assets/9492d2f1-6a8f-4dcc-a2fa-dbf433fd749a)
Users can see their complete list of expenses in a grid or excel like layout. There would be columns for the date the expense was added, the label of expenses, the amount spent, and the category selected for the expense. The table would allow the user to easily view a filtered log based on their search or simply see the entire history of their expenditures.

**Use Case**: A user wants to search the number of "Target run" they made in the last month. They first navigate to the logs screen which shows all their expenses. They can then search for the label "Target run" and keep a date limit for the last month. They can then see how many times they went to Target and the total amount they spent each time.

## Savings Goal Screen
This screen allows users to check their current savings goals that they set or set a new savings goal.
![5](https://github.com/user-attachments/assets/faa729e6-4627-41cd-bec1-769ab1e280fa)
Users can set a savings goal by entering the goal name and the target amount. Existing goals are displayed in a list with progress bars that visually indicate how close they are to achieving each goal.

**Use Case**: A user plans to go to a concert and wants to set a savings goal of $300. They navigate to the savings goal screen from the nav bar. They then add information about the goal like a name, the amount, and  the date by which they would like to achieve it. Over time as they save money, the progress bar would keep updating to show how close they are to achieving the goal.

## Tips Screen
The Tips screen is designed as a resourceful page where users can find practical advice on how to manage their finances more effectively. 
![6](https://github.com/user-attachments/assets/732ec958-4245-4f00-b210-c6dc16087a86)
It dynamically generates financial advice based on the user's expenditure data and savings goals. After the user enters their spending information and defines their savings goals, a simple algorithm analyzes the data to identify spending patterns and areas where the user can improve. The algorithm compares the user's spending habits to their goals and provides relevant tips to help them save more effectively.
This feature provides personalized advice, helping users to stay aligned with their savings goals by offering tailored suggestions.

## Notes Screen
The Notes screen provides a simple and intuitive interface for users to track important financial reminders and tasks related to their budgeting or saving goals.
![7](https://github.com/user-attachments/assets/f66cfa09-5e28-48c4-bf31-d27a6588a7fb)
The right side of the screen displays a task management section where users can create and check off specific financial tasks. A "Submit" button at the bottom of the task section allows users to update their tasks list, providing a straightforward way to track progress. The left-side navigation is consistent with the other screens, giving users quick access to other features. This screen enables users to jot down important financial notes and stay on top of their savings strategies by managing actionable tasks.
