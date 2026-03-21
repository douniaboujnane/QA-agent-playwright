# App - Happy Path Test Plan

## Application Overview

The app is a patient-facing web application that allows patients to prepare their medical appointment in 5 steps before seeing their healthcare provider. The workflow includes: (1) selecting a healthcare provider using a text search or interactive map, (2) going through an onboarding consent flow, (3) answering scheduling questions about the appointment, (4) selecting a reason for consultation from a template list, and (5) completing a pre-appointment questionnaire and submitting health insurance and contact information.

The application is available in English and French. It uses a Leaflet map to display healthcare facility markers, a text search that filters clinics by name, location, or physician name, and a multi-step questionnaire flow. A developer debug panel ("show log") is available to inspect session IDs. The application also detects unfinished sessions and prompts users to continue or start fresh.

## Test Scenarios

### 1. Healthcare Provider Selection via Text Search

**Seed:** `specs/seed.spec.ts`

#### 1.1. Select a healthcare provider by searching by clinic name and proceed through the full onboarding flow

**File:** `specs/healthcare-provider-selection.spec.ts`

**Steps:**
  1. Navigate to BASE_URL and handle the browser prompt dialog by entering APP_PASSWORD and accepting it.
    - expect: The home page is displayed with the heading 'Welcome to the platform. Prepare your appointment in 5 simple steps:'
    - expect: The 'Start' button is visible
    - expect: A 5-step overview carousel is shown with step indicators numbered 1 through 5
  2. Click the 'Start' button.
    - expect: The page navigates to /search
    - expect: A text search field with placeholder 'Search by name, location, or physician...' is displayed
    - expect: An interactive Leaflet map is shown with multiple clinic markers
    - expect: An informational alert banner is shown: 'You must select your family doctor for your appointment. If you do not select your family doctor, your appointment will be rejected.'
  3. Type a clinic keyword in the search field.
    - expect: A list of matching clinic cards appears below the search field
    - expect: The results include 'Clinic A' located at '123 Example St, City, Province A1A 1A1'
    - expect: A 'Clear search' (×) button appears inside the search field
    - expect: The map markers update to reflect filtered results
  4. Click the 'Clinic A' clinic card in the search results list.
    - expect: A popup appears on the map showing the clinic name 'Clinic A'
    - expect: The address '123 Example St, City, Province A1A 1A1' is displayed in the popup
    - expect: A 'Healthcare provider:' heading is shown with at least one provider button (e.g. 'Dr. Smith')
    - expect: A 'Close popup' (×) button is visible in the popup
  5. Click the healthcare provider button (e.g. 'Dr. Smith') in the popup.
    - expect: The page navigates to /onboarding/1
    - expect: A confirmation screen is shown with the heading 'Welcome to Your Pre-appointment Questionnaire'
    - expect: The selected provider and clinic are confirmed: 'You have selected Dr. Smith (Clinic A).'
    - expect: A warning is shown that appointment requests with the wrong provider will be rejected
    - expect: A 'Back' button and a 'Next' button are present
  6. Click the 'Next' button.
    - expect: The page navigates to /onboarding/2
    - expect: A 'How It Works' screen is shown explaining the questionnaire process and estimated duration (10-15 minutes)
    - expect: A 'Back' button and a 'Next' button are present
  7. Click the 'Next' button.
    - expect: The page navigates to /onboarding/3
    - expect: A 'Let's Get Started' screen is shown with privacy and data deletion information
    - expect: Two unchecked checkboxes are displayed: one for consenting to data usage and one for agreeing to the privacy policy and terms of use
    - expect: Links to 'Read the terms and conditions of use.' and 'Read the privacy policy.' are present
    - expect: The 'Start Questionnaire' button is disabled
  8. Check the first checkbox: 'I consent to my Health Insurance Number, phone number and answers being used only for my appointment with Dr. Smith (Clinic A).'
    - expect: The first checkbox is now checked
    - expect: The 'Start Questionnaire' button remains disabled
  9. Check the second checkbox: 'I have read and agree to the privacy policy and terms of use.'
    - expect: The second checkbox is now checked
    - expect: The 'Start Questionnaire' button becomes enabled and clickable
  10. Click the 'Start Questionnaire' button.
    - expect: The page navigates to /appointment-scheduling
    - expect: A question is shown: 'Are you currently in the waiting room?'
    - expect: An explanatory paragraph is shown: 'If you are already at the clinic and waiting to be seen, select Yes.'
    - expect: Two buttons are displayed: 'Yes, I am in the waiting room' and 'No, I am not in the waiting room'
    - expect: A 'Back' button is present
  11. Click the 'No, I am not in the waiting room' button.
    - expect: A follow-up question is shown: 'Do you have an appointment scheduled for the questionnaire you are about to fill?'
    - expect: An explanatory paragraph is shown: 'This refers to the current appointment for which you are filling out this questionnaire — not a future one.'
    - expect: Two buttons are displayed: 'Yes, I have an appointment scheduled' and 'No, I do not have an appointment yet'
    - expect: A 'Back' button is present
  12. Click the 'Yes, I have an appointment scheduled' button.
    - expect: A date selection screen is shown with the heading 'When is your appointment?'
    - expect: A date input field labeled 'Please select your appointment date *' is shown
    - expect: Shortcut buttons 'Today' and 'Tomorrow' are available
    - expect: The 'Continue' button is disabled
  13. Click the 'Tomorrow' shortcut button to select tomorrow's date.
    - expect: The date field is populated with tomorrow's date
    - expect: The 'Tomorrow' button appears as active/selected
    - expect: The 'Continue' button becomes enabled
  14. Click the 'Continue' button.
    - expect: The page navigates to /templates
    - expect: A 'Select a reason for consultation' heading is displayed
    - expect: A search field labeled 'Enter your reason for consultation' is shown
    - expect: A 'View completed questionnaires' link pointing to /summary is present
    - expect: Instructional text states: 'Please enter in the search field and then select from the choices below your reason for consultation.'

### 2. Language Switching and Home Page Navigation

**Seed:** `specs/seed.spec.ts`

#### 2.1. Switch the application language from English to French and verify the interface updates throughout the home page

**File:** `specs/language-switching.spec.ts`

**Steps:**
  1. Navigate to BASE_URL and handle the browser prompt dialog by entering APP_PASSWORD and accepting it.
    - expect: The home page is displayed in English
    - expect: The welcome message reads: 'Welcome to the platform. Prepare your appointment in 5 simple steps:'
    - expect: The 'Start' button label is 'Start'
    - expect: Step headings include 'Select Your Healthcare Provider', 'Choose Reason for Visit', 'Answer the Questionnaire', 'Repeat if Needed', 'Submit Your Information'
    - expect: The disclaimer at the bottom reads: 'Take care to select your usual healthcare professional with whom you already have a file. Otherwise, your appointment request will be automatically rejected.'
  2. Click the language toggle button (flag icon) in the top-left corner of the page.
    - expect: A language selection dropdown or menu appears with two options: 'English' and 'French'
  3. Click the 'French' option.
    - expect: The interface switches to French immediately
    - expect: The welcome message changes to the French equivalent
    - expect: The 'Start' button is now labeled 'Commencer'
    - expect: Step headings are now in French
    - expect: The disclaimer at the bottom is now in French
    - expect: Step navigation buttons (1 through 5) remain unchanged
  4. Click the language toggle button again to open the language menu.
    - expect: The language menu appears again in French ('Anglais' and 'Français')
  5. Click 'Anglais' to switch back to English.
    - expect: The interface switches back to English
    - expect: The welcome message reads: 'Welcome to the platform. Prepare your appointment in 5 simple steps:'
    - expect: The 'Start' button is labeled 'Start'
    - expect: All step headings are displayed in English again
  6. Use the step navigation: click the 'Next step' arrow button.
    - expect: The step carousel advances to show the next set of step descriptions
    - expect: The 'Previous step' arrow button becomes enabled
  7. Click the 'Go to step 5' button (numbered step indicator '5').
    - expect: The step 5 content ('Submit Your Information') is brought into view
  8. Click the 'Previous step' arrow button.
    - expect: The carousel moves to the previous step
    - expect: Navigation arrows remain functional
  9. Click the 'Start' button.
    - expect: The page navigates to /search
    - expect: The search page is displayed in English
    - expect: The informational alert banner appears
    - expect: The map and search field are visible

### 3. Session Recovery and Appointment Summary

**Seed:** `specs/seed.spec.ts`

#### 3.1. Resume a previous unfinished session when prompted and view the appointment summary page

**File:** `specs/session-recovery.spec.ts`

**Steps:**
  1. Navigate to BASE_URL and handle the browser prompt dialog by entering APP_PASSWORD and accepting it.
    - expect: The home page is displayed with the 'Start' button and the 5-step overview
  2. Click the 'Start' button, then on the /search page force-click a map marker to open a clinic popup, and click the provider button to navigate to /onboarding/1.
    - expect: The provider confirmation screen at /onboarding/1 is shown with the selected provider name and clinic
  3. Click 'Next' on /onboarding/1, then 'Next' on /onboarding/2, then check both consent checkboxes on /onboarding/3, then click 'Start Questionnaire'.
    - expect: The appointment scheduling page at /appointment-scheduling is shown with the waiting room question
  4. Click 'No, I am not in the waiting room', then 'Yes, I have an appointment scheduled', then click 'Tomorrow' and then 'Continue' to reach the /templates page.
    - expect: The 'Select a reason for consultation' page at /templates is shown
  5. Without completing the consultation reason selection, navigate directly to BASE_URL/summary.
    - expect: The Appointment Summary page is shown with the heading 'Appointment Summary'
    - expect: A modal dialog appears over the page with the heading 'Continue Previous Session?'
    - expect: The message reads: 'We detected that you have an unfinished session. Would you like to continue where you left off?'
    - expect: Two buttons are present: 'Yes, continue' and 'No, start new'
    - expect: An 'Add visit reasons' link pointing to /templates is visible in the background
  6. Click 'Yes, continue' to resume the previous session.
    - expect: The modal dialog dismisses
    - expect: The Appointment Summary page remains visible
    - expect: The page reflects the session data from the previous steps (provider and appointment details)
    - expect: The 'Add visit reasons' link to /templates is available to add more consultation reasons
  7. Navigate again to BASE_URL/summary.
    - expect: The 'Continue Previous Session?' modal appears again since the session is still active
    - expect: Both 'Yes, continue' and 'No, start new' buttons are available
  8. Click 'No, start new' to discard the previous session.
    - expect: The session data is cleared
    - expect: The application navigates back to the home page
    - expect: The home page is displayed fresh with the 'Start' button and 5-step overview
    - expect: No previous session data is retained
  9. Navigate to BASE_URL/terms using the browser address bar.
    - expect: The Terms and Conditions page is shown with a heading 'Terms and Conditions'
    - expect: The terms content is displayed on the page
    - expect: A 'Download' link is present with a download icon
    - expect: A 'Back' button is shown in the header to return to the previous page
  10. Click the 'Back' button on the Terms and Conditions page.
    - expect: The browser navigates back to the previous page
  11. Navigate to BASE_URL/privacy using the browser address bar.
    - expect: The Privacy Policy page is shown with a heading 'Privacy Policy'
    - expect: The privacy policy content is displayed on the page
    - expect: A 'Download' link is present with a download icon
    - expect: A 'Back' button is shown in the header
