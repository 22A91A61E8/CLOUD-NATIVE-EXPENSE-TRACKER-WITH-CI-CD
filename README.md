# Cloud-Native Expense Tracker

A full-stack, cloud-native expense tracking application that enables users to manage and analyze their personal expenses. The app features real-time tracking, category-wise visualization, and is built using containerized microservices with CI/CD and Kubernetes deployment.

---

## Features

- Add, edit, delete income and expense entries
- Category-wise charts for better financial insights
- Secure authentication and user sessions
- CI/CD pipeline using **Jenkins** and **GitHub Actions**
- Dockerized services (frontend & backend)
- Deployed using **Kubernetes** (Minikube or any cloud provider)

---

## Tech Stack

### Frontend
- React.js
- Tailwind CSS / Bootstrap
- Axios

### Backend
- Node.js
- Express.js
- MongoDB (or PostgreSQL)

### DevOps
- Docker
- Kubernetes
- **Jenkins**
- GitHub Actions

##  CI/CD Pipeline (Jenkins)

- Jenkins is configured with a **Jenkinsfile** to automate build, test, and deploy.
- Every code push triggers:
  1. Git pull
  2. Docker image build
  3. Push to Docker Hub
  4. Deployment via `kubectl` to Kubernetes cluster

### 🔧 Sample Jenkinsfile

```groovy
pipeline {
    agent any
    stages {
        stage('Clone') {
            steps {
                git 'https://github.com/your-username/expense-tracker.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t client ./client'
                sh 'docker build -t server ./server'
            }
        }
        stage('Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', ...)]) {
                    sh 'docker push your-user/client'
                    sh 'docker push your-user/server'
                }
            }
        }
        stage('Deploy') {
            steps {
                sh 'kubectl apply -f k8s/'
            }
        }
    }
}
