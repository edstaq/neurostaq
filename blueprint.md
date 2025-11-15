# Project Blueprint

## Overview

This is a student progress tracking application. It allows students to log in and see their learning progress on various topics. The application marks topics as "learned" and persists this state.

## Project Outline

### Style and Design
*   **Theme:** Modern and clean design.
*   **Layout:** Responsive layout with a collapsible sidebar for navigation.
*   **Interactivity:**
    *   Buttons with hover effects.
    *   Loading indicators for asynchronous operations.
    *   Modals for confirmation and alerts.

### Features
*   **Authentication:**
    *   Student login with Student ID and Password.
    *   Session management using `localStorage`.
    *   Logout functionality.
*   **Learning Tracker:**
    *   Displays a list of topics.
    *   Allows students to mark topics as "learned".
    *   Progress is saved on the server.
    *   Visual feedback for learned topics.

## Current Request: Add Change Password Option

### Plan
1.  **Add "Change Password" button:**
    *   A new button will be added to the sidebar in `tracker.html`, just above the "Logout" button.

2.  **Create "Change Password" Modal:**
    *   A modal dialog will be added to `tracker.html`.
    *   It will contain input fields for "Old Password", "New Password", and "Confirm New Password".
    *   It will have "Save Changes" and "Cancel" buttons.

3.  **Implement Password Change Logic:**
    *   The logic will be in `tracker.js`.
    *   An event listener on the "Change Password" button will show the modal.
    *   An event listener on the "Save Changes" button will:
        *   Validate the input fields.
        *   Make a `fetch` request to the provided API endpoint: `https://script.google.com/macros/s/AKfycby9cOtD_w6OHRRmMytKZGYJSXIjHHVGlO0HAUIN0bGeKpOmGcgKPe-E6lsy5BPqx3Bi/exec`
        *   The request will include `studentId`, `oldPassword`, and `newPassword`.
        *   Display loading indicators during the API call.
        *   Show success or error messages to the user.

4.  **Style the new elements:**
    *   The new button and modal will be styled in `style.css` to match the application's theme.
