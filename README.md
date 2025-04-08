![Static Badge](https://img.shields.io/badge/BCIT%20-%20Comp1800%20-%20blue)
![Static Badge](https://img.shields.io/badge/group%20-%20BBY19%20-%20blue?color=%23f60665)

## SweetSpot Overview

SweetSpot is a collaborative event planning application, allowing users to create events, suggest dates for the event, invitie others to contribute the dates they want, and finally confirm the event date. This was intended to help busy family or friends get together more often by removing the hassle of a singular organizer reaching out to multiple people trying to find that perfect day that works for everyone.

Example:

This client-side JavaScript web application provides users with an interface to create events, join events with an event code, and manage their created events. All elements are pure HTML and JS, either from Bootstrap or from our own creation, with the exception of the location picker map which was sourced from Mapbox.

Developed for the BCIT Comp 1800 course, applying User-Centred Design practices, agile project management processes, and a Firestore date store.

---

## Features

- Creating user defined events.
- Joining events with codes.
- Submitting event dates you can attend (as an attendee).
- Confirming the final event date (as a host/event creator).
- Deleting events.
- Responsive design for desktop and mobile.

---

## Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Firebase for hosting
- **Database**: Firestore
- **API**: Mapbox API

---

## Usage

1. Open your browser and visit `http://localhost:5500`.
2. Sign in or sign up to enter the main application.
3. Use the Create event button in the header or use the create event icon in the footer.
4. Populate the event fields.
5. Select multiple dates you want to suggest for the event by clicking and dragging across multiple dates.
6. Submit your event.
7. Invite others to your event with the generated code.
8. Wait for others to input their avaliablity.
9. Finally, confirm the best suited date based on responses.

---

## Project Structure

```
project-name/
├── fonts/
│   ├── EBGaramond-Italic-VariableFont_wght.ttf
│   ├── EBGaramond-VariableFont_wght.ttf
│   └── Nautilus.otf
├── images/
│   └── ...images
├── scripts/
│   ├── authentication.js
│   ├── calendar.js
│   ├── create-event.js
│   ├── enter-code.js
│   ├── event-page.js
│   ├── firebaseAPI.js
│   ├── main.js
│   ├── map.js
│   ├── script.js
│   └── skeleton.js
├── styles/
│   ├── calendar.css
│   ├── style.css
│   └── styleguide.html
├── text/
│   ├── enter-code-button.html
│   ├── enter-code-modal.html
│   ├── footer-after-login.html
│   ├── footer.html
│   ├── nav-after-login.html
│   ├── nav-before-login.html
│   ├── no-events.html
│   └── planner-tools.html
├── .gitignore
├── abouts_us.html
├── create-event.html
├── event-page.html
├── index.html
├── login.html
├── main.html
├── README.md
└── template.html
```

---

## Contributors

- Chell Jacques - BCIT CST Student who loves making things. Transgender Non-Binary
- David Martinez - BCIT CST Student, Set A Rep, looking to expand my knowledge and build more projects.
- Daiel Do - BCIT CST Student with a passion for computer hardware.
- Jazib Jeehan - BCIT CST Student loves all things tech and computers.

---

## Acknowledgments

Example:

- Mapbox sourced from [MapBox](https://www.mapbox.com/).
- Select icons sourced from [Bootstrap](https://icons.getbootstrap.com/). Branded icons made by our very own Chell Jacques.

---

## Limitations and Future Work

### Limitations

Example:

- Currently, the app doesn't have many validation for incorrect usage.
- Time selection for event is currently set to AM or PM.
- The user interface can be further enhanced for accessibility.

### Future Work

Example:

- Add event validation.
- Improve calendar selection process.
- Implement time selection field.
- Create a dark mode for better usability in low-light conditions.

---

## License

Example:
This project is licensed under the MIT License. See the LICENSE file for details.
