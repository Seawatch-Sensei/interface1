# BananAI

<div align="center">
  <video width="640" height="360" autoplay loop muted playsinline>
    <source src="image/README/17.04.2025_11.09.21_REC.mp4" type="video/mp4">
    Your browser does not support the video tag.
  </video>
</div>

Repo Structure:

1. `client` is the directory of the web application
2. `old server` is the old backend server we used. ***It is no longer in user, just there for the records.***
3. `HF` is the model hosted on gradio.
4. `image` just has the images in the README.

A full-stack web application built entirely with Next.js, utilizing Next.js API routes for backend functionality.

## Directory Structure

```
/
├── client/   # Frontend and backend (Next.js)
```

## Prerequisites

Ensure you have the following installed:

- Node.js (LTS version recommended)
- npm (comes with Node.js)

## Setup

### Application (Next.js)

1. Navigate to the `client` directory:

   ```bash
   cd client
   ```
2. Install the required Node.js packages (force install to resolve dependencies if needed):

   ```bash
   npm install --force
   ```
3. Start the development server:

   ```bash
   npm run dev
   ```

   The application should now be running at `http://localhost:3000`.


## Notes

- The `server` directory is no longer used, as we have migrated backend functionality to Next.js API routes.
- Note that you need a `.env` file with a structure similar to the one in `client\env.example`
