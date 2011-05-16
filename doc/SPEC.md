# Produkt-Stammdatenpflege als HTML5 Web App

Die Anwendung soll Produkt-Stammdaten für ein Kassensystem pflegen. Das Kassensystem existiert bereits als seperate Anwendung und bezieht die Daten über den einen SQL Azure OData Endpunkt. Die Funktionen der Anwendungen werden im folgenden kurz skizziert. 


## Datenmodell

Das Datenmodell ist schlicht gehalten. Die Stammdatenpflege erhält die Daten als JSON String und spielt diese wieder als JSON an den Endpunkt zurück. Das Modell besteht aus zwei Entitäten. 

  * Category
  * Product

Im folgenden werden die Entitäten in JSON beschrieben.

    Category {
      Id: "1234",
      Name: "Kategorie 1",
      Description: "Die erste Kategorie"
    }

    Product {
      Id: "1234",
      Name: "Product1",
      Description: "Beschreibung hier",
      UnitPrice: "232,00",
      ValidTo: "20.12.2012",
      Category: {
        Id: "1234"
      }
    }

Produkte gehören immer einer Kategorie an.


## Ansicht der Stammdatenpflege

Die Ansicht ist nicht genau vorgegeben, es sollten nur folgende Elemente verwendet werden und folgende Funktionalität sichergestellt werden:

  * CRUD Funktionalität bei Category und Products
  * Master / Detail Darstellung von Category zu Products, wobei für Category auch eine einfache Combobox ausreicht
  * Products sollten in einer Tabellenform/Grid dargestellt werden
  * Products sollten scrollbar sein, auch wenn mehrere hundert im Grid erscheinen können (virtualisiert)
  * Eine reine Keyboard Navigation wäre klasse, keine Ahnung wie schwer das zu realisieren ist.


## Daten lesen und speichern

Sämtliche Operationen sollen einfach per AJAX direkt an einen REST Service gesendet werden. Der REST Service kann bei der Entwicklung gemocked werden. Er ist noch nicht definiert und würde dann anhand des Mock-Ups von uns zur Produktionszeit gestellt werden.


## Online / Offline Funktionalität

Im Internet Explorer kann man explizit in einen Offline Modus gehen. Wenn dieser getätigt wird sollen die Daten die erfasst werden, lokal im LocalStorage gespeichert werden. Bei Wiederverbindung mit dem REST Service sollen die Daten hochgeladen werden können. Das heißt man benötigt unter Umständen noch ein State Feld in den Entitäten.


## Benutzer Login

Eine Login Maske soll vor Benutzung der Stammdatenpflege erscheinen. Die Loginmaske soll Benutzername und Password abfragen und momentan einfach auf einen hardcodierten Benutzer gehen. Wichtig wäre nur das die Funktion so vorbereitet wird das man diese durch einen richtigen Authorisierungsaufruf abändern kann.


## Schliessen des Browsers / Absturz

Wird momentan ein Datensatz bearbeitet soll der Benutzer einen Hinweis bekommen wenn der Browser geschlossen wird, das der Datensatz noch in Bearbeitung ist. Grundsätzlich sollte der momentane Datensatz immer im LocalStorage gespeichert werden um auch einen Absturz vorzubeugen. Sprich, stürzt der Browser ab und öffnet man wieder die Anwendung so sollte diese den Benutzer darauf hinweisen das noch ein nicht finalisierter Datensatz zur Bearbeitung wartet und er dann diesen in der Formular Maske mit den gespeicherten Werten angezeigt bekommt und weiterbearbeiten kann.


## Hinweis Meldungen / Flash

Hinweise sollten als Flash Meldung eingeblendet werden, vielleicht zentral eingeblendet bis man die Maus bewegt


## UI im allgemeinen

Wichtig wäre das die UI schon etwas hermacht. Z.B. die Verwendung eines Datepickers beim Datum, schönes Layout, visueller Hinweis von Pflichtfeldern, Validierungen, momentane Position, etc. Es sollte möglich sein das ganze mit einem CSS Stylesheet einfach anzupassen und so die Visualisierung zu ändern.


## Codestruktur

In diesem Projekt geht es in erster Linie um einen Use Case um zu sehen wie komplex es ist HTML Web Apps mit JavaScript zu erstellen. Die Codestruktur, Gliederung, Verwendung von Frameworks, Bibliotheken, Plugins, etc. Ist alles frei definierbar. Die einzigste Bedingung, es dürfen keine Lizenzpflichtigen Dinge verwendet werden, damit meine ich Frameworks, wie z.B extJS.