# Autoindex Beautification Library

## 1. Introduction

Autoindex library is used for Nginx server autoindex module beautification.
Library only availabled while Nginx Autoindex module enabled.

## 2. Quick Start

2.1 Copy project files to website root path: $ROOT/autoindex

2.2 Add configuration to Nginx config file(or in some sites config file).

```conf
location / {
   autoindex on; # open autoindex module
   add_after_body /autoindex/footer.inc.html;
}
```

2.3 Restart Nginx server

```shell
nginx -s reload
```

2.4 Now visit http://localhost to see the result :)