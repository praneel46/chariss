# Charis

Charis is a full-stack gift consultation and delivery app. Product requirements come from the supplied build specification. The UI will be implemented from the user's video references; the visual direction in the PDF is superseded.

## Stack

- Next.js App Router with React and strict TypeScript
- Tailwind CSS
- ESLint and Prettier

## Development

```sh
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality commands

```sh
pnpm lint
pnpm typecheck
pnpm format:check
```

## Environment

Copy `.env.example` to `.env.local` and fill in local credentials as features are added. Never commit `.env.local` or real secrets.

## Decisions

- The attached PDF is the product and build specification. Its UI direction is not used; the user-provided videos are the UI reference.
- Guest consultation is the default entry to the product; account creation is deferred until saving or sharing.
- Product recommendations must be grounded in catalog IDs and must never invent products.
