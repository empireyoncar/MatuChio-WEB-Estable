# start-local.ps1

# Levantar Playit Agent en segundo plano (detached)
docker run -d --rm --net=host -e SECRET_KEY=84d8dbb6a8976319b3950da8213a25deec07f898828edb8d6f922b746c243b64 ghcr.io/playit-cloud/playit-agent:0.16

# Ir a la carpeta del proyecto
cd "C:\Users\empir\Documents\GitHub\MatuChio-WEB"

# Instalar dependencias
npm install

# Generar cliente de Prisma
npx prisma generate

# Levantar la aplicación Next.js
npm run dev
