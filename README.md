# Консольное приложение для публикации страниц на github

1. Ввод параметров через аргументы
- необходимо указать следующие параметры:
    --project=project.json (необязательно)  
    --dir=/path/to/project  
    --login=<username> (необязательно, только если будет push)  
    --token=<TOKEN> (необязательно, только если будет push)  
    --build -b (опциоанльно)  
    --push  -p (опционально)
- используем команду в консоли (примеры)  
**node src/index.js --project=./src/project.json** (в этом случае используется этот файл, в котором уже есть все необходимые данные для дальнейшей работы этого консольного приложения)  
**node src/index.js --dir=/path/to/project --login=lololo --token=gfhsjgdk12skadj -bp** (в этом случае мы вручную указываем все нужные параметры)

2. Ввод параметров через интерфейс с запросами в консоли:
- npm run start
- запрашивается путь к проекту (укажите абсолютный путь до этой директории на вашем компьютере)
- выберите, нужна ли вам сборка, введите "д" (да) или "y" (yes) если сборка (build) необходима
- выберите, нужно ли отправлять (git push) ваш проект

Создание и получиние личного TOKEN на github:
https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens  
https://github.com/settings/tokens
