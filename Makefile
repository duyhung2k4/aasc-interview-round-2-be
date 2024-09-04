migrate_database:
	npx prisma migrate dev --name init
docker_build:
	docker-compose up --build
pm2_start:
	pm2 start ecosystem.config.js &&
	pm2 startup &&
	pm2 save