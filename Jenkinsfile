pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Docker Build & Push') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        echo $password | docker login --username $username --password-stdin
                        docker build -f Dockerfile -t $username/lyj_landingpage .
                        docker push $username/lyj_landingpage
                        """
                    }
                }
            }
        }

        stage('Deploy to Prod') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'LYJ_DockerHub', passwordVariable: 'password', usernameVariable: 'username')]) {
                        sh """
                        docker ps
                        docker stop lyj_landingpage || true
                        docker rm lyj_landingpage || true
                        docker pull $username/lyj_landingpage
                        docker run -d --name lyj_landingpage --restart always -p 9002:3000 $username/lyj_landingpage
                        docker network connect lyj_default lyj_landingpage
                        docker image prune -f
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}