
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

 - Redisbackplane -> fra "in memory backplane" til redis 3rd party; for skalerbarheden... men det går fornu.
 - Vise exeptions / fejl for brugeren, så de ved, hvad de gør forkert. F.eks. når man sender en kommando afsted, så kunne det være fint hvis den sagde "hey denne turbine kører allerede, så er der ingen grund til at aktivere den igen." el. lign.
 - Man kunne også forbinde den bruger som udførte kommandoen til relationen i db. For lige nu kan man ikke se hvilken bruger der udførte kommandoen, men bare at den er blevet udført, og på hvilken turbine den er udført på.
 - Se en længere historik fra turbinenerne, så det ikke kun er de 50 datapunkter, og derfra bare hvad der indsamles - det kunne godt reworkes - men det kommer vel også an på hvad kunden gerne vil have. Desuden kunne man også bruge de individuelle subscriber events som man kan tilslutte sig, istede for at tilslutte sig alle på én gang - men det er vel smag og behag - tænker bare på, hvis der var 1000 turbiner, så kan det også bliver stramt for netværket.

## Authors

- [@Lucas](https://www.github.com/usernameluxi)
- [@Casper](https://www.github.com/casfro01)


