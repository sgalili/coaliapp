# Branch Setup Documentation

## Branches Overview

- **`main`**: Production version with full Supabase database integration and authentication
- **`dev-db-current`**: Development version with database features 
- **`ui-demo-simple`**: Demo version for UI development without database dependencies

## Current Branch: `ui-demo-simple`

### Purpose
- Pure UI development and testing
- Client demos and presentations
- Public deployment to trust.coali.app
- No authentication requirements
- No database dependencies for basic functionality

### Features
- ✅ Mock data for all content (mockPosts in Index.tsx)  
- ✅ Simulated ZOOZ balance and interactions
- ✅ All animations and UI interactions work
- ✅ ZOOZ reaction animations via useZoozReactions hook
- ✅ Video playback and controls
- ✅ Responsive design and mobile-first approach
- ✅ RTL Hebrew interface

### Technical Details
- Uses mockPosts array for content
- ZOOZ reactions work with animations but don't persist
- No authentication flow required
- Supabase hooks provide animations without database calls
- Perfect for UI iteration and design testing

### Workflow
1. Develop and test UI changes on `ui-demo-simple`
2. Deploy directly to trust.coali.app for demos
3. Manually merge validated changes to `main` when ready
4. Keep this branch clean for UI-focused development

### Deployment
- Optimized for public deployment
- No environment variables needed for basic functionality
- All interactions work visually without backend dependencies