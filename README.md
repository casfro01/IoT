
# I Observe Turbines (IoT)

Et fullstack system til overvågning og kontrol af simulerede vindmøller i realtid.
Programmet viser data fra turbiner, opfanger alarmer og giver operatører mulighed for at sende kommandoer til systemet via webapplikationen.

Systemet gør det muligt for en vindmølleinspektør at:
* Se live data fra vindmøllerne
* Visualisere data gennem grafer
* Modtage alarmer hvis noget går galt
* Styre vindmøllerne fra webapplikationen
## Features

**Real-Time Monitoring**

* Live data fra alle turbiner
* Automatisk opdatering af UI via SSE
* Visualisering af metrics over tid

**Alerts & System Status**
* Systemet registrerer fejl eller kritiske værdier
* Alerts gemmes i databasen
* Inspektører får besked i UI

**Turbine Control**
* Operatører kan sende kommandoer til turbiner
* Alle kommandoer valideres på serveren
* Alle komandoer kræver authentication

**Data History**
* Alle metrics gemmes
* Alle alerts logges
* Alle brugerhandlinger timestampes og gemmes


## Login

**Bruger Login**
* Email: `Jens@gmail.com`
* Password: `Password`
## Tech Stack

**Client:** 
* React
* Vite
* TypeScript
 

**Server:** 
* .NET

**Libraries**
* [Recharts](https://github.com/recharts/recharts)

## Improvements

 - Redisbackplane -> fra "in memory" til 3rd party; for skalerbarheden... men det går fornu.

## Authors

- [@Lucas](https://www.github.com/usernameluxi)
- [@Casper](https://www.github.com/casfro01)


