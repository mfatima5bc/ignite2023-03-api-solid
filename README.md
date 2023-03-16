# App

GymPass style app.

## RFs (Requisitos funcionais)

- [*] It should be possible to register
- [*] It should be possible to authenticate
- [*] It should be possible to get a user's profile logged in
- [*] It should be possible to obtain the number d check-in performed by the logged-in user
- [*] It should be possible the user obtain your own check-in history
- [ ] It should be possible the user search nearby gyms
- [*] It should be possible the user search gyms by name
- [*] It should be possible the user make a check-in in a gym
- [ ] It should be possible validate the user check-in
- [*] It should be possible register a gym


## RNs (Regras de negócio)

- [*] O usuário não deve poder se cadastrar com um e-mail duplicado;
- [*] O usuário não pode fazer 2 check-ins no mesmo dia;
- [*] O usuário não pode fazer check=in se não estiver perto (100m) da academia;
- [ ] O check-in só pode ser validado até 20 minutos após criado;
- [ ] O check-in só pode ser validado por administradores;
- [ ] A academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não-funcionais)

- [*] A senha do usuário precisa estar criptografada;
- [*] Os dados da aplicação precisam estar persistidos em um banco PostgreSql;
- [*] Todas listas de dados precisam estar paginadas com 20 items por página;
- [ ] O usuário deve ser identificado por um JWT (json web token);