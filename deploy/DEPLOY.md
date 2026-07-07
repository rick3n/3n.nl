# Hosting — lab.3n.nl

Statische conceptsite voor de AI-Native Studio, gericht op de MKB-doelgroep.
De site is één self-contained bestand: [`lab/index.html`](../lab/index.html) (geen build, geen dependencies).

---

## 1. DNS (doe jij)

Maak op de A-server een record aan dat naar het IP van de webserver wijst:

```
lab   IN   A   <IP-van-je-server>
```

(Of een AAAA-record voor IPv6.) Wacht tot `dig +short lab.3n.nl` het juiste IP teruggeeft.

## 2. Code op de server zetten

```bash
sudo mkdir -p /var/www/lab.3n.nl
sudo git clone https://github.com/rick3n/3n.nl.git /var/www/lab.3n.nl
# updaten later:  cd /var/www/lab.3n.nl && sudo git pull
```

De nginx-config wijst naar de `lab/`-map in de repo, dus een `git pull` is genoeg om te updaten.

## 3. nginx koppelen

```bash
sudo cp /var/www/lab.3n.nl/deploy/lab.3n.nl.nginx.conf /etc/nginx/sites-available/lab.3n.nl.conf
sudo ln -s /etc/nginx/sites-available/lab.3n.nl.conf /etc/nginx/sites-enabled/
sudo nginx -t
```

> Pas in de conf zo nodig `root /var/www/lab.3n.nl/lab;` aan als je een ander pad koos.

## 4. TLS-certificaat (Let's Encrypt)

Doe dit **nadat** de DNS live is (stap 1), anders faalt de validatie:

```bash
sudo certbot --nginx -d lab.3n.nl
sudo systemctl reload nginx
```

Certbot vult de `ssl_certificate`-paden automatisch in en zet auto-renewal op.

## 5. Klaar

`https://lab.3n.nl` serveert nu de site. Updaten = `git pull` in `/var/www/lab.3n.nl`.

---

### Alternatief zonder eigen nginx-config
Draai je al een reverse proxy (Caddy, Traefik, een panel)? Wijs de vhost dan simpelweg
met docroot naar de `lab/`-map. Een Caddy-equivalent is één regel:

```
lab.3n.nl {
    root * /var/www/lab.3n.nl/lab
    file_server
    encode gzip
}
```
