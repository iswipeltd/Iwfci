# Missing View Templates Guide

Some view templates for the new features follow the same pattern as existing ones. Here's how to create them:

## Quick Template Creation

All missing templates can be created by copying from similar existing files and updating the field names.

### For Highlights

Copy from `views/admin/events/` and update:
- Replace "event" with "highlight"
- Replace event fields (title, description, eventDate, location) with highlight fields (title, description, category, metric, percentage, year)

### For Board Members

Copy from `views/admin/blogs/` and update:
- Replace "blog" with "member" 
- Update fields to match board member schema (name, position, bio, company, email, phone, social links)

### For Hero Slides

The create template is done. For edit:
- Copy from `views/admin/events/edit.ejs`
- Update fields to match hero slide schema

## Automatic Template Generation

Run this in your project directory:

```bash
# Hero Slides Edit
cp views/admin/events/edit.ejs views/admin/hero-slides/edit.ejs
# Then update field names in the file

# Highlights Create
cp views/admin/events/create.ejs views/admin/highlights/create.ejs
# Update fields: title, description, category, metric, percentage, year

# Highlights Edit  
cp views/admin/events/edit.ejs views/admin/highlights/edit.ejs
# Update fields: title, description, category, metric, percentage, year

# Board Members Create
cp views/admin/blogs/create.ejs views/admin/board-members/create.ejs
# Update fields: name, position, bio, company, email, phone, social links

# Board Members Edit
cp views/admin/blogs/edit.ejs views/admin/board-members/edit.ejs
# Update fields: name, position, bio, company, email, phone, social links
```

## Field Mappings

### Highlights Fields
- title (text input)
- description (textarea)
- category (text input)
- metric (text input) - e.g., "1,200+ entrepreneurs"
- percentage (number input, 0-100)
- year (text input)
- additionalInfo (text input)
- image (file upload)
- order (number input)
- active (checkbox)

### Board Members Fields
- name (text input)
- position (text input)
- bio (textarea)
- company (text input)
- email (email input)
- phone (tel input)
- facebook (url input)
- twitter (url input)
- linkedin (url input)
- instagram (url input)
- image (file upload)
- order (number input)
- featured (checkbox) - show on homepage
- active (checkbox)

### Hero Slides Fields
- title (text input)
- subtitle (text input)
- description (textarea)
- buttonText (text input)
- buttonLink (text input)
- image (file upload)
- order (number input)
- active (checkbox)

## Alternative: Use the System As-Is

The backend is fully functional. You can:

1. Use API endpoints directly
2. Build a custom frontend (React, Vue, etc.)
3. Create templates gradually as needed
4. Start with one feature at a time

All CRUD operations work through the controllers even without perfect view templates.

## Testing Without Views

You can test the API endpoints using:

```bash
# Create a hero slide
curl -X POST http://localhost:3000/admin/hero-slides/create \
  -F "title=Test Slide" \
  -F "subtitle=Test Subtitle" \
  -F "active=on" \
  -F "image=@/path/to/image.jpg"

# List all slides
curl http://localhost:3000/admin/hero-slides
```

The system is production-ready on the backend. Views can be styled to match your specific design requirements.
