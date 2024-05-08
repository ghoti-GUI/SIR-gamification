# Kafka
## Objectifs du TP :
- Comprendre ce qu'est un message broker
- Premier contact avec un système multi-agent
- Exemples d'usages
- Parler de Kafka un peu


## Scénario :
Modélisation sous la forme d'une chaine de production, avec Kafka en intermédiaire de logistique.
L'élève va devoir compléter plusieurs niveaux, de plus en plus complexes. Il apprendra le rôle de chaque élément de Kafka au long des niveaux.
Les agents seront représentés par des mines/usines (producer/consumer) qui seront reliés entre eux par la brique Kafka.
Les consumers et producers disposeront d'une interface de code pour configurer sur quel topic/partition envoyer et consommer des messages, ainsi que de réaliser le traitement de l'information
Le temps de consommation et de production suivra une loi exponentielle afin de simuler des événements aléatoires.
## Niveaux :
### Niveau 1 :
![](kafka_lvl1.png)
#### Objectif : {id="objectif_lvl1"}
Mise en place d'un producer, de kafka avec 1 topic et 1 partition et d'un consumer.
#### Description : {id="description_lvl1"}
L'élève se voit présenter les différentes briques élémentaires du TP : Mine (Producer), Usine (Consumer), Service logistique (Kafka) composé de : Entrepôt (Topic), Quai de chargement (Partition)
Il va devoir les relier et consommer ce que produit la mine dans l'usine.

### Niveau 2 :
![](kafka_lvl2.png)
#### Objectif :  {id="objectif_lvl2"}
Mise en place d'un second topic pour gérer un autre type de message.
#### Description : {id="description_lvl2"}
On rajoute une deuxième mine et une deuxième usine qui produisent et traitent des minerais de type 2. Ils ne peuvent pas être traités dans l'usine 1. Ils représentent des messages d'un type différent qui nécessitent un nouveau consumer sur un nouveau topic.
L'élève va donc devoir rajouter un Entrepôt (Topic) avec un quai de chargement (Partition) pour stocker et envoyer les matériaux vers la nouvelle usine.

### Niveau 3 :
![](kafka_lvl3.png)
#### Objectif :  {id="objectif_lvl3"}
Comprendre l'objectif des partitions en mode round-robin (Load Balancing)
#### Description : {id="description_lvl3"}
On rajoute une deuxième mine de type 1 et une deuxième usine de type 1.
L'élève va donc devoir rajouter un quai de chargement (Partition) pour stocker et envoyer les matériaux vers la nouvelle usine de type1

### Niveau 4 :
![](kafka_lvl4.png)
#### Objectif :  {id="objectif_lvl4"}
Comprendre l'intérêt d'envoyer les messages sur des partitions spécifiques en fonction de leur contenu (hash)
#### Description : {id="description_lvl4"}
La mine 2 produit maintenant deux versions du minerai de type 2. Ils demandent chacun un traitement séparé dans une usine distincte.

### Niveau 5 et + (Bonus):
#### Objectifs :
Faire un kafka plus élaboré avec des usines qui sont à la fois consumer et producer 
