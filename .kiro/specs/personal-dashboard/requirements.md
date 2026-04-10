# Requirements Document

## Introduction

A personal dashboard web app built with HTML, CSS, and Vanilla JavaScript. It runs entirely in the browser with no backend — all data is persisted via the Local Storage API. The dashboard provides a greeting with time and date, a configurable focus timer, a to-do list, and a quick links panel. It also supports light/dark mode, a custom user name in the greeting, and a user-configurable Pomodoro duration.

## Glossary

- **Dashboard**: The single-page web application described in this document.
- **Storage**: The browser's Local Storage API used to persist all user data.
- **Greeting_Widget**: The UI component that displays the current time, date, and a personalized greeting.
- **Timer**: The focus/Pomodoro countdown timer component.
- **Todo_List**: The UI component that manages the user's task list.
- **Quick_Links**: The UI component that manages and displays user-defined website shortcuts.
- **Theme**: The visual color scheme of the Dashboard, either light or dark.
- **Task**: A single to-do item with a title and a completion status.
- **Link**: A user-defined shortcut consisting of a label and a URL.

---

## Requirements

### Requirement 1: Greeting Widget

**User Story:** As a user, I want to see the current time, date, and a contextual greeting when I open the dashboard, so that I have an at-a-glance overview of the moment.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL display the current time in HH:MM format, updated every minute.
2. THE Greeting_Widget SHALL display the current date including the day of the week, month, and year.
3. WHEN the current time is between 05:00 and 11:59, THE Greeting_Widget SHALL display the greeting "Good morning".
4. WHEN the current time is between 12:00 and 17:59, THE Greeting_Widget SHALL display the greeting "Good afternoon".
5. WHEN the current time is between 18:00 and 21:59, THE Greeting_Widget SHALL display the greeting "Good evening".
6. WHEN the current time is between 22:00 and 04:59, THE Greeting_Widget SHALL display the greeting "Good night".

---

### Requirement 2: Custom Name in Greeting (Challenge)

**User Story:** As a user, I want to set my name so that the greeting addresses me personally.

#### Acceptance Criteria

1. THE Greeting_Widget SHALL provide an input field for the user to enter their name.
2. WHEN the user submits a non-empty name, THE Greeting_Widget SHALL append the name to the greeting message (e.g., "Good morning, Alex").
3. WHEN the user submits a name, THE Storage SHALL persist the name so it is restored on subsequent page loads.
4. WHEN no name has been saved, THE Greeting_Widget SHALL display the greeting without a name suffix.
5. IF the user submits an empty string as a name, THEN THE Greeting_Widget SHALL remove the stored name and display the greeting without a name suffix.

---

### Requirement 3: Focus Timer

**User Story:** As a user, I want a countdown timer so that I can track focused work sessions.

#### Acceptance Criteria

1. THE Timer SHALL display the remaining time in MM:SS format.
2. WHEN the user activates the start control, THE Timer SHALL begin counting down from the configured duration.
3. WHEN the user activates the stop control, THE Timer SHALL pause the countdown at the current remaining time.
4. WHEN the user activates the reset control, THE Timer SHALL stop the countdown and restore the display to the configured duration.
5. WHEN the countdown reaches 00:00, THE Timer SHALL stop automatically and provide a visual or audible notification to the user.
6. WHILE the Timer is counting down, THE Timer SHALL disable the start control and enable the stop and reset controls.
7. WHILE the Timer is stopped or reset, THE Timer SHALL enable the start control and disable the stop control.

---

### Requirement 4: Change Pomodoro Time (Challenge)

**User Story:** As a user, I want to configure the timer duration so that I can adapt focus sessions to my workflow.

#### Acceptance Criteria

1. THE Timer SHALL provide an input that allows the user to set a custom duration in whole minutes, within the range of 1 to 120 minutes.
2. WHEN the user sets a valid duration, THE Timer SHALL update the displayed time to reflect the new duration.
3. WHEN the user sets a valid duration, THE Storage SHALL persist the duration so it is restored on subsequent page loads.
4. WHEN no custom duration has been saved, THE Timer SHALL default to a duration of 25 minutes.
5. IF the user enters a value outside the range of 1 to 120 minutes, THEN THE Timer SHALL reject the input and retain the previously configured duration.
6. WHILE the Timer is counting down, THE Timer SHALL disable the duration input to prevent mid-session changes.

---

### Requirement 5: To-Do List

**User Story:** As a user, I want to manage a list of tasks so that I can track what needs to be done.

#### Acceptance Criteria

1. THE Todo_List SHALL provide an input field and a submit control for adding new tasks.
2. WHEN the user submits a non-empty task title, THE Todo_List SHALL add the task to the list with a default status of incomplete.
3. IF the user submits an empty task title, THEN THE Todo_List SHALL reject the input and display an inline validation message.
4. WHEN the user activates the completion toggle for a task, THE Todo_List SHALL update the task's status to complete and apply a visual distinction (e.g., strikethrough).
5. WHEN the user activates the completion toggle for a completed task, THE Todo_List SHALL update the task's status back to incomplete.
6. WHEN the user activates the edit control for a task, THE Todo_List SHALL present the task title in an editable field.
7. WHEN the user confirms an edit with a non-empty title, THE Todo_List SHALL update the task title.
8. IF the user confirms an edit with an empty title, THEN THE Todo_List SHALL reject the change and retain the original task title.
9. WHEN the user activates the delete control for a task, THE Todo_List SHALL remove the task from the list.
10. WHEN any task is added, updated, or deleted, THE Storage SHALL persist the full task list so it is restored on subsequent page loads.

---

### Requirement 6: Quick Links

**User Story:** As a user, I want to save and access my favorite websites from the dashboard so that I can navigate quickly.

#### Acceptance Criteria

1. THE Quick_Links SHALL provide input fields for a link label and a URL, and a submit control for adding a new link.
2. WHEN the user submits a link with a non-empty label and a valid URL, THE Quick_Links SHALL add the link as a clickable button that opens the URL in a new browser tab.
3. IF the user submits a link with an empty label or an invalid URL, THEN THE Quick_Links SHALL reject the input and display an inline validation message.
4. WHEN the user activates the delete control for a link, THE Quick_Links SHALL remove the link from the panel.
5. WHEN any link is added or deleted, THE Storage SHALL persist the full link list so it is restored on subsequent page loads.

---

### Requirement 7: Light / Dark Mode (Challenge)

**User Story:** As a user, I want to switch between light and dark themes so that I can use the dashboard comfortably in different lighting conditions.

#### Acceptance Criteria

1. THE Dashboard SHALL provide a toggle control that switches the Theme between light and dark.
2. WHEN the user activates the theme toggle, THE Dashboard SHALL apply the selected Theme to all UI components immediately without a page reload.
3. WHEN the user activates the theme toggle, THE Storage SHALL persist the selected Theme so it is restored on subsequent page loads.
4. WHEN no Theme preference has been saved, THE Dashboard SHALL apply the Theme that matches the user's operating system preference (via the `prefers-color-scheme` media query).

---

### Requirement 8: Data Persistence

**User Story:** As a user, I want my data to survive page reloads so that I don't lose my tasks, links, or settings.

#### Acceptance Criteria

1. WHEN the Dashboard loads, THE Storage SHALL restore all previously saved tasks, links, custom name, timer duration, and Theme preference.
2. IF Storage is unavailable or returns malformed data, THEN THE Dashboard SHALL fall back to default values and continue operating normally.

---

### Requirement 9: Performance and Compatibility

**User Story:** As a user, I want the dashboard to load fast and work across modern browsers so that I can rely on it daily.

#### Acceptance Criteria

1. THE Dashboard SHALL load and render all widgets within 2 seconds on a standard broadband connection.
2. THE Dashboard SHALL operate without errors on the latest stable versions of Chrome, Firefox, Edge, and Safari.
3. THE Dashboard SHALL function as a standalone HTML file opened directly in a browser without requiring a web server.
