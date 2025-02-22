pipeline {
    agent any
    stages {
        stage('Clone Repository') {
            steps {
                git url: 'https://github.com/sreejeshd/CICD-Project-2.git', branch: 'main'
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t your-dockerhub-username/cicd-project-2:${BUILD_NUMBER} .'
            }
        }
        stage('Push Image to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker push your-dockerhub-username/cicd-project-2:${BUILD_NUMBER}
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            agent { label 'slave-node' }
            steps {
                sh '''
                    sed -i "s/BUILD_NUMBER_PLACEHOLDER/${BUILD_NUMBER}/g" deployment.yaml
                    kubectl apply -f deployment.yaml
                    kubectl apply -f service.yaml
                '''
            }
        }
    }
}
