## Machine virtuelles

| Charge | Débit (Transactions/seconde) | Latence médiane (ms) | Latence 90e centile (ms) | Latence 95e centile (ms) | Latence 99e centile (ms) | Taux d'erreur | CPU BDD (% sur 1 coeur) | CPU Metier (% sur 1 coeur) | CPU Proxy (% sur 1 coeur)           | RAM BDD | RAM Metier | RAM Proxy | I/O BDD |
|--------|------------------------------|----------------------|--------------------------|--------------------------|--------------------------|---------------|-------------------------|----------------------------|-------------------------------------|---------|------------|-----------|---------|
| 10     | 83,44                        | 141                  | 592                      | 698                      | 969                      | 0%            | 14%                     | 200%                       | 5%                                  | 310Mo   | 330 Mo     | 200Mo     | 24Ko/s  |
| 50     | 79,11                        | 1228                 | 2319                     | 2516                     | 2759                     | 0%            | 12%                     | 200%                       | 5%                                  | 302Mo   | 357Mo      | 200Mo     | 24Ko/s  |
| 100    | 80,23                        | 2360                 | 4346                     | 5200                     | 5780                     | 0%            | 12%                     | 200%                       | 5%                                  | 305Mo   | 360Mo      | 203Mo     | 24Ko/s  |
| 200    | 71,35                        | 3357                 | 10096                    | 11314                    | 14017                    | 0%            | 12%                     | 200%                       | 5%                                  | 305Mo   | 365Mo      | 195Mo     | 24Ko/s  |
| 500    | 4773,26                      | 2                    | 4                        | 5                        | 1029                     | 99,45%        | 12%                     | 200%                       | 2% (pic à 100% au début du plateau) | 302Mo   | 365Mo      | 195Mo     | 24Ko/s  |

On constate que la machine virtuelle métier est surchargée dès 10 utilisateurs connectés et que cette machine est le maillon faible de l'application car elle est la seule à être utilisée à 100%.
Cependant, toutes les requêtes sont traitées par la machine jusqu'à 200 utilisateurs avec comme coût un temps de latence élevé.
Lors du test à 500 utilisateurs, l'application est surchargée et ne peut plus traiter les requêtes. Un pic à 100% a eu lieu sur la machine gérant le proxy puis toutes les requêtes sont bloquées.
Pour améliorer les performances de l'application, il faudrait augmenter la capacité de la machine virtuelle métier ou utiliser plusieurs machines virtuelles métier pour distribuer le traitement des requêtes.


## Conteneurs

| Charge | Débit (Transactions/seconde) | Latence médiane (ms) | Latence 90e centile (ms) | Latence 95e centile (ms) | Latence 99e centile (ms) | Taux d'erreur | CPU BDD (% sur 1 coeur) | CPU Metier (% sur 1 coeur) | CPU Proxy (% sur 1 coeur) | RAM BDD | RAM Metier | RAM Proxy |
|--------|------------------------------|----------------------|--------------------------|--------------------------|--------------------------|---------------|-------------------------|----------------------------|---------------------------|---------|------------|-----------|
| 10     | 164,49                       | 23                   | 372                      | 389                      | 557                      | 0%            | 3%                      | 285%                       | 1,3%                      | 125Mo   | 123Mo      | 17Mo      |
| 50     | 158,40                       | 606                  | 1199                     | 1252                     | 1406                     | 0%            | 3%                      | 285%                       | 1,15%                     | 125Mo   | 132Mo      | 17Mo      |
| 100    | 162,28                       | 1201                 | 2368                     | 2544                     | 2724                     | 0%            | 3,5%                    | 285%                       | 1,22%                     | 125Mo   | 134Mo      | 18,5Mo    |
| 200    | 140,70                       | 2353                 | 4933                     | 5817                     | 6562                     | 0%            | 2,8%                    | 285%                       | 1,5%                      | 126Mo   | 135Mo      | 20,5Mo    |
| 500    | 79,57                        | 7271                 | 15324                    | 19163                    | 22064                    | 0%            | 2%                      | 285%                       | 1,5%                      | 126Mo   | 135Mo      | 25Mo      |
