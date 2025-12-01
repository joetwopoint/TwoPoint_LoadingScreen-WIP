TwoPoint Loading Screen - Staff Avatars

Place your staff character images in this folder and reference them in html/script.js.

Example:
  html/staff/jane.png
  html/staff/bob.jpg

In html/script.js, set:

  const STAFF_ENABLED = true;

  const staffMembers = [
    {
      name: "Jane Doe",
      role: "Community Manager",
      description: "Handles support & questions.",
      image: "staff/jane.png"
    },
    {
      name: "Bob Smith",
      role: "Staff Lead",
      description: "Contact for staff-related issues.",
      image: "staff/bob.jpg"
    }
  ];

Images are loaded relative to the html folder, so use paths like 'staff/jane.png'.
