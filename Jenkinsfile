pipeline {
    agent any

    environment {
        dockerImage = ''
    }

    stages {
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("sreejeshd/cicdproject2:${env.BUILD_NUMBER}")
                }
            }
        }
        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USERNAME', passwordVariable: 'DOCKERHUB_PASSWORD')]) {
                    script {
                        docker.withRegistry('https://registry.hub.docker.com', 'dockerhub-credentials') {
                            dockerImage.push()
                        }
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            agent { label 'slave-node' }
            steps {
                sh '''
                    sed -i "s|image:.*|image: sreejeshd/cicdproject2:${BUILD_NUMBER}|g" app-deployment.yaml
                    kubectl apply -f app-deployment.yaml
                    kubectl apply -f app-service.yaml
                '''
            }
        }
    }
}
