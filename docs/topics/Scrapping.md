# Scrapping
Endpoint racine : `/api/scrapping`
## Niveau 1 :
Objectif : Récupérer le nom d'utilsateur du professeur ayant les initiales données en paramètre.

### Endpoints :
- `GET /lvl1` : Récupère les initiales du professeur. Est envoyé dans le body de la réponse sous la forme d'un objet JSON : `{ "teacherInitials":"initiales" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `POST /lvl1` : Envoie du nom d'utilisateur du professeur cible. Doit être envoyé dans le body de la requête sous la forme d'un objet JSON : `{ "username": "nom_utilisateur" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `GET /lvl1/scrap` : Renvoie la liste des professeurs dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.

***
## Niveau 2 :

Objectif : Récupérer le nom, le nombre d'heure et le nombre de crédit du cours ayant le code donné en paramètre.

### Endpoints : {id="endpoints_lvl2"}
- `GET /lvl2` : Récupère le code du cours. Est envoyé dans le body de la réponse sous la forme d'un objet JSON : `{ "courseCode":"code_du_cours" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `POST /lvl2` : Envoie du nom, du nombre d'heure et du nombre de crédit du cours cible. Doit être envoyé dans le body de la requête sous la forme d'un objet JSON : `{ "name": "nom_cours", "hours": "nombre_heures", "ects": "nombre_credits" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `GET /lvl2/scrap` : Renvoie la liste des années dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.
- `GET /lvl2/scrap/:year` : Renvoie la liste des UEs de l'année donnée en paramètre dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.
- `GET /lvl2/scrap/:year/:ue` : Renvoie la liste des cours de l'UE donnée en paramètre dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.
- `GET /lvl2/scrap/:year/:ue/:course` : Renvoie les détails du cours donné en paramètre dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.

***
## Niveau 3 :

Objectif : Trouver le livre ayant l'ISBN dont la somme des chiffres est la plus faible. En cas d'égalité, on renvoie celui dont le titre est le premier dans l'ordre alphabétique.

### Endpoints : {id="endpoints_lvl3"}
- `GET /lvl3` : Renvoie un objet JSON vide. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `POST /lvl3` : Envoie du titre et de l'ISBN du livre cible. Doit être envoyé dans le body de la requête sous la forme d'un objet JSON : `{ "title": "titre_livre", "isbn": "isbn_livre" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `GET /lvl3/scrap` : Renvoie la liste des livres dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.
- `GET /lvl3/scrap/:bookId` : Renvoie les détails du livre donné en paramètre dans une page HTML. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête et l'utilisation du User-Agent `scrapper`.

***
## Niveau 4 :

Objectif : Trouver le mot de passe à partir des informations de 4 utilisateurs. Le mot de passe se compose des initiales de la première personne, des 3 derniers chiffres du numéro de téléphone de la deuxième personne, du jour de naissance de la troisième personne (2 chiffres) et du nom du chien de la quatrième personne. Il se réinitialise toutes les 5 minutes.
Remarque : Les données changent toutes les 5 minutes. Il faut donc faire une requête sur l'endpoint `/lvl4` pour récupérer les nouvelles données à chaque fois que les minutes sont multiples de 5.

### Endpoints : {id="endpoints_lvl4"}
- `GET /lvl4` : Renvoie les informations permettant d'identifier les 4 personnes. Est envoyé dans le body de la réponse sous la forme d'un objet JSON : `{ "p1Name":"nom_de_la_personne1", "p2Initials":"initiales_de_la_personne2", "p3Phone":"téléphone_de_la_personne3", "p4Mail":"mail_de_la_personne4" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `POST /lvl4` : Envoie du mot de passe. Doit être envoyé dans le body de la requête sous la forme d'un objet JSON : `{ "password": "mot_de_passe" }`. Requiers un token d'authentification (envoyé lors de la jonction de la session) défini dans le header `Authorization` de la requête.
- `GET /lvl4/scrap` : Renvoie la liste des personnes dans une page HTML. Requiers l'utilisation du User-Agent `scrapper`.
- `GET /lvl4/scrap/:personId` : Renvoie les détails de la personne donnée en paramètre dans une page HTML. Requiers l'utilisation du User-Agent `scrapper`.


