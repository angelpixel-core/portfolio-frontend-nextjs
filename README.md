# Portfolio Project

# Getting Started

## Development

1. Rename `.env.template` to `.env.local`
2. Replace environment variables
3. Start DB containers

```bash
make start-db
```

## Setup Admin DB

1. Grab database IP Address
2. Go to [DB Admin Page](`http://localhost:${DB_ADMIN_PORT}`) and sigin with `DB_ADMIN` credentials
3. Register a new server called `portfolio`
4. Set _Connection/Hostname/address_ with container DataBase IP Address

```bash
make grab-db-ip-address
```

5. Set _Connection/Username_ with `DB_USER` and _Connection/Password_ with `DB_PASSWORD`
6. Save

    > You should see the new `portfolio` server with a new `DB_NAME` database.

## About ORM Prisma commands

1. Run seeds to [create local database](http://localhost:3000/api/seed)

```
npx prisma init
npx prisma migrate dev
npx prisma generate
```

# Sources

-   [How to create a docker-compose setup with PostgreSQL and pgAdmin4](https://www.youtube.com/watch?v=qECVC6t_2mU)
