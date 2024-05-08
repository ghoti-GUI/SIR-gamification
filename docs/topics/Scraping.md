# Scrapping
## Objectifs du TP :
- Faire passer la notion de scrapping, usages.
- Faire manipuler des expressions régulières
- Notion de droits associés (RGPD, Respect des CGU, rate limit...)
- Faire des références à RPC et au client serveur (pas vraiment fait pour le moment)
- Transmettre la notion que l'informatique c'est de la manipulation d'information et que quelque-soit la forme, il y a des outils pour la manipuler
- Usages de la ligne de commande

## Scénario :
Modélisation sous la forme d'un escape game où l'élève doit modifier sa note de SYD pour pouvoir sortir en avance du TP/TD.
Il sera guidé par un 5TC qui a hacké l'accès au serveur et veut aider l'élève à sortir avec une bonne note. Malheureusement, il ne peut pas fouiller les pages web sans se faire repérer contrairement à l'étudiant.

L'élève disposera d'une fenêtre où entrer l'information cherchée pour vérification, ainsi qu'une fenêtre de code et d'un terminal.
Les informations cherchées seront différentes d'un étudiant à l'autre, pour éviter du partage inter-étudiants.

## Niveaux :
### Niveau 0 :
#### Objectif : {id="objectif_lvl0"}
Donner les outils de base du TP/TD.
#### Description : {id="description_lvl0"}
On donne des bouts de code aux élèves pour leur montrer comment faire des requêtes HTTP, des regex.
### Niveau 1 :
#### Objectif : {id="objectif_lvl1"}
Chercher à la main le username du prof sur une seule page Web
#### Description : {id="description_lvl1"}
On donne à l'étudiant une page Web qui contient les initiales des profs et l'username associé. Pas forcé d'automatiser le processus, on donne l'idée de base du scraping.
### Niveau 2 :
#### Objectif : {id="objectif_lvl2"}
Forcer l'automatisation du processus. L'élève doit chercher les détails d'un cours de TC (aléatoire) dans la base de données de TC.
#### Description : {id="description_lvl2"}
On donne à l'élève une page avec les 3 années de TC. Les noms des pages sont obfusqués. Sur la page de chaque année, on a les différentes UE (là encore obfusquées) qui donnent des liens vers les cours.
Une fois le cours trouvé, l'étudiant donne les détails demandés au 5TC et passe à l'étape suivante.
### Niveau 3 :
#### Objectif : {id="objectif_lvl3"}
Passage à l'échelle et forcer l'exploration totale du site. L'élève doit trouver le livre avec l'ISBN dont la somme des chiffres est la plus faible.
#### Description : {id="description_lvl3"}
On donne à l'élève une page avec la liste des livres. Chaque livre a un lien vers sa page de détails. L'élève doit donc parcourir toutes les pages de détails pour trouver le livre avec l'ISBN dont la somme des chiffres est la plus faible.
### Niveau 4 :
#### Objectif : {id="objectif_lvl4"}
Forcer l'exploration de données personnelles. L'élève doit trouver le mot de passe du prof à partir de données de 4 personnes différentes.
#### Description : {id="description_lvl4"}
On donne à l'élève une page avec la liste des personnes. Chaque personne a un lien vers sa page de détails. L'élève doit donc parcourir toutes les pages de détails pour trouver le mot de passe du prof.
