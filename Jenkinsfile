pipeline {
    agent any

    stages {
        stage('pull source'){
            steps {
                echo "pull sourceCode!"
                git branch: 'master-prod', url: 'https://github.com/ryanimay/ERP-View.git'
            }
        }
        stage('Docker Login') {
            steps {
                echo "Logging into Docker Hub..."
                withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'DOCKERHUB_USR', passwordVariable: 'DOCKERHUB_PSW')]) {
                    script {
                        sh """
                            echo "${DOCKERHUB_PSW}" | docker login -u "${DOCKERHUB_USR}" --password-stdin
                        """
                    }
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                echo "Building Docker image..."
                sh 'docker build -t ryanimay840121/erp-view:latest .'
            }
        }
        stage('Push Docker Image') {
            steps {
                echo "Pushing Docker image to Docker Hub..."
                sh 'docker push ryanimay840121/erp-view:latest'
                echo "Docker image has been pushed successfully!"
            }
        }
        stage('Deploy to Kubernetes') {
            agent {
                kubernetes {
                    label 'k8s-agent'
                    defaultContainer 'jnlp'
                }
            }
            steps {
                echo "Installing kubectl..."
                //安裝kubectl
                sh 'curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"'
                sh 'chmod u+x ./kubectl'
                //用kubectl執行
                echo "Deploying to Kubernetes..."
                sh './kubectl apply -f ./erp-view-deployment.yml'
                echo "Deployment applied successfully!"
            }
        }
    }
}