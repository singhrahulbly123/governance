# Coding standards

- Use TypeScript strict mode and keep API calls outside UI components.
- Use Tailwind CSS 4 utilities only; do not add component stylesheets or another CSS framework.
- Keep Laravel controllers small. Validation belongs in Form Requests; authorization belongs in Policies; reusable business operations may live in focused Services or Actions.
- Never commit `.env` files, credentials, build output, or dependencies.
- Add tests with each backend endpoint and frontend behavior.
