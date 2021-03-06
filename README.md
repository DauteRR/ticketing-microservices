# Ticketing microservices

This repository contains my implementation of the second application of the Stephen Grider's course [Microservices with Node JS and React](https://www.udemy.com/course/microservices-with-node-js-and-react/).

## Local deployment

In order to deploy the application and the microservices your system should have installed the following technologies:

- [Docker](https://www.docker.com/)
- [Kubernetes](https://kubernetes.io/)
- [Skaffold](https://skaffold.dev/)

The development process was carried in a Linux environment. For that reason, [Minikube](https://minikube.sigs.k8s.io/docs/) and [VirtualBox](https://www.virtualbox.org/) were needed to run a local Kubernetes cluster.

1. Start the cluster:

```bash
$ minikube start --driver=virtualbox
```

2. Run the command below to create jwt secret (replace jwt_secret with a secret of your choice):

```bash
$ kubectl create secret generic jwt-secret --from-literal=JWT_KEY=jwt_secret
```

3. Run the command below to create stripe secret (replace stripe_key with a valid [Stripe api key](https://stripe.com/))

```bash
$ kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=stripe_key
```

4. Enable minikube ingress addon:

```bash
$ minikube addons enable ingress
```

5. Create a LoadBalancer service that will expose the ingress-nginx-controller deployment:

```bash
$ kubectl expose deployment ingress-nginx-controller --target-port=80 --type=LoadBalancer -n kube-system
```

6. Add a temporary line to /etc/hosts file (replace ip_address with the result of running minikube ip):

> ip_address ticketing.dev

7. Run Skaffold to create Kubernetes Objects (in order to stop Skaffold, press ctrl + c):

```bash
$ skaffold dev
```

8. Navigate to https://ticketing.dev
