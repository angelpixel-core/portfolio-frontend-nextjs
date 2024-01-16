# Portfolio Project

## Development

1. Database Setup

```bash
docker compose up -d
```

2. Rename `.env.template` to `.env`
3. Replace env variables

```bash
docker run --name db-portfolio-dev -e POSTGRES_PASSWORD=abcd1234 -e POSTGRES_USER=${USER} e POSTGRES_DB=portfoliodev -p 5432:5432 -d postgres:15.
```

4. Set App username

```bash
export USER=${your_username}
```

5. Set the USER env variable into .env file for Prisma conection

### Prisma commands

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```
