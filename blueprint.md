
# Project Blueprint: NeuroStaq Tracker

## 1. Application Overview

The NeuroStaq Tracker is a personalized learning application designed to help students manage their study tasks and track their progress. It provides a clear and organized view of pending, current, and upcoming learning activities, ensuring students stay on top of their coursework.

The application is authenticated and fetches student-specific data from a secure backend, providing a personalized experience for each user.

## 2. Core Features & Design

### 2.1. Authentication

*   **Login Page:** A secure login page (`login.html`) allows users to authenticate using their `StudentID` and `Password`.
*   **API Integration:** The login process is handled by a dedicated Google Apps Script API that verifies user credentials.
*   **Session Management:** Upon successful login, the `StudentID` is stored in the browser's session storage to maintain the user's session.

### 2.2. Tracker Dashboard

*   **Personalized Experience:** The tracker page (`tracker.html`) is personalized with the student's name, ID, and guardian details, fetched from a dedicated Student Details API.
*   **Task Categorization:** Tasks are fetched from the Tracker Data API and categorized into three sections:
    *   **Pending:** Tasks with a repetition date in the past that have not been marked as "Learned."
    *   **Today:** Tasks scheduled for the current day.
    *   **Tomorrow:** Tasks scheduled for the following day.
*   **Task Cards:** Each task is displayed on a "card" with the following details:
    *   Topic and subject
    *   Repetition stage and name
    *   Session and repetition dates
    *   File attachments (displayed as clickable "chips")

### 2.3. User Interface & Design

*   **Modern & Clean UI:** The application features a modern, clean, and responsive design with a blue and white color scheme.
*   **Sidebar Navigation:** A collapsible sidebar provides easy access to the student's profile, a link to their dashboard, and a logout button.
*   **Loading & Confirmation Modals:** The application includes modals for:
    *   **Loading:** A loading dialog with a spinner is displayed during data fetching to inform the user.
    *   **Confirmation:** A confirmation modal appears when a user marks a task as "Learned" to prevent accidental clicks.

### 2.4. Functionality

*   **Mark as Learned:** Users can mark tasks as "Learned," which triggers an API call to update the task's status in the database. The change is also persisted in the browser's local storage.
*   **Error Handling:** The application includes robust error handling for API failures, with clear on-screen messages and a "Try Again" option.

## 3. Current Implementation Plan

*This section is updated with each new development cycle.*

**Objective:** Improve application stability and user experience.

**Steps Completed:**

1.  **Loading Indicator:** Implemented a loading dialog to provide feedback during API calls.
2.  **Synchronized Data Loading:** Ensured that the application waits for all data to be fetched before rendering the UI.
3.  **Improved Error Handling:** Enhanced error messages to be more user-friendly, with a "Try Again" option.
4.  **UI Feedback:** Refined the "Mark as Learned" functionality to provide immediate visual feedback.
5.  **Login Page Enhancements:** Added a loading state to the login button and trimmed user input to prevent login failures.
6.  **API Response Handling:** Updated the tracker page to correctly handle the Student Details API response, making the application more resilient to variations in the API's status messages.
7.  **JSON Data Parsing:** Updated the `renderStudentDetails` and `initializeTracker` functions to correctly parse the JSON response from the Student Details API.
8.  **API Integration for "Mark as Learned":** Integrated the API call to update the database when a task is marked as "Learned."
9.  **Bug Fix: "Curve ID not found":** Resolved a race condition where the `CurveID` was being cleared from memory before the API call was made, ensuring the update operation now completes successfully.
10. **Data Integrity:** The application now treats the database as the single source of truth, fetching the latest data on page load and updating the local cache to prevent data mismatches.
11. **UX Improvement: Redundant Loading Indicator:** Removed the full-screen loading dialog that appeared during the "Mark as Learned" action, relying instead on the button's "Updating..." text for a cleaner user experience.
12. **Concurrency Bug Fix:** Resolved a concurrency issue where multiple, simultaneous clicks on "Mark as Learned" buttons would interfere with each other. The update process is now atomic, ensuring all clicks are handled independently and reliably.
13. **Conditional UI:** The "Dashboard" button in the sidebar is now only visible if the student's data contains a valid link, preventing dead clicks and cleaning up the UI.
14. **Mobile Layout Refinement:** Adjusted the vertical spacing on mobile devices to create a more compact and visually unified layout. The gap between main categories and sub-categories has been eliminated.
15. **Mobile Sticky Header Bug Fix:** Corrected a CSS bug that caused the sticky category headers to overlap content on mobile devices during scrolling, ensuring a smooth and predictable user experience.
