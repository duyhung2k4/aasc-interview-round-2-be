migrate_database:
	npx prisma migrate dev --name init
docker_build:
	docker-compose up --build