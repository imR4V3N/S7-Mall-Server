CREATE TABLE role
(
    id    serial primary key,
    val   varchar(255),
    desce varchar(255)
);

CREATE TABLE authentification
(
    id          serial primary key,
    idUser      varchar(255),
    idRole      int,
    identifiant varchar(255),
    mdp         text
);

CREATE TABLE proprietaire
(
    id             serial primary key,
    pdp            text,
    nom            varchar(255),
    prenom         varchar(255),
    adresse        varchar(255),
    contact        varchar(100),
    email          varchar(255),
    date_naissance date,
    date_creation  timestamp
);

CREATE TABLE centre_commercial
(
    id              serial primary key,
    nom             varchar(255),
    adresse         varchar(255),
    date_creation   timestamp,
    isOuvert        boolean,
    heure_ouverture time,
    heure_fermeture time
);


CREATE TABLE boxe
(
    id                 serial primary key,
    idCentreCommercial int,
    nom                varchar(255),
    description        text,
    isDisponible       boolean
);

CREATE TABLE offre_location
(
    id            serial primary key,
    idBoxe        int,
    jour_payement int,
    loyer         decimal,
    date          timestamp
);

CREATE TABLE demande_location
(
    id                serial primary key,
    idBoxe            int,
    idProprietaire    int,
    proposition_loyer decimal,
    date              timestamp
);

CREATE TABLE boutique
(
    id              serial primary key,
    idBoxe          int,
    idProprietaire  int,
    nom             varchar(255),
    description     text,
    isOuvert        boolean,
    heure_ouverture time,
    heure_fermeture time,
    contact         int,
    email           varchar(255)
);

CREATE TABLE loyer
(
    id             serial primary key,
    idBoxe         int,
    idProprietaire int,
    montant        decimal,
    date_payement  timestamp
);

CREATE TABLE parking
(
    id                 serial primary key,
    idCentreCommercial int,
    placeDisponible    int,
    placeTotal         int,
    tarifParHeure      int,
    dureeMax           time
);

CREATE TABLE reservation_parking
(
    id        serial primary key,
    idParking int,
    idClient  int,
    montant   decimal,
    dateDebut timestamp,
    dateFin   timestamp
);

CREATE TABLE client
(
    id      serial primary key,
    pdp     text,
    nom     varchar(255),
    prenom  varchar(255),
    adresse varchar(255),
    contact varchar(100)
);

CREATE TABLE categorie_produit
(
    id    serial primary key,
    val   varchar(255),
    desce varchar(255)
);

CREATE TABLE produit
(
    id          serial primary key,
    idBoutique  int,
    idCategorie int,
    nom         varchar(255),
    description text,
    prix        decimal,
    quantite    decimal
);

CREATE TABLE photo
(
    id      serial primary key,
    idObjet varchar(255),
    url     text,
    date    timestamp
);

CREATE TABLE variante_produit
(
    id        serial primary key,
    idProduit int,
    val       varchar(255),
    desce     text
);

CREATE TABLE prix_produit
(
    id        serial primary key,
    idProduit int,
    montant   decimal,
    date      timestamp
);

CREATE TABLE mvt_stock
(
    id             serial primary key,
    idBoutique     int,
    idTypeMvtStock int,
    designation    varchar(255),
    date           timestamp
);

CREATE TABLE mvt_stock_details
(
    id        serial primary key,
    idProduit int,
    entree    int,
    sortie    int,
    remarque  varchar(255)
);

CREATE TABLE vente
(
    id          serial primary key,
    idBoutique  int,
    idClient    int,
    designation varchar(255),
    date        timestamp
);

CREATE TABLE vente_details
(
    id           serial primary key,
    idProduit    int,
    remarque     varchar(255),
    prixUnitaire int,
    quantite     int
);

CREATE TABLE panier
(
    id          serial primary key,
    idClient    int,
    designation varchar(255),
    date        timestamp
);

CREATE TABLE panier_details
(
    id           serial primary key,
    idProduit    int,
    prixUnitaire int,
    quantite     int
);

