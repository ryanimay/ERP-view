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
    }
}