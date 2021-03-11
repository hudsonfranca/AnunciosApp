# Site de anúncios

Esta aplicação foi criado utilizando NextJs no frontend e NestJs no backend, o banco de dados utilizado foi o PostgreSql em conjunto com Docker e Kubernetes.

<p>
<br/>
<br/>
<img src="images/1.png">
<br/>
<br/>
<img src="images/2.png">
<br/>
<br/>
<img src="images/3.png">
<br/>
<br/>
</p>

## Pré-requisitos

[Kubectl](https://kubernetes.io/docs/tasks/tools/)

[Minikube](https://v1-18.docs.kubernetes.io/docs/tasks/tools/install-minikube/)

[Docker](https://www.docker.com/)

[Skaffold](https://skaffold.dev/docs/quickstart/)

## Como usar 

Quando estiver instalado o Kubectl, minikube, skaffold e docker, teremos que dizer ao computador que todas a vezes que tentarmos nos conectar a `http://anunciosapp/` o computador se conecte a nossa máquina local ao invés de se conectar a algum outro site da internet para isso execute o comando: `minikube start`, para startar o seu cluster depois execute: `minikube ip`, copie o ip que será retornado, execute o comando: `code etc/hosts`, para abrir o host file no linux/macOS usando o Visual Studio Code, se você estiver no Windows o host file está em `c:\windows\system32\drivers\etc\hosts`, quando o arquivo estiver aberto digite no final do arquivo `<minikube ip> anunciosapp`, subistitua `<minikube ip>` pelo ip retornado pelo comando `minikube ip` e salve o arquivo.

Agora teremos que configurar um pod para usar um PersistentVolumeClaim, siga [este](https://kubernetes.io/docs/tasks/configure-pod-container/configure-persistent-volume-storage/) tutorial.

clone o projeto `https://github.com/hudsonfranca/AnunciosApp`, execute o comando `skaffold dev` na raiz do projeto, quando a aplicação estiver rodando teremos que adicionar uma categoria de produtos ao banco de dados, para isso execute o comando: `curl -d '{"name":"eletronicos"}' -H "Content-Type: application/json" -X POST http://anunciosapp/api/category` .
Se você estiver usando o [Insomnia](https://insomnia.rest/download) ou algum outro aplicativo semelhante faça um post request para `http://anunciosapp/api/category` com o body `{"name":"Eletronicos"}`, o usuário precisará desta categoria para adicionar produtos, adicione quantas quiser.

A aplicação necessita de um `Gmail` valido que ela utilizará para enviar o email de confirmação de cadastro e email de recuperação de senha. Abra o arquivo `k8s/email-configmap.yaml` e troque `<email address>` pelo endereço de email, depois abra o arquivo `k8s/email-secret.yaml` e troque `<password>` pela senha do email, a senha deve estar no formato `Base64`. Você terá que ativar a opção `Permitir aplicativos menos seguros` no Gmail para enviar emails pela aplicação.

Digite `http://anunciosapp/` no navegador e navegue pela aplicação.

Desative o Adblock porque ele pode causar alguma interferência na aplicação.




