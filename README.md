# node-hh-parser

Приложение для летней образовательной практики 2020-го года.
Всё приложение основано на [официальной документации использоания API HeadHunter](https://github.com/hhru/api).

## Инструкция по установке:

* иметь установленный [NodeJS](https://nodejs.org) последней или 14.3.0 версии.

* иметь установленный [Git](https://git-scm.com/).

* в произвольной директории открыть командную строку или терминал

* установить данный репозиторий написав в консоли ``` git clone https://github.com/unLomTrois/node-hh-parser.git ```

* перейти в данный репозиторий, написав ```cd node-hh-parser```

* для более быстрой установки зависимостей установить программу [Yarn](https://yarnpkg.com/), написав в консоли ```npm install -g yarn```

* установить зависимости, написав в консоли ```yarn install```

* скомпилировать TypeScript в JavaScript, написав в консоли команду ```yarn build:ts```

## Инструкция по применению:

* найти нужные вакансии: ```node ./bin/cli.js search <text> -C```, где -C - флаг поиска кластеров.

* получить "полные" версии вакансий: ```node ./bin/cli.js get-full``` - данная операция изначально очень медленная, т.к. она совершает <=2000 асинхронных запросов в сеть, но результаты запросов кешируются, и в дальнейшем, поиск с прежнего региона выдаст результаты быстрее.

* подготовить вакансии и кластера к анализу: ```node .bin/cli.js prepare```.

* проанализировать данные: ```node ./bin/cli.js analyze```

Все вышеописанные операции сохраняют собственные результаты в папку "log", по окончанию анализа в которой будет находится файл analyzed_data.json.

## Что анализируется?

1. средняя зарплата, их процентная составляющая по группам дохода.

2. опыт работы - в разных регионах одни группы требуются больше, чем в дугих.

3. вид занятости.

4. рабочий график - в связи с произошедшим в 2020-м году карантином, всё большие места начали занимать "удалённые рааботы"

5. индустрия, в которой полразумевается совершение работы.

6. ключевые навыки.

Последнее - наиболее интересное поле, в нём подсчитаны наиболее часто встречающиеся требования по-ключевым навыкам, требуемым на работе. Иначе говоря, технологии, использующиеся наиболее часто в данном регионе.
